// eslint-disable-next-line react-hooks/exhaustive-deps
import React, { useEffect, useRef, useState } from "react";
import Popup from '../../../components/Popup';
import { AutoForm } from '../../../components/useForm';
import { API } from '../_Service';
import { builderFieldsAction, useEntityAction, useEntitiesQuery, enableFilterAction } from '../../../store/actions/httpactions';
import { Circle } from "../../../deps/ui/icons";
import DataGrid, { useGridApi, getActions, GridToolbar } from '../../../components/useDataGrid';
import { useSocketIo } from '../../../components/useSocketio';
import ConfirmDialog from '../../../components/ConfirmDialog';
import { useDropDown } from "../../../components/useDropDown";
import { formateISODateTime } from "../../../services/dateTimeService";
import InfoToolTip from "../../../components/InfoToolTip";
import { useAppDispatch, useAppSelector } from "../../../store/storehook";


const fields = {
    title: {
        label: 'Leave Type',
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
        { field: '_id', headerName: 'Id', hide: true, hideable: false },
        {
            field: 'title', headerName: 'Leave Type', width: 180, hideable: false
        },
        { field: 'modifiedOn', headerName: 'Modified On', width: 180, hideable: false, valueGetter: ({ row }) => formateISODateTime(row.modifiedOn) },
        { field: 'createdOn', headerName: 'Created On', width: 180, hideable: false, valueGetter: ({ row }) => formateISODateTime(row.createdOn) },
        {
            field: 'isActive', headerName: 'Status', renderCell: (param) => (
                param.row["isActive"] ? <Circle color="success" /> : <Circle color="disabled" />
            ),
            flex: '0 1 5%',
            hideable: false,
            align: 'center',
        },
        getActions(apiRef, actionKit)
    ]
}
const genderItems = [
    { id: "All", title: "All" },
    { id: "Male", title: "Male" },
    { id: "Female", title: "Female" },
]

const DEFAULT_API = API.LeaveType;
let editId = 0;
export const AddLeaveType = ({ openPopup, setOpenPopup, isEdit = false, row = null }) => {
    const formApi = useRef(null);
    const { addEntity } = useEntityAction();
    const { groups, leaveAccural } = useDropDown();
    useEffect(() => {
        if (!formApi.current || !openPopup) return;
        const { resetForm, setFormValue } = formApi.current;
        if (openPopup && !isEdit)
            resetForm();
        else {
            setFormValue({
                ...row,
                fkGroupIds: groups.filter(c => row.fkGroupIds.includes(c._id))
            });
        }
    }, [openPopup, formApi])
    const handleSubmit = (e) => {
        const { getValue, validateFields } = formApi.current
        if (validateFields()) {
            let values = getValue();
            let dataToInsert = { ...values };
            dataToInsert.fkGroupIds = values.fkGroupIds.map(c => c._id);
            if (isEdit)
                dataToInsert._id = editId

            addEntity({ url: DEFAULT_API, data: [dataToInsert] });

        }
    }

    const formData = [
        {
            elementType: "inputfield",
            name: "title",
            label: "Title",
            required: true,
            validate: {
                errorMessage: "Title is required"
            },
            defaultValue: ""
        },
        {
            elementType: "inputfield",
            name: "entitled",
            label: "Entitle",
            type: "number",
            required: true,
            validate: {
                errorMessage: "Entitle is required"
            },
            defaultValue: 0
        },
        {
            elementType: "ad_dropdown",
            name: "fkGroupIds",
            label: "Group",
            isMultiple: true,
            required: true,
            dataId: '_id',
            dataName: "groupName",
            validate: {
                errorMessage: "Group is required",
            },
            options: groups ?? [],
            defaultValue: []
        },
        {
            elementType: "dropdown",
            name: "gender",
            label: "Gender",
            dataId: "id",
            dataName: "title",
            defaultValue: "All",
            options: genderItems
        },
        {
            elementType: "dropdown",
            name: "fkleaveAccrualId",
            label: "LeaveAccural",
            dataId: "leaveAccrualId",
            breakpoints: { md: 12, sm: 12, xs: 12 },
            dataName: "name",
            defaultValue: "",
            options: leaveAccural ?? []
        },
        {
            elementType: "checkbox",
            name: "isProRata",
            label: "ProRata Base",
            defaultValue: false,
        },
        {
            elementType: "checkbox",
            name: "isEmployeeWise",
            label: "Company Wise",
            defaultValue: false,
        },
        {
            elementType: "checkbox",
            name: "isCarryForword",
            label: "Carry Forward",
            defaultValue: false,
        },
        {
            elementType: "checkbox",
            name: "isLeaveEncash",
            label: "Leave Encashment",
            defaultValue: false,
        }

    ];
    return <Popup
        title="Add Leave Type"
        openPopup={openPopup}
        maxWidth="sm"
        isEdit={isEdit}
        keepMounted={true}
        addOrEditFunc={handleSubmit}
        setOpenPopup={setOpenPopup}>
        <AutoForm formData={formData} ref={formApi} isValidate={true} />
    </Popup>
}
const LeaveType = () => {
    const dispatch = useAppDispatch();
    const [openPopup, setOpenPopup] = useState(false);
    const isEdit = React.useRef(false);
    const row = React.useRef(null);
    const [selectionModel, setSelectionModel] = React.useState([]);

    const [sort, setSort] = useState({ sort: { createdAt: -1 } });
    const [filter, setFilter] = useState({
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

    const { data, isLoading, refetch, totalRecord } = useEntitiesQuery({
        url: DEFAULT_API,
        data: {
            limit: filter.limit,
            page: filter.page + 1,
            lastKeyId: filter.lastKey,
            ...sort,
            searchParams: { ...query }
        }
    }, { selectFromResult: ({ data, isLoading }) => ({ data: data?.entityData, totalRecord: data?.totalRecord, isLoading }) });

    const { updateOneEntity, removeEntity } = useEntityAction();


    const { socketData } = useSocketIo("changeInLeaveType", refetch);


    const handleEdit = (id) => {
        isEdit.current = true;
        editId = id;
        row.current = data.find(a => a.id === id);;
        setOpenPopup(true);
    }

    const handleActiveInActive = (id) => {
        updateOneEntity({ url: DEFAULT_API, data: { _id: id } });
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
            <AddLeaveType openPopup={openPopup} setOpenPopup={setOpenPopup} isEdit={isEdit.current} row={row.current} />
            <DataGrid apiRef={gridApiRef}
                columns={columns} rows={data}
                loading={isLoading}
                page={filter.page}
                pageSize={filter.limit}
                setFilter={setFilter}
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
export default LeaveType;