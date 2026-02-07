// eslint-disable-next-line react-hooks/exhaustive-deps
import React, { useEffect, useState } from "react";
import Popup from '../../../components/Popup';
import { AutoForm } from '../../../components/useForm';
import { API } from '../_Service';
import { builderFieldsAction, useEntityAction, useEntitiesQuery, enableFilterAction } from '../../../store/actions/httpactions';
import { Circle } from "../../../deps/ui/icons";
import DataGrid, { useGridApi, getActions, GridToolbar } from '../../../components/useDataGrid';
import { useSocketIo } from '../../../components/useSocketio';
import ConfirmDialog from '../../../components/ConfirmDialog';
import { useAppDispatch, useAppSelector } from "../../../store/storehook";
import { formateISODateTime } from "../../../services/dateTimeService";


const fields = {
    name: {
        label: 'Allowance Title',
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

/**
 * @param {Function} apiRef 
 * @param {Function} onEdit 
 * @param {Function} onActive  
 * @returns {import("@mui/x-data-grid-pro").GridColumns}
 */
const getColumns = (apiRef, onEdit, onActive) => {
    const actionKit = {
        onActive: onActive,
        onEdit: onEdit
    }
    return [

        { field: '_id', headerName: 'Id', hide: true, hideable: false },
        {
            field: 'name', headerName: 'Name', flex: 1, hideable: false
        },
        { field: 'modifiedOn', headerName: 'Modified On', flex: 1, valueGetter: ({ row }) => formateISODateTime(row.modifiedOn) },
        { field: 'createdOn', headerName: 'Created On', flex: 1, sortingOrder: ["desc"], valueGetter: ({ row }) => formateISODateTime(row.createdOn) },
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

let editId = 0;
// const DEFAULT_API = API.Allowance;

const Allowance = ({ DEFAULT_API = API.Allowance, DEFAULT_NAME = "Allowance", formProps = [], dataMapping = null, setEditData = null }) => {
    const dispatch = useAppDispatch();
    const [openPopup, setOpenPopup] = useState(false);
    const isEdit = React.useRef(false);
    const formApi = React.useRef(null);
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

    const { addEntity, updateOneEntity, removeEntity } = useEntityAction();

    const { socketData } = useSocketIo(`changeIn${DEFAULT_NAME}`, refetch);

    const handleEdit = (id) => {
        isEdit.current = true;
        editId = id;
        const { setFormValue } = formApi.current;

        const rowData = data.find(a => a.id === id);
        let editData = formData.reduce((acc, field) => {
            if (field.name) {
                acc[field.name] = rowData[field.name]; // Use `name` as the key
            }
            return acc;
        }, {})
        if (typeof setEditData === "function") {
            editData = setEditData(rowData);
        }

        setFormValue(editData);
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

    const columns = getColumns(gridApiRef, handleEdit, handleActiveInActive, handelDeleteItems);

    const handleSubmit = (e) => {
        const { getValue, validateFields } = formApi.current
        const isValid = validateFields();
        if (isValid) {
            let values = getValue();
            let dataToInsert = { ...values };
            if (typeof dataMapping === "function") {
                dataToInsert = dataMapping(values);
            }

            if (isEdit.current)
                dataToInsert._id = editId



            addEntity({ url: DEFAULT_API, data: [dataToInsert] }).then(r => {
                if (r?.data) setOpenPopup(false);
            });

        }
        return isValid;
    }
    /**
    * @type {Array<import("../../../types").FormType>}
    */
    const formData = [
        {
            elementType: "inputfield",
            name: "name",
            label: `${DEFAULT_NAME} Title`,
            required: true,
            onKeyDown: (e) => e.keyCode == 13 && handleSubmit(),
            validate: {
                errorMessage: `${DEFAULT_NAME} Title is required`
            },
            defaultValue: ""
        },
        {
            elementType: "checkbox",
            name: "isTaxable",
            label: "Taxable",
            defaultValue: true
          },
        ...formProps
    ];

    const showAddModal = () => {
        isEdit.current = false;
        const { resetForm } = formApi.current;
        resetForm();
        setOpenPopup(true);
    }

    return (
        <>
            <Popup
                title={`Add ${DEFAULT_NAME}`}
                openPopup={openPopup}
                maxWidth="sm"
                keepMounted={true}
                isEdit={isEdit.current}
                addOrEditFunc={handleSubmit}
                setOpenPopup={setOpenPopup}>
                <AutoForm formData={formData} ref={formApi} isValidate={true} />
            </Popup>
            <DataGrid apiRef={gridApiRef}
                columns={columns} rows={data}
                loading={isLoading}
                totalCount={totalRecord}
                pageSize={gridFilter.limit}
                page={gridFilter.page}
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
export default Allowance;