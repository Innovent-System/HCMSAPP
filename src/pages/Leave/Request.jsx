// eslint-disable-next-line react-hooks/exhaustive-deps
import React, { useEffect, useRef, useState } from "react";
import Popup from '../../components/Popup';
import { API } from './_Service';
import { useDispatch, useSelector } from 'react-redux';
import { builderFieldsAction, useEntityAction, useEntitiesQuery, showDropDownFilterAction, useLazySingleQuery } from '../../store/actions/httpactions';
import { Stack, Typography } from "../../deps/ui";
import { PeopleOutline } from "../../deps/ui/icons";
import DataGrid, { GridToolbar, renderStatusCell, useGridApi } from '../../components/useDataGrid';
import { useSocketIo } from '../../components/useSocketio';
import ConfirmDialog from '../../components/ConfirmDialog';
import { AutoForm } from '../../components/useForm'
import PageHeader from '../../components/PageHeader'
import { startOfDay, addDays, isEqual, formateISODate } from '../../services/dateTimeService'
import { formateISODateTime } from "../../services/dateTimeService";
import Loader from '../../components/Circularloading'
import { useDropDownIds } from "../../components/useDropDown";

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


const columns = [
    { field: '_id', headerName: 'Id', hide: true },
    {
        field: 'fullName', headerName: 'Employee Name', flex: 1, valueGetter: ({ row }) => row.employees.fullName
    },
    { field: 'fromDate', headerName: 'From', flex: 1, valueGetter: ({ row }) => formateISODate(row.fromDate) },
    { field: 'toDate', headerName: 'To', flex: 1, valueGetter: ({ row }) => formateISODate(row.toDate) },
    { field: 'leavetype', headerName: 'Leave Type', flex: 1, valueGetter: ({ row }) => row.leavetype.title },
    {
        field: 'status', headerName: 'Status', flex: 1, renderCell: renderStatusCell
    },
    { field: 'modifiedOn', headerName: 'Modified On', flex: 1, valueGetter: ({ row }) => formateISODateTime(row.modifiedOn) },
    { field: 'createdOn', headerName: 'Created On', flex: 1, valueGetter: ({ row }) => formateISODateTime(row.createdOn) }
];

const AddLeaveRequest = ({ openPopup, setOpenPopup }) => {
    const formApi = useRef(null);
    const [loader, setLoader] = useState(false);
    const [leaveTypes, setLeaveTypes] = useState([]);
    const { Employees } = useSelector(e => e.appdata.employeeData);
    const { addEntity } = useEntityAction();
    const [getLeaveDetail] = useLazySingleQuery();
    useEffect(() => {
        if (formApi.current && openPopup) {
            const { resetForm } = formApi.current;
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
                getLeaveDetail({ url: API.GetLeaveDetail, params: { employeeId: data._id } }).then(c => {
                    if (c.data?.result) {
                       setLeaveTypes(c.data.result);
                    }
                    setLoader(false);
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
            disableFuture: true,
            breakpoints: { md: 12, sx: 12, xs: 12 },
            validate: {
                errorMessage: "Select Date please",
            },
            defaultValue: [new Date(), new Date()]
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
            dataToInsert.fromDate = values.leavesDate[0];
            dataToInsert.toDate = values.leavesDate[1]
            // ChangeType = [],

            addEntity({ url: DEFAULT_API, data: [dataToInsert] });

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
    const dispatch = useDispatch();
    const [openPopup, setOpenPopup] = useState(false);
    const [pageSize, setPageSize] = useState(30);

    const [selectionModel, setSelectionModel] = React.useState([]);

    const offSet = useRef({
        isLoadMore: false,
        isLoadFirstTime: true,
    })

    const [gridFilter, setGridFilter] = useState({
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
    const { countryIds, stateIds, cityIds, areaIds } = useDropDownIds();
    const { data, isLoading, status, refetch } = useEntitiesQuery({
        url: DEFAULT_API,
        params: {
            limit: offSet.current.limit,
            lastKeyId: offSet.current.isLoadMore ? offSet.current.lastKeyId : "",
            searchParams: JSON.stringify(query)
        }
    });

    const { removeEntity } = useEntityAction();

    useEffect(() => {
        if (status === "fulfilled") {
            const { entityData, totalRecord } = data.result;
            if (offSet.current.isLoadMore) {
                setRecords([...entityData, ...records]);
            }
            else
                setRecords(entityData)

            setGridFilter({ ...gridFilter, totalRecord: totalRecord });
            offSet.current.isLoadMore = false;
        }
    }, [data, status])

    const { socketData } = useSocketIo("changeInLeaveRequest", refetch);

    useEffect(() => {
        if (Array.isArray(socketData)) {
            setRecords(socketData);
        }
    }, [socketData])


    const loadMoreData = (params) => {
        if (records.length < gridFilter.totalRecord && params.viewportPageSize !== 0) {
            offSet.current.isLoadMore = true;
            setGridFilter({ ...gridFilter, lastKey: records.length ? records[records.length - 1].id : null });
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
                removeEntity({ url: DEFAULT_API, params: idTobeDelete }).then(res => {
                    setSelectionModel([]);
                })
            },
        });
    }

    useEffect(() => {
        offSet.current.isLoadFirstTime = false;
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
                columns={columns} rows={records}
                loading={isLoading} pageSize={pageSize}
                totalCount={offSet.current.totalRecord}
                toolbarProps={{
                    apiRef: gridApiRef,
                    onAdd: showAddModal,
                    onDelete: handelDeleteItems,
                    selectionModel
                }}
                gridToolBar={GridToolbar}
                selectionModel={selectionModel}
                setSelectionModel={setSelectionModel}
                onRowsScrollEnd={loadMoreData}
            />
            <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
        </>
    );
}

export default LeaveRequest;