// eslint-disable-next-line react-hooks/exhaustive-deps
import React, { useEffect, useRef, useState } from "react";
import Popup from '../../components/Popup';
import { API } from './_Service';

import { builderFieldsAction, useEntityAction, useEntitiesQuery, showDropDownFilterAction, useLazySingleQuery } from '../../store/actions/httpactions';
import { PeopleOutline, Delete, AdminPanelSettings, CancelScheduleSend } from "../../deps/ui/icons";
import { GridActionsCellItem } from "../../deps/ui";
import DataGrid, { GridToolbar, renderStatusCell, useGridApi, getActions } from '../../components/useDataGrid';
import { useSocketIo } from '../../components/useSocketio';
import ConfirmDialog from '../../components/ConfirmDialog';
import { AutoForm } from '../../components/useForm'
import PageHeader from '../../components/PageHeader'
import { startOfDay, addDays, isEqual, formateISODate } from '../../services/dateTimeService'
import { formateISODateTime } from "../../services/dateTimeService";
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
    { field: 'type', headerName: 'Type' },
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
const AddLaonRequest = ({ openPopup, setOpenPopup, colData = [] }) => {
    const formApi = useRef(null);
    const [loader, setLoader] = useState(false);

    const { Employees } = useAppSelector(e => e.appdata.employeeData);
    const checkPfBalance = useAppSelector(e => e.modulesetting.payroll.checkPfBalance);
    const { addEntity } = useEntityAction();

    const [getPFDetail] = useLazySingleQuery();
    useEffect(() => {
        if (formApi.current && openPopup) {
            const { resetForm } = formApi.current;
            resetForm();
        }
    }, [openPopup, formApi])

    const handlePfBalc = (employeeId, type) => {
        if (type !== "PF") return;
        getPFDetail({ url: `${DEFAULT_API}/pfdetail`, params: { employeeId } }).then(res => {
            const { setFormValue } = formApi.current;
            if (res.data.result)
                setFormValue({ pfBalance: res.data.result.pfBalance })
        })
    }
    const formData = [
        {
            elementType: "ad_dropdown",
            name: "fkEmployeeId",
            label: "Employee",
            onChange: (val) => {
                const { getValue } = formApi.current;
                handlePfBalc(val._id, getValue().type);
            },
            required: true,
            validate: {
                errorMessage: "Select Employee",
            },
            dataName: 'fullName',
            dataId: "_id",
            options: Employees,
            defaultValue: null,
            excel: {
                sampleData: "Faizan Siddiqui"
            }
        },
        {
            elementType: "datetimepicker",
            label: "Date",
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
            elementType: "dropdown",
            name: "type",
            label: "Type",
            onChange: (val) => {
                const { getValue } = formApi.current;
                handlePfBalc(getValue().fkEmployeeId._id, val);
            },
            isNone: false,
            dataId: "id",
            dataName: "title",
            defaultValue: "Personal",
            options: LoanType,
            excel: {
                sampleData: "PF Loan"
            }
        },
        {
            elementType: "inputfield",
            name: "principleAmount",
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
                validate: (val) => {
                    if (!checkPfBalance || (getValue().type !== "PF" && !val.principleAmount)) return true;
                    const { getValue } = formApi.current;

                    return +val.principleAmount <= +getValue().pfBalance;
                }
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
            elementType: "inputfield",
            name: "pfBalance",
            disabled: true,
            isShow: val => val.fkEmployeeId && val.type === "PF",
            type: "number",
            label: "Balance",
            defaultValue: 0
        },
        {
            elementType: "inputfield",
            name: "description",
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
        if (validateFields()) {
            let values = getValue();
            let dataToInsert = { ...values };
            dataToInsert.fkEmployeeId = values.fkEmployeeId._id;

            addEntity({ url: DEFAULT_API, data: [dataToInsert] });

        }
    }
    return <>
        <Loader open={loader} />
        <Popup
            title="Loan Request"
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
    const { inProcess, setFile, excelData, getTemplate } = useExcelReader({
        formTemplate: excelColData.current,
        transform: mapAdvSalary,
        fileName: "LoanRequest.xlsx"
    });

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

    useEffect(() => {
        if (excelData)
            addEntity({ url: DEFAULT_API, data: excelData });

    }, [excelData])

    const { socketData } = useSocketIo("changeInLaon", refetch);

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
                title="Loan Request"
                enableFilter={true}
                handleUpload={(e) => setFile(e.target.files[0])}
                handleTemplate={getTemplate}
                subTitle="Manage Loan Request"
                icon={<PeopleOutline fontSize="large" />}
            />
            <AddLaonRequest colData={excelColData} openPopup={openPopup} setOpenPopup={setOpenPopup} />

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