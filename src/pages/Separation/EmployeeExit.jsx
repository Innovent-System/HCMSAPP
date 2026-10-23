// eslint-disable-next-line react-hooks/exhaustive-deps
import React, { useEffect, useRef, useState } from "react";
import Popup from '../../components/Popup';
import { API, exitTypes, } from './_Service';
import { builderFieldsAction, useEntityAction, useEntitiesQuery, showDropDownFilterAction } from '../../store/actions/httpactions';
import { PeopleOutline, Percent, AttachMoney } from "../../deps/ui/icons";
import { InputAdornment } from "../../deps/ui";
import DataGrid, { getActions, GridToolbar, renderStatusCell, useGridApi } from '../../components/useDataGrid';
import { useSocketIo } from '../../components/useSocketio';
import ConfirmDialog from '../../components/ConfirmDialog';
import { AutoForm } from '../../components/useForm'
import PageHeader from '../../components/PageHeader'
import { formateISODateTime, formateISODate, systemFormatDate, isBefore, startOfDay } from '../../services/dateTimeService'
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

const mapExcelData = (values) => {
    const map = { ...values };
    map.employeeId = values.employeeId.id;
    map.requestDate = systemFormatDate(values.requestDate);
    map.lastWorkingDate = systemFormatDate(values.lastWorkingDate);
    return map
}

const getColumns = (onCancel) => [
    { field: 'id', headerName: 'Id', hide: true },
    { field: 'fullName', headerName: 'Employee', flex: 1 },
    { field: 'requestDate', headerName: 'Date', flex: 1, valueGetter: ({ row }) => formateISODate(row.requestDate) },
    { field: 'lastWorkingDate', headerName: 'Last Working Day', flex: 1, valueGetter: ({ row }) => formateISODate(row.lastWorkingDate) },
    { field: 'exitType', headerName: 'Type' },
    {
        field: 'status', headerName: 'Status', flex: 1, renderCell: renderStatusCell
    },
    { field: 'modifiedOn', headerName: 'Modified On', flex: 1, valueGetter: ({ row }) => formateISODateTime(row.modifiedAt) },
    { field: 'createdOn', headerName: 'Created On', flex: 1, valueGetter: ({ row }) => formateISODateTime(row.createdAt) },
    getActions(null, { onCancel })
];

const AddEmployeeExit = ({ openPopup, setOpenPopup, colData = [] }) => {
    const formApi = useRef(null);
    const [loader, setLoader] = useState(false);

    const { employees } = useAppSelector(e => e.appdata.employeeData);
    const { addEntity } = useEntityAction();

    useEffect(() => {
        if (formApi.current && openPopup) {
            const { resetForm } = formApi.current;
            resetForm();
        }
    }, [openPopup, formApi])
    const formData = [
        {
            elementType: "ad_dropdown",
            name: "employeeId",
            label: "Employee",
            variant: "outlined",
            required: true,
            validate: {
                errorMessage: "Select Employees",
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
            elementType: "datetimepicker",
            label: "Date",
            name: "requestDate",
            required: true,
            validate: {
                errorMessage: "Select Date please",
            },
            defaultValue: new Date(),
            excel: {
                sampleData: new Date().toLocaleDateString('en-CA')
            }
        },
        {
            elementType: "datetimepicker",
            label: "Last Working Day",
            name: "lastWorkingDate",
            required: true,
            // disablePast: true,
            validate: {
                errorMessage: "Select Last Working Day please",
                validate: (val) => isBefore(startOfDay(val.lastWorkingDate), startOfDay(formApi.current.getValue().requestDate)) ? "Last Working Day should be greater than Request Date" : true
            },
            defaultValue: new Date(),
            excel: {
                sampleData: new Date().toLocaleDateString('en-CA')
            }
        },
        {
            elementType: "dropdown",
            name: "exitType",
            label: "Exit Type",
            dataId: "id",
            dataName: "title",
            isNone: false,
            defaultValue: "Resignation",
            options: exitTypes,
            excel: {
                sampleData: "Resignation"
            }
        },
        {
            elementType: "inputfield",
            name: "reason",
            required: true,
            label: "Reason",
            multiline: true,
            validate: {
                errorMessage: "Reason required",
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

            dataToInsert.employeeId = values.employeeId.id;
            dataToInsert.requestDate = systemFormatDate(values.requestDate);
            dataToInsert.lastWorkingDate = systemFormatDate(values.lastWorkingDate);

            addEntity({ url: DEFAULT_API, data: [dataToInsert] }).finally(() => {
                setOpenPopup(false);
            });

        }
    }
    return <>
        <Loader open={loader} />
        <Popup
            title="Employee Exit"
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
const DEFAULT_API = API.EmployeeExit;
const EmployeeExitRequest = () => {
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
        transform: mapExcelData,
        fileName: "EmployeeExit.xlsx",
        uniqueBy: ["requestDate", "employeeId"]
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

    const { socketData } = useSocketIo("changeInEmployeeExit", refetch);

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
                title="Employee Exit"
                enableFilter={true}
                handleUpload={(e) => setFile(e.target.files[0])}
                handleTemplate={getTemplate}
                subTitle="Manage EmployeeExit"
                icon={<PeopleOutline fontSize="large" />}
            />
            <AddEmployeeExit colData={excelColData} openPopup={openPopup} setOpenPopup={setOpenPopup} />

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

export default EmployeeExitRequest;