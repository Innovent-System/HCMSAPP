// eslint-disable-next-line react-hooks/exhaustive-deps
import React, { useEffect, useRef, useState } from "react";
import Popup from '../../components/Popup';
import { API, calcTypeObj, CalculationType, FixedAmount, PercentageOfBasicSalary, salaryChangeType } from './_Service';
import { builderFieldsAction, useEntityAction, useEntitiesQuery, showDropDownFilterAction } from '../../store/actions/httpactions';
import { PeopleOutline, Percent, AttachMoney } from "../../deps/ui/icons";
import { InputAdornment } from "../../deps/ui";
import DataGrid, { getActions, GridToolbar, renderStatusCell, useGridApi } from '../../components/useDataGrid';
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

const mapExcelData = (values) => {
    const map = { ...values };
    map.employeeId = values.employeeId.id;
    map.requestDate = systemFormatDate(values.requestDate);
    return map
}

const getColumns = (onCancel) => [
    { field: 'id', headerName: 'Id', hide: true },
    { field: 'fullName', headerName: 'Employee', flex: 1 },
    { field: 'title', headerName: 'Title', flex: 1 },
    { field: 'requestDate', headerName: 'Date', flex: 1, valueGetter: ({ row }) => formateISODate(row.requestDate) },
    { field: 'calculationType', headerName: 'Type', flex: 1, valueGetter: ({ row }) => calcTypeObj[row.calculationType] },
    { field: 'adjustmentType', headerName: 'Frequency' },
    // { field: 'amount', headerName: 'Amount' },
    {
        field: 'status', headerName: 'Status', flex: 1, renderCell: renderStatusCell
    },
    { field: 'modifiedOn', headerName: 'Modified On', flex: 1, valueGetter: ({ row }) => formateISODateTime(row.modifiedAt) },
    { field: 'createdOn', headerName: 'Created On', flex: 1, valueGetter: ({ row }) => formateISODateTime(row.createdAt) },
    getActions(null, { onCancel })
];

const AddAdjustment = ({ openPopup, setOpenPopup, colData = [] }) => {
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
            disablePast: true,
            validate: {
                errorMessage: "Select Date please",
            },
            defaultValue: new Date(),
            excel: {
                sampleData: new Date().toLocaleDateString('en-CA')
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
                sampleData: "Annual Adjustment"
            }
        },
        {
            elementType: "dropdown",
            name: "adjustmentType",
            label: "Adjustment Type",
            dataId: "id",
            dataName: "title",
            isNone: false,
            defaultValue: "Increment",
            options: salaryChangeType,
            excel: {
                sampleData: "Increment"
            }
        },
        {
            elementType: "dropdown",
            name: "calculationType",
            label: "Type",
            dataId: "id",
            dataName: "title",
            isNone: false,
            defaultValue: FixedAmount,
            options: CalculationType,
            excel: {
                sampleData: "FixedAmount"
            }
        },
        {
            elementType: "inputfield",
            name: "value",
            label: "Value",
            inputMode: 'numeric',
            required: true,
            validate: {
                errorMessage: "Value is required",
            },
            type: "number",
            inputProps: {
                min: 0
            },
            defaultValue: "",
            excel: {
                sampleData: 0
            }
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

            dataToInsert.employeeId = values.employeeId.id;
            dataToInsert.requestDate = systemFormatDate(values.requestDate);
            // const dataToInsert = values.employeeId.map((empId) => ({
            //     ...values,
            //     employeeId: empId.id,
            //     requestDate: systemFormatDate(values.requestDate)
            // }));

            addEntity({ url: DEFAULT_API, data: [dataToInsert] }).finally(() => {
                setOpenPopup(false);
            });

        }
    }
    return <>
        <Loader open={loader} />
        <Popup
            title="Adjustment"
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
const DEFAULT_API = API.Adjustment;
const AdjustmentRequest = () => {
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
        fileName: "Adjustment.xlsx",
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

    const { socketData } = useSocketIo("changeInAdjustment", refetch);

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
                title="Adjustment"
                enableFilter={true}
                handleUpload={(e) => setFile(e.target.files[0])}
                handleTemplate={getTemplate}
                subTitle="Manage Adjustment"
                icon={<PeopleOutline fontSize="large" />}
            />
            <AddAdjustment colData={excelColData} openPopup={openPopup} setOpenPopup={setOpenPopup} />

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

export default AdjustmentRequest;