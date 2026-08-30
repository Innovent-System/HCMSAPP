// eslint-disable-next-line react-hooks/exhaustive-deps
import React, { useEffect, useRef, useState } from "react";
import Popup from '../../../../components/Popup';
import { AutoForm } from '../../../../components/useForm';
import { API } from '../../_Service';
import { useDispatch, useSelector } from 'react-redux';
import { builderFieldsAction, useEntityAction, useEntitiesQuery, enableFilterAction } from '../../../../store/actions/httpactions';
import { Circle, DisplaySettings, RemoveCircleOutline, AddCircleOutline } from "../../../../deps/ui/icons";
import { Divider, Chip, IconButton } from '@/deps/ui'
import DataGrid, { useGridApi, getActions, GridToolbar, renderStatusCell } from '../../../../components/useDataGrid';
import { useSocketIo } from '../../../../components/useSocketio';
import ConfirmDialog from '../../../../components/ConfirmDialog';
import { useAppDispatch, useAppSelector } from "../../../../store/storehook";
import { useExcelReader } from "../../../../hooks/useExcelReader";
import { useFileConfig } from "../../../../hooks/useFileConfig";
import Loader from '../../../../components/Circularloading'
import { formateISODateTime, systemFormatDate } from "@/services/dateTimeService";
import { getDefaultMonth, getMonths, getYears, monthNames } from "@/util/common";


const fields = {
    name: {
        label: 'TaxAdjustment',
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
const _month = getMonths(), _years = getYears();
const getColumns = (apiRef, handleCancel) => {
    const actionKit = {
        onCancel: handleCancel
    }
    return [
        { field: 'id', headerName: 'Id', hide: true, hideable: false },
        {
            field: 'fullName', headerName: 'Employee Name', width: 220, hideable: false
        },
        { field: 'year', headerName: 'Year', hideable: false },
        { field: 'month', headerName: 'Month', hideable: false, valueGetter: ({ value }) => monthNames[value - 1], },

        { field: 'amount', headerName: 'Amount', hideable: false },
        {
            field: 'status', headerName: 'Status', flex: 1, renderCell: renderStatusCell
        },
        { field: 'modifiedOn', headerName: 'Modified On', flex: 1, valueGetter: ({ row }) => formateISODateTime(row.modifiedAt) },
        { field: 'createdOn', sortingOrder: ["desc"], headerName: 'Created On', flex: 1, valueGetter: ({ row }) => formateISODateTime(row.createdAt) },

        getActions(apiRef, actionKit, true)
    ]
}
const DEFAULT_API = API.TaxAdjustment;
let editId = 0;
const breakpoints = { size: { md: 3, sm: 6, xs: 6 } }, fullWidthPoints = { size: { md: 12, sm: 12, xs: 12 } };

export const AddTaxAdjustment = ({ openPopup, setOpenPopup, isEdit = false, row = null, }) => {
    const formApi = useRef(null);
    const taxFormApi = useRef(null);
    // const designationData = React.useRef(null);
    const [error, setError] = useState(false);

    const { data: taxAdjustmentTypes, isFetching, refetch, totalRecord } = useEntitiesQuery({
        url: `${API.TaxAdjustmentType}/get`,
        data: {
            limit: 100,
            page: 1,
            searchParams: {}
        }
    }, { selectFromResult: ({ data, isFetching }) => ({ data: data?.entityData, totalRecord: data?.totalRecord, isFetching }) });

    const { addEntity } = useEntityAction();
    const { employees } = useAppSelector(e => e.appdata.employeeData);
    const [taxDetail, setTaxDetail] = useState([{ taxAdjustDate: new Date(), taxAdjustmentTypeId: taxAdjustmentTypes?.length ? taxAdjustmentTypes[0] : [], amount: 0 }]);
    useEffect(() => {
        if (!formApi.current || !openPopup) return;
        const { resetForm, setFormValue } = formApi.current;
        const { resetForm: desResetFrom } = taxFormApi.current;
        if (openPopup && !isEdit) {
            desResetFrom();
            resetForm();
            setFormValue({ detail: [{ taxAdjustDate: new Date(), taxAdjustmentTypeId: taxAdjustmentTypes?.length ? taxAdjustmentTypes[0] : [], amount: 0 }] })
        }
        else {
            const data = row;
            const mapDetail = data.detail.map(d => ({ taxAdjustmentTypeId: taxAdjustmentTypes.find(c => c.id === d.id), taxAdjustDate: new Date(d.taxAdjustDate), amount: d.amount }));
            setFormValue({
                employeeId: employees.find(e => e.id === data?.employeeId),
                month: row.month,
                year: row.year,
                detail: mapDetail,
            });
        }
    }, [openPopup, formApi])

    const handleDelete = (_index) => {
        const { getValue, setFormValue } = formApi.current;
        if (getValue().detail.length === 1) return;

        getValue().detail.splice(_index, 1);
        setFormValue({ detail: [...getValue().detail] })
    }
    const handleAdd = () => {
        const { getValue, setFormValue } = formApi.current;
        setFormValue({ detail: [...getValue().detail, { taxAdjustDate: new Date(), taxAdjustmentTypeId: taxAdjustmentTypes?.length ? taxAdjustmentTypes[0] : [], amount: 0 }] })
    }

    const formData = [
        {
            elementType: "ad_dropdown",
            name: "employeeId",
            label: "Employee",
            dataId: "id",
            dataName: "fullName",
            required: true,
            validate: {
                errorMessage: "Plese select employee",
            },
            breakpoints: { size: { md: 3, sm: 6, xs: 6 } },
            defaultValue: null,
            options: employees
        },
        {
            elementType: "clearfix",
            breakpoints: fullWidthPoints
        },
        {
            elementType: "dropdown",
            name: "month",
            label: "Month",
            required: true,
            validate: {
                errorMessage: "Month is required",
            },
            breakpoints: { size: { md: 3, sm: 6, xs: 6 } },
            isNone: false,
            dataId: "id",
            dataName: "title",
            defaultValue: getDefaultMonth(new Date().getMonth() + 1),
            options: _month,
        },
        {
            elementType: "dropdown",
            name: "year",
            label: "Year",
            required: true,
            validate: {
                errorMessage: "Year is required",
            },
            isNone: false,
            breakpoints: { size: { md: 3, sm: 6, xs: 6 } },
            dataId: "id",
            dataName: "title",
            defaultValue: _years[_years.length - 1].id,
            options: _years,
        },
        {
            elementType: "custom",
            breakpoints: { size: { xs: 12, md: 12, lg: 12 } },
            NodeElement: () => <Divider><Chip label="Tax Adjustment Detail" icon={<DisplaySettings />} /></Divider>
        },
        {
            elementType: "arrayForm",
            name: "detail",
            arrayFormRef: taxFormApi,
            breakpoints: fullWidthPoints,
            defaultValue: taxDetail,
            formData: [
                {
                    elementType: "datetimepicker",
                    label: "Date",
                    name: "taxAdjustDate",
                    required: true,
                    shouldDisableDate: (date) => {
                        const { year, month } = formApi.current?.getValue();
                        if (!year || month === undefined) return false;
                        return (
                            date.getFullYear() !== Number(year) ||
                            date.getMonth() !== Number(month - 1)
                        );
                    },
                    breakpoints,
                    // disablePast: true,
                    validate: {
                        errorMessage: "Select Date please",
                    },
                    defaultValue: new Date(),
                    excel: {
                        sampleData: new Date().toLocaleDateString('en-CA')
                    }
                },
                {
                    elementType: "ad_dropdown",
                    name: "taxAdjustmentTypeId",
                    label: "Type",
                    required: true,
                    breakpoints,
                    validate: {
                        errorMessage: "Type is required",
                    },
                    dataId: "id",
                    dataName: "name",
                    defaultValue: null,
                    options: taxAdjustmentTypes
                },
                {
                    elementType: "inputfield",
                    name: "amount",
                    label: "Amount",
                    required: true,
                    validate: {
                        errorMessage: "Amount is required",
                    },
                    breakpoints,
                    type: 'number',
                    defaultValue: 0
                },
                {
                    elementType: "custom",
                    breakpoints: { xs: 1, lg: 2, md: 2 },
                    NodeElement: ({ dataindex }) => <IconButton onClick={() => handleDelete(dataindex)} sx={{
                        ml: 2
                    }} color="warning" aria-label="delete">
                        <RemoveCircleOutline />
                    </IconButton>
                },
            ],
            isValidate: true,
        },
        {
            elementType: "custom",
            breakpoints: fullWidthPoints,
            NodeElement: () => <IconButton title='Add Allowance' size='small' aria-label="delete" onClick={handleAdd}>
                <AddCircleOutline color='primary' />
            </IconButton>
        },
    ];

    const handleSubmit = (e) => {
        const { getValue, validateFields } = formApi.current;
        const { validateFields: desgFieldValidate } = taxFormApi.current;


        if (validateFields() && desgFieldValidate()) {
            const values = getValue();
            let dataToInsert = { ...values };

            dataToInsert.id = 0;
            dataToInsert.employeeId = dataToInsert.employeeId.id;
            if (isEdit)
                dataToInsert.id = editId

            dataToInsert.detail = dataToInsert.detail.map(e => ({ ...e, taxAdjustDate: systemFormatDate(e.taxAdjustDate), taxAdjustmentId: dataToInsert.id, taxAdjustmentTypeId: e.taxAdjustmentTypeId.id }));

            addEntity({ url: DEFAULT_API, data: [dataToInsert] }).finally(c => {
                setOpenPopup(false);
            });

        }
    }


    return <Popup
        title="Add Tax Adjustment"
        openPopup={openPopup}
        fullScreen
        isEdit={isEdit}
        keepMounted={true}
        addOrEditFunc={handleSubmit}
        setOpenPopup={setOpenPopup}>
        <AutoForm formData={formData} ref={formApi} isValidate={true} />
    </Popup>
}
const TaxAdjustment = () => {
    const dispatch = useAppDispatch();
    const [openPopup, setOpenPopup] = useState(false);
    const isEdit = React.useRef(false);
    const row = React.useRef(null);
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

    const { addEntity, updateOneEntity, removeEntity } = useEntityAction();

    const { socketData } = useSocketIo("changeInTaxAdjustment", refetch);

    const handleEdit = (id) => {
        isEdit.current = true;
        editId = id;

        row.current = data.find(a => a.id === id);
        setOpenPopup(true);
    }

    const handleActiveInActive = (id) => {
        updateOneEntity({ url: DEFAULT_API, data: { id } });
    }

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

        dispatch(enableFilterAction(false));
        dispatch(builderFieldsAction(fields));
    }, [dispatch])

    const columns = getColumns(gridApiRef, handleCancel);

    const showAddModal = () => {
        isEdit.current = false;
        setOpenPopup(true);
    }

    return (
        <>
            <AddTaxAdjustment openPopup={openPopup} setOpenPopup={setOpenPopup} isEdit={isEdit.current} row={row.current} />
            <DataGrid apiRef={gridApiRef}
                columns={columns} rows={data}
                loading={isFetching}
                pageSize={gridFilter.limit}
                page={gridFilter.page}
                totalCount={totalRecord}
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
export default TaxAdjustment;