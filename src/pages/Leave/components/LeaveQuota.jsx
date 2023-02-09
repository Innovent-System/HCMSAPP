// eslint-disable-next-line react-hooks/exhaustive-deps
import React, { useEffect, useRef, useState } from "react";
import Popup from '../../../components/Popup';
import { AutoForm } from '../../../components/useForm';
import { API } from '../_Service';
import { useDispatch, useSelector } from 'react-redux';
import { builderFieldsAction, useEntityAction, enableFilterAction, useLazyPostQuery } from '../../../store/actions/httpactions';
import { Circle, Add as AddIcon } from "../../../deps/ui/icons";
import { GridToolbarContainer, Select, MenuItem, FormControl, InputLabel } from "../../../deps/ui";
import DataGrid, { useGridApi } from '../../../components/useDataGrid';
import ConfirmDialog from '../../../components/ConfirmDialog';
import { useDropDown } from "../../../components/useDropDown";
import { formateISODate } from "../../../services/dateTimeService";
import Controls from "../../../components/controls/Controls";
import useTable from "../../../components/useTable";
import { getYears } from "../../../util/common";


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

const getColumns = (apiRef, onEdit, onActive, onDelete) => {
    const actionKit = {
        onActive: onActive,
        onEdit: onEdit,
        onDelete: onDelete
    }
    return [
        { field: '_id', headerName: 'Id', hide: true, hideable: false },
        {
            field: 'fullName', headerName: 'Employee Name', width: 180, hideable: false
        },
        { field: 'quotaStartDate', headerName: 'Start Date', width: 180, hideable: false, valueGetter: ({ row }) => formateISODate(row.quotaStartDate) },
        { field: 'quotaEndDate', headerName: 'End Date', width: 180, hideable: false, valueGetter: ({ row }) => formateISODate(row.quotaEndDate) },

    ]
}

const DEFAUL_API = API.LeaveQuota;

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

const LeaveQuota = () => {
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

    const [getLeaveQuota] = useLazyPostQuery();

    const { updateOneEntity, removeEntity, addEntity } = useEntityAction();


    const loadMoreData = (params) => {
        if (records.length < filter.totalRecord && params.viewportPageSize !== 0) {
            offSet.current.isLoadMore = true;
            setFilter({ ...filter, lastKey: records.length ? records[records.length - 1].id : null });
        }
    }

    const handleEdit = (id) => {
        isEdit.current = true;
        const data = records.find(a => a.id === id);
        row.current = data;
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

    const handleLeaveQuota = () => {
        getLeaveQuota({
            url: DEFAUL_API, data: {
                year,
                employeeIds: []
            }
        }).then(({ data }) => {
            if (data)
                setRecords(data.result);
        })
    }
    const handleCreateQuota = () => {
        addEntity({ url: API.LeaveQuotaInsert, data: records })
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
            <DataGrid apiRef={gridApiRef}
                columns={columns} rows={records}
                loading={false}
                totalCount={offSet.current.totalRecord}
                toolbarProps={{
                    apiRef: gridApiRef,
                    onAdd: handleCreateQuota,
                    getQuota: handleLeaveQuota,
                    year,
                    setYear,
                    records,
                    selectionModel
                }}

                checkboxSelection={false}
                detailPanelExpandedRowIds={detailPanelExpandedRowIds}
                onDetailPanelExpandedRowIdsChange={handleDetailPanelExpandedRowIdsChange}
                getDetailPanelContent={getDetailPanelContent}
                getDetailPanelHeight={getDetailPanelHeight} // Height based on the content.
                gridToolBar={QuotaToolbar}
                selectionModel={selectionModel}
                setSelectionModel={setSelectionModel}
                onRowsScrollEnd={loadMoreData}
            />
            <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
        </>
    );
}

export function QuotaToolbar(props) {
    const {  onAdd, getQuota, year, setYear, records } = props;

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

export default LeaveQuota;