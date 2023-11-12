// eslint-disable-next-line react-hooks/exhaustive-deps
import React, { useEffect, useRef, useState } from "react";
import Popup from '../../../components/Popup';
import { AutoForm } from '../../../components/useForm';
import { API } from '../_Service';
import { useDispatch, useSelector } from 'react-redux';
import { useEntitiesQuery, useEntityAction, enableFilterAction, builderFieldsAction, useLazySingleQuery } from '../../../store/actions/httpactions';

import { Circle } from "../../../deps/ui/icons";
import DataGrid, { useGridApi, getActions, GridToolbar } from '../../../components/useDataGrid';
import { useSocketIo } from '../../../components/useSocketio';
import ConfirmDialog from '../../../components/ConfirmDialog';

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
const getColumns = (apiRef, onEdit, onActive, onDelete) => {
    const actionKit = {
        onActive: onActive,
        onEdit: onEdit,
        onDelete: onDelete
    }
    return [
        { field: '_id', headerName: 'Id', hide: true },
        {
            field: 'name', headerName: 'Country', width: 180
        },
        {
            field: 'company', headerName: 'Company', width: 180, valueGetter: ({ row }) => row.company.companyName
        },
        { field: 'modifiedOn', headerName: 'Modified On' },
        { field: 'createdOn', headerName: 'Created On' },
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
    const Companies = useSelector(e => e.appdata.DropDownData?.Companies);
    const dispatch = useDispatch();
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
        // keepMounted={true}
        addOrEditFunc={handleSubmit}
        setOpenPopup={setOpenPopup}>
        <AutoForm formData={formData} ref={formApi} isValidate={true} />
    </Popup>
}

const Country = () => {
    const dispatch = useDispatch();
    const [openPopup, setOpenPopup] = useState(false);
    const [pageSize, setPageSize] = useState(30);
    const isEdit = React.useRef(false);
    const row = useRef(null);
    const [selectionModel, setSelectionModel] = React.useState([]);
    const offSet = useRef({
        isLoadMore: false,
        isLoadFirstTime: true,
    })

    const [filter, setFilter] = useState({
        lastKey: null,
        limit: 10,
        totalRecord: 0
    })


    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        title: "",
        subTitle: "",
    });

    const [countries, setCountry] = useState([]);

    const gridApiRef = useGridApi();
    const query = useSelector(e => e.appdata.query.builder);

    const { data, isLoading, status, refetch } = useEntitiesQuery({
        url: DEFAULT_API,
        params: {
            limit: offSet.current.limit,
            lastKeyId: offSet.current.isLoadMore ? offSet.current.lastKeyId : "",
            searchParams: JSON.stringify(query)
        }
    });

    const { updateOneEntity, removeEntity } = useEntityAction();

    useEffect(() => {
        if (status === "fulfilled") {
            const { entityData, totalRecord } = data.result;
            if (offSet.current.isLoadMore) {
                setCountry([...entityData, ...countries]);
            }
            else
                setCountry(entityData)

            setFilter({ ...filter, totalRecord: totalRecord });
            offSet.current.isLoadMore = false;
        }

    }, [data, status])


    const { socketData } = useSocketIo("changeInCountry", refetch);
    useEffect(() => {
        if (Array.isArray(socketData)) {
            setCountry(socketData);
        }
    }, [socketData])


    const loadMoreData = (params) => {
        if (countries.length < filter.totalRecord && params.viewportPageSize !== 0) {
            offSet.current.isLoadMore = true;
            setFilter({ ...filter, lastKey: countries.length ? countries[countries.length - 1].id : null });
        }
    }

    const handleEdit = (id) => {
        isEdit.current = true;
        editId = id;
        const rowData = countries.find(a => a.id === id);
        row.current = rowData;
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
        offSet.current.isLoadFirstTime = false;
        dispatch(enableFilterAction(false));
        dispatch(builderFieldsAction(fields));
    }, [dispatch])

    const columns = getColumns(gridApiRef, handleEdit, handleActiveInActive, handelDeleteItems);


    const showAddModal = () => {
        isEdit.current = false;
        setOpenPopup(true);
    }

    return (
        <>
            <AddCountry openPopup={openPopup} setOpenPopup={setOpenPopup} row={row.current} isEdit={isEdit.current} />
            <DataGrid apiRef={gridApiRef}
                columns={columns} rows={countries}
                loading={isLoading}
                pageSize={pageSize}
                toolbarProps={{
                    apiRef: gridApiRef,
                    onAdd: showAddModal,
                    onDelete: handelDeleteItems,
                    selectionModel
                }}
                gridToolBar={GridToolbar}
                selectionModel={selectionModel}
                setSelectionModel={setSelectionModel}
                onRowsScrollEnd={loadMoreData}
            />
            <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
        </>
    );
}
export default Country;