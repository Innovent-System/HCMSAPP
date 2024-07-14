// eslint-disable-next-line react-hooks/exhaustive-deps
import React, { useEffect, useRef, useState } from "react";
import Controls from '../components/controls/Controls';
import Popup from '../components/Popup';
import { builderFieldsAction, useEntityAction, useEntitiesQuery, showDropDownFilterAction } from '../store/actions/httpactions';
import { Chip, GridToolbarContainer, GridActionsCellItem } from "../deps/ui";
import { Delete as DeleteIcon, PeopleOutline, CheckCircle, Cancel, Description, AdminPanelSettings } from "../deps/ui/icons";
import DataGrid, { renderStatusCell, useGridApi } from '../components/useDataGrid';
import { useSocketIo } from '../components/useSocketio';
import ConfirmDialog from '../components/ConfirmDialog';
import { AutoForm } from '../components/useForm'
import PropTypes from 'prop-types'
import PageHeader from '../components/PageHeader'
import { formateISODateTime } from "../services/dateTimeService";
import Loader from '../components/Circularloading'
import Auth from '../services/AuthenticationService'
import { useAppDispatch, useAppSelector } from "../store/storehook";

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
        field: 'status', headerName: 'Status', flex: 1, renderCell: renderStatusCell
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


const AddApprovalRoute = ({ openPopup, setOpenPopup, DEFAULT_API, selectionModel, row, isApproved, records }) => {
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
            breakpoints: { md: 12, sm: 12, xs: 12 },
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
                formId: row.appform.formId,
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

            addEntity({ url: `${DEFAULT_API}/action`, data: datalist });

        }
    }
    return <>
        <Loader open={loader} />
        <Popup
            title="Payroll Approvals"
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

const ApprovalRoute = ({ DEFAULT_API, DEFAULT_NAME, DISPLAY_TITLE }) => {
    const dispatch = useAppDispatch();
    const [openPopup, setOpenPopup] = useState(false);


    const [selectionModel, setSelectionModel] = React.useState([]);

    const isApproved = useRef(false);
    const row = useRef(null);

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

    const { data, isLoading, refetch, totalRecord } = useEntitiesQuery({
        url: DEFAULT_API,
        data: {
            limit: gridFilter.limit,
            page: gridFilter.page + 1,
            ...sort,
            searchParams: {
                ...query,
                $and: [
                    { routeBy: Auth.getitem("userInfo").fkEmployeeId },
                    { $or: [{ isCurrentApproval: true }, { actionTaken: true }] }
                ],
            }
        }
    }, { selectFromResult: ({ data, isLoading }) => ({ data: data?.entityData, totalRecord: data?.totalRecord, isLoading }) });

    const { removeEntity } = useEntityAction();

    const { socketData } = useSocketIo(`changeIn${DEFAULT_NAME}`, refetch);


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
        dispatch(showDropDownFilterAction({
            employee: true,
        }));
        dispatch(builderFieldsAction(fields));
    }, [dispatch])




    return (
        <>
            <PageHeader
                title={DISPLAY_TITLE}
                enableFilter={true}
                subTitle={`Manage ${DISPLAY_TITLE}`}
                icon={<PeopleOutline fontSize="large" />}
            />
            <AddApprovalRoute openPopup={openPopup} DEFAULT_API={DEFAULT_API} setOpenPopup={setOpenPopup} isApproved={isApproved.current} selectionModel={selectionModel} records={data} row={row.current} />
            <DataGrid apiRef={gridApiRef}
                columns={columns} rows={data}
                loading={isLoading} pageSize={gridFilter.limit}
                page={gridFilter.page}
                totalCount={gridFilter.totalRecord}
                // toolbarProps={{
                //     apiRef: gridApiRef,
                //     onAdd: showAddModal,
                //     selectionModel
                // }}
                // gridToolBar={ApprovalToolbar}
                selectionModel={selectionModel}
                setSelectionModel={setSelectionModel}

            />
            <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
        </>
    );
}

export default ApprovalRoute;

function ApprovalToolbar(props) {
    const { apiRef, onAdd, selectionModel } = props;

    return (
        <GridToolbarContainer sx={{ justifyContent: "flex-end" }}>

        </GridToolbarContainer>
    );
}

ApprovalToolbar.propTypes = {
    apiRef: PropTypes.shape({
        current: PropTypes.object,
    }),
    onAdd: PropTypes.func,
    selectionModel: PropTypes.array
};