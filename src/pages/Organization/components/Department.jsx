// eslint-disable-next-line react-hooks/exhaustive-deps
import React, { useEffect, useRef, useState } from "react";
import Popup from '../../../components/Popup';
import { AutoForm } from '../../../components/useForm';
import { API } from '../_Service';
import { builderFieldsAction, useEntityAction, useEntitiesQuery, enableFilterAction } from '../../../store/actions/httpactions';
import { FormHelperText, IconButton, Divider, Chip } from "../../../deps/ui";
import { Circle, RemoveCircleOutline, DisplaySettings } from "../../../deps/ui/icons";
import DataGrid, { useGridApi, getActions, GridToolbar } from '../../../components/useDataGrid';
import { useSocketIo } from '../../../components/useSocketio';
import ConfirmDialog from '../../../components/ConfirmDialog';
import BulkInsert from '../../../components/BulkInsert'
import { groupBySum } from '../../../util/common'
import { useAppDispatch, useAppSelector } from "../../../store/storehook";


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

const getColumns = (apiRef, onEdit, onActive) => {
    const actionKit = {
        onActive: onActive,
        onEdit: onEdit
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
    const desgFormApi = useRef(null);
    // const designationData = React.useRef(null);
    const [error, setError] = useState(false);

    const { addEntity } = useEntityAction();
    const { Designations: designations, Employees } = useAppSelector(e => e.appdata.employeeData);
    const [mapDesignation, setMapDesignation] = useState([{ noOfPositions: 0, id: designations?.length ? designations[0] : [] }]);
    useEffect(() => {
        if (!formApi.current || !openPopup) return;
        const { resetForm, setFormValue } = formApi.current;
        const { resetForm: desResetFrom } = desgFormApi.current;
        if (openPopup && !isEdit) {
            desResetFrom();
            resetForm();
            setFormValue({ designations: [{ noOfPositions: 0, id: designations?.length ? designations[0] : [] }] })
        }
        else {
            const data = row;
            const mapDesig = data.designations.map(d => ({ id: designations.find(c => c._id === d.id), noOfPositions: d.noOfPositions }));
            setFormValue({
                departmentName: data.departmentName,
                employeeLimit: data.employeeLimit,
                code: data.code,
                designations: mapDesig,
                departmentHead: data?.depart_head ? Employees.find(e => e._id === data?.depart_head._id) : null
            });
        }
    }, [openPopup, formApi])

    const handleDelete = (_index) => {
        const { getValue, setFormValue } = formApi.current;
        getValue().designations.splice(_index, 1);
        setFormValue({ designations: [...getValue().designations] })
    }
    const handleAdd = () => {
        const { getValue, setFormValue } = formApi.current;
        setFormValue({ designations: [...getValue().designations, { noOfPositions: 0, id: designations?.length ? designations[0] : [] }] })
    }

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
            elementType: "custom",
            breakpoints: { xs: 12, md: 12, lg: 12 },
            NodeElement: () => <Divider><Chip label="Map Designtaion" onClick={handleAdd} icon={<DisplaySettings />} /></Divider>
        },
        {
            elementType: "arrayForm",
            name: "designations",
            arrayFormRef: desgFormApi,
            breakpoints: { md: 12, lg: 12, sx: 12 },
            defaultValue: mapDesignation,
            formData: [
                {
                    elementType: "ad_dropdown",
                    name: "id",
                    label: "Designation",
                    breakpoints: { xs: 6, lg: 5, md: 5 },
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
                    breakpoints: { xs: 6, lg: 5, md: 5 },
                    type: 'number',
                    validate: {
                        errorMessage: "You have exceeded the employees limit",
                        validate: (val) => {
                            const { getValue } = formApi.current;
                            return +val.noOfPositions < +getValue().employeeLimit && +val.noOfPositions > 0
                        }
                    },
                    defaultValue: 0
                },
                {
                    elementType: "custom",
                    breakpoints: { xs: 1, lg: 2, md: 2 },
                    NodeElement: ({ dataindex }) => <IconButton onClick={() => handleDelete(dataindex)} sx={{
                        ml: 2
                    }} color="warning" aria-label="delete">
                        <RemoveCircleOutline />
                    </IconButton>
                },
            ],
            isValidate: true,
        },
    ];

    const handleSubmit = (e) => {
        const { getValue, validateFields } = formApi.current;
        const { validateFields: desgFieldValidate } = desgFormApi.current;


        if (validateFields() && desgFieldValidate()) {
            let { departmentName, employeeLimit, code, departmentHead, designations: dataSet } = getValue();
            let dataToInsert = {};

            const total = dataSet.reduce((total, obj) => (+(obj?.noOfPositions ?? 0)) + total, 0);
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

            addEntity({ url: DEFAULT_API, data: [dataToInsert] }).finally(c => {
                setOpenPopup(false);
            });

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
    const dispatch = useAppDispatch();
    const [openPopup, setOpenPopup] = useState(false);
    const isEdit = React.useRef(false);
    const row = React.useRef(null);

    const [selectionModel, setSelectionModel] = React.useState([]);

    const [sort, setSort] = useState({ sort: { createdAt: -1 } });
    const [filter, setFilter] = useState({
        lastKey: null,
        limit: 10,
        page: 0,
        totalRecord: 0
    })

    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        title: "",
        subTitle: "",
    });

    const gridApiRef = useGridApi();
    const query = useAppSelector(e => e.appdata.query.builder);
    const { data, isLoading, refetch, totalRecord } = useEntitiesQuery({
        url: DEFAULT_API,
        data: {
            limit: filter.limit,
            page: filter.page + 1,
            lastKeyId: filter.lastKey,
            ...sort,
            searchParams: { ...query }
        }
    }, { selectFromResult: ({ data, isLoading }) => ({ data: data?.entityData, totalRecord: data?.totalRecord, isLoading }) });


    const { updateOneEntity, removeEntity } = useEntityAction();
    const { socketData } = useSocketIo(`changeIn${DEFAULT_NAME}`, refetch);

    const handleEdit = (id) => {
        isEdit.current = true;
        editId = id;
        row.current = data.find(a => a.id === id);
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

        dispatch(enableFilterAction(false));
        dispatch(builderFieldsAction(fields));
    }, [dispatch])


    const columns = getColumns(gridApiRef, handleEdit, handleActiveInActive);



    const showAddModal = () => {
        isEdit.current = false;
        setOpenPopup(true);
    }

    return (
        <>
            <AddDepartment setOpenPopup={setOpenPopup} openPopup={openPopup} isEdit={isEdit.current} row={row.current} />

            <DataGrid apiRef={gridApiRef}
                columns={columns} rows={data}
                loading={isLoading}
                totalCount={totalRecord}
                pageSize={filter.limit}
                page={filter.page}
                setFilter={setFilter}
                onSortModelChange={(s) => setSort({ sort: s.reduce((a, v) => ({ ...a, [v.field]: v.sort === 'asc' ? 1 : -1 }), {}) })}
                toolbarProps={{
                    apiRef: gridApiRef,
                    onAdd: showAddModal,
                    selectionModel
                }}
                gridToolBar={GridToolbar}
                selectionModel={selectionModel}
                setSelectionModel={setSelectionModel}
            />
            <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
        </>
    );
}

export default Department;