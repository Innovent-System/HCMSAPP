// eslint-disable-next-line react-hooks/exhaustive-deps
import React, { useEffect, useRef, useState } from "react";
import { API } from './_Service';
import { useDispatch, useSelector } from 'react-redux';
import { builderFieldsAction, useEntityAction, enableFilterAction, useLazyPostQuery } from '../../store/actions/httpactions';
import { Circle, Add as AddIcon, PeopleOutline } from "../../deps/ui/icons";
import { GridToolbarContainer, Select, MenuItem, FormControl, InputLabel, TextField, LocalizationProvider, DesktopDateTimePicker, FormHelperText } from "../../deps/ui";
import DataGrid, { useGridApi } from '../../components/useDataGrid';
import ConfirmDialog from '../../components/ConfirmDialog';
import { formateISODateTime } from "../../services/dateTimeService";
import Controls from "../../components/controls/Controls";
import PageHeader from '../../components/PageHeader'
import { weekday } from "../../util/common";


const fields = {
    title: {
        label: 'Employee Name',
        type: 'text',
        valueSources: ['value'],
        preferWidgets: ['text'],
    },
    scheduleStartDt: {
        label: 'From',
        type: 'date',
        fieldSettings: {
            dateFormat: "D/M/YYYY",
            mongoFormatValue: val => ({ $date: new Date(val).toISOString() }),
        },
        valueSources: ['value'],
        preferWidgets: ['date'],
    },
    ScheduleEndDt: {
        label: 'To',
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

const DateTimeCell = ({ apiRef, value, id, field, row, type = 'In' }) => {
    const [error, setError] = useState(null);

    const hanldechange = (e) => {
        let { value } = e.target;
        const schedule = row.schedule.at(0), schDt = new Date(type === "In" ? row.scheduleStartDt : row.ScheduleEndDt);

        const dayShift = schedule.weeks.find(c => c.name === weekday[schDt.getDay()]);
        const shift = schedule.shift.find(s => s._id === dayShift.fkShiftId);
        const minDate = new Date(shift.minTime), maxDate = new Date(shift.maxTime);
        minDate.setDate(schDt.getDate());
        minDate.setMonth(schDt.getMonth());
        minDate.setFullYear(schDt.getFullYear());

        maxDate.setDate(schDt.getDate());
        maxDate.setMonth(schDt.getMonth());
        maxDate.setFullYear(schDt.getFullYear());
        if (value.getTime() < minDate.getTime()) {
            value = null;
            setError(`${type} time should be greater than company ${type.toLowerCase()} time`);
        } else if (value.getTime() > maxDate.getTime()) {
            value = null;
            setError(`${type} time should be  less than company ${type.toLowerCase()} time`);
        }
        else if (error)
            setError(null)


        apiRef.current.setEditCellValue({ id, field, value, debounceMs: 200 });
    }
    return <Controls.DatePicker error={error} name={id} key={id} onChange={hanldechange} category="datetime" value={value} />
}

const getColumns = (apiRef, onActive, onDelete) => {
    const actionKit = {
        onActive: onActive,
        onDelete: onDelete
    }
    return [
        { field: '_id', headerName: 'Id', hide: true, hideable: false },
        {
            field: 'fullName', headerName: 'Employee Name', width: 180, hideable: false
        },
        { field: 'scheduleStartDt', headerName: 'Schedule Start', width: 200, hideable: false, valueGetter: ({ value }) => formateISODateTime(value) },
        { field: 'ScheduleEndDt', headerName: 'Schedule End', width: 200, hideable: false, valueGetter: ({ value }) => formateISODateTime(value) },
        {
            field: 'startDateTime', headerName: 'Actual In', width: 200, hideable: false,
            type: 'dateTime',
            editable: true,
            valueGetter: ({ value }) => value ? new Date(value) : "--",
            renderEditCell: (params) => <DateTimeCell apiRef={apiRef}  {...params} />,
            // /**  @param {import("@mui/x-data-grid-pro").GridPreProcessEditCellProps} params   */
            // preProcessEditCellProps: ({ props }) => {

            //     const hasError = props.value.length < 3;
            //     return { ...props, error: hasError };
            // }
        },
        {
            field: 'endDateTime', headerName: 'Actual Out', width: 200, hideable: false, type: 'dateTime',
            editable: true,
            valueGetter: ({ value }) => value ? new Date(value) : "--",
            renderEditCell: (params) => <DateTimeCell type="Out" apiRef={apiRef} {...params} />
        },
    ]
}

const DEFAUL_API = API.Attendance;

const Amend = () => {
    const dispatch = useDispatch();
    const [openPopup, setOpenPopup] = useState(false);
    const isEdit = React.useRef(false);
    const row = React.useRef(null);
    const [selectionModel, setSelectionModel] = React.useState([]);
    const offSet = useRef({
        isLoadMore: false,
        isLoadFirstTime: true,
    })

    const [cellModesModel, setCellModesModel] = React.useState({});

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

    const [getEmployeeAttendance] = useLazyPostQuery();

    const { updateOneEntity, removeEntity, addEntity } = useEntityAction();


    const loadMoreData = (params) => {
        if (records.length < filter.totalRecord && params.viewportPageSize !== 0) {
            offSet.current.isLoadMore = true;
            setFilter({ ...filter, lastKey: records.length ? records[records.length - 1].id : null });
        }
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

    const handleAmendAttendance = () => {
        getEmployeeAttendance({
            url: DEFAUL_API, data: {
                filter: { fkEmployeeIds: ['63a7015948deb2d63f4cb8a9'] },
                dateFrom: new Date("2023-02-01"),
                dateTo: new Date()
            }
        }).then(({ data }) => {
            if (data)
                setRecords(data.result);
        })
    }
    const handleSaveAttendance = () => {
        addEntity({ url: API.Attendance, data: records })
    }

    useEffect(() => {
        offSet.current.isLoadFirstTime = false;
        dispatch(enableFilterAction(false));
        dispatch(builderFieldsAction(fields));
    }, [dispatch])

    const columns = getColumns(gridApiRef, handleActiveInActive, handelDeleteItems);

    const showAddModal = () => {
        isEdit.current = false;
        setOpenPopup(true);
    }
    /** @param {Array} _selectModels  */
    const hanldeSelectionEdit = (_selectModels) => {

        const id = _selectModels.at(-1);

        if (selectionModel.length > _selectModels.length) {
            const [offId] = selectionModel.filter(s => !_selectModels.includes(s));
            setCellModesModel({
                ...cellModesModel,
                [offId]: { ...cellModesModel[offId], 'startDateTime': { mode: "view", ignoreModifications: true }, 'endDateTime': { mode: 'view', ignoreModifications: true } },
            });
        } else {
            setCellModesModel({
                ...cellModesModel,
                [id]: { ...cellModesModel[id], 'startDateTime': { mode: "edit" }, 'endDateTime': { mode: 'edit' } },
            });
        }
        setSelectionModel(_selectModels);
    }

    return (
        <>
            <PageHeader
                title="Amend Attendance"
                enableFilter={true}
                subTitle="Manage Amend Attendance"
                icon={<PeopleOutline fontSize="large" />}
            />
            <DataGrid apiRef={gridApiRef}
                columns={columns} rows={records}
                loading={false}
                totalCount={offSet.current.totalRecord}
                disableSelectionOnClick
                cellModesModel={cellModesModel}
                experimentalFeatures={{ newEditingApi: true }}
                onCellModesModelChange={(model) => setCellModesModel(model)}
                // isCellEditable={console.log}
                toolbarProps={{
                    apiRef: gridApiRef,
                    onAdd: handleSaveAttendance,
                    getQuota: handleAmendAttendance,

                    records,
                    selectionModel
                }}

                gridToolBar={AmendToolbar}
                selectionModel={selectionModel}
                setSelectionModel={hanldeSelectionEdit}
                onRowsScrollEnd={loadMoreData}
            />
            <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
        </>
    );
}

export function AmendToolbar(props) {
    const { onAdd, getQuota, selectionModel, records } = props;

    return (
        <GridToolbarContainer sx={{ justifyContent: "flex-end" }}>

            {selectionModel?.length ? <Controls.Button onClick={onAdd} startIcon={<AddIcon />} text="Save" /> : null}
            <Controls.Button onClick={getQuota} startIcon={<AddIcon />} text="Apply" />
        </GridToolbarContainer>
    );
}

export default Amend;