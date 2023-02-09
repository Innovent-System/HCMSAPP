// eslint-disable-next-line react-hooks/exhaustive-deps
import React, { useEffect, useRef, useState } from "react";
import { API } from './_Service';
import { useDispatch, useSelector } from 'react-redux';
import { builderFieldsAction, useEntityAction, enableFilterAction, useLazyPostQuery } from '../../store/actions/httpactions';
import { Circle, Add as AddIcon } from "../../deps/ui/icons";
import { GridToolbarContainer, Select, MenuItem, FormControl, InputLabel } from "../../deps/ui";
import DataGrid, { useGridApi } from '../../components/useDataGrid';
import ConfirmDialog from '../../components/ConfirmDialog';
import { formateISODate, formateISODateTime } from "../../services/dateTimeService";
import Controls from "../../components/controls/Controls";
import useTable from "../../components/useTable";
import { getYears } from "../../util/common";


const fields = {
    title: {
        label: 'Leave Type',
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
        { field: 'startDateTime', headerName: 'Actual In', width: 200, hideable: false, type: 'dateTime', editable: true, valueGetter: ({ value }) => value ? new Date(value) : "--" },
        { field: 'endDateTime', headerName: 'Actual Out', width: 200, hideable: false, type: 'dateTime', editable: true, valueGetter: ({ value }) => value ? new Date(value) : "--" },
    ]
}

const DEFAUL_API = API.Attendance;

const TableHead = [
    { id: 'title', disableSorting: false, label: 'Leave Type' },
    { id: 'entitled', disableSorting: false, label: 'Allowed' },
    { id: 'pending', disableSorting: false, label: 'Pending' },
    { id: 'taken', disableSorting: false, label: 'Taken' },
    { id: 'remaining', disableSorting: false, label: 'Remaining' }

];
const Years = getYears();
const currentYear = new Date().getFullYear();
const DetailPanelContent = ({ row }) => {
    const { TblContainer, TblHead, TblBody } = useTable(row, TableHead)
    return (
        <TblContainer>
            <TblHead />
            <TblBody />
        </TblContainer>
    )
}

const Amend = () => {
    const dispatch = useDispatch();
    const [openPopup, setOpenPopup] = useState(false);
    const isEdit = React.useRef(false);
    const row = React.useRef(null);
    const [selectionModel, setSelectionModel] = React.useState([]);
    const [year, setYear] = useState(currentYear)
    const offSet = useRef({
        isLoadMore: false,
        isLoadFirstTime: true,
    })

    const [filter, setFilter] = useState({
        lastKey: null,
        limit: 10,
        totalRecord: 0
    })

    const getDetailPanelContent = React.useCallback(
        ({ row }) => <DetailPanelContent row={row.leaveTypes} />,
        [],
    );

    const getDetailPanelHeight = React.useCallback(() => 180, []);

    const [detailPanelExpandedRowIds, setDetailPanelExpandedRowIds] = React.useState(
        [],
    );

    const handleDetailPanelExpandedRowIdsChange = React.useCallback((newIds) => {
        setDetailPanelExpandedRowIds(newIds);
    }, []);


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

    const handleLeaveQuota = () => {
        getEmployeeAttendance({
            url: DEFAUL_API, data: {
                filter: null,
                dateFrom: new Date("2023-02-01"),
                dateTo: new Date()
            }
        }).then(({ data }) => {
            if (data)
                setRecords(data.result);
        })
    }
    const handleCreateQuota = () => {
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

    return (
        <>
            <DataGrid apiRef={gridApiRef}
                columns={columns} rows={records}
                loading={false}
                totalCount={offSet.current.totalRecord}
                // isCellEditable={console.log}
                toolbarProps={{
                    apiRef: gridApiRef,
                    onAdd: handleCreateQuota,
                    getQuota: handleLeaveQuota,
                    year,
                    setYear,
                    records,
                    selectionModel
                }}

                gridToolBar={AmendToolbar}
                selectionModel={selectionModel}
                setSelectionModel={setSelectionModel}
                onRowsScrollEnd={loadMoreData}
            />
            <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
        </>
    );
}

export function AmendToolbar(props) {
    const { onAdd, getQuota, year, setYear, records } = props;

    return (
        <GridToolbarContainer sx={{ justifyContent: "flex-end" }}>
            <FormControl sx={{ width: 120 }} size="small">
                <InputLabel size="small" id={`demo-multiple-name-year`}>Year</InputLabel>
                <Select size="small" value={year} onChange={(e) => setYear(e.target.value)} variant="outlined" name="year" label="Year">
                    {Years.map(y => <MenuItem key={y} value={y}>{y}</MenuItem>)}
                </Select>
            </FormControl>
            {records?.length ? <Controls.Button onClick={onAdd} startIcon={<AddIcon />} text="Update Quota" /> : null}
            <Controls.Button onClick={getQuota} startIcon={<AddIcon />} text="Create Quota" />
        </GridToolbarContainer>
    );
}

export default Amend;