// eslint-disable-next-line react-hooks/exhaustive-deps
import React, { useEffect, useRef, useState } from "react";
import Popup from '../../components/Popup';
import { API, CalculationType, PercentageOfBasicSalary } from './_Service';
import { builderFieldsAction, useEntityAction, useEntitiesQuery, showDropDownFilterAction } from '../../store/actions/httpactions';
import { PeopleOutline, Percent, Circle } from "../../deps/ui/icons";
import { InputAdornment } from '../../deps/ui'
import DataGrid, { getActions, GridToolbar, renderStatusCell, useGridApi } from '../../components/useDataGrid';
import { useSocketIo } from '../../components/useSocketio';
import ConfirmDialog from '../../components/ConfirmDialog';
import { AutoForm } from '../../components/useForm'
import PageHeader from '../../components/PageHeader'
import { startOfDay, formateISODate, formateISODateTime, endOfDay } from '../../services/dateTimeService'
import { useDropDownIds } from "../../components/useDropDown";
import { useAppDispatch, useAppSelector } from "../../store/storehook";
import { useExcelReader } from "../../hooks/useExcelReader";

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
    return map
}
const calcObj = {
    "PercentageOfBasicSalary": "Percentage of Basic Salary",
    "PercentageOfGrossSalary": "Percentage of Gross Salary",
    "FixedAmount": "Fix Amount"
}

const getColumns = (apiRef, onEdit, onActive) => [
    { field: '_id', headerName: 'Id', hide: true },
    {
        field: 'fullName', headerName: 'Employee Name', flex: 1, valueGetter: ({ row }) => row.employees.fullName
    },
    { field: 'type', headerName: 'Type', flex: 1, valueGetter: ({ row }) => calcObj[row.type] },
    { field: 'employeeShare', headerName: 'Employee Share' },
    { field: 'employerShare', headerName: 'Employer Share' },

    {
        field: 'isActive', headerName: 'Active', renderCell: (param) => (
            param.row["isActive"] ? <Circle color="success" /> : <Circle color="disabled" />
        ),
        // flex: '0 1 5%',
        align: 'center',
    },
    { field: 'modifiedOn', headerName: 'Modified On', flex: 1, valueGetter: ({ row }) => formateISODateTime(row.modifiedOn) },
    { field: 'createdOn', headerName: 'Created On', flex: 1, valueGetter: ({ row }) => formateISODateTime(row.createdOn) },
    getActions(apiRef, { onEdit, onActive })
];


const AddProvidentFund = ({ openPopup, setOpenPopup, colData = [], row = null, isEdit = false }) => {
    const formApi = useRef(null);


    const { Employees } = useAppSelector(e => e.appdata.employeeData);
    const { addEntity } = useEntityAction();

    useEffect(() => {

        if (!formApi.current || !openPopup) return;
        const { resetForm, setFormValue } = formApi.current;
        if (openPopup && !isEdit)
            resetForm();
        else {

            const { fkEmployeeId } = row;
            setFormValue({
                fkEmployeeId: Employees.find(c => c._id === fkEmployeeId),
                type: row.type,
                employeeShare: row.employeeShare,
                employerShare: row.employerShare,
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
            disabled: isEdit,
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
            elementType: "dropdown",
            name: "type",
            label: "Type",

            dataId: "id",
            dataName: "title",
            isNone: false,
            defaultValue: PercentageOfBasicSalary,
            options: CalculationType,
            excel: {
                sampleData: "Percentage of Basic Salary"
            }
        },
        {
            elementType: "inputfield",
            name: "employeeShare",
            label: "Employee(s) Share",
            inputMode: 'numeric',
            required: true,
            validate: {
                errorMessage: "Employee(s) Share is required",
            },
            type: "number",
            inputProps: {
                min: 0,
                max: 100
            },

            InputProps: {
                endAdornment: (
                    <InputAdornment position="end">
                        <Percent />
                    </InputAdornment>
                )
            },
            defaultValue: "",
        },
        {
            elementType: "inputfield",
            name: "employerShare",
            label: "Employer(s) Share",
            inputMode: 'numeric',
            required: true,
            validate: {
                errorMessage: "Employer(s) Share is required",
            },
            type: "number",
            inputProps: {
                min: 0,
                max: 100
            },

            InputProps: {
                endAdornment: (
                    <InputAdornment position="end">
                        <Percent />
                    </InputAdornment>
                )
            },
            defaultValue: "",
        }

    ];
    colData.current = formData;

    const handleSubmit = (e) => {
        const { getValue, validateFields } = formApi.current
        if (validateFields()) {
            let values = getValue();
            let dataToInsert = { ...values };
            dataToInsert.fkEmployeeId = values.fkEmployeeId._id;

            if (isEdit)
                dataToInsert._id = editId

            addEntity({ url: DEFAULT_API, data: [dataToInsert] });

        }
    }
    return <>

        <Popup
            title={`Add ${DEFAULT_TITLE}`}
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
const DEFAULT_API = API.PF, DEFAULT_TITLE = "Provident Fund";
let editId = 0;
const ProvidentFund = () => {
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
        fileName: "ProvidentFund.xlsx",
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
            addEntity({ url: DEFAULT_API, data: excelData });

    }, [excelData])

    const { socketData } = useSocketIo("changeInPF", refetch);

    const columns = getColumns(gridApiRef, handleEdit, handleActiveInActive);

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
                title={DEFAULT_TITLE}
                enableFilter={true}
                handleUpload={(e) => setFile(e.target.files[0])}
                handleTemplate={getTemplate}
                subTitle={`Manage ${DEFAULT_TITLE}`}
                icon={<PeopleOutline fontSize="large" />}
            />
            <AddProvidentFund colData={excelColData} openPopup={openPopup}
                isEdit={isEdit.current} row={row.current} setOpenPopup={setOpenPopup} />

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

export default ProvidentFund;