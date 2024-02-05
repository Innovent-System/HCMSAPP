// eslint-disable-next-line react-hooks/exhaustive-deps
import React, { useEffect, useRef, useState } from "react";
import Controls from '../../components/controls/Controls';
import Popup from '../../components/Popup';
import { API } from './_Service';
import { builderFieldsAction, useEntityAction, useEntitiesQuery, showDropDownFilterAction, useLazySingleQuery } from '../../store/actions/httpactions';
import { PeopleOutline } from "../../deps/ui/icons";
import DataGrid, { GridToolbar, renderStatusCell, useGridApi } from '../../components/useDataGrid';
import { useSocketIo } from '../../components/useSocketio';
import ConfirmDialog from '../../components/ConfirmDialog';
import { AutoForm } from '../../components/useForm'

import PageHeader from '../../components/PageHeader'
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
const columns = [
    { field: '_id', headerName: 'Id', hide: true },
    {
        field: 'fullName', headerName: 'Employee Name', flex: 1, valueGetter: ({ row }) => row.employees.fullName
    },
    { field: 'exemptionDate', headerName: 'Exemption Date', flex: 1, valueGetter: ({ row }) => formateISODateTime(row.exemptionDate) },
    { field: 'attendanceFlag', headerName: 'Attendance Flag', flex: 1, valueGetter: ({ row }) => row.att_flag.name },
    {
        field: 'status', headerName: 'Status', flex: 1, renderCell: renderStatusCell
    },
    { field: 'modifiedOn', headerName: 'Modified On', flex: 1, valueGetter: ({ row }) => formateISODateTime(row.modifiedOn) },
    { field: 'createdOn', headerName: 'Created On', flex: 1, valueGetter: ({ row }) => formateISODateTime(row.createdOn) }
];

const AddExemptionRequest = ({ openPopup, setOpenPopup }) => {
    const formApi = useRef(null);
    const [loader, setLoader] = useState(false);
    const { Employees, AttendanceFlag } = useAppSelector(e => e.appdata.employeeData);
    const { addEntity } = useEntityAction();
    const [getExemptionRequest] = useLazySingleQuery();
    useEffect(() => {
        if (formApi.current && openPopup) {
            const { resetForm } = formApi.current;
            resetForm();
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
            onChange: (data) => {
                if (!data) return;
                setLoader(true);
                const { setFormValue, getValue } = formApi.current;
                getExemptionRequest({ url: API.GetExemptionDetail, params: { employeeId: data._id, exemptionDate: getValue()?.exemptionDate } }).then(c => {
                    if (c?.data?.result) {
                        setFormValue({ attendanceFlagId: AttendanceFlag.find(f => f.flagCode === c.data?.result.flagCode)._id });
                    }
                    else setFormValue({ attendanceFlagId: "" });

                    setLoader(false);
                })
            },
            defaultValue: null
        },
        {
            elementType: "datetimepicker",
            name: "exemptionDate",
            required: true,
            disableFuture: true,
            validate: {
                errorMessage: "Select Date please",
            },
            label: "Date",
            defaultValue: new Date(),
            onChange: (data) => {
                console.log({ data });
                if (!data) return;
                const { setFormValue, getValue } = formApi.current;
                const { fkEmployeeId } = getValue();
                if (!fkEmployeeId?._id) return;
                setLoader(true);
                getExemptionRequest({ url: API.GetExemptionDetail, params: { employeeId: fkEmployeeId?._id, exemptionDate: data } }).then(c => {

                    if (c?.data?.result) {
                        setFormValue({ attendanceFlagId: AttendanceFlag.find(f => f.flagCode === c.data?.result.flagCode)._id });
                    }
                    else setFormValue({ attendanceFlagId: "" });
                    setLoader(false);
                })
            },
        },
        {
            elementType: "dropdown",
            name: "attendanceFlagId",
            label: "Attendance Flag",
            required: true,
            disabled: true,
            validate: {
                errorMessage: "Flag is required",
            },
            dataId: "_id",
            dataName: "name",
            options: AttendanceFlag,
            defaultValue: ""
        },
        {
            elementType: "inputfield",
            name: "reason",
            required: true,
            label: "Reason",
            multiline: true,
            validate: {
                errorMessage: "Reson required",
            },
            minRows: 5,
            variant: "outlined",
            breakpoints: { md: 12, sx: 12, xs: 12 },
            defaultValue: ""
        }

    ];

    const handleSubmit = (e) => {
        const { getValue, validateFields } = formApi.current
        if (validateFields()) {
            let values = getValue();
            let dataToInsert = { ...values };
            dataToInsert.fkEmployeeId = values.fkEmployeeId._id;

            addEntity({ url: API.ExemptionRequest, data: [dataToInsert] });

        }
    }
    return <>
        <Loader open={loader} />
        <Popup
            title="Exemption Request"
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
const ExemptionRequest = () => {
    const dispatch = useAppDispatch();
    const [openPopup, setOpenPopup] = useState(false);


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
    const { countryIds, stateIds, cityIds, areaIds } = useDropDownIds();

    const { data, isLoading, refetch, totalRecord } = useEntitiesQuery({
        url: API.ExemptionRequest,
        data: {
            limit: gridFilter.limit,
            page: gridFilter.page + 1,
            ...sort,
            searchParams: { ...query }
        }
    }, { selectFromResult: ({ data, isLoading }) => ({ data: data?.entityData, totalRecord: data?.totalRecord, isLoading }) });
    const { removeEntity } = useEntityAction();


    const { socketData } = useSocketIo("changeInExemptionRequest", refetch);


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
                removeEntity({ url: API.ExemptionRequest, params: idTobeDelete }).then(res => {
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
                title="Exemption Request"
                enableFilter={true}
                subTitle="Manage Exemption Request"
                icon={<PeopleOutline fontSize="large" />}
            />
            <AddExemptionRequest openPopup={openPopup} setOpenPopup={setOpenPopup} />
            <DataGrid apiRef={gridApiRef}
                columns={columns} rows={data}
                loading={isLoading} pageSize={gridFilter.limit}
                page={gridFilter.page}
                totalCount={totalRecord}
                setFilter={setGridFilter}
                onSortModelChange={(s) => setSort({ sort: s.reduce((a, v) => ({ ...a, [v.field]: v.sort === 'asc' ? 1 : -1 }), {}) })}
                toolbarProps={{
                    apiRef: gridApiRef,
                    onAdd: showAddModal,
                    onDelete: handelDeleteItems,
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

export default ExemptionRequest;