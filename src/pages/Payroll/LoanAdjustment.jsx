// eslint-disable-next-line react-hooks/exhaustive-deps
import React, { useEffect, useRef, useState } from "react";
import Popup from '../../components/Popup';
import { API } from './_Service';

import { builderFieldsAction, useEntityAction, useEntitiesQuery, showDropDownFilterAction, useLazySingleQuery } from '../../store/actions/httpactions';
import { PeopleOutline, AttachMoney, DisplaySettings, RemoveCircleOutline, AddCircleOutline } from "../../deps/ui/icons";
import { InputAdornment, Divider, Chip, IconButton } from "../../deps/ui";
import DataGrid, { GridToolbar, renderStatusCell, useGridApi, getActions } from '../../components/useDataGrid';
import { useSocketIo } from '../../components/useSocketio';
import ConfirmDialog from '../../components/ConfirmDialog';
import { AutoForm } from '../../components/useForm'
import PageHeader from '../../components/PageHeader'
import { formateISODate } from '../../services/dateTimeService'
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

const mapAdvSalary = (values) => {
    const map = { ...values };
    map.fkEmployeeId = values.fkEmployeeId._id;
    return map
}

const getColumns = (onCancel) => [
    { field: '_id', headerName: 'Id', hide: true },
    {
        field: 'fullName', headerName: 'Employee Name', flex: 1, valueGetter: ({ row }) => row.employees.fullName
    },
    { field: 'loanRequest', headerName: 'Date', flex: 1, valueGetter: ({ row }) => formateISODate(row.loanRequest) },
    { field: 'principleAmount', headerName: 'Principle' },
    { field: 'repayAmount', headerName: 'Repay' },
    {
        field: 'status', headerName: 'Status', flex: 1, renderCell: renderStatusCell
    },
    { field: 'modifiedOn', headerName: 'Modified On', flex: 1, valueGetter: ({ row }) => formateISODateTime(row.modifiedOn) },
    { field: 'createdOn', headerName: 'Created On', flex: 1, valueGetter: ({ row }) => formateISODateTime(row.createdOn) },
    getActions(null, { onCancel })
];

const LoanType = [
    { id: "Personal", title: "Personal Loan" },
    { id: "PF", title: "PF Loan" }
]
const breakpoints = { size: { md: 12 } }
const AddLoanAdjustment = ({ openPopup, setOpenPopup, colData = [] }) => {
    const formApi = useRef(null);
    const loanAjApi = useRef(null);
    const loadId = useRef(null);
    const initLoanDetail = useRef([{ _id: null, paidDate: new Date(), amount: 0 }]);
    const { Employees } = useAppSelector(e => e.appdata.employeeData);
    const { addEntity } = useEntityAction();
    const [getLoanDetail] = useLazySingleQuery();

    useEffect(() => {
        if (formApi.current && openPopup) {
            const { resetForm } = formApi.current;
            resetForm();
        }
    }, [openPopup, formApi])

    const handleAddItems = (i) => {
        const { getValue, setFormValue } = formApi.current;
        if (getValue().distributedMonth === getValue().loanSchedule.length) return;
        setFormValue({ loanSchedule: [...getValue().loanSchedule, { _id: null, paidDate: new Date(), amount: 0, isNew: true }] })


    }
    const handleRemoveItems = (_index) => {
        const { getValue, setFormValue } = formApi.current;
        const { loanSchedule } = getValue();

        setFormValue({ loanSchedule: loanSchedule.toSpliced(_index, 1) })
    }
    const handleLoanDetail = (employeeId, type) => {

        const { setFormValue, getValue } = formApi.current;
        getLoanDetail({ url: API.LoanDetail, params: { employeeId, type } }).then(c => {
            if (c.data?.result) {
                const { result } = c.data;
                loadId.current = result._id;
                setFormValue({
                    title: result.title, loanRequest: new Date(result.loanRequest),
                    repayAmount: result.repayAmount, principleAmount: result.principleAmount,
                    loanStartDate: new Date(result.loanStartDate),
                    distributedMonth: Math.ceil(result.principleAmount / result.repayAmount),
                    loanSchedule: result.loanSchedule.map(e => ({ ...e, paidDate: new Date(e.paidDate) }))
                });
            }
            else {
                loadId.current = null;
                setFormValue({
                    title: "", loanRequest: new Date(),
                    repayAmount: 0, principleAmount: 0,
                    distributedMonth: 0,
                    loanStartDate: new Date(),
                    loanSchedule: [...initLoanDetail.current]
                });
            }

        })
    }

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
            onChange: (data) => {
                if (!data) return;
                const { getValue } = formApi.current;
                handleLoanDetail(data._id, getValue().type);
            },
            options: Employees,
            defaultValue: null,
            excel: {
                sampleData: "Faizan Siddiqui"
            }
        },
        {
            elementType: "dropdown",
            name: "type",
            label: "Type",
            onChange: (data) => {
                if (!data) return;
                const { getValue } = formApi.current;
                handleLoanDetail(getValue().fkEmployeeId._id, data);
            },
            isNone: false,
            dataId: "id",
            dataName: "title",
            defaultValue: "Personal",
            options: LoanType,
            excel: {
                sampleData: "PF"
            }
        },
        {
            elementType: "datetimepicker",
            label: "Date",
            disabled: true,
            name: "loanRequest",
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
            elementType: "datetimepicker",
            label: "Loan Start Date",
            name: "loanStartDate",
            disabled: true,
            required: true,
            shouldDisableDate: (date) => {
                const { getValue } = formApi.current;
                const { loanRequest } = getValue();
                return date?.getTime() < loanRequest?.getTime()
            },
            validate: {
                errorMessage: "Select Date please",
            },
            defaultValue: new Date(),
            excel: {
                sampleData: new Date().toLocaleDateString('en-US')
            }
        },
        {
            elementType: "inputfield",
            name: "title",
            required: true,
            disabled: true,
            label: "Title",
            validate: {
                errorMessage: "Title required",
            },
            defaultValue: "",
            excel: {
                sampleData: "Peronal Loan"
            }
        },
        {
            elementType: "inputfield",
            name: "principleAmount",
            disabled: true,
            required: true,
            onChange: (val) => {
                const { setFormValue, getValue } = formApi.current;
                const { repayAmount } = getValue();
                setFormValue({ distributedMonth: Math.ceil(+val / +repayAmount) })
            },
            type: "number",
            label: "Loan Amount",
            validate: {
                errorMessage: "Loan Amount required",
            },
            defaultValue: 0,
            excel: {
                sampleData: 10000
            }
        },
        {
            elementType: "inputfield",
            name: "repayAmount",
            required: true,
            type: "number",
            onChange: (val) => {
                const { setFormValue, getValue } = formApi.current;
                const { principleAmount } = getValue();

                setFormValue({ distributedMonth: Math.ceil(+principleAmount / +val) })
            },
            label: "Repay Amount",
            validate: {
                validate: (val) => {
                    const { getValue } = formApi.current;
                    return +val.repayAmount < +getValue().principleAmount
                },
                errorMessage: "Amount should be less than of loan amount",
            },
            defaultValue: 0,
            excel: {
                sampleData: 2000
            }
        },
        {
            elementType: "inputfield",
            name: "distributedMonth",
            disabled: true,
            type: "number",
            label: "Distribute in Month",
            defaultValue: 0
        },
        {
            elementType: "custom",
            breakpoints: breakpoints,
            NodeElement: () => <Divider><Chip size="small" label="Installment Details" icon={<DisplaySettings />} /></Divider>
        },
        {
            elementType: "arrayForm",
            name: "loanSchedule",
            // sx: listStyle,
            arrayFormRef: loanAjApi,
            breakpoints: breakpoints,
            defaultValue: initLoanDetail.current,
            formData: [
                {
                    elementType: "datetimepicker",
                    label: "Date",
                    name: "paidDate",
                    required: true,
                    disabled: (value) => value["_id"],
                    validate: {
                        errorMessage: "Select Date please",
                    },
                    breakpoints: { size: { md: 5 } },
                    defaultValue: new Date(),
                    excel: {
                        sampleData: new Date().toLocaleDateString('en-US')
                    }
                },
                {
                    elementType: "inputfield",
                    name: "amount",
                    label: "Amount",
                    inputMode: 'numeric',
                    disabled: (value) => value["_id"],
                    type: "number",
                    required: true,
                    validate: {
                        errorMessage: "Amount is required",
                    },
                    inputProps: {
                        min: 0,
                    },
                    breakpoints: { size: { md: 5 } },
                    InputProps: {
                        endAdornment: (
                            <InputAdornment position="end">
                                <AttachMoney />
                            </InputAdornment>
                        )
                    },
                    defaultValue: "",
                },
                {
                    elementType: "custom",
                    breakpoints: { size: { md: 2 } },
                    NodeElement: ({ dataindex, datavalue }) =>
                        !datavalue?._id ?
                            <IconButton onClick={() => handleRemoveItems(dataindex, false)}>
                                <RemoveCircleOutline color='warning' />
                            </IconButton> : null

                }
            ],
            isValidate: true,
        },
        {
            elementType: "custom",
            breakpoints: breakpoints,
            NodeElement: () => <IconButton title='Add Installment' aria-label="delete" onClick={() => handleAddItems(false)}>
                <AddCircleOutline color='primary' />
            </IconButton>
        }
    ];
    colData.current = formData;

    const handleSubmit = (e) => {
        if (!loadId.current) return;
        const { getValue, validateFields } = formApi.current
        const { validateFields: adjValidateFields } = loanAjApi.current
        if (validateFields() && adjValidateFields()) {
            let values = getValue();
            let dataToInsert = {};
            dataToInsert._id = loadId.current;
            dataToInsert.repayAmount = values.repayAmount;
            dataToInsert.isAdjust = true;
            dataToInsert.loanSchedule = values.loanSchedule.map(({ _id, ...e }) => ({
                ...e,
                isFromAdjust: e?.isNew ?? false, ...(_id && { _id }),
                ...(!e?.month && e.month !== 0 && { month: e.paidDate.getMonth(), year: e.paidDate.getFullYear() })
            }));

            const creditAmount = values.loanSchedule
                .reduce((accumulator, currentValue) => accumulator + (+currentValue.amount), 0);

            dataToInsert.isPaid = creditAmount === values.principleAmount;

            addEntity({ url: DEFAULT_API, data: [dataToInsert] }).finally(() => {
                setOpenPopup(false);
            });

        }
    }
    return <>
        <Popup
            title="Loan Adjustment"
            openPopup={openPopup}
            maxWidth="xl"
            fullScreen
            isEdit={false}
            keepMounted={true}
            addOrEditFunc={handleSubmit}
            setOpenPopup={setOpenPopup}>
            <AutoForm formData={formData} ref={formApi} breakpoints={{ size: { md: 6 } }} isValidate={true} />
        </Popup>
    </>
}
const DEFAULT_API = API.LoanRequest;
const LoanRequest = () => {
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
    const { data, isLoading, refetch, totalRecord } = useEntitiesQuery({
        url: `${DEFAULT_API}/get`,
        data: {
            limit: gridFilter.limit,
            page: gridFilter.page + 1,
            lastKeyId: gridFilter.lastKey,
            ...sort,
            searchParams: {
                isAdjust: true,
                ...query
            }
        }
    }, { selectFromResult: ({ data, isLoading }) => ({ data: data?.entityData, totalRecord: data?.totalRecord, isLoading }) });

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

    const { socketData } = useSocketIo("changeInAdj", refetch);

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
                title="Loan Adjustment"
                enableFilter={true}
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

export default LoanRequest;