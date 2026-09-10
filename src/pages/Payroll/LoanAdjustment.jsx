// eslint-disable-next-line react-hooks/exhaustive-deps
import React, { useEffect, useRef, useState } from "react";
import Popup from '../../components/Popup';
import { API } from './_Service';

import { builderFieldsAction, useEntityAction, useEntitiesQuery, showDropDownFilterAction, useLazySingleQuery } from '../../store/actions/httpactions';
import { PeopleOutline, Delete, AdminPanelSettings, CancelScheduleSend } from "../../deps/ui/icons";
import { GridActionsCellItem, Box, Divider, Typography, Chip, Stack } from "../../deps/ui";
import DataGrid, { GridToolbar, renderStatusCell, useGridApi, getActions } from '../../components/useDataGrid';
import { useSocketIo } from '../../components/useSocketio';
import ConfirmDialog from '../../components/ConfirmDialog';
import { AutoForm } from '../../components/useForm'
import PageHeader from '../../components/PageHeader'
import { formateISODateTime, formateISODate, systemFormatDate } from '../../services/dateTimeService'
import Loader from '../../components/Circularloading'
import { useDropDownIds } from "../../components/useDropDown";
import { useAppDispatch, useAppSelector } from "../../store/storehook";
import { useExcelReader } from "../../hooks/useExcelReader";

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

const mapAdvSalary = (values) => {
    const map = { ...values };
    map.employeeId = values.employeeId.id;
    return map
}

const LoanDetailPanel = ({ loanDetail, pfBalance }) => {
    if (!loanDetail) {
        return (
            <Box p={2} width="80%" bgcolor="#f5f5f5" borderRadius={1}>
                <Typography variant="body2" color="textSecondary">
                    No Record Found
                </Typography>
            </Box>
        );
    }

    return (
        <Box border="0.5px solid #e0e0e0" width="80%" borderRadius={1} p={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="subtitle2" fontWeight={700}>{loanDetail.fullName}</Typography>
                <Chip
                    label={loanDetail.isPaid ? "Paid" : "Active"}
                    color={loanDetail.isPaid ? "default" : "success"}
                    size="small"
                />
            </Box>

            <Divider sx={{ my: 1 }} />

            <Box display="flex" justifyContent="space-between" py={0.5}>
                <Typography variant="body2" color="textSecondary">Loan Request Date</Typography>
                <Typography variant="body2">{formateISODate(loanDetail.loanRequest)}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" py={0.5}>
                <Typography variant="body2" color="textSecondary">Loan Start Date</Typography>
                <Typography variant="body2">{formateISODate(loanDetail.loanStartDate)}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" py={0.5}>
                <Typography variant="body2" color="textSecondary">Principle Amount</Typography>
                <Typography variant="body2">{loanDetail.principleAmount}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" py={0.5}>
                <Typography variant="body2" color="textSecondary">Repayment Amount</Typography>
                <Typography variant="body2">{loanDetail.repayAmount}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" py={0.5}>
                <Typography variant="body2" color="textSecondary">Paid Amount</Typography>
                <Typography variant="body2">{loanDetail.paidAmount}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" py={0.5}>
                <Typography variant="body2" color="textSecondary">Outstanding Balance</Typography>
                <Typography variant="body2">{loanDetail.principleAmount - loanDetail.paidAmount}</Typography>
            </Box>

            {loanDetail?.loanType === 'PF' && (
                <>
                    <Divider sx={{ my: 1 }} />
                    <Box display="flex" justifyContent="space-between" py={0.5}>
                        <Typography variant="body2" fontWeight={600}>Available PF Balance</Typography>
                        <Typography variant="body2" fontWeight={700} color="primary.main">
                            {Number(pfBalance).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </Typography>
                    </Box>
                </>
            )}
        </Box>
    );
};

const getColumns = (onCancel) => [
    { field: 'id', headerName: 'Id', hide: true },
    {
        field: 'fullName', headerName: 'Employee Name', flex: 1
    },
    { field: 'requestDate', headerName: 'Date', flex: 1, valueGetter: ({ row }) => formateISODate(row.requestDate) },
    { field: 'loanType', headerName: 'Loan Type' },
    { field: 'adjustmentType', headerName: 'Adjustment Type' },
    {
        field: 'status', headerName: 'Status', flex: 1, renderCell: renderStatusCell
    },
    { field: 'modifiedAt', headerName: 'Modified On', flex: 1, valueGetter: ({ row }) => formateISODateTime(row.modifiedAt) },
    { field: 'createdAt', headerName: 'Created On', flex: 1, valueGetter: ({ row }) => formateISODateTime(row.createdAt) },
    getActions(null, { onCancel })
];

const LoanType = [
    { id: "Personal", title: "Personal Loan" },
    { id: "PF", title: "PF Loan" }
]

const LoanAdjustmentType = [
    { id: "Settlement", title: "Settlement" },
    // { id: "InstallmentChange", title: "Change In Installment" }
]
const AddLoanAdjustment = ({ openPopup, setOpenPopup, colData = [] }) => {
    const formApi = useRef(null);
    const detailRef = useRef(null);
    const [loader, setLoader] = useState(false);
    const [detail, setDetail] = useState(null);
    const { employees } = useAppSelector(e => e.appdata.employeeData);
    const checkPfBalance = useAppSelector(e => e.modulesetting.payroll.checkPfBalance);
    const { addEntity } = useEntityAction();

    const [getLoanDetail] = useLazySingleQuery();
    const handleAmountValidation = (amount) => {
        const { loanDetail } = detailRef.current;
        return (+amount + loanDetail?.paidAmount) <= loanDetail.principleAmount;
    };
    useEffect(() => {
        if (formApi.current && openPopup) {
            const { resetForm } = formApi.current;
            resetForm();
        }
    }, [openPopup, formApi])

    const handleLoanDetail = (employeeId, type) => {
        if (!employeeId || !type) {
            detailRef.current = null;
            setDetail(null)
            return;
        }
        getLoanDetail({ url: `${API.LoanRequest}/detail`, params: { employeeId, type } }).then(res => {
            const { setFormValue } = formApi.current;
            if (res.data.result) {
                detailRef.current = res.data.result;
                setDetail(res.data.result)

            }
        })
    }

    const formData = [
        {
            elementType: "datetimepicker",
            label: "Date",
            name: "requestDate",
            required: true,
            validate: {
                errorMessage: "Select Date please",
            },
            defaultValue: new Date(),
            excel: {
                sampleData: new Date().toLocaleDateString('en-US')
            }
        },
        {
            elementType: "ad_dropdown",
            name: "employeeId",
            label: "Employee",
            onChange: (val) => {
                const { getValue } = formApi.current;
                handleLoanDetail(val?.id, getValue().loanType);
            },
            required: true,
            validate: {
                errorMessage: "Select Employee",
            },
            dataName: 'fullName',
            dataId: "id",
            options: employees,
            defaultValue: null,
            excel: {
                sampleData: "Faizan Siddiqui"
            }
        },
        {
            elementType: "dropdown",
            name: "loanType",
            label: "Type",
            required: true,
            validate: {
                errorMessage: "Select Loan Type",
            },
            onChange: (val) => {
                const { getValue } = formApi.current;
                handleLoanDetail(getValue().employeeId.id, val);
            },
            isNone: false,
            dataId: "id",
            dataName: "title",
            defaultValue: "Personal",
            options: LoanType
        },
        {
            elementType: "dropdown",
            name: "adjustmentType",
            label: "Adjustment Type",
            isNone: false,
            dataId: "id",
            dataName: "title",
            defaultValue: "Settlement",
            options: LoanAdjustmentType
        },
        {
            elementType: "inputfield",
            name: "amount",
            required: true,
            validate: {
                validate: (val) => {
                    return handleAmountValidation(val.amount);
                },
                errorMessage: "Amount should be less than of loan balance",
            },
            type: "number",
            label: "Amount",
            defaultValue: 0
        },
        {
            elementType: "inputfield",
            name: "reason",
            required: true,
            label: "Description",
            multiline: true,
            validate: {
                errorMessage: "Description required",
            },
            minRows: 5,
            variant: "outlined",
            breakpoints: { size: { md: 12, sm: 12, xs: 12 } },
            defaultValue: "",
            excel: {
                sampleData: "Personl reson"
            }
        }
    ];
    colData.current = formData;

    const handleSubmit = (e) => {
        const { getValue, validateFields } = formApi.current
        if (validateFields() && detail?.loanDetail) {
            let values = getValue();
            const { loanDetail } = detail;
            let dataToInsert = { ...values };
            dataToInsert.employeeId = values.employeeId.id;
            dataToInsert.loanMasterId = loanDetail.loanMasterId;
            dataToInsert.requestDate = systemFormatDate(values.requestDate);
            dataToInsert.settlementAmount = values.amount;
            dataToInsert.outstandingBalanceAtSettlement = (loanDetail.principleAmount - loanDetail.paidAmount);
            addEntity({ url: DEFAULT_API, data: [dataToInsert] }).finally(() => setOpenPopup(false));

        }
    }
    return <>
        <Loader open={loader} />
        <Popup
            title="Loan Adjustment"
            openPopup={openPopup}
            maxWidth="md"
            loader={Boolean(!detail?.loanDetail)}
            isEdit={false}
            keepMounted={true}
            addOrEditFunc={handleSubmit}
            setOpenPopup={setOpenPopup}>
            <Stack flexDirection="row" gap={2}>
                <AutoForm formData={formData} ref={formApi} isValidate={true} />
                <LoanDetailPanel loanDetail={detail?.loanDetail} pfBalance={detail?.pfBalance} />
            </Stack>

        </Popup>
    </>
}
const DEFAULT_API = API.LoanAdjustment;
const LoanAdjustment = () => {
    const dispatch = useAppDispatch();
    const [openPopup, setOpenPopup] = useState(false);

    const [selectionModel, setSelectionModel] = React.useState([]);

    const [gridFilter, setGridFilter] = useState({
        lastKey: null,
        limit: 10,
        page: 0,
        totalRecord: 0
    })

    const excelColData = useRef([]);

    const [sort, setSort] = useState({ sort: { createdAt: -1 } });


    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        title: "",
        subTitle: "",
    });


    const gridApiRef = useGridApi();
    const query = useAppSelector(e => e.appdata.query.builder);
    const { countryIds, stateIds, cityIds, areaIds } = useDropDownIds();
    const { data, isFetching, refetch, totalRecord } = useEntitiesQuery({
        url: `${DEFAULT_API}/get`,
        data: {
            limit: gridFilter.limit,
            page: gridFilter.page + 1,
            lastKeyId: gridFilter.lastKey,
            ...sort,
            searchParams: { ...query }
        }
    }, { selectFromResult: ({ data, isFetching }) => ({ data: data?.entityData, totalRecord: data?.totalRecord, isFetching }) });

    const { removeEntity, updateOneEntity, addEntity } = useEntityAction();

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

    const { socketData } = useSocketIo("changeInLoanAdjust", refetch);

    const columns = getColumns(handleCancel);

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

        // dispatch(showDropDownFilterAction({
        //     employee: true,
        // }));
        dispatch(builderFieldsAction(fields));
    }, [dispatch])


    const showAddModal = () => {
        setOpenPopup(true);
    }

    return (
        <>
            <PageHeader
                title="Loan Adjustment"
                enableFilter={false}
                subTitle="Manage Loan Adjustment"
                icon={<PeopleOutline fontSize="large" />}
            />
            <AddLoanAdjustment colData={excelColData} openPopup={openPopup} setOpenPopup={setOpenPopup} />

            <DataGrid apiRef={gridApiRef}
                columns={columns} rows={data}
                page={gridFilter.page}
                checkboxSelection={false}
                disableSelectionOnClick={true}
                getRowHeight={() => 40}
                loading={isFetching} pageSize={gridFilter.limit}
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

export default LoanAdjustment;