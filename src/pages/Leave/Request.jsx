// eslint-disable-next-line react-hooks/exhaustive-deps
import React, { useEffect, useRef, useState } from "react";
import Popup from '../../components/Popup';
import { API } from './_Service';

import { builderFieldsAction, useEntityAction, useEntitiesQuery, showDropDownFilterAction, useLazySingleQuery } from '../../store/actions/httpactions';
import { PeopleOutline } from "../../deps/ui/icons";
import DataGrid, { getActions, GridToolbar, renderStatusCell, useGridApi } from '../../components/useDataGrid';
import { useSocketIo } from '../../components/useSocketio';
import ConfirmDialog from '../../components/ConfirmDialog';
import { AutoForm } from '../../components/useForm'
import PageHeader from '../../components/PageHeader'
import { startOfDay, addDays, isEqual, formateISODate } from '../../services/dateTimeService'
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

const Duration = [
    { id: "FullDay", title: "Full Day" },
    { id: "HalfDay", title: "Half Day" }
];


const getColumns = (apiRef, onCancel) => [
    { field: '_id', headerName: 'Id', hide: true },
    {
        field: 'fullName', headerName: 'Employee Name', flex: 1, valueGetter: ({ row }) => row.employees.fullName
    },
    { field: 'fromDate', headerName: 'From', flex: 1, valueGetter: ({ row }) => formateISODate(row.fromDate) },
    { field: 'toDate', headerName: 'To', flex: 1, valueGetter: ({ row }) => formateISODate(row.toDate) },
    { field: 'leavetype', headerName: 'Leave Type', flex: 1, valueGetter: ({ row }) => row.leavetype.title },
    { field: 'leaveDuration', headerName: 'Duration', flex: 1 },
    {
        field: 'status', headerName: 'Status', flex: 1, renderCell: renderStatusCell
    },
    { field: 'modifiedOn', headerName: 'Modified On', flex: 1, valueGetter: ({ row }) => formateISODateTime(row.modifiedOn) },
    { field: 'createdOn', headerName: 'Created On', flex: 1, valueGetter: ({ row }) => formateISODateTime(row.createdOn) },
    getActions(apiRef, { onCancel }, true)
];

export const AddLeaveRequest = ({ requestedDate = null, requestedEmployee = null, openPopup, setOpenPopup }) => {
    const formApi = useRef(null);
    const [loader, setLoader] = useState(false);
    const [leaveTypes, setLeaveTypes] = useState([]);
    const { Employees } = useAppSelector(e => e.appdata.employeeData);
    const { addEntity } = useEntityAction();
    const [getLeaveDetail] = useLazySingleQuery();

    useEffect(() => {
        if (formApi.current && openPopup) {
            const { resetForm } = formApi.current;
            resetForm();
        }
    }, [openPopup, formApi])

    useEffect(() => {

        if (requestedEmployee && openPopup) {

            const { setFormValue, getValue } = formApi.current;
            getLeaveDetail({ url: API.GetLeaveDetail, params: { employeeId: requestedEmployee } }).then(c => {
                if (c.data?.result) {
                    setLeaveTypes(c.data.result);
                }
                setFormValue({
                    fkEmployeeId: Employees.find(e => e._id === requestedEmployee)
                })
            })


        }
    }, [requestedEmployee, Employees, openPopup])
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

                const { setFormValue, getValue } = formApi.current;
                getLeaveDetail({ url: API.GetLeaveDetail, params: { employeeId: data._id } }).then(c => {
                    if (c.data?.result) {
                        setLeaveTypes(c.data.result);
                    }

                })
            },
            defaultValue: null
        },
        {
            elementType: "dropdown",
            name: "fkLeaveTypeId",
            label: "Leave Type",
            dataId: "_id",
            dataName: "title",
            required: true,
            validate: {
                errorMessage: "Leave Type required",
            },
            options: leaveTypes,
            defaultValue: ""
        },
        {
            elementType: "daterangepicker",
            name: "leavesDate",
            required: true,
            // disableFuture: true,
            breakpoints: { size: { md: 12, xs: 12 } },
            validate: {
                errorMessage: "Select Date please",
            },
            defaultValue: requestedDate ? [new Date(requestedDate), new Date(requestedDate)] : [new Date(), new Date()]
        },
        {
            elementType: "dropdown",
            name: "leaveDuration",
            label: "Duration",
            dataId: "id",
            dataName: "title",
            defaultValue: "FullDay",
            required: true,
            validate: {
                errorMessage: "Leave Duration required",
            },
            options: Duration
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
            breakpoints: { size: { md: 12, xs: 12 } },
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
            dataToInsert.fromDate = startOfDay(values.leavesDate[0]);
            dataToInsert.toDate = startOfDay(values.leavesDate[1]);
            // ChangeType = [],

            addEntity({ url: DEFAULT_API, data: [dataToInsert] }).finally(() => setOpenPopup(false));

        }
    }
    return <>
        <Loader open={loader} />
        <Popup
            title="Leave Request"
            openPopup={openPopup}
            maxWidth="sm"
            isEdit={false}
            keepMounted={true}
            addOrEditFunc={handleSubmit}
            setOpenPopup={setOpenPopup}>
            <AutoForm formData={formData} ref={formApi} isValidate={true} />
        </Popup>
    </>
}
const DEFAULT_API = API.LeaveRequest;
const LeaveRequest = () => {
    const dispatch = useAppDispatch();
    const [openPopup, setOpenPopup] = useState(false);

    const [selectionModel, setSelectionModel] = React.useState([]);

    const [gridFilter, setGridFilter] = useState({
        lastKey: null,
        limit: 10,
        page: 0,
        totalRecord: 0
    })

    const [sort, setSort] = useState({ sort: { createdAt: -1 } });

    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        title: "",
        subTitle: "",
    });



    const gridApiRef = useGridApi();
    const query = useAppSelector(e => e.appdata.query.builder);
    const { countryIds, stateIds, cityIds, areaIds } = useDropDownIds();
    const { data, isLoading, refetch, totalRecord } = useEntitiesQuery({
        url: `${DEFAULT_API}/get`,
        data: {
            limit: gridFilter.limit,
            page: gridFilter.page + 1,
            lastKeyId: gridFilter.lastKey,
            ...sort,
            searchParams: { ...query }
        }
    }, { selectFromResult: ({ data, isLoading }) => ({ data: data?.entityData, totalRecord: data?.totalRecord, isLoading }) });

    const { updateOneEntity } = useEntityAction();


    const { socketData } = useSocketIo("changeInLeaveRequest", refetch);


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
                title="Leave Request"
                enableFilter={true}
                subTitle="Manage Leave Request"
                icon={<PeopleOutline fontSize="large" />}
            />
            <AddLeaveRequest openPopup={openPopup} setOpenPopup={setOpenPopup} />
            <DataGrid apiRef={gridApiRef}
                columns={columns} rows={data}
                page={gridFilter.page}

                loading={isLoading} pageSize={gridFilter.limit}
                setFilter={setGridFilter}
                onSortModelChange={(s) => setSort({ sort: s.reduce((a, v) => ({ ...a, [v.field]: v.sort === 'asc' ? 1 : -1 }), {}) })}
                totalCount={totalRecord}
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

export default LeaveRequest;