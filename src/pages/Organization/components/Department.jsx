// eslint-disable-next-line react-hooks/exhaustive-deps
import React, { useEffect, useRef, useState } from "react";
import Popup from '../../../components/Popup';
import { AutoForm } from '../../../components/useForm';
import { API } from '../_Service';
import { useDispatch, useSelector } from 'react-redux';
import { builderFieldsAction, useEntityAction, useEntitiesQuery, enableFilterAction } from '../../../store/actions/httpactions';
import {  FormHelperText } from "../../../deps/ui";
import { Circle } from "../../../deps/ui/icons";
import DataGrid, { useGridApi, getActions, GridToolbar } from '../../../components/useDataGrid';
import { useSocketIo } from '../../../components/useSocketio';
import ConfirmDialog from '../../../components/ConfirmDialog';
import BulkInsert from '../../../components/BulkInsert'
import { groupBySum } from '../../../util/common'

const DEFAULT_API = API.Department;
const DEFAULT_NAME = "Department";

const fields = {
    departmentName: {
        label: DEFAULT_NAME,
        type: 'text',
        valueSources: ['value'],
        preferWidgets: ['text'],
    },
    createdAt: {
        label: 'Created Date',
        type: 'date',
        fieldSettings: {
            dateFormat: "D/M/YYYY",
            mongoFormatValue: val => ({ $date: new Date(val).toISOString() }),
        },
        valueSources: ['value'],
        preferWidgets: ['date'],
    },

    isActive: {
        label: 'Status',
        type: 'boolean',
        operators: ['equal'],
        valueSources: ['value'],
    },
}

const getColumns = (apiRef, onEdit, onActive, onDelete) => {
    const actionKit = {
        onActive: onActive,
        onEdit: onEdit,
        onDelete: onDelete
    }
    return [
        { field: '_id', headerName: 'Id', hide: true, hideable: false },
        {
            field: 'code', headerName: "Code", width: 100, hideable: false
        },
        {
            field: 'departmentName', headerName: DEFAULT_NAME, width: 180, hideable: false
        },
        {
            field: 'departhead', headerName: "Department Head", width: 180, hideable: false
        },

        { field: 'modifiedOn', headerName: 'Modified On', hideable: false },
        { field: 'createdOn', headerName: 'Created On', hideable: false },
        {
            field: 'isActive', headerName: 'Active', renderCell: (param) => (
                param.row["isActive"] ? <Circle color="success" /> : <Circle color="disabled" />
            ),
            flex: '0 1 5%',
            hideable: false,
            align: 'center',
        },
        getActions(apiRef, actionKit)
    ]
}


let editId = 0;
const AddDepartment = ({ openPopup, setOpenPopup, isEdit = false, row = null }) => {
    const formApi = useRef(null);
    const designationData = React.useRef(null);
    const [mapDesignation, setMapDesignation] = useState([]);
    const [error, setError] = useState(false);

    const { addEntity } = useEntityAction();
    const { Designations: designations, Employees } = useSelector(e => e.appdata.employeeData);
    useEffect(() => {
        if (!formApi.current || !openPopup) return;
        const { resetForm, setFormValue } = formApi.current;
        const { resetForms } = designationData.current;
        if (openPopup && !isEdit) {
            resetForms();
            resetForm();
        }
        else {
            const data = row;
            setMapDesignation(data.designations.map(d => [{
                elementType: "ad_dropdown",
                name: "id",
                label: "Designation",
                dataId: "_id",
                dataName: "name",
                defaultValue: designations.find(c => c._id === d.id),
                options: designations
            },
            {
                elementType: "inputfield",
                name: "noOfPositions",
                label: "No Of Positions",
                required: true,
                type: 'number',
                validate: {
                    errorMessage: "You have exceeded the employees limit",
                    validate: (val) => {
                        const { getValue } = formApi.current;
                        return val.noOfPositions < getValue().employeeLimit && val.noOfPositions > 0
                    }
                },
                defaultValue: d.noOfPositions
            }]))

            setFormValue({
                departmentName: data.departmentName,
                employeeLimit: data.employeeLimit,
                code: data.code,
            });
        }
    }, [openPopup, formApi])

    useEffect(() => {
        if (Array.isArray(designations)) {
            setMapDesignation([
                [
                    {
                        elementType: "ad_dropdown",
                        name: "id",
                        label: "Designation",
                        dataId: "_id",
                        dataName: "name",
                        defaultValue: null,
                        options: designations
                    },
                    {
                        elementType: "inputfield",
                        name: "noOfPositions",
                        label: "No Of Positions",
                        required: true,
                        type: 'number',
                        validate: {
                            errorMessage: "You have exceeded the employees limit",
                            validate: (val) => {
                                const { getValue } = formApi.current;
                                return val.noOfPositions < getValue().employeeLimit && val.noOfPositions > 0
                            }
                        },
                        defaultValue: 0
                    },
                ]
            ])
        }

    }, [designations])

    const formData = [
        {
            elementType: "inputfield",
            name: "code",
            label: "Department Code",
            required: true,
            validate: {
                errorMessage: `Code is required`
            },
            defaultValue: ""
        },
        {
            elementType: "inputfield",
            name: "departmentName",
            label: DEFAULT_NAME,
            required: true,
            validate: {
                errorMessage: `${DEFAULT_NAME} is required`
            },
            defaultValue: ""
        },
        {
            elementType: "inputfield",
            name: "employeeLimit",
            label: "Employees Limit",
            required: true,
            type: 'number',
            validate: {
                errorMessage: "You have exceeded the limit",
                validate: (val) => val.employeeLimit < 300 && val.employeeLimit > 0
            },
            defaultValue: ""
        },
        {
            elementType: "ad_dropdown",
            name: "departmentHead",
            label: "Department Head",
            dataId: "_id",
            dataName: "fullName",
            defaultValue: null,
            options: Employees
        },
        {
            elementType: "fieldarray",
            breakpoints: { md: 12 },
            NodeElement: () => <BulkInsert as="div" buttonName="Map Designation"
                ref={designationData}
                BulkformData={mapDesignation} />
        }
    ];

    const handleSubmit = (e) => {
        const { getValue, validateFields } = formApi.current;
        const { getFieldArray } = designationData.current;
        let { isValid, dataSet } = getFieldArray();

        if (validateFields() && isValid) {
            const { departmentName, employeeLimit, code, departmentHead } = getValue();
            let dataToInsert = {};

            const total = dataSet.reduce((total, obj) => (+obj.noOfPositions ?? 0) + total, 0);
            if (total > employeeLimit) return setError(true);
            else {
                setError(false);
                dataSet = groupBySum(dataSet, "id", "noOfPositions");
            }

            dataToInsert.departmentName = departmentName;
            dataToInsert.employeeLimit = employeeLimit;
            dataToInsert.code = code;
            if (departmentHead?._id) {
                dataToInsert.departmentHead = departmentHead._id;
            }
            dataToInsert.designations = dataSet;
            if (isEdit)
                dataToInsert._id = editId

            addEntity({ url: DEFAULT_API, data: [dataToInsert] });

        }
    }

    return <Popup
        title={`Add ${DEFAULT_NAME}`}
        openPopup={openPopup}

        isEdit={isEdit}
        keepMounted={true}
        addOrEditFunc={handleSubmit}
        setOpenPopup={setOpenPopup}>

        <AutoForm formData={formData} ref={formApi} isValidate={true} />
        <FormHelperText
            error={error}
            sx={{
                display: "flex",
                justifyContent: "space-between",
                padding: "0 10px"
            }}
        >
            {error && <span>Total No. of positions should be less then employees limit</span>}
        </FormHelperText>
    </Popup>
}

const Department = () => {
    const dispatch = useDispatch();
    const [openPopup, setOpenPopup] = useState(false);
    const [pageSize, setPageSize] = useState(30);
    const isEdit = React.useRef(false);
    const row = React.useRef(null);

    const [selectionModel, setSelectionModel] = React.useState([]);

    const offSet = useRef({
        isLoadMore: false,
        isLoadFirstTime: true
    })


    const [filter, setFilter] = useState({
        lastKey: null,
        limit: 10,
        totalRecord: 0
    })

    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        title: "",
        subTitle: "",
    });

    const [records, setRecords] = useState([]);

    const gridApiRef = useGridApi();
    const query = useSelector(e => e.appdata.query.builder);
    const { data, status, isLoading, refetch } = useEntitiesQuery({
        url: DEFAULT_API,
        params: {
            limit: filter.limit,
            lastKeyId: filter.lastKey,
            searchParams: JSON.stringify(query)
        }
    });

    const { updateOneEntity, removeEntity } = useEntityAction();

    useEffect(() => {
        if (status === "fulfilled") {
            const { entityData, totalRecord } = data.result;
            if (offSet.current.isLoadMore) {
                setRecords([...entityData, ...records]);
            }
            else
                setRecords(entityData)

            setFilter({ ...filter, totalRecord: totalRecord });
            offSet.current.isLoadMore = false;
        }

    }, [data, status])

    const { socketData } = useSocketIo(`changeIn${DEFAULT_NAME}`, refetch);

    useEffect(() => {
        if (Array.isArray(socketData)) {
            setRecords(socketData);
        }
    }, [socketData])


    const loadMoreData = (params) => {
        if (records.length < filter.totalRecord && params.viewportPageSize !== 0) {
            offSet.current.isLoadMore = true;
            setFilter({ ...filter, lastKey: records.length ? records[records.length - 1].id : null });
        }
    }

    const handleEdit = (id) => {
        isEdit.current = true;
        editId = id;
        const data = records.find(a => a.id === id);
        row.current = data;
        setOpenPopup(true);
    }

    const handleActiveInActive = (id) => {
        updateOneEntity({ url: DEFAULT_API, data: { _id: id } });
    }

    const handelDeleteItems = (ids) => {
        let idTobeDelete = ids;
        if (Array.isArray(ids)) {
            idTobeDelete = ids.join(',');
        }

        setConfirmDialog({
            isOpen: true,
            title: "Are you sure to delete this records?",
            subTitle: "You can't undo this operation",
            onConfirm: () => {
                removeEntity({ url: DEFAULT_API, params: idTobeDelete }).then(res => {
                    setSelectionModel([]);
                })
            },
        });

    }


    useEffect(() => {
        offSet.current.isLoadFirstTime = false;
        dispatch(enableFilterAction(false));
        dispatch(builderFieldsAction(fields));
    }, [dispatch])


    const columns = getColumns(gridApiRef, handleEdit, handleActiveInActive, handelDeleteItems);



    const showAddModal = () => {
        isEdit.current = false;
        setOpenPopup(true);
    }

    return (
        <>
            <AddDepartment setOpenPopup={setOpenPopup} openPopup={openPopup} isEdit={isEdit.current} row={row.current} />
            <DataGrid apiRef={gridApiRef}
                columns={columns} rows={records}
                loading={isLoading} pageSize={pageSize}
                totalCount={offSet.current.totalRecord}
                toolbarProps={{
                    apiRef: gridApiRef,
                    onAdd: showAddModal,
                    onDelete: handelDeleteItems,
                    selectionModel
                }}
                gridToolBar={GridToolbar}
                selectionModel={selectionModel}
                setSelectionModel={setSelectionModel}
                onRowsScrollEnd={loadMoreData}
            />
            <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
        </>
    );
}

export default Department;