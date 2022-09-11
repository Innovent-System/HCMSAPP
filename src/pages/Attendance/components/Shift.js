// eslint-disable-next-line react-hooks/exhaustive-deps
import React, { useEffect, useRef, useState } from "react";
import Controls from '../../../components/controls/Controls';
import Popup from '../../../components/Popup';
import { AutoForm } from '../../../components/useForm';
import { API } from '../_Service';
import { useDispatch, useSelector } from 'react-redux';
import { builderFieldsAction, useEntityAction, useEntitiesQuery, enableFilterAction } from '../../../store/actions/httpactions';
import { GridToolbarContainer, Box } from "../../../deps/ui";
import { Circle, Add as AddIcon, Delete as DeleteIcon, } from "../../../deps/ui/icons";
import DataGrid, { useGridApi, getActions } from '../../../components/useDataGrid';
import { useSocketIo } from '../../../components/useSocketio';
import ConfirmDialog from '../../../components/ConfirmDialog';
import PropTypes from 'prop-types'
import { formateISODateTime, formateISOTime } from '../../../services/dateTimeService'
import InfoToolTip from "../../../components/InfoToolTip";

const fields = {
    shiftName: {
        label: 'Shift',
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
            field: 'shiftCode', headerName: 'Code', width: 180, hideable: false
        },
        {
            field: 'shiftName', headerName: 'Name', width: 180, hideable: false
        },
        {
            field: 'shiftTime', headerName: 'Shift Time', width: 180, hideable: false, valueGetter: ({ row }) => formateISOTime(row.startTime) + " - " + formateISOTime(row.endTime)
        },
        { field: 'modifiedOn', headerName: 'Modified On', hideable: false, valueGetter: ({ row }) => formateISODateTime(row.modifiedOn) },
        { field: 'createdOn', headerName: 'Created On', hideable: false, valueGetter: ({ row }) => formateISODateTime(row.createdOn) },
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

const Weeks = [{ id: "Sunday", name: "Sunday" },
{ id: "Monday", name: "Monday" },
{ id: "Tuesday", name: "Tuesday" },
{ id: "Wednesday", name: "Wednesday" },
{ id: "Thursday", name: "Thursday" },
{ id: "Friday", name: "Friday" },
{ id: "Saturday", name: "Saturday" }
];

const DEFAUL_API = API.Shift;
let editId = 0;
const Shift = () => {
    const dispatch = useDispatch();
    const [openPopup, setOpenPopup] = useState(false);
    const [openShift, setOpenShift] = useState(false);
    const [pageSize, setPageSize] = useState(30);
    const isEdit = React.useRef(false);
    const formApi = React.useRef(null);

    const [selectionModel, setSelectionModel] = React.useState([]);

    const offSet = useRef({
        isLoadMore: false,
        isLoadFirstTime: true,
        ShiftId: null
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
        url: DEFAUL_API,
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

    const { socketData } = useSocketIo("changeInShift", refetch);

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
        setFormValue(data);
        setOpenPopup(true);
    }

    const handleActiveInActive = (id) => {
        updateOneEntity({ url: DEFAUL_API, data: { _id: id } });
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
                removeEntity({ url: DEFAUL_API, params: idTobeDelete }).then(res => {
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
            if (isEdit.current)
                values._id = editId

            addEntity({ url: DEFAUL_API, data: [values] });
        }
    }


    const formData = [
        {
            elementType: "inputfield",
            name: "shiftCode",
            label: "Shift Code",
            required: true,
            validate: {
                errorMessage: "Shift Code is required"
            },
            defaultValue: ""
        },
        {
            elementType: "inputfield",
            name: "shiftName",
            label: "Name",
            required: true,
            validate: {
                errorMessage: "Shift Name is required"
            },
            defaultValue: ""
        },
        {
            elementType: "datetimepicker",
            required: true,
            validate: {
                errorMessage: "Start time is required",
            },
            name: "startTime",
            category: "time",
            label: "Shift Start",
            defaultValue: null
        },
        {
            elementType: "datetimepicker",
            required: true,
            validate: {
                errorMessage: "End time is required",
            },
            name: "endTime",
            category: "time",
            label: "Shift End",
            defaultValue: null
        },
        {
            elementType: "datetimepicker",
            required: true,
            validate: {
                errorMessage: "Start time is required",
            },
            name: "minTime",
            category: "time",
            label: "Min Start Time",
            defaultValue: null
        },
        {
            elementType: "datetimepicker",
            required: true,
            validate: {
                errorMessage: "End time is required",
            },
            name: "maxTime",
            category: "time",
            label: "Max Start Time",
            defaultValue: null
        },
        {
            elementType: "checkbox",
            name: "isNextDay",
            label: "Is Next Day",
            defaultValue: false,
        },
        {
            elementType: "inputfield",
            name: "late",
            type: "number",
            label: "Late",
            defaultValue: 0
        },
        {
            elementType: "inputfield",
            name: "early",
            type: "number",
            label: "Early",
            defaultValue: 0
        },
        {
            elementType: "inputfield",
            name: "halfDay",
            type: "number",
            label: "Half Day",
            defaultValue: 0
        },
        {
            elementType: "inputfield",
            name: "shortDay",
            type: "number",
            label: "Short Day",
            defaultValue: 0
        },
    ];

    const showAddModal = () => {
        isEdit.current = false;
        const { resetForm } = formApi.current;
        resetForm();
        setOpenPopup(true);
    }

    return (
        <>
            <Popup
                title="Add Shift"
                openPopup={openPopup}
                maxWidth="sm"
                keepMounted={true}
                isEdit={isEdit.current}
                addOrEditFunc={handleSubmit}
                setOpenPopup={setOpenPopup}>
                <AutoForm formData={formData} ref={formApi} isValidate={true} />
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
                gridToolBar={ShiftToolbar}
                selectionModel={selectionModel}
                setSelectionModel={setSelectionModel}
                onRowsScrollEnd={loadMoreData}
            />
            <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
        </>
    );
}
export default Shift;

function ShiftToolbar(props) {
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

ShiftToolbar.propTypes = {
    apiRef: PropTypes.shape({
        current: PropTypes.object,
    }).isRequired,
    onAdd: PropTypes.func,
    onDelete: PropTypes.func,
    selectionModel: PropTypes.array
};