// eslint-disable-next-line react-hooks/exhaustive-deps
import React, { useEffect, useMemo, useRef, useState } from "react";
import Controls from '../../../components/controls/Controls';
import Popup from '../../../components/Popup';
import { AutoForm } from '../../../components/useForm';
import { API } from '../_Service';
import { builderFieldsAction, useEntityAction, useEntitiesQuery, enableFilterAction } from '../../../store/actions/httpactions';
import { GridToolbarContainer } from "../../../deps/ui";
import { Circle, Add as AddIcon, Delete as DeleteIcon, } from "../../../deps/ui/icons";
import DataGrid, { useGridApi, getActions, GridToolbar } from '../../../components/useDataGrid';
import { useSocketIo } from '../../../components/useSocketio';
import ConfirmDialog from '../../../components/ConfirmDialog';
import PropTypes from 'prop-types'
import { formateISODateTime, formateISOTime } from '../../../services/dateTimeService'
import { useAppDispatch, useAppSelector } from "../../../store/storehook";


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

const getColumns = (apiRef, onEdit, onActive) => {
    const actionKit = {
        onActive: onActive,
        onEdit: onEdit
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

const flagCol = [
    {
        field: 'index', headerName: 'Sr#', hideable: false, valueGetter: ({ api, row }) => api.getRowIndex(row.id) + 1
    },
    {
        field: 'name', headerName: 'Attendance Flag', width: 180, hideable: false
    },
    {
        field: 'at', headerName: 'At', width: 180, hideable: false, editable: true,
        preProcessEditCellProps: ({ props, ...values }) => {
            const hasError = +props.value < 0 || +props.value > 1440;
            return { ...props, error: hasError };
        },
        type: "number"

    }
]
const DEFAULT_API = API.Shift;
const setToCurrentDate = (date = new Date()) => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(),
        date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
}
let editId = 0;
export const AddShift = ({ openPopup, setOpenPopup, isEdit = false, row = null }) => {
    const { addEntity } = useEntityAction();

    const attendanceFlag = useAppSelector(e => e.appdata.employeeData?.AttendanceFlag)


    const [flagRows, setFlagRow] = useState([...attendanceFlag]);
    const formApi = useRef(null);

    useEffect(() => {
        if (!formApi.current || !openPopup) return;
        const { resetForm, setFormValue } = formApi.current;
        if (openPopup && !isEdit) {
            resetForm();
            setFlagRow([...attendanceFlag])
        }
        else {
            setFormValue({
                ...row,
                startTime: new Date(row.startTime),
                endTime: new Date(row.endTime),
                minTime: new Date(row.minTime),
                maxTime: new Date(row.maxTime)
            });
            setFlagRow(row.attendanceflag.map(a => ({ ...a, name: attendanceFlag.find(c => c.flagCode === a.flagCode).name, id: a._id })));
        }
    }, [openPopup, formApi])

    const processRowUpdate = (newRow) => {
        const updatedRow = { ...newRow, isNew: false };
        setFlagRow(flagRows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    }

    const handleRowOrderChange = (params) => {
        const { oldIndex, targetIndex } = params;
        const rowsClone = [...flagRows];
        const row = rowsClone.splice(oldIndex, 1)[0];
        rowsClone.splice(targetIndex, 0, row);
        setFlagRow(rowsClone.map((r, index) => ({ ...r, order: ++index })));
    }

    const handleSubmit = (e) => {
        const { getValue, validateFields } = formApi.current;

        if (validateFields()) {
            let values = getValue();
            
            if (isEdit)
                values._id = editId

            addEntity({ url: DEFAULT_API, data: [{ ...values, attendanceflag: flagRows }] });
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
            breakpoints: { xs: 6, sm: 6, md: 5 },
            defaultValue: false,
        },
        {
            elementType: "checkbox",
            name: "isHoliday",
            label: "Is HoliDay",
            breakpoints: { xs: 6, sm: 6, md: 5 },
            defaultValue: false,
        }
    ];

    return <Popup
        title="Add Shift"
        openPopup={openPopup}
        maxWidth="sm"
        keepMounted={true}
        isEdit={isEdit}
        addOrEditFunc={handleSubmit}
        setOpenPopup={setOpenPopup}>

        <AutoForm formData={formData} ref={formApi} isValidate={true} />
        <DataGrid
            rowHeight={35}
            hideFooter
            onRowOrderChange={handleRowOrderChange}
            processRowUpdate={processRowUpdate}
            rowReordering={true}
            experimentalFeatures={{ newEditingApi: true }}
            checkboxSelection={false}
            columns={flagCol} rows={flagRows}
        />
    </Popup>
}

const Shift = () => {
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
        url: `${DEFAULT_API}/get`,
        data: {
            limit: filter.limit,
            page: filter.page + 1,
            lastKeyId: filter.lastKey,
            ...sort,
            searchParams: { ...query }
        }
    }, { selectFromResult: ({ data, isLoading }) => ({ data: data?.entityData, totalRecord: data?.totalRecord, isLoading }) });

    const { updateOneEntity, removeEntity } = useEntityAction();



    const { socketData } = useSocketIo("changeInShift", refetch);



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
            <AddShift openPopup={openPopup} setOpenPopup={setOpenPopup} isEdit={isEdit.current} row={row.current} />
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
export default Shift;
