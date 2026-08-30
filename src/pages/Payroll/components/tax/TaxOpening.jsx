// eslint-disable-next-line react-hooks/exhaustive-deps
import React, { useEffect, useRef, useState } from "react";
import Popup from '../../../../components/Popup';
import { AutoForm } from '../../../../components/useForm';
import { API } from '../../_Service';
import { useDispatch, useSelector } from 'react-redux';
import { builderFieldsAction, useEntityAction, useEntitiesQuery, enableFilterAction } from '../../../../store/actions/httpactions';
import { Circle } from "../../../../deps/ui/icons";
import DataGrid, { useGridApi, getActions, GridToolbar } from '../../../../components/useDataGrid';
import { useSocketIo } from '../../../../components/useSocketio';
import ConfirmDialog from '../../../../components/ConfirmDialog';
import { useAppDispatch, useAppSelector } from "../../../../store/storehook";
import { useExcelReader } from "../../../../hooks/useExcelReader";
import { useFileConfig } from "../../../../hooks/useFileConfig";
import Loader from '../../../../components/Circularloading'
import { formateISODateTime } from "@/services/dateTimeService";
import { getYears } from "@/util/common";


const fields = {
    name: {
        label: 'TaxOpening',
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

const getColumns = (apiRef, onEdit, onActive) => {
    const actionKit = {
        onActive: onActive,
        onEdit: onEdit
    }
    return [
        { field: 'id', headerName: 'Id', hide: true, hideable: false },
        {
            field: 'fullName', headerName: 'Employee Name', width: 220, hideable: false
        },
        { field: 'taxableIncome', headerName: 'Taxable Income', hideable: false },
        { field: 'taxDeducted', headerName: 'Tax Deducted', hideable: false },
        { field: 'modifiedOn', headerName: 'Modified On', flex: 1, valueGetter: ({ row }) => formateISODateTime(row.modifiedAt) },
        { field: 'createdOn', sortingOrder: ["desc"], headerName: 'Created On', flex: 1, valueGetter: ({ row }) => formateISODateTime(row.createdAt) },

        {
            field: 'isActive', headerName: 'Active', renderCell: (param) => (
                param.row["isActive"] ? <Circle color="success" /> : <Circle color="disabled" />
            ),
            flex: '0 1 5%',
            hideable: false,
            align: 'center',
        },
        getActions(apiRef, actionKit)
    ]
}
const DEFAULT_API = API.TaxOpening;
let editId = 0;
const _years = getYears();

export const AddTaxOpening = ({ openPopup, setOpenPopup, isEdit = false, row = null, colData = [] }) => {
    const formApi = useRef(null);
    const { addEntity } = useEntityAction();
    const { employees } = useAppSelector(e => e.appdata.employeeData);
    useEffect(() => {
        if (!formApi.current || !openPopup) return;
        const { resetForm, setFormValue } = formApi.current;
        if (openPopup && !isEdit)
            resetForm();
        else {
            const { employeeId } = row;
            setFormValue({
                employeeId: employees.find(c => c.id === employeeId),
                year: row.year,
                taxableIncome: row.taxableIncome,
                taxDeducted: row.taxDeducted
            });
        }
    }, [openPopup, formApi])
    const handleSubmit = (e) => {
        const { getValue, validateFields } = formApi.current
        if (validateFields()) {
            let values = getValue();
            let dataToInsert = { ...values };
            dataToInsert.employeeId = dataToInsert.employeeId.id;
            if (isEdit)
                dataToInsert.id = editId

            addEntity({ url: DEFAULT_API, data: [dataToInsert] });

        }
    }

    const formData = [
        {
            elementType: "ad_dropdown",
            name: "employeeId",
            label: "Employee",
            variant: "outlined",
            disabled: isEdit,
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
            name: "year",
            label: "Fiscal Start Year",
            isNone: false,
            dataId: "id",
            dataName: "title",
            defaultValue: _years[_years.length - 1].id,
            options: _years,
        },
        {
            elementType: "inputfield",
            name: "taxableIncome",
            required: true,
            type: "number",
            label: "Taxable Income",
            validate: {
                errorMessage: "Taxable Income required",
            },
            defaultValue: 0,
            excel: {
                sampleData: 10000
            }
        },
        {
            elementType: "inputfield",
            name: "taxDeducted",
            required: true,
            type: "number",
            label: "Tax Deducted",
            validate: {
                errorMessage: "Tax Deducted required",
            },
            defaultValue: 0,
            excel: {
                sampleData: 10000
            }
        }

    ];

    colData.current = formData;
    return <Popup
        title="Add Tax Opening"
        openPopup={openPopup}
        maxWidth="sm"
        isEdit={isEdit}
        keepMounted={true}
        addOrEditFunc={handleSubmit}
        setOpenPopup={setOpenPopup}>
        <AutoForm formData={formData} ref={formApi} isValidate={true} />
    </Popup>
}

const mapData = (values) => {
    const map = { ...values };
    map.employeeId = values.employeeId.id;
    return map
}
const TaxOpening = () => {
    const dispatch = useAppDispatch();
    const [openPopup, setOpenPopup] = useState(false);
    const isEdit = React.useRef(false);
    const row = React.useRef(null);
    const [selectionModel, setSelectionModel] = React.useState([]);
    const excelColData = useRef([]);
    const [sort, setSort] = useState({ sort: { createdAt: -1 } });
    const { addEntity } = useEntityAction();

    const [gridFilter, setGridFilter] = useState({
        lastKey: null,
        limit: 10,
        page: 0,
        totalRecord: 0
    })
    const { inProcess, setFile, excelData, getTemplate } = useExcelReader({
        formTemplate: excelColData.current, fileName: "TaxOpening.xlsx",
        transform: mapData,
        uniqueBy: ["employeeId"]

    });
    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        title: "",
        subTitle: "",
    });
    useEffect(() => {
        if (excelData) {
            addEntity({ url: DEFAULT_API, data: excelData });
        }
    }, [excelData])

    useFileConfig(setFile, getTemplate);
    const gridApiRef = useGridApi();
    const query = useAppSelector(e => e.appdata.query.builder);

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

    const { updateOneEntity, removeEntity } = useEntityAction();

    const { socketData } = useSocketIo("changeInTaxOpening", refetch);

    const handleEdit = (id) => {
        isEdit.current = true;
        editId = id;

        row.current = data.find(a => a.id === id);
        setOpenPopup(true);
    }

    const handleActiveInActive = (id) => {
        updateOneEntity({ url: DEFAULT_API, data: { id } });
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

    const columns = getColumns(gridApiRef, handleEdit, handleActiveInActive);

    const showAddModal = () => {
        isEdit.current = false;
        setOpenPopup(true);
    }

    return (
        <>
            <Loader open={inProcess} />
            <AddTaxOpening colData={excelColData} openPopup={openPopup} setOpenPopup={setOpenPopup} isEdit={isEdit.current} row={row.current} />
            <DataGrid apiRef={gridApiRef}
                columns={columns} rows={data}
                loading={isLoading}
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
export default TaxOpening;