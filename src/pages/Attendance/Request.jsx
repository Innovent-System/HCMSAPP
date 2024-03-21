// eslint-disable-next-line react-hooks/exhaustive-deps
import React, { useEffect, useRef, useState } from "react";
import Popup from '../../components/Popup';
import { API } from './_Service';
import { builderFieldsAction, useEntityAction, useEntitiesQuery, showDropDownFilterAction, useLazySingleQuery } from '../../store/actions/httpactions';
import { Stack, Typography } from "../../deps/ui";
import { PeopleOutline } from "../../deps/ui/icons";
import DataGrid, { getActions, GridToolbar, renderStatusCell, useGridApi } from '../../components/useDataGrid';
import { useSocketIo } from '../../components/useSocketio';
import ConfirmDialog from '../../components/ConfirmDialog';
import { AutoForm } from '../../components/useForm'
import PageHeader from '../../components/PageHeader'
import { startOfDay, addDays, isEqual } from '../../services/dateTimeService'
import { formateISODateTime } from "../../services/dateTimeService";
import Loader from '../../components/Circularloading'
import { useDropDownIds } from "../../components/useDropDown";
import { useAppDispatch, useAppSelector } from "../../store/storehook";

const fields = {
    status: {
        label: "Status",
        type: "select",
        valueSources: ["value"],
        fieldSettings: {
            listValues: [
                { value: "Pending", title: "Pending" },
                { value: "Approved", title: "Approved" },
                { value: "Rejected", title: "Rejected" }
            ]
        }
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
    }
}
const getColumns = (apiRef, onCancel) => [
    { field: '_id', headerName: 'Id', hide: true },
    {
        field: 'fullName', headerName: 'Employee Name', flex: 1, valueGetter: ({ row }) => row.employees.fullName
    },
    { field: 'requestDate', headerName: 'Request Date', flex: 1, valueGetter: ({ row }) => formateISODateTime(row.requestDate) },
    { field: 'changeType', headerName: 'Change Type', flex: 1, valueGetter: ({ row }) => row.changeType.join(',') },
    {
        field: 'status', headerName: 'Status', flex: 1, renderCell: renderStatusCell
    },
    { field: 'modifiedOn', headerName: 'Modified On', flex: 1, valueGetter: ({ row }) => formateISODateTime(row.modifiedOn) },
    { field: 'createdOn', headerName: 'Created On', flex: 1, valueGetter: ({ row }) => formateISODateTime(row.createdOn) },
    getActions(apiRef, { onCancel })
];

const AddAttendanceRequest = ({ openPopup, setOpenPopup }) => {
    const formApi = useRef(null);
    const [loader, setLoader] = useState(false);
    const { Employees } = useAppSelector(e => e.appdata.employeeData);
    const { addEntity } = useEntityAction();
    const [getAttendanceRequest] = useLazySingleQuery();
    const changeTypeTrack = useRef({ start: null, end: null });
    useEffect(() => {
        if (formApi.current && openPopup) {
            const { resetForm } = formApi.current;
            changeTypeTrack.current = { start: null, end: null };
            resetForm();
        }
    }, [openPopup, formApi])
    const formData = [
        {
            elementType: "ad_dropdown",
            name: "fkEmployeeId",
            label: "Employee",
            variant: "outlined",
            required: true,
            validate: {
                errorMessage: "Select Employee",
            },
            dataName: 'fullName',
            dataId: "_id",
            options: Employees,
            onChange: (data) => {
                if (!data) return;
                setLoader(true);
                const { setFormValue, getValue } = formApi.current;
                getAttendanceRequest({ url: API.GetAttendanceDetail, params: { employeeId: data._id, requestDate: getValue()?.requestDate } }).then(c => {
                    if (c.data?.result) {
                        changeTypeTrack.current = {
                            start: new Date(c.data.result.startDateTime),
                            end: new Date(c.data.result.endDateTime)
                        }
                        setFormValue({
                            startDateTime: new Date(c.data.result.startDateTime),
                            endDateTime: new Date(c.data.result.endDateTime)
                        });
                    }
                    else {

                        setFormValue({
                            startDateTime: null,
                            endDateTime: null
                        });
                    }
                    setLoader(false);
                })
            },
            defaultValue: null
        },
        {
            elementType: "datetimepicker",
            name: "requestDate",
            required: true,
            disableFuture: true,
            validate: {
                errorMessage: "Select Date please",
            },
            label: "Date",
            onChange: (data) => {
                if (!data) return;
                const { setFormValue, getValue } = formApi.current;
                const { fkEmployeeId } = getValue();
                if (!fkEmployeeId) return
                setLoader(true);
                getAttendanceRequest({ url: API.GetAttendanceDetail, params: { employeeId: fkEmployeeId._id, requestDate: data } }).then(c => {
                    if (c.data?.result) {
                        changeTypeTrack.current = {
                            start: new Date(c.data.result.startDateTime),
                            end: new Date(c.data.result.endDateTime)
                        }
                        setFormValue({
                            startDateTime: new Date(c.data.result.startDateTime),
                            endDateTime: new Date(c.data.result.endDateTime)
                        });
                    }
                    else {

                        setFormValue({
                            startDateTime: null,
                            endDateTime: null
                        });
                    }
                    setLoader(false);
                })
            },
            defaultValue: new Date()
        },
        {
            elementType: "datetimepicker",
            required: true,
            validate: {
                errorMessage: "Select Check In",
            },
            name: "startDateTime",
            shouldDisableDate: (date) => !isEqual(startOfDay(date), startOfDay(formApi.current?.getValue()?.requestDate)),
            disableFuture: true,
            category: "datetime",
            label: "Check In",
            defaultValue: null
        },
        {
            elementType: "datetimepicker",
            category: "datetime",
            shouldDisableDate: (date) => date < startOfDay(formApi.current?.getValue()?.startDateTime) || date >= addDays(startOfDay(formApi.current?.getValue()?.startDateTime), 2),
            disableFuture: true,
            // required: true,
            // validate: {
            //     errorMessage: "Select Check Out",
            // },
            name: "endDateTime",
            label: "Check Out",
            defaultValue: null
        },
        {
            elementType: "inputfield",
            name: "reason",
            required: true,
            label: "Reason",
            multiline: true,
            validate: {
                errorMessage: "Reson required",
            },
            minRows: 5,
            variant: "outlined",
            breakpoints: { md: 12, sx: 12, xs: 12 },
            defaultValue: ""
        }

    ];

    const handleSubmit = (e) => {
        const { getValue, validateFields } = formApi.current
        if (validateFields()) {
            let values = getValue();
            let dataToInsert = { ...values };
            dataToInsert.fkEmployeeId = values.fkEmployeeId._id;
            dataToInsert.employeeCode = values.fkEmployeeId.punchCode;
            dataToInsert.changeType = [];
            if (changeTypeTrack.current.start?.getTime() !== dataToInsert.startDateTime.getTime()) {
                dataToInsert.changeType.push("SignIn")
            }
            if (changeTypeTrack.current.end?.getTime() !== dataToInsert.endDateTime?.getTime()) {
                dataToInsert.changeType.push("SignOut")
            }

            addEntity({ url: DEFAULT_API, data: [dataToInsert] });

        }
    }
    return <>
        <Loader open={loader} />
        <Popup
            title="Attendance Request"
            openPopup={openPopup}
            maxWidth="sm"
            isEdit={false}
            keepMounted={true}
            addOrEditFunc={handleSubmit}
            setOpenPopup={setOpenPopup}>
            <Stack >
                <Typography variant="body2"><strong>Schedule Name :</strong>Morning</Typography>
                <Typography variant="body2"><strong>Schdule In :</strong>09:00 AM</Typography>
                <Typography variant="body2"><strong>Schedule Out :</strong>08:00 PM</Typography>
                <AutoForm formData={formData} ref={formApi} isValidate={true} />
            </Stack>
        </Popup>
    </>
}
const DEFAULT_API = API.AttendanceRequest;
const AttendanceRequest = () => {
    const dispatch = useAppDispatch();
    const [openPopup, setOpenPopup] = useState(false);

    const [selectionModel, setSelectionModel] = React.useState([]);
    const [sort, setSort] = useState({ sort: { createdAt: -1 } });
    const [gridFilter, setGridFilter] = useState({
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
    const { countryIds, stateIds, cityIds, areaIds } = useDropDownIds();
    const { data, isLoading, refetch, totalRecord } = useEntitiesQuery({
        url: DEFAULT_API,
        data: {
            limit: gridFilter.limit,
            page: gridFilter.page + 1,
            ...sort,
            searchParams: { ...query }
        }
    }, { selectFromResult: ({ data, isLoading }) => ({ data: data?.entityData, totalRecord: data?.totalRecord, isLoading }) });
    const { updateOneEntity } = useEntityAction();

    const { socketData } = useSocketIo("changeInAttendanceRequest", refetch);

    const handleCancel = (id) => {
        setConfirmDialog({
            isOpen: true,
            title: "Are you sure to cancel this request?",
            subTitle: "You can't undo this operation",
            onConfirm: () => {
                updateOneEntity({ url: `${DEFAULT_API}/cancel/${id}`, data: {} });
            },
        });

    }
    const columns = getColumns(gridApiRef, handleCancel);
    useEffect(() => {
        dispatch(showDropDownFilterAction({
            employee: true,
        }));
        dispatch(builderFieldsAction(fields));
    }, [dispatch])


    const showAddModal = () => {
        setOpenPopup(true);
    }

    return (
        <>
            <PageHeader
                title="Attendance Request"
                enableFilter={true}
                subTitle="Manage Attendance Request"
                icon={<PeopleOutline fontSize="large" />}
            />
            <AddAttendanceRequest openPopup={openPopup} setOpenPopup={setOpenPopup} />
            <DataGrid apiRef={gridApiRef}
                columns={columns} rows={data}
                loading={isLoading} pageSize={gridFilter.limit}
                page={gridFilter.page}
                totalCount={gridFilter.totalRecord}
                setFilter={setGridFilter}
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

export default AttendanceRequest;