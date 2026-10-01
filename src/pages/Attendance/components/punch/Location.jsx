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
import { formateISODateTime } from "@/services/dateTimeService";
import { getYears } from "@/util/common";
import { useDropDown } from "@/components/useDropDown";


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

const getColumns = (apiRef, onEdit, onDelete) => {
    const actionKit = {
        // onEdit: onEdit,
        onDelete: onDelete
    }
    return [
        { field: 'employeeId', headerName: 'Id', hide: true, hideable: false },
        {
            field: 'fullName', headerName: 'Employee', width: 220, hideable: false
        },
        { field: 'area', headerName: 'Area', hideable: false },
        { field: 'locationCount', headerName: 'Location Access', hideable: false },
        { field: 'createdOn', sortingOrder: ["desc"], headerName: 'Created On', flex: 1, valueGetter: ({ row }) => formateISODateTime(row.createdAt) },
        getActions(apiRef, actionKit, false, null, false)
    ]
}
const DEFAULT_API = API.GeoLocation;
let editId = 0;
const _years = getYears();

export const AddLocation = ({ openPopup, setOpenPopup, isEdit = false, row = null }) => {
    const formApi = useRef(null);
    const { addEntity } = useEntityAction();
    const { employees, areas } = useDropDown();
    useEffect(() => {
        if (!formApi.current || !openPopup) return;
        const { resetForm, setFormValue } = formApi.current;
        if (openPopup && !isEdit)
            resetForm();
        else {
            const { employeeId } = row;
            setFormValue({
                employeeId: row.employeeId,
                areaId: row.areaId
            });
        }
    }, [openPopup, formApi])
    const handleSubmit = (e) => {
        const { getValue, validateFields } = formApi.current
        if (validateFields()) {
            let values = getValue();
            let dataToInsert = [];
            // if (isEdit)
            //     dataToInsert.id = editId
            values.employeeId.forEach((empId) => {
                values.areaId.forEach((areaId) => {
                    dataToInsert.push({ employeeId: empId.id, areaId: areaId.id });
                });
            })

            addEntity({ url: DEFAULT_API, data: dataToInsert }).finally(() => {
                setOpenPopup(false);
            });

        }
    }

    const formData = [
        {
            elementType: "ad_dropdown",
            name: "employeeId",
            label: "Employee",
            required: true,
            isMultiple: true,
            onKeyDown: (e) => e.keyCode == 13 && handleSubmit(),
            validate: {
                errorMessage: "Employee is required",
            },
            dataName: 'fullName',
            options: employees,
            defaultValue: []
        },
        {
            elementType: "ad_dropdown",
            name: "areaId",
            label: "Area",
            required: true,
            isMultiple: true,
            onKeyDown: (e) => e.keyCode == 13 && handleSubmit(),
            validate: {
                errorMessage: "Area is required",
            },
            dataId: 'id',
            dataName: 'name',
            options: areas,
            defaultValue: []
        }


    ];

    return <Popup
        title="Add Geo Location"
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
    return map
}
const Location = () => {
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

    const { updateOneEntity, removeEntity } = useEntityAction();

    const { socketData } = useSocketIo("changeInLocation", refetch);

    const handleEdit = (id) => {
        isEdit.current = true;
        editId = id;

        row.current = data.find(a => a.id === id);
        setOpenPopup(true);
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

    const columns = getColumns(gridApiRef, handleEdit, handelDeleteItems);

    const showAddModal = () => {
        isEdit.current = false;
        setOpenPopup(true);
    }

    return (
        <>

            <AddLocation colData={excelColData} openPopup={openPopup} setOpenPopup={setOpenPopup} isEdit={isEdit.current} row={row.current} />
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



export default Location;