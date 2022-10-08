// eslint-disable-next-line react-hooks/exhaustive-deps
import React, { useEffect, useRef, useState } from "react";
import Controls from '../../components/controls/Controls';
import Popup from '../../components/Popup';
import { API } from './_Service';
import { useDispatch, useSelector } from 'react-redux';
import { builderFieldsAction, useEntityAction, useEntitiesQuery, showDropDownFilterAction, useLazySingleQuery } from '../../store/actions/httpactions';
import { Chip, GridToolbarContainer, IconButton, Stack, Typography, GridActionsCellItem } from "../../deps/ui";
import { Add as AddIcon, Delete as DeleteIcon, PeopleOutline, CheckCircle, Cancel, Description, AdminPanelSettings } from "../../deps/ui/icons";
import DataGrid, { useGridApi } from '../../components/useDataGrid';
import { useSocketIo } from '../../components/useSocketio';
import ConfirmDialog from '../../components/ConfirmDialog';
import { AutoForm } from '../../components/useForm'
import PropTypes from 'prop-types'
import PageHeader from '../../components/PageHeader'
import { startOfDay, addDays, isEqual } from '../../services/dateTimeService'
import { formateISODateTime } from "../../services/dateTimeService";
import Loader from '../../components/Circularloading'
import Auth from '../../services/AuthenticationService'

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
const getColumns = (handleApprove) => [
    { field: '_id', headerName: 'Id', hide: true },
    {
        field: 'fullName', headerName: 'Employee Name', flex: 1, valueGetter: ({ row }) => row.employees.fullName
    },
    {
        field: 'status', headerName: 'Status', flex: 1, renderCell: ({ row }) => <Chip size="small" color={row.status === "Rejected" ? "error" : row.status === "Approved" ? "info" : "default"} label={row.status} />
    },
    {
        field: 'appform', headerName: 'Request Type', flex: 1, valueGetter: ({ row }) => row.appform.title
    },
    { field: 'reason', headerName: 'Reason', flex: 1 },
    {
        field: 'detail', cellClassName: 'actions', type: "actions", headerName: 'Detail', flex: 1, align: 'center', hideable: false, renderCell: ({ row }) => (
            <GridActionsCellItem
                icon={<Description />}
                label="Detail"
                onClick={() => { }}
            />
        )
    },
    { field: 'modifiedOn', headerName: 'Modified On', flex: 1, valueGetter: ({ row }) => formateISODateTime(row.modifiedOn) },
    { field: 'createdOn', headerName: 'Created On', flex: 1, valueGetter: ({ row }) => formateISODateTime(row.createdOn) },
    {
        field: 'action', cellClassName: 'actions', type: "actions", headerName: 'Action', width: 180, align: 'center', hideable: false, renderCell: ({ row }) => (
            <>
                {row.actionTaken ? <GridActionsCellItem
                    label="Action Taken"
                    icon={<AdminPanelSettings fontSize="small" />}
                /> : <>
                    <GridActionsCellItem
                        icon={<Chip size="small" variant="outlined" color="success" icon={<CheckCircle fontSize="small" />} label="Accept" />}
                        label="Approve"
                        onClick={() => handleApprove(1, row)}
                    />
                    <GridActionsCellItem
                        icon={<Chip size="small" variant="outlined" color="error" icon={<Cancel fontSize="small" />} label="Reject" />}
                        label="Reject"
                        onClick={() => handleApprove(0, row)}
                    />
                </>


                }

            </>
        )
    }
];

const DEFAULT_API = API.Approval;

const AddAttendanceApproval = ({ openPopup, setOpenPopup, selectionModel, row, isApproved, records }) => {
    const formApi = useRef(null);
    const [loader, setLoader] = useState(false);

    const { addEntity } = useEntityAction();

    useEffect(() => {
        if (formApi.current && openPopup) {
            const { resetForm } = formApi.current;
            resetForm();
        }
    }, [openPopup, formApi])
    const formData = [
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

            let datalist = [];
            const dataObj = {
                _id: row._id,
                requestId: row.requestId,
                formId: row.formId,
                type: "Request",
                isApprove: isApproved,
                reason: values.reason
            };
            if (selectionModel.length) {
                datalist = records.filter(c => selectionModel.includes(c._id)).map(r => ({
                    _id: r._id,
                    requestId: r.requestId,
                    formId: r.formId,
                    type: "Request",
                    isApprove: isApproved,
                    reason: values.reason
                }))
            }
            else {
                datalist.push(dataObj)
            }

            addEntity({ url: API.ApprovalAction, data: datalist });

        }
    }
    return <>
        <Loader open={loader} />
        <Popup
            title="Attendance Approvals"
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

const AttendanceApproval = () => {
    const dispatch = useDispatch();
    const [openPopup, setOpenPopup] = useState(false);
    const [pageSize, setPageSize] = useState(30);

    const [selectionModel, setSelectionModel] = React.useState([]);

    const isApproved = useRef(false);
    const row = useRef(null);
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
    console.log(Auth.getitem("userInfo"));
    const { data, isLoading, status, refetch } = useEntitiesQuery({
        url: DEFAULT_API,
        params: {
            limit: offSet.current.limit,
            lastKeyId: offSet.current.isLoadMore ? offSet.current.lastKeyId : "",
            searchParams: JSON.stringify({
                ...query,
                $and: [
                    { routeBy: Auth.getitem("userInfo").fkEmployeeId },
                    { $or: [{ isCurrentApproval: true }, { actionTaken: true }] }
                ],
            })
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

    const { socketData } = useSocketIo("changeInAttendanceRequest", refetch);

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
    const showAddModal = (isApprove, _row) => {
        row.current = _row;
        isApproved.current = isApprove === 1
        setOpenPopup(true);
    }

    const columns = getColumns(showAddModal)

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




    return (
        <>
            <PageHeader
                title="Attendance Approval"
                enableFilter={true}
                subTitle="Manage Attendance Approval"
                icon={<PeopleOutline fontSize="large" />}
            />
            <AddAttendanceApproval openPopup={openPopup} setOpenPopup={setOpenPopup} isApproved={isApproved.current} selectionModel={selectionModel} records={records} row={row.current} />
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
                gridToolBar={ApprovalToolbar}
                selectionModel={selectionModel}
                setSelectionModel={setSelectionModel}
                onRowsScrollEnd={loadMoreData}
            />
            <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
        </>
    );
}

export default AttendanceApproval;

function ApprovalToolbar(props) {
    const { apiRef, onAdd, onDelete, selectionModel } = props;

    return (
        <GridToolbarContainer sx={{ justifyContent: "flex-end" }}>
            {selectionModel?.length ? <Controls.Button onClick={() => onDelete(selectionModel)} startIcon={<DeleteIcon />} text="Delete Items" /> : null}
            {/* <Controls.Button onClick={onAdd} startIcon={<AddIcon />} text="Add record" /> */}
        </GridToolbarContainer>
    );
}

ApprovalToolbar.propTypes = {
    apiRef: PropTypes.shape({
        current: PropTypes.object,
    }),
    onAdd: PropTypes.func,
    onDelete: PropTypes.func,
    selectionModel: PropTypes.array
};