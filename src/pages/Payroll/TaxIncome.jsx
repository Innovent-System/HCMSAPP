// eslint-disable-next-line react-hooks/exhaustive-deps
import React, { useEffect, useRef, useState } from "react";
import Popup from '../../components/Popup';
import { API } from './_Service';
import { builderFieldsAction, useEntityAction, useEntitiesQuery, showDropDownFilterAction } from '../../store/actions/httpactions';
import { PeopleOutline, Circle } from "../../deps/ui/icons";
import DataGrid, { getActions, GridToolbar, renderStatusCell, useGridApi } from '../../components/useDataGrid';
import { useSocketIo } from '../../components/useSocketio';
import ConfirmDialog from '../../components/ConfirmDialog';
import { AutoForm } from '../../components/useForm'
import PageHeader from '../../components/PageHeader'
import { startOfDay, formateISODate, formateISODateTime, endOfDay } from '../../services/dateTimeService'
import { useDropDownIds } from "../../components/useDropDown";
import { useAppDispatch, useAppSelector } from "../../store/storehook";
import { useExcelReader } from "../../hooks/useExcelReader";
import { uniqueData } from "../../util/common";

/**
 * @type {import('@react-awesome-query-builder/mui').Fields}
 */
const fields = {
    createdAt: {
        label: 'Created Date',
        type: 'date',
        fieldName: "createdAt", //must taken to for query binding
        defaultOperator: "equal", //must taken to for query binding
        defaultValue: null, //must taken to for query binding
        fieldSettings: {
            dateFormat: "D/M/YYYY",
        },
        valueSources: ['value'],
        preferWidgets: ['date'],
    }
}

const mapExcelData = (values) => {
    const map = { ...values };
    map.fkEmployeeId = values.fkEmployeeId._id;
    map.endDate = endOfDay(values.endDate)
    return map
}

const getColumns = (onCancel, onActive, onEdit) => [
    { field: '_id', headerName: 'Id', hide: true },
    {
        field: 'fullName', headerName: 'Employee Name', flex: 1, valueGetter: ({ row }) => row.employees.fullName
    },
    { field: 'startDate', headerName: 'Start Date', flex: 1, valueGetter: ({ row }) => formateISODate(row.startDate) },
    { field: 'endDate', headerName: 'End Date', flex: 1, valueGetter: ({ row }) => formateISODate(row.endDate) },
    { field: 'amount', headerName: 'Amount' },
    {
        field: 'isActive', headerName: 'Active', renderCell: (param) => (
            param.row["isActive"] ? <Circle color="success" /> : <Circle color="disabled" />
        ),
        // flex: '0 1 5%',
        align: 'center',
    },
    { field: 'modifiedOn', headerName: 'Modified On', flex: 1, valueGetter: ({ row }) => formateISODateTime(row.modifiedOn) },
    { field: 'createdOn', headerName: 'Created On', flex: 1, valueGetter: ({ row }) => formateISODateTime(row.createdOn) },
    getActions(null, { onCancel, onActive, onEdit })
];
let editId = 0;
const AddTaxIncome = ({ openPopup, setOpenPopup, colData = [], isEdit = false, row = null }) => {
    const formApi = useRef(null);


    const { Employees } = useAppSelector(e => e.appdata.employeeData);
    const { addEntity } = useEntityAction();

    useEffect(() => {
        if (!formApi.current || !openPopup) return;
        const { resetForm, setFormValue } = formApi.current;
        if (openPopup && !isEdit)
            resetForm();
        else {
            console.log(row);
            setFormValue({
                fkEmployeeId: Employees.find(e => e._id === row.fkEmployeeId),
                startDate: new Date(row.startDate),
                endDate: new Date(row.endDate),
                amount: row.amount
            });
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
            defaultValue: null,
            excel: {
                sampleData: "Faizan Siddiqui"
            }
        },
        {
            elementType: "datetimepicker",
            label: "Start",
            name: "startDate",
            required: true,
            validate: {
                errorMessage: "Select Start Date please",
            },
            defaultValue: new Date(),
            excel: {
                sampleData: new Date().toLocaleDateString('en-US')
            }
        },
        {
            elementType: "datetimepicker",
            label: "End",
            name: "endDate",
            shouldDisableDate: (date) => date < startOfDay(formApi.current?.getValue()?.startDate),
            required: true,
            validate: {
                errorMessage: "Select End Date please",
            },
            defaultValue: new Date(),
            excel: {
                sampleData: new Date().toLocaleDateString('en-US')
            }
        },
        {
            elementType: "inputfield",
            name: "amount",
            required: true,
            type: "number",
            label: "Amount",
            validate: {
                errorMessage: "Amount required",
            },
            defaultValue: 0,
            excel: {
                sampleData: 10000
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
            dataToInsert.endDate = endOfDay(values.endDate);
             if (isEdit)
                dataToInsert._id = editId
            addEntity({ url: DEFAULT_API, data: [dataToInsert] });

        }
    }
    return <>

        <Popup
            title="Add Tax Income"
            openPopup={openPopup}
            maxWidth="sm"
            isEdit={isEdit}
            keepMounted={true}
            addOrEditFunc={handleSubmit}
            setOpenPopup={setOpenPopup}>
            <AutoForm formData={formData} ref={formApi} isValidate={true} />
        </Popup>
    </>
}
const DEFAULT_API = API.TaxIncome;
const TaxIncome = () => {
    const dispatch = useAppDispatch();
    const [openPopup, setOpenPopup] = useState(false);
    const isEdit = React.useRef(false);
    const row = useRef(null);
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
        transform: mapExcelData,
        fileName: "TaxIncome.xlsx",
        uniqueBy: ["fkEmployeeId"]
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
    const handleActiveInActive = (id) => {
        updateOneEntity({ url: DEFAULT_API, data: { _id: id } });
    }

    const handleEdit = (id) => {
        isEdit.current = true;
        editId = id;

        row.current = data.find(a => a.id === id);
        setOpenPopup(true);
    }

    useEffect(() => {
        if (excelData)
            addEntity({ url: DEFAULT_API, data: uniqueData(excelData, "fkEmployeeId", "startDate", "endDate") });

    }, [excelData])

    const { socketData } = useSocketIo("changeInTax", refetch);

    const columns = getColumns(handleCancel, handleActiveInActive, handleEdit);

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
        isEdit.current = false;
        setOpenPopup(true);
    }

    return (
        <>
            <PageHeader
                title="Tax Income"
                enableFilter={true}
                handleUpload={(e) => setFile(e.target.files[0])}
                handleTemplate={getTemplate}
                subTitle="Manage Tax Income"
                icon={<PeopleOutline fontSize="large" />}
            />
            <AddTaxIncome colData={excelColData} openPopup={openPopup} setOpenPopup={setOpenPopup}
                row={row.current} isEdit={isEdit.current}
            />

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

export default TaxIncome;