// eslint-disable-next-line react-hooks/exhaustive-deps
import React, { useEffect, useRef, useState } from "react";
import Popup from '../../components/Popup';
import { API, CalculationType, FixedAmount, PercentageOfBasicSalary } from './_Service';
import { builderFieldsAction, useEntityAction, useEntitiesQuery, showDropDownFilterAction } from '../../store/actions/httpactions';
import { PeopleOutline, Percent, AttachMoney } from "../../deps/ui/icons";
import { InputAdornment } from "../../deps/ui";
import DataGrid, { getActions, GridToolbar, renderStatusCell, useGridApi } from '../../components/useDataGrid';
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
    map.employeeIds = values.employeeIds._id;
    map.type = values.type.id;
    map.percentage_or_amount = map.type !== FixedAmount ? map.percentage : map.amount;
    return map
}

const getColumns = (onCancel) => [
    { field: '_id', headerName: 'Id', hide: true },
    {
        field: 'title', headerName: 'Title', flex: 1, valueGetter: ({ row }) => row.title
    },
    { field: 'bonusRequest', headerName: 'Date', flex: 1, valueGetter: ({ row }) => formateISODate(row.bonusRequest) },
    { field: 'type', headerName: 'Type', flex: 1 },
    // { field: 'amount', headerName: 'Amount' },
    {
        field: 'status', headerName: 'Status', flex: 1, renderCell: renderStatusCell
    },
    { field: 'modifiedOn', headerName: 'Modified On', flex: 1, valueGetter: ({ row }) => formateISODateTime(row.modifiedOn) },
    { field: 'createdOn', headerName: 'Created On', flex: 1, valueGetter: ({ row }) => formateISODateTime(row.createdOn) },
    getActions(null, { onCancel })
];

const AddBonus = ({ openPopup, setOpenPopup, colData = [] }) => {
    const formApi = useRef(null);
    const [loader, setLoader] = useState(false);

    const { Employees } = useAppSelector(e => e.appdata.employeeData);
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
            name: "employeeIds",
            label: "Employee",
            variant: "outlined",
            required: true,
            isMultiple: true,
            validate: {
                errorMessage: "Select Employees",
            },
            dataName: 'fullName',
            dataId: "_id",
            options: Employees,
            defaultValue: [],
            excel: {
                sampleData: "Faizan Siddiqui"
            }
        },
        {
            elementType: "datetimepicker",
            label: "Date",
            name: "bonusRequest",
            required: true,
            disablePast: true,
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
                sampleData: "Advance"
            }
        },
        {
            elementType: "dropdown",
            name: "type",
            label: "Type",
            // breakpoints,
            dataId: "id",
            dataName: "title",
            isNone: false,
            defaultValue: PercentageOfBasicSalary,
            options: CalculationType,
        },
        {
            elementType: "inputfield",
            name: "percentage",
            isShow: (values) => values.type !== FixedAmount,
            label: "Percentage",
            inputMode: 'numeric',
            required: true,
            validate: {
                errorMessage: "Perentage is required",
            },
            type: "number",
            inputProps: {
                min: 0,
                max: 100
            },
            // breakpoints,
            InputProps: {
                endAdornment: (
                    <InputAdornment position="end">
                        <Percent />
                    </InputAdornment>
                )
            },
            defaultValue: "",
            excel: {
                sampleData: 20
            }
        },
        {
            elementType: "inputfield",
            name: "amount",
            isShow: (values) => values.type === FixedAmount,
            label: "Amount",
            inputMode: 'numeric',
            required: true,
            validate: {
                errorMessage: "Amount is required",
            },
            type: "number",
            inputProps: {
                min: 0,
            },
            // breakpoints,
            InputProps: {
                endAdornment: (
                    <InputAdornment position="end">
                        <AttachMoney />
                    </InputAdornment>
                )
            },
            defaultValue: "",
            excel: {
                sampleData: 10000
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
            const { percentage, amount, ...values } = getValue();
            values.percentage_or_amount = values.type === FixedAmount ? amount : percentage
            values.employeeIds = values.employeeIds.map(e => e._id)
            // dataToInsert.fkEmployeeId = values.fkEmployeeId._id;

            addEntity({ url: DEFAULT_API, data: [values] });

        }
    }
    return <>
        <Loader open={loader} />
        <Popup
            title="Bonus Request"
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
const DEFAULT_API = API.Bonus;
const BonusRequest = () => {
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
        fileName: "Bonus.xlsx"
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
        if (excelData) {

            const groupedData = {};

            for (const obj of excelData) {
                const key = obj.title.toLowerCase();
                if (!groupedData[key]) {
                    groupedData[key] = { ...obj, employeeIds: [] };
                }
                if (!groupedData[key].employeeIds.includes(obj.employeeIds)) {
                    groupedData[key].employeeIds.push(obj.employeeIds);
                }
            }

            const result = Object.values(groupedData);
            addEntity({ url: DEFAULT_API, data: result });
        }

    }, [excelData])

    const { socketData } = useSocketIo("changeInBonus", refetch);

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
                title="Bonus Request"
                enableFilter={true}
                handleUpload={(e) => setFile(e.target.files[0])}
                handleTemplate={getTemplate}
                subTitle="Manage Bonus Request"
                icon={<PeopleOutline fontSize="large" />}
            />
            <AddBonus colData={excelColData} openPopup={openPopup} setOpenPopup={setOpenPopup} />

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

export default BonusRequest;