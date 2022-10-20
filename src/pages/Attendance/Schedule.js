// eslint-disable-next-line react-hooks/exhaustive-deps
import React, { useEffect, useRef, useState } from "react";
import Controls from '../../components/controls/Controls';
import Popup from '../../components/Popup';
import { API } from './_Service';
import { useDispatch, useSelector } from 'react-redux';
import { builderFieldsAction, useEntityAction, useEntitiesQuery, enableFilterAction, useLazySingleQuery } from '../../store/actions/httpactions';
import {
    GridToolbarContainer, Box, GridActionsCellItem, Badge, Grid, Typography
} from "../../deps/ui";
import { Circle, Add as AddIcon, Delete as DeleteIcon, People, PeopleOutline } from "../../deps/ui/icons";
import DataGrid, { useGridApi, getActions } from '../../components/useDataGrid';
import { useSocketIo } from '../../components/useSocketio';
import ConfirmDialog from '../../components/ConfirmDialog';
import PropTypes from 'prop-types'
import { formateISODateTime, formateISOTime } from '../../services/dateTimeService'
import ShiftCard from "./components/ShiftCard";
import PageHeader from '../../components/PageHeader'
import AssingSchedule from "./components/AssignSchedule";
const fields = {
    scheduleName: {
        label: 'Schedule',
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

const getColumns = (apiRef, onEdit, onActive, onDelete, setOpenShift) => {
    const actionKit = {
        onActive: onActive,
        onEdit: onEdit,
        onDelete: onDelete
    }
    return [
        { field: '_id', headerName: 'Id', hide: true, hideable: false },
        {
            field: 'code', headerName: 'Code', flex: 1, hideable: false
        },
        {
            field: 'scheduleName', headerName: 'Name', flex: 1, hideable: false
        },
        {
            field: 'totalAssigned', cellClassName: 'actions', type: "actions", headerName: 'Assigned Employees', flex: 1, align: 'center', hideable: false, renderCell: ({ row }) => (

                <GridActionsCellItem
                    icon={<Badge badgeContent={row.totalAssigned} color="primary" showZero>
                        <People fontSize="small" color="action" />
                    </Badge>}
                    label="Active"
                    onClick={() => { setOpenShift(row.id) }}
                    color="primary"
                />
            )
        },
        { field: 'modifiedOn', headerName: 'Modified On', hideable: false, flex: 1, valueGetter: ({ row }) => formateISODateTime(row.modifiedOn) },
        { field: 'createdOn', headerName: 'Created On', hideable: false, flex: 1,valueGetter: ({ row }) => formateISODateTime(row.createdOn) },
        {
            field: 'isActive', headerName: 'Status',flex: 1, renderCell: (param) => (
                param.row["isActive"] ? <Circle color="success" /> : <Circle color="disabled" />
            ),
            flex: '0 1 5%',
            hideable: false,
            align: 'center',
        },
        getActions(apiRef, actionKit)
    ]
}


const initialState = [{ name: "Sunday", isNextDay: false, fkShiftId: "", startTime: "-:-:-", endTime: "-:-:-", minTime: "-:-:-", maxTime: "-:-:-" },
{ name: "Monday", isNextDay: false, fkShiftId: "", startTime: "-:-:-", endTime: "-:-:-", minTime: "-:-:-", maxTime: "-:-:-" },
{ name: "Tuesday", isNextDay: false, fkShiftId: "", startTime: "-:-:-", endTime: "-:-:-", minTime: "-:-:-", maxTime: "-:-:-" },
{ name: "Wednesday", isNextDay: false, fkShiftId: "", startTime: "-:-:-", endTime: "-:-:-", minTime: "-:-:-", maxTime: "-:-:-" },
{ name: "Thursday", isNextDay: false, fkShiftId: "", startTime: "-:-:-", endTime: "-:-:-", minTime: "-:-:-", maxTime: "-:-:-" },
{ name: "Friday", isNextDay: false, fkShiftId: "", startTime: "-:-:-", endTime: "-:-:-", minTime: "-:-:-", maxTime: "-:-:-" },
{ name: "Saturday", isNextDay: false, fkShiftId: "", startTime: "-:-:-", endTime: "-:-:-", minTime: "-:-:-", maxTime: "-:-:-" }
];

const initialError = [{ startTime: "", endTime: "", missingAfter: "", late: "", early: "", shortDay: "", halfday: "" },
{ startTime: "", endTime: "", missingAfter: "", late: "", early: "", shortDay: "", halfday: "" },
{ startTime: "", endTime: "", missingAfter: "", late: "", early: "", shortDay: "", halfday: "" },
{ startTime: "", endTime: "", missingAfter: "", late: "", early: "", shortDay: "", halfday: "" },
{ startTime: "", endTime: "", missingAfter: "", late: "", early: "", shortDay: "", halfday: "" },
{ startTime: "", endTime: "", missingAfter: "", late: "", early: "", shortDay: "", halfday: "" },
{ startTime: "", endTime: "", missingAfter: "", late: "", early: "", shortDay: "", halfday: "" }
];

const DEFAUL_API = API.Schedule;
let editId = 0;
const Schedule = () => {
    const dispatch = useDispatch();
    const [openPopup, setOpenPopup] = useState(false);
    const [openShift, setOpenShift] = useState(false);
    const [pageSize, setPageSize] = useState(30);
    const isEdit = React.useRef(false);
    const formApi = React.useRef(null);
    const [state, setState] = useState(initialState);

    const [tab, setTab] = React.useState('1');

    const [textField, setTextField] = useState({
        code: "",
        scheduleName: ""
    })
    const [error, setError] = useState({
        code: "",
        scheduleName: ""
    });
    const shiftList = useRef([]);

    const [selectionModel, setSelectionModel] = React.useState([]);
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const offSet = useRef({
        isLoadMore: false,
        isLoadFirstTime: true,
        scheduleId: null
    })

    const [filter, setFilter] = useState({
        lastKey: null,
        limit: 10,
        totalRecord: 0
    })

    const [getShiftList] = useLazySingleQuery();

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
            searchParams: query ? JSON.stringify(query) : ""
        }
    });

    const { addEntity, updateOneEntity, updateEntity, removeEntity } = useEntityAction();

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
        getShiftList({
            url: API.Shift, params: {
                limit: 30,
                lastKeyId: null,
                searchParams: '{}'
            }
        }).then(c => {
            if (c.data?.result)
                shiftList.current = c.data?.result.entityData;

        })

        offSet.current.isLoadFirstTime = false;
        dispatch(builderFieldsAction(fields));

    }, [dispatch])

    const columns = getColumns(gridApiRef, handleEdit, handleActiveInActive, handelDeleteItems, (id) => {
        offSet.current.scheduleId = id;
        setOpenShift(true);
    });

    const handleSubmit = (e) => {
        if (!textField.code) return setError({ ...error, code: "Code is required" })
        if (!textField.scheduleName) return setError({ ...error, scheduleName: "Schedule Name is required" })
        const mapData = {
            code: textField.code,
            scheduleName: textField.scheduleName,
            weeks: state.map(s => ({ name: s.name, isHoliday: !Boolean(s.fkShiftId), fkShiftId: s.fkShiftId ? s.fkShiftId : null }))
        }

        if (isEdit.current)
            mapData._id = editId

        addEntity({
            url: DEFAUL_API, data: [mapData]
        });
        // }
    }
    const updateSchedule = () => {

        updateEntity({
            url: API.UpdateSchedule, data: {
                scheduleId: offSet.current.scheduleId,
                isFromAssign: tab === "1",
                employeeIds: selectedEmployees
            }
        });

    }

    const handleTextField = (e) => {
        const { name, value } = e.target;
        setTextField({ ...textField, [name]: value });
    }

    const handleChange = (e, index) => {
        const { name, value } = e.target;
        state[index][name] = value;
        if (name === "fkShiftId" && value) {
            const sourceData = shiftList.current.find(c => c.id === value);
            state[index].startTime = formateISOTime(sourceData.startTime);
            state[index].endTime = formateISOTime(sourceData.endTime);
            state[index].minTime = formateISOTime(sourceData.minTime);
            state[index].maxTime = formateISOTime(sourceData.maxTime);
            state[index].isNextDay = sourceData.isNextDay;
        }
        else {
            state[index].startTime = "--:--:-";
            state[index].endTime = "--:--:--";
            state[index].minTime = "--:--:--"
            state[index].maxTime = "--:--:--"
            state[index].isNextDay = false;
        }

        setState([...state])
    }
    const handleCopy = (e, source) => {
        const target = e.currentTarget.firstChild.innerText;
        const targetData = state.find(c => c.name === target);
        targetData.fkShiftId = source.fkShiftId;
        targetData.startTime = source.startTime;
        targetData.endTime = source.endTime;
        targetData.minTime = source.minTime;
        targetData.maxTime = source.maxTime;

        setState([...state]);
    }
    const showAddModal = () => {
        isEdit.current = false;
        setOpenPopup(true);
    }

    const handleTabs = (event, newValue) => {
        setTab(newValue);
    };

    return (
        <>
            <PageHeader
                title="Schedule"
                enableFilter={true}
                subTitle="Manage Schedule"
                icon={<PeopleOutline fontSize="large" />}
            />
            <Popup
                title="Add Schedule"
                openPopup={openPopup}
                maxWidth="lg"
                isEdit={isEdit.current}
                addOrEditFunc={handleSubmit}
                setOpenPopup={setOpenPopup}>
                <Grid container gap={2}>
                    <Grid item sm={12} md={4}>
                        <Controls.Input name="code" error={error.code} onChange={handleTextField} value={textField.code} required label="Code" />
                    </Grid>
                    <Grid item sm={12} md={4}>
                        <Controls.Input name="scheduleName" error={error.scheduleName} onChange={handleTextField} value={textField.scheduleName} required label="Name" />
                    </Grid>
                    <Grid item width="100%">
                        <Typography variant="h6" >Select Working  Days</Typography>
                    </Grid>
                    {state.map((w, index) => (
                        <Grid key={w.name + "week"} item>
                            <ShiftCard index={index} handleCopy={handleCopy} handleChange={handleChange} shifts={shiftList.current} data={w} />
                        </Grid>
                    ))}
                </Grid>
            </Popup>
            <Popup
                title="Assinged Schedule"
                openPopup={openShift}
                buttonName={tab === "1" ? "UnAssign" : "Assign"}
                maxWidth="sm"
                isEdit={isEdit.current}
                addOrEditFunc={updateSchedule}
                setOpenPopup={setOpenShift}
            >
                <AssingSchedule handleTabs={handleTabs} tab={tab} scheduleId={offSet.current.scheduleId} setSelectedEmployees={setSelectedEmployees} selectedEmployees={selectedEmployees} />
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
                gridToolBar={ScheduleToolbar}
                selectionModel={selectionModel}
                setSelectionModel={setSelectionModel}
                onRowsScrollEnd={loadMoreData}
            />
            <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
        </>
    );
}
export default Schedule;

function ScheduleToolbar(props) {
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

ScheduleToolbar.propTypes = {
    apiRef: PropTypes.shape({
        current: PropTypes.object,
    }).isRequired,
    onAdd: PropTypes.func,
    onDelete: PropTypes.func,
    selectionModel: PropTypes.array
};