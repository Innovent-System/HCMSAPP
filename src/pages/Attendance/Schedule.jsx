// eslint-disable-next-line react-hooks/exhaustive-deps
import React, { useEffect, useRef, useState } from "react";
import Controls from '../../components/controls/Controls';
import Popup from '../../components/Popup';
import { API } from './_Service';
import { builderFieldsAction, useEntityAction, useEntitiesQuery, enableFilterAction, useLazyPostQuery } from '../../store/actions/httpactions';
import {
    GridActionsCellItem, Badge, Grid, Typography
} from "../../deps/ui";
import { Circle, People, PeopleOutline } from "../../deps/ui/icons";
import DataGrid, { useGridApi, getActions, GridToolbar } from '../../components/useDataGrid';
import { useSocketIo } from '../../components/useSocketio';
import ConfirmDialog from '../../components/ConfirmDialog';
import { formateISODateTime, formateISOTime } from '../../services/dateTimeService'
import ShiftCard from "./components/ShiftCard";
import PageHeader from '../../components/PageHeader'
import AssingSchedule from "./components/AssignSchedule";
import { useAppDispatch, useAppSelector } from "../../store/storehook";
import InfoToolTip from "../../components/InfoToolTip";
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

const getColumns = (apiRef, onEdit, onActive, setOpenShift) => {
    const actionKit = {
        onActive: onActive,
        onEdit: onEdit
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
        { field: 'createdOn', headerName: 'Created On', hideable: false, flex: 1, valueGetter: ({ row }) => formateISODateTime(row.createdOn) },
        {
            field: 'isActive', headerName: 'Status', flex: 1, renderCell: (param) => (
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

const DEFAULT_API = API.Schedule;
let editId = 0;
const Schedule = () => {
    const dispatch = useAppDispatch();
    const [openPopup, setOpenPopup] = useState(false);
    const [openShift, setOpenShift] = useState(false);
    const isEdit = React.useRef(false);
    const formApi = React.useRef(null);
    const [state, setState] = useState([...initialState]);
    const scheduleId = useRef(null);

    const [tab, setTab] = React.useState('0');

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
    const [sort, setSort] = useState({ sort: { createdAt: -1 } });

    const [filter, setFilter] = useState({
        lastKey: null,
        limit: 10,
        page: 0,
        totalRecord: 0
    })

    const [getShiftList] = useLazyPostQuery();

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
            ...sort,
            searchParams: { ...query }
        }
    }, { selectFromResult: ({ data, isLoading }) => ({ data: data?.entityData, totalRecord: data?.totalRecord, isLoading }) });

    const { addEntity, updateOneEntity, updateEntity, removeEntity } = useEntityAction();

    const { socketData } = useSocketIo("changeInSchedule", refetch);



    const handleEdit = (id) => {
        isEdit.current = true;
        editId = id;

        const { code, scheduleName, weeks } = data.find(c => c.id === id);

        setState(weeks.map(w => {
            const sourceData = shiftList.current.find(s => s.id === w.fkShiftId);

            return {
                fkShiftId: w.fkShiftId,
                name: w.name,
                startTime: sourceData ? formateISOTime(sourceData.startTime) : "--:--:-",
                endTime: sourceData ? formateISOTime(sourceData.endTime) : "--:--:-",
                minTime: sourceData ? formateISOTime(sourceData.minTime) : '--:--:-',
                maxTime: sourceData ? formateISOTime(sourceData.maxTime) : '--:--:-',
                isNextDay: sourceData ? sourceData.isNextDay : false
            }
        }))

        setTextField({
            code,
            scheduleName
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
        getShiftList({
            url: `${API.Shift}/get`, data: {
                page: 1,
                limit: 30,
                searchParams: {}
            }
        }).then(c => {
            if (c.data)
                shiftList.current = c.data?.entityData;

        })


        dispatch(builderFieldsAction(fields));

    }, [dispatch])

    const columns = getColumns(gridApiRef, handleEdit, handleActiveInActive, (id) => {
        scheduleId.current = id;
        setTab('0');
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
            url: DEFAULT_API, data: [mapData]
        });
        // }
    }
    const updateSchedule = () => {

        updateEntity({
            url: API.UpdateSchedule, data: {
                scheduleId: scheduleId.current,
                isFromAssign: tab === "0",
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
        const sourceData = shiftList.current.find(c => c.id === value);
        if (name === "fkShiftId" && sourceData) {
            state[index].fkShiftId = value;
            state[index].startTime = formateISOTime(sourceData.startTime);
            state[index].endTime = formateISOTime(sourceData.endTime);
            state[index].minTime = formateISOTime(sourceData.minTime);
            state[index].maxTime = formateISOTime(sourceData.maxTime);
            state[index].isNextDay = sourceData.isNextDay;
        }
        else {
            state[index].fkShiftId = '';
            state[index].startTime = "--:--:-";
            state[index].endTime = "--:--:--";
            state[index].minTime = "--:--:--"
            state[index].maxTime = "--:--:--"
            state[index].isNextDay = false;
        }

        setState([...state])
        return state[index];
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
        setTextField({
            code: "",
            scheduleName: ""
        })
        setError({
            code: "",
            scheduleName: ""
        });
        setState(initialState.map(e => ({ ...e })));
        setOpenPopup(true);
    }

    const handleTabs = (newValue) => {

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
                        <Typography variant="h6" >Select Working  Days
                            <InfoToolTip sx={{ display: 'inline-block' }} placement="bottom" color="info" title='You can edit by double click on shift cell' />
                        </Typography>

                    </Grid>
                    <Grid item sm={12} xs={12} md={12}>
                        <ShiftCard index={0} handleCopy={handleCopy} handleChange={handleChange} shifts={shiftList.current} data={state} />
                    </Grid>

                </Grid>
            </Popup>
            <Popup
                title="Assinged Schedule"
                openPopup={openShift}
                buttonName={tab === "0" ? "UnAssign" : "Assign"}
                maxWidth="md"
                isEdit={isEdit.current}
                addOrEditFunc={updateSchedule}
                setOpenPopup={setOpenShift}
            >
                <AssingSchedule handleTabs={handleTabs} tab={tab} scheduleId={scheduleId.current} setSelectedEmployees={setSelectedEmployees} selectedEmployees={selectedEmployees} />
            </Popup>
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
export default Schedule;