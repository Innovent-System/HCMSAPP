// eslint-disable-next-line react-hooks/exhaustive-deps
import React, { useEffect, useRef, useState } from "react";
import Controls from '../../components/controls/Controls';
import Popup from '../../components/Popup';
import { API } from './_Service';
import { useDispatch, useSelector } from 'react-redux';
import { builderFieldsAction, useEntityAction, useEntitiesQuery, showDropDownFilterAction, useLazySingleQuery } from '../../store/actions/httpactions';
import { GridToolbarContainer, Stack, Typography } from "../../deps/ui";
import { Add as AddIcon, Delete as DeleteIcon, PeopleOutline } from "../../deps/ui/icons";
import DataGrid, { useGridApi } from '../../components/useDataGrid';
import { useSocketIo } from '../../components/useSocketio';
import ConfirmDialog from '../../components/ConfirmDialog';
import { AutoForm } from '../../components/useForm'
import PropTypes from 'prop-types'
import PageHeader from '../../components/PageHeader'
import { startOfDay, addDays, isEqual } from '../../services/dateTimeService'
import { formateISODateTime } from "../../services/dateTimeService";
import Loader from '../../components/Circularloading'
import Speach from "../../components/Speech";
import { useDropDownIds } from "../../components/useDropDown";
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
const columns = [
    { field: '_id', headerName: 'Id', hide: true },
    {
        field: 'fullName', headerName: 'Employee Name', flex: 1, valueGetter: ({ row }) => row.employees.fullName
    },
    { field: 'exemptionDate', headerName: 'Exemption Date', flex: 1, valueGetter: ({ row }) => formateISODateTime(row.exemptionDate) },
    { field: 'attendanceFlag', headerName: 'Attendance Flag', flex: 1, valueGetter: ({ row }) => row.att_flag.name },
    { field: 'status', headerName: 'Status', flex: 1 },
    { field: 'modifiedOn', headerName: 'Modified On', flex: 1, valueGetter: ({ row }) => formateISODateTime(row.modifiedOn) },
    { field: 'createdOn', headerName: 'Created On', flex: 1, valueGetter: ({ row }) => formateISODateTime(row.createdOn) }
];

const AddExemptionRequest = ({ openPopup, setOpenPopup }) => {
    const formApi = useRef(null);
    const [loader, setLoader] = useState(false);
    const { Employees, AttendanceFlag } = useSelector(e => e.appdata.employeeData);
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
                    console.log(c);
                    if (c.data?.result) {
                        setFormValue({ attendanceFlagId: AttendanceFlag.find(f => f.flagId === c.data?.result.flagCode)._id });
                    }
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
                    console.log(c);
                    if (c.data?.result) {
                        setFormValue({ attendanceFlagId: AttendanceFlag.find(f => f.flagId === c.data?.result.flagCode)._id });
                    }
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
    const dispatch = useDispatch();
    const [openPopup, setOpenPopup] = useState(false);
    const [pageSize, setPageSize] = useState(30);

    const [selectionModel, setSelectionModel] = React.useState([]);

    const offSet = useRef({
        isLoadMore: false,
        isLoadFirstTime: true,
    })

    const [gridFilter, setGridFilter] = useState({
        lastKey: null,
        limit: 10,
        totalRecord: 0
    })

    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        title: "",
        subTitle: "",
    });

    const [records, setRecords] = useState([]);

    const gridApiRef = useGridApi();
    const query = useSelector(e => e.appdata.query.builder);
    const { countryIds, stateIds, cityIds, areaIds } = useDropDownIds();
    const { data, isLoading, status, refetch } = useEntitiesQuery({
        url: API.ExemptionRequest,
        params: {
            limit: offSet.current.limit,
            lastKeyId: offSet.current.isLoadMore ? offSet.current.lastKeyId : "",
            searchParams: JSON.stringify(query)
        }
    });

    const { removeEntity } = useEntityAction();

    useEffect(() => {
        if (status === "fulfilled") {
            const { entityData, totalRecord } = data.result;
            if (offSet.current.isLoadMore) {
                setRecords([...entityData, ...records]);
            }
            else
                setRecords(entityData)

            setGridFilter({ ...gridFilter, totalRecord: totalRecord });
            offSet.current.isLoadMore = false;
        }
    }, [data, status])

    const { socketData } = useSocketIo("changeInExemptionRequest", refetch);

    useEffect(() => {
        if (Array.isArray(socketData)) {
            setRecords(socketData);
        }
    }, [socketData])


    const loadMoreData = (params) => {
        if (records.length < gridFilter.totalRecord && params.viewportPageSize !== 0) {
            offSet.current.isLoadMore = true;
            setGridFilter({ ...gridFilter, lastKey: records.length ? records[records.length - 1].id : null });
        }
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
                removeEntity({ url: API.ExemptionRequest, params: idTobeDelete }).then(res => {
                    setSelectionModel([]);
                })
            },
        });
    }

    useEffect(() => {
        offSet.current.isLoadFirstTime = false;
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
                columns={columns} rows={records}
                loading={isLoading} pageSize={pageSize}
                totalCount={offSet.current.totalRecord}
                toolbarProps={{
                    apiRef: gridApiRef,
                    onAdd: showAddModal,
                    onDelete: handelDeleteItems,
                    selectionModel
                }}
                gridToolBar={RequestToolbar}
                selectionModel={selectionModel}
                setSelectionModel={setSelectionModel}
                onRowsScrollEnd={loadMoreData}
            />
            <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
        </>
    );
}

export default ExemptionRequest;

function RequestToolbar(props) {
    const { apiRef, onAdd, onDelete, selectionModel } = props;

    return (
        <GridToolbarContainer sx={{ justifyContent: "flex-end" }}>
            {selectionModel?.length ? <Controls.Button onClick={() => onDelete(selectionModel)} startIcon={<DeleteIcon />} text="Delete Items" /> : null}
            <Controls.Button onClick={onAdd} startIcon={<AddIcon />} text="Add record" />
        </GridToolbarContainer>
    );
}

RequestToolbar.propTypes = {
    apiRef: PropTypes.shape({
        current: PropTypes.object,
    }),
    onAdd: PropTypes.func,
    onDelete: PropTypes.func,
    selectionModel: PropTypes.array
};