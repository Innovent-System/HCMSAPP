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
    {
        field: 'fullName', headerName: 'Employee', width: 180, hideable: false, renderCell: ({ row }) => (
            <Stack sx={{ cursor: "pointer" }}>
                <Link underline="hover">{row.fullName}</Link>
                <Typography variant="caption"><strong>Department :</strong>{row.department.departmentName}</Typography>
                <Typography variant="caption"><strong>Designation :</strong>{row.designation.name}</Typography>
                <Typography variant="caption"><strong>Group :</strong>{row.group.groupName}</Typography>
            </Stack>
        )
    },
    {
        field: 'detail', headerName: 'Detail', renderCell: ({ row }) => (<Stack>
            <Typography variant="caption"><strong>Company :</strong>{row.company.companyName} </Typography>
            <Typography variant="caption"><strong>Country :</strong>{row.country.name}</Typography>
            <Typography variant="caption"><strong>State :</strong>{row.state.name}</Typography>
            <Typography variant="caption"><strong>City :</strong>{row.city.name}</Typography>
            <Typography variant="caption"><strong>Area :</strong>{row.area.areaName}</Typography>
        </Stack>), flex: 1
    },
]

const DEFAUL_API = API.ShiftDetail;
let editId = 0;
const AssingShift = ({ shiftId, selectedEmployees, setSelectedEmployees }) => {
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
            shiftId,
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

    const { socketData } = useSocketIo("changeInDesignation", refetch);

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

    const [value, setValue] = React.useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

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
                <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList onChange={handleChange} aria-label="lab API tabs example">
                            <Tab label="Assigned" value="1" />
                            <Tab label="UnAssigned" value="2" />
                        </TabList>
                    </Box>
                    <TabPanel value="1">
                        <DataGrid apiRef={gridApiRef}
                            columns={columns} rows={records.assigned}
                            rowHeight={100}
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
                            rowHeight={100}
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
export default AssingShift;