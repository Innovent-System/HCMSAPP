// eslint-disable-next-line react-hooks/exhaustive-deps
import React, { useEffect, useRef, useState } from "react";
import Popup from '../../components/Popup';
import { AutoForm } from '../../components/useForm';
import { API } from './_Service';
import { enableFilterAction, builderFieldsAction, showDropDownFilterAction, useEntitiesQuery, useEntityAction } from '../../store/actions/httpactions';
import { useDropDown, useDropDownIds } from "../../components/useDropDown";
import { Circle, Add as AddIcon, Delete as DeleteIcon, PeopleOutline } from "../../deps/ui/icons";
import DataGrid, { useGridApi, getActions, GridToolbar } from '../../components/useDataGrid';
import { useSocketIo } from '../../components/useSocketio';
import { useAppDispatch, useAppSelector } from "../../store/storehook";
import PageHeader from '../../components/PageHeader'
import ConfirmDialog from '../../components/ConfirmDialog';
import { formateISODate, formateISODateTime } from "../../services/dateTimeService";


const fields = {
    areaName: {
        label: 'Area',
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
            field: 'title', headerName: 'Name', flex: 1, hideable: false
        },
        { field: 'holidayDate', headerName: 'Date', flex: 1, valueGetter: ({ row }) => formateISODate(row.holidayDate) },
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
const DEFAULT_API = API.Gazetted;
export const AddGazettedHoliday = ({ openPopup, setOpenPopup, isEdit = false, row = null }) => {
    const { addEntity } = useEntityAction();
    const formApi = useRef(null);
    const { countries, cities, states, areas, groups, employees, filterType, setFilter } = useDropDown();

    useEffect(() => {
        if (!formApi.current || !openPopup) return;
        const { resetForm, setFormValue } = formApi.current;
        if (openPopup && !isEdit)
            resetForm();
        else {

            setFormValue({
                fkCountryId: countries.filter(c => row.fkCountryId.includes(c._id)),
                fkStateId: states.filter(s => row.fkStateId.includes(s._id)),
                fkCityId: cities.filter(ct => row.fkCityId.includes(ct._id)),
                fkAreaId: areas.filter(a => row.fkAreaId.includes(a._id)),
                fkGroupId: groups.filter(g => row.fkGroupId.includes(g._id)),
                exemptedEmployees: employees.filter(e => row.exemptedEmployees.includes(e._id)),
                title: row.title
            });
            // setFilter(countries.filter(c => row.fkCountryId.includes(c._id)), filterType.COUNTRY, "id", (data) => {
            //     const { states, cities, areas } = data;

            // });
        }
    }, [openPopup, formApi])

    const handleSubmit = (e) => {
        const { getValue, validateFields } = formApi.current
        if (validateFields()) {
            let values = getValue();
            let dataToInsert = { ...values };

            dataToInsert.fkCountryId = dataToInsert.fkCountryId.map(c => c._id);
            dataToInsert.fkStateId = dataToInsert.fkStateId.map(c => c._id);
            dataToInsert.fkCityId = dataToInsert.fkCityId.map(c => c._id);
            dataToInsert.fkAreaId = dataToInsert.fkAreaId.map(c => c._id);
            dataToInsert.fkGroupId = dataToInsert.fkGroupId.map(c => c._id);
            if (isEdit)
                dataToInsert._id = editId

            addEntity({ url: DEFAULT_API, data: [dataToInsert] }).then(r => {
                if (r?.data) setOpenPopup(false);
            });
        }
    }

    const formData = [
        {
            elementType: "inputfield",
            name: "title",
            label: "Title",
            required: true,
            onKeyDown: (e) => e.keyCode == 13 && handleSubmit(),
            validate: {
                errorMessage: "Title is required"
            },
            defaultValue: ""
        },
        {
            elementType: "datetimepicker",
            name: "holidayDate",
            required: true,
            // disableFuture: true,
            validate: {
                errorMessage: "Select Date please",
            },
            label: "Date",
            defaultValue: new Date()
        },
        {
            elementType: "ad_dropdown",
            name: "fkCountryId",
            isMultiple: true,
            label: "Country",
            dataName: 'name',
            options: countries,
            onChange: (data) => setFilter(data, filterType.COUNTRY, "id"),
            defaultValue: []
        },
        {
            elementType: "ad_dropdown",
            name: "fkStateId",
            label: "State",
            isMultiple: true,
            dataName: "name",
            options: states,
            onChange: (data) => setFilter(data, filterType.STATE, "id"),
            defaultValue: []
        },
        {
            elementType: "ad_dropdown",
            name: "fkCityId",
            label: "City",
            isMultiple: true,
            dataName: "name",
            onChange: (data) => setFilter(data, filterType.CITY, "_id"),
            options: cities,
            defaultValue: []
        },
        {
            elementType: "ad_dropdown",
            name: "fkAreaId",
            label: "Area",
            required: true,
            validate: {
                errorMessage: "Area is required",
            },
            dataId: '_id',
            dataName: "areaName",
            onChange: (data) => setFilter(data, filterType.AREA, "_id"),
            options: areas,
            isMultiple: true,
            defaultValue: []
        },
        {
            elementType: "ad_dropdown",
            name: "fkGroupId",
            label: "Group",
            required: true,
            validate: {
                errorMessage: "Group is required",
            },
            isMultiple: true,
            // onChange: (data) => setFilter(data, filterType.GROUP, "_id"),
            dataId: '_id',
            dataName: "groupName",
            options: groups,
            defaultValue: []
        },
        {
            elementType: "ad_dropdown",
            name: "exemptedEmployees",
            label: "Exempted Employees",
            isMultiple: true,
            dataId: '_id',
            dataName: "fullName",
            options: employees,
            defaultValue: []
        }
    ];

    return <Popup
        title="Add Gazetted Holiday"
        openPopup={openPopup}
        maxWidth="md"
        isEdit={isEdit}
        keepMounted={true}
        addOrEditFunc={handleSubmit}
        setOpenPopup={setOpenPopup}>
        <AutoForm formData={formData} ref={formApi} isValidate={true} />
    </Popup>

}

const GazettedHoliday = () => {
    const dispatch = useAppDispatch();
    const [openPopup, setOpenPopup] = useState(false);

    const isEdit = React.useRef(false);
    const row = useRef(null);
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
    const { countryIds, stateIds, cityIds } = useDropDownIds();

    const { data, isLoading, refetch, totalRecord } = useEntitiesQuery({
        url: `${DEFAULT_API}/get`,
        data: {
            limit: filter.limit,
            page: filter.page + 1,
            lastKeyId: filter.lastKey,
            ...sort,
            searchParams: {
                ...query,
                ...(countryIds && { "country.country_id": countryIds }),
                ...(stateIds && { "state.state_id": stateIds }),
                ...(cityIds && { "city.city_id": cityIds })
            }
        }
    }, { selectFromResult: ({ data, isLoading }) => ({ data: data?.entityData, totalRecord: data?.totalRecord, isLoading }) });


    const { updateOneEntity, removeEntity } = useEntityAction();

    const { socketData } = useSocketIo("changeInGazetted", refetch);

    const handleEdit = (id) => {
        isEdit.current = true;
        editId = id;
        row.current = data.find(a => a.id === id);
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
        dispatch(showDropDownFilterAction({
            country: true,
            state: true,
            city: true
        }))
        dispatch(enableFilterAction(true));
        dispatch(builderFieldsAction(fields))

    }, [dispatch])

    const columns = getColumns(gridApiRef, handleEdit, handleActiveInActive, handelDeleteItems);

    const showAddModal = () => {
        isEdit.current = false;
        setOpenPopup(true);
    }

    return (
        <>
            <PageHeader
                title="Gazetted Holiday"
                subTitle="Manage Holiday"
                icon={<PeopleOutline fontSize="large" />}
            />
            <AddGazettedHoliday openPopup={openPopup} setOpenPopup={setOpenPopup} row={row.current} isEdit={isEdit.current} />
            <DataGrid apiRef={gridApiRef}
                columns={columns} rows={data}
                loading={isLoading}
                totalCount={totalRecord}
                pageSize={filter.limit}
                page={filter.page}
                setFilter={setFilter}
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
export default GazettedHoliday;