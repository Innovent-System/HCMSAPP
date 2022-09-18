// eslint-disable-next-line react-hooks/exhaustive-deps
import React, { useEffect, useRef, useState } from "react";
import { API } from '../_Service';
import { useSelector } from 'react-redux';
import { useEntityAction, useEntitiesQuery } from '../../../store/actions/httpactions';
import DataGrid, { useGridApi } from '../../../components/useDataGrid';
import { useSocketIo } from '../../../components/useSocketio';
import ConfirmDialog from '../../../components/ConfirmDialog';
import { useDropDownIds } from '../../../components/useDropDown'
import CommonDropDown from "../../../components/CommonDropDown";
import { Typography, Stack, Link, Tab, TabContext, Box, TabList, TabPanel } from "../../../deps/ui";
import Tabs from '../../../components/Tabs'


const columns = [
    { field: '_id', headerName: 'Id', hide: true, hideable: false },
    { field: 'row_No', headerName: 'Sr#', hideable: false, maxWidth: 50 },
    {
        field: 'fullName', headerName: 'Employee', width: 180, hideable: false, renderCell: ({ row }) => (
            <Link underline="hover">{row.fullName}</Link>
        )
    },
    { field: 'area', headerName: 'Area', hideable: false, valueGetter: ({ row }) => row.area.areaName },
    { field: 'department', headerName: 'Department', hideable: false, valueGetter: ({ row }) => row.department.departmentName },
    { field: 'desgination', headerName: 'Desgination', hideable: false, valueGetter: ({ row }) => row.designation.name },
    { field: 'group', headerName: 'Group', hideable: false, valueGetter: ({ row }) => row.group.groupName },
]

const DEFAUL_API = API.ScheduleDetail;
let editId = 0;
const AssingSchedule = ({ scheduleId, tab, handleTabs, selectedEmployees, setSelectedEmployees }) => {
    const [pageSize, setPageSize] = useState(30);
    const isEdit = React.useRef(false);
    const formApi = React.useRef(null);
    const [selectionModel, setSelectionModel] = React.useState([]);
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

    const [records, setRecords] = useState({
        assigned: [],
        unAssign: []
    });

    const gridApiRef = useGridApi();
    const ids = useDropDownIds();

    const { data, status, isLoading, refetch } = useEntitiesQuery({
        url: DEFAUL_API,
        params: {
            scheduleId,
            "companyInfo.fkAreaId": ids.areaIds
        }
    });



    const { addEntity, updateOneEntity, removeEntity } = useEntityAction();

    useEffect(() => {
        if (status === "fulfilled") {
            setRecords(data.result)
            offSet.current.isLoadMore = false;
        }

    }, [data, status])

    const { socketData } = useSocketIo("changeInSchedule", refetch);

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

    const handleSubmit = (e) => {
        const { getValue, validateFields } = formApi.current
        if (validateFields()) {
            let values = getValue();
            let dataToInsert = {};
            dataToInsert.name = values.name;
            if (isEdit.current)
                dataToInsert._id = editId

            addEntity({ url: DEFAUL_API, data: [dataToInsert] });

        }
    }

    return (
        <>
            <CommonDropDown showFilters={{
                company: true,
                country: true,
                state: true,
                city: true,
                area: true
            }}

            />

            <Box sx={{ width: '100%', typography: 'body1' }}>
                <TabContext value={tab}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList onChange={handleTabs} aria-label="lab API tabs example">
                            <Tab label="Assigned" value="1" />
                            <Tab label="UnAssigned" value="2" />
                        </TabList>
                    </Box>
                    <TabPanel value="1">
                        <DataGrid apiRef={gridApiRef}
                            columns={columns} rows={records.assigned}
                            disableSelectionOnClick
                            loading={isLoading} pageSize={pageSize}
                            totalCount={offSet.current.totalRecord}
                            selectionModel={selectedEmployees}
                            setSelectionModel={setSelectedEmployees}
                        />
                    </TabPanel>
                    <TabPanel value="2">
                        <DataGrid apiRef={gridApiRef}
                            columns={columns} rows={records.unAssign}
                            disableSelectionOnClick
                            loading={isLoading} pageSize={pageSize}
                            totalCount={offSet.current.totalRecord}
                            selectionModel={selectedEmployees}
                            setSelectionModel={setSelectedEmployees}
                        />
                    </TabPanel>
                </TabContext>
            </Box>

            <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
        </>
    );
}
export default AssingSchedule;