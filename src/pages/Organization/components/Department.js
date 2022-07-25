// eslint-disable-next-line react-hooks/exhaustive-deps
import React, { useEffect, useRef, useState } from "react";
import Controls from '../../../components/controls/Controls';
import Popup from '../../../components/Popup';
import { AutoForm, Form } from '../../../components/useForm';
import { API } from '../_Service';
import { useDispatch, useSelector } from 'react-redux';
import { builderFieldsAction, useEntityAction, useEntitiesQuery, enableFilterAction } from '../../../store/actions/httpactions';
import { GridToolbarContainer, Box, IconButton, Grid, Divider } from "../../../deps/ui";
import { Circle, Add as AddIcon, Delete as DeleteIcon, RemoveCircleOutline } from "../../../deps/ui/icons";
import DataGrid, { useGridApi, getActions } from '../../../components/useDataGrid';
import { useSocketIo } from '../../../components/useSocketio';
import ConfirmDialog from '../../../components/ConfirmDialog';
import PropTypes from 'prop-types'
import BulkInsert from '../../../components/BulkInsert'

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
            field: 'departmentName', headerName: DEFAULT_NAME, width: 180, hideable: false
        },
        { field: 'modifiedOn', headerName: 'Modified On', hideable: false },
        { field: 'createdOn', headerName: 'Created On', hideable: false },
        {
            field: 'isActive', headerName: 'Status', renderCell: (param) => (
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
const Department = () => {
    const dispatch = useDispatch();
    const [openPopup, setOpenPopup] = useState(false);
    const [pageSize, setPageSize] = useState(30);
    const isEdit = React.useRef(false);
    const formApi = React.useRef(null);
    const designationData = React.useRef(null);
    const [selectionModel, setSelectionModel] = React.useState([]);
    const [mapDesignation, setMapDesignation] = useState([]);
    const offSet = useRef({
        isLoadMore: false,
        isLoadFirstTime: true,
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
    const designations = useSelector(e => e.appdata.employeeData.designations);
    console.log(designations);
    const { data, status, isLoading, refetch } = useEntitiesQuery({
        url: DEFAULT_API,
        params: {
            limit: filter.limit,
            lastKeyId: filter.lastKey,
            searchParams: JSON.stringify(query)
        }
    });

    const { addEntity, updateOneEntity, removeEntity } = useEntityAction();

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
        const { setFormValue } = formApi.current;

        const data = records.find(a => a.id === id);
        setFormValue({
            departmentName: data.departmentName
        });
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

    const handleSubmit = (e) => {
        const { getValue, validateFields } = formApi.current
        if (validateFields()) {
            let values = getValue();
            let dataToInsert = {};
            dataToInsert.departmentName = values.departmentName;
            if (isEdit.current)
                dataToInsert._id = editId

            addEntity({ url: DEFAULT_API, data: [dataToInsert] });

        }
    }
    console.log({ designationData });

    const formData = [
        {
            elementType: "inputfield",
            name: "departmentName",
            label: DEFAULT_NAME,
            required: true,
            breakpoints: { md: 6 },
            validate: {
                errorMessage: `${DEFAULT_NAME} is required`
            },
            defaultValue: ""
        },
        {
            elementType: "inputfield",
            name: "employeeLimite",
            label: "Employees Limite",
            breakpoints: { md: 6 },
            required: true,
            type: 'number',
            validate: {
                errorMessage: "Employees Limite is no valid",
                validate: (val) => val < 300 && val > 0
            },
            defaultValue: ""
        },
        {
            elementType: "fieldarray",
            breakpoints: { md: 12 },
            NodeElement: () => <BulkInsert as="div" buttonName="Map Designation" ref={designationData} BulkformData={[[
                {
                    elementType: "dropdown",
                    name: "designation",
                    label: "Designation",
                    dataId: "_id",
                    dataName: "name",
                    breakpoints: { md: 6 },
                    defaultValue: [],
                    options: designations
                },
                {
                    elementType: "inputfield",
                    name: "noOfPositions",
                    label: "No Of Positions",
                    breakpoints: { md: 6 },
                    required: true,
                    type: 'number',
                    validate: {
                        errorMessage: "No. Of Positions is required",
                    },
                    defaultValue: 0
                },

            ]]} />
        }
    ];

    const showAddModal = () => {
        isEdit.current = false;
        const { resetForm } = formApi.current;
        resetForm();
        setOpenPopup(true);
    }

    const AddDesignation = () => {
        const data = {
            designations,
            designationId: designations[0]._id,
            noOfPositions: 0,
            error: ""
        }
        setMapDesignation([data, ...mapDesignation])
    }

    const deleteData = (index) => {
        mapDesignation.splice(index, 1);
        setMapDesignation([...mapDesignation]);
    }


    return (
        <>
            <Popup
                title={`Add ${DEFAULT_NAME}`}
                openPopup={openPopup}
                maxWidth="sm"
                isEdit={isEdit.current}
                keepMounted={true}
                addOrEditFunc={handleSubmit}
                setOpenPopup={setOpenPopup}>
                <AutoForm formData={formData} ref={formApi} isValidate={true} />
                {/* <Divider /> */}
                {/* <Controls.Button
                    variant="text"
                    text={"Add Designation"}
                    onClick={AddDesignation}
                    startIcon={<AddIcon />}
                /> */}
                {/* <Form>
                    <Grid sx={{ pl: 1 }} container spacing={2}>
                        {mapDesignation.map((m, index) => <>
                            <Grid key={index + "designationId"} item md={6}>
                                <Controls.Select
                                    name="designationId"
                                    label="Designation"
                                    dataId="_id"
                                    dataName="name"
                                    // value={m.designationId}
                                    // onChange={handleInputChange}
                                    options={m.designations}
                                />
                            </Grid>
                            <Grid key={index + "noOfPositions"} item md={6}>
                                <Controls.Input
                                    name="noOfPositions"
                                    label="No. of Positions"
                                    // value={m.noOfPositions}
                                    type="number"
                                // onChange={handleInputChange}
                                />
                                <IconButton onClick={() => deleteData(index)} sx={{
                                    ml: 2
                                }} color="warning" aria-label="delete">
                                    <RemoveCircleOutline />
                                </IconButton>
                            </Grid>

                        </>)}
                    </Grid>
                </Form> */}
            </Popup>
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
                gridToolBar={DepartmentToolbar}
                selectionModel={selectionModel}
                setSelectionModel={setSelectionModel}
                onRowsScrollEnd={loadMoreData}
            />
            <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
        </>
    );
}

export default Department;

function DepartmentToolbar(props) {
    const { apiRef, onAdd, onDelete, selectionModel } = props;

    return (
        <>
            <GridToolbarContainer sx={{ justifyContent: "flex-end" }}>
                <Box >
                    {selectionModel?.length ? <Controls.Button onClick={() => onDelete(selectionModel)} startIcon={<DeleteIcon />} text="Delete Items" /> : null}
                    <Controls.Button onClick={onAdd} startIcon={<AddIcon />} text="Add record" />
                </Box>
            </GridToolbarContainer>
        </>
    );
}

DepartmentToolbar.propTypes = {
    apiRef: PropTypes.shape({
        current: PropTypes.object,
    }).isRequired,
    onAdd: PropTypes.func,
    onDelete: PropTypes.func,
    selectionModel: PropTypes.array
};