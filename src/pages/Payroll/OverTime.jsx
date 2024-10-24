// eslint-disable-next-line react-hooks/exhaustive-deps
import React, { useEffect, useRef, useState } from "react";
import Popup from '../../components/Popup';
import { API, defaultOverTimeType, OverTimeType } from './_Service';
import { builderFieldsAction, useEntityAction, useEntitiesQuery, showDropDownFilterAction } from '../../store/actions/httpactions';
import { PeopleOutline, HourglassBottom } from "../../deps/ui/icons";
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
import InfoToolTip from "../../components/InfoToolTip";

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

const mapOverTime = (values) => {
    const map = { ...values };
    map.fkEmployeeId = values.fkEmployeeId._id;
    map.type = values.type.id;
    // map.percentage_or_amount = map.type !== FixedAmount ? map.percentage : map.amount;
    return map
}

const getColumns = (onCancel) => [
    { field: '_id', headerName: 'Id', hide: true },
    {
        field: 'fullName', headerName: 'Employee Name', flex: 1, valueGetter: ({ row }) => row.employees.fullName
    },
    {
        field: 'title', headerName: 'Title', flex: 1, valueGetter: ({ row }) => row.title
    },
    { field: 'overTimeRequest', headerName: 'Date', flex: 1, valueGetter: ({ row }) => formateISODate(row.overTimeRequest) },
    { field: 'type', headerName: 'Type', flex: 1 },
    // { field: 'amount', headerName: 'Amount' },
    {
        field: 'status', headerName: 'Status', flex: 1, renderCell: renderStatusCell
    },
    { field: 'modifiedOn', headerName: 'Modified On', flex: 1, valueGetter: ({ row }) => formateISODateTime(row.modifiedOn) },
    { field: 'createdOn', headerName: 'Created On', flex: 1, valueGetter: ({ row }) => formateISODateTime(row.createdOn) },
    getActions(null, { onCancel })
];
const min = 0, max = 48;
const AddOverTime = ({ openPopup, setOpenPopup, colData = [] }) => {
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
    const handleInvalid = (e) => {
        e.preventDefault();
        alert(`Value must be between `);
    };
    const formData = [
        {
            elementType: "ad_dropdown",
            name: "fkEmployeeId",
            label: "Employee",
            variant: "outlined",
            required: true,
            validate: {
                errorMessage: "Select Employees",
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
            name: "overTimeRequest",
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
                sampleData: "OverTime"
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
            defaultValue: defaultOverTimeType,
            options: OverTimeType,
            excel: {
                sampleData: defaultOverTimeType
            }
        },

        {
            elementType: "inputfield",
            name: "OTHours",
            label: "Hours",
            inputMode: 'numeric',
            // modal: {
            //     Component: ,
            // },
            required: true,
            onChange: (hour) => {
                const { setFormValue } = formApi.current;
                if (+hour < min || +hour > max) {
                    setFormValue({ OTHours: '' })
                }
            },
            validate: {
                errorMessage: "OverTime Hours is required",
            },
            type: "number",
            inputProps: {
                min,
                max
            },
            // breakpoints,
            InputProps: {
                endAdornment: (
                    <InputAdornment position="end">
                        <InfoToolTip sx={{ float: "right", pt: 1 }} color="info" title="Hours should be between 0 - 48" />
                        <HourglassBottom />
                    </InputAdornment>
                )
            },
            defaultValue: "",
            excel: {
                sampleData: 12
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
            breakpoints: { md: 12, sm: 12, xs: 12 },
            defaultValue: "",
            excel: {
                sampleData: ""
            }
        }
    ];
    colData.current = formData;

    const handleSubmit = (e) => {
        const { getValue, validateFields } = formApi.current
        if (validateFields()) {
            const values = { ...getValue() };
            // values.percentage_or_amount = values.type === FixedAmount ? amount : percentage
            values.fkEmployeeId = values.fkEmployeeId._id;
            // dataToInsert.fkEmployeeId = values.fkEmployeeId._id;

            addEntity({ url: DEFAULT_API, data: [values] });

        }
    }
    return <>
        <Loader open={loader} />
        <Popup
            title="Over Time Request"
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
const DEFAULT_API = API.OverTime;
const OverTimeRequest = () => {
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
    const { inProcess, setFile, excelData, getTemplate } = useExcelReader(excelColData.current, mapOverTime, "OverTime.xlsx");

    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        title: "",
        subTitle: "",
    });


    const gridApiRef = useGridApi();
    const query = useAppSelector(e => e.appdata.query.builder);
    const { countryIds, stateIds, cityIds, areaIds } = useDropDownIds();
    const { data, isLoading, refetch, totalRecord } = useEntitiesQuery({
        url: DEFAULT_API,
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
            addEntity({ url: DEFAULT_API, data: excelData });
        }

    }, [excelData])

    const { socketData } = useSocketIo("changeInOverTime", refetch);

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
                title="OverTime Request"
                enableFilter={true}
                handleUpload={(e) => setFile(e.target.files[0])}
                handleTemplate={getTemplate}
                subTitle="Manage OverTime Request"
                icon={<PeopleOutline fontSize="large" />}
            />
            <AddOverTime colData={excelColData} openPopup={openPopup} setOpenPopup={setOpenPopup} />

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

export default OverTimeRequest;