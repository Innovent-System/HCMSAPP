
import React, { useEffect, useRef, useState } from "react";
import Popup from '../../../components/Popup';
import { AutoForm } from '../../../components/useForm';
import { API } from '../_Service';
import { useEntitiesQuery, useEntityAction, enableFilterAction, builderFieldsAction, useLazySingleQuery } from '../../../store/actions/httpactions';
import { Circle } from "../../../deps/ui/icons";
import DataGrid, { useGridApi, getActions, GridToolbar } from '../../../components/useDataGrid';
import { useSocketIo } from '../../../components/useSocketio';
import ConfirmDialog from '../../../components/ConfirmDialog';
import { useAppDispatch, useAppSelector } from "../../../store/storehook";

const fields = {
    name: {
        label: 'Country',
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
 * 
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
        { field: '_id', headerName: 'Id', hide: true },
        {
            field: 'name', headerName: 'Name', width: 180
        },
        {
            field: 'company', headerName: 'Company', width: 180, valueGetter: ({ row }) => row.company.companyName
        },
        { field: 'modifiedOn', headerName: 'Modified On' },
        { field: 'createdOn', headerName: 'Created On', sortingOrder: ["desc"] },
        {
            field: 'isActive', headerName: 'Status', renderCell: (param) => (
                param.row["isActive"] ? <Circle color="success" /> : <Circle color="disabled" />
            ),
            flex: '0 1 5%',
            align: 'center',
        },
        getActions(apiRef, actionKit)
    ]
}
let editId = 0;
const DEFAULT_API = API.COUNTRY;
export const AddCountry = ({ openPopup, setOpenPopup, isEdit = false, row = null }) => {
    const formApi = useRef(null);
    const Companies = useAppSelector(e => e.appdata.DropDownData?.Companies);
    const dispatch = useAppDispatch();
    const [getAllCountry] = useLazySingleQuery()
    const [countryData, setCountryData] = useState([]);
    useEffect(() => {
        getAllCountry({ url: API.ALL_COUNTRY }).then(res => {
            setCountryData(res.data?.result || []);
        });
    }, [])

    useEffect(() => {
        if (!formApi.current || !openPopup) return;
        const { resetForm, setFormValue } = formApi.current;
        if (openPopup && !isEdit)
            resetForm();
        else {
            const { fkCompanyId, intId } = row;
            setFormValue({
                company: Companies.find(c => c._id === fkCompanyId),
                country: countryData.find(c => c.id === intId)
            });
        }
    }, [openPopup, formApi])

    const formData = [
        {
            elementType: "ad_dropdown",
            name: "company",
            label: "Company",
            required: true,
            onKeyDown: (e) => e.keyCode == 13 && handleSubmit(),
            validate: {
                errorMessage: "Company is required",
            },
            dataName: 'companyName',
            options: Companies,
            defaultValue: null
        },
        {
            elementType: "ad_dropdown",
            name: "country",
            label: "Country",
            onKeyDown: (e) => e.keyCode == 13 && handleSubmit(),
            required: true,
            validate: {
                errorMessage: "Country is required",
            },
            dataName: 'name',
            options: countryData,
            defaultValue: null
        }
    ];

    const { addEntity } = useEntityAction();

    const handleSubmit = (e) => {
        const { getValue, validateFields } = formApi.current
        if (validateFields()) {
            let values = getValue();
            const { _id, ...country } = values.country;
            let dataToInsert = country;
            dataToInsert.fkCompanyId = values.company._id;
            if (isEdit)
                dataToInsert._id = editId

            addEntity({ url: DEFAULT_API, data: [dataToInsert] }).then(r => {
                if (r?.data) setOpenPopup(false);
            });
        }
    }

    return <Popup
        title="Country"
        openPopup={openPopup}
        maxWidth="sm"
        isEdit={isEdit}
        keepMounted={true}
        addOrEditFunc={handleSubmit}
        setOpenPopup={setOpenPopup}>
        <AutoForm formData={formData} ref={formApi} isValidate={true} />
    </Popup>
}

const Country = () => {
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

    const { data, isLoading, refetch, totalRecord } = useEntitiesQuery({
        url: `${DEFAULT_API}/get`,
        data: {
            limit: filter.limit,
            page: filter.page + 1,
            lastKeyId: filter.lastKey,
            ...sort,
            searchParams: { ...query }
        }
    }, { selectFromResult: ({ data, isLoading }) => ({ data: data?.entityData, totalRecord: data?.totalRecord, isLoading }) });

    const { updateOneEntity, removeEntity } = useEntityAction();

    const { socketData } = useSocketIo("changeInCountry", refetch);

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
            <AddCountry openPopup={openPopup} setOpenPopup={setOpenPopup} row={row.current} isEdit={isEdit.current} />
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
export default Country;