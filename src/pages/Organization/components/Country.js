// eslint-disable-next-line react-hooks/exhaustive-deps
import React, { useEffect, useRef, useState } from "react";
import Controls from '../../../components/controls/Controls';
import Popup from '../../../components/Popup';
import { AutoForm } from '../../../components/useForm';
import { API } from '../_Service';
import { useDispatch, useSelector } from 'react-redux';
import { useEntitiesQuery, useEntityAction, handleGetActions, enableFilterAction, builderFieldsAction } from '../../../store/actions/httpactions';
import { GridToolbarContainer, Box } from "../../../deps/ui";
import { Circle, Add as AddIcon, Delete as DeleteIcon } from "../../../deps/ui/icons";
import DataGrid, { useGridApi, getActions } from '../../../components/useDataGrid';
import { useSocketIo } from '../../../components/useSocketio';
import ConfirmDialog from '../../../components/ConfirmDialog';
import PropTypes from 'prop-types'

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
const Country = () => {
    const dispatch = useDispatch();
    const [openPopup, setOpenPopup] = useState(false);
    const [pageSize, setPageSize] = useState(30);
    const isEdit = React.useRef(false);
    const formApi = React.useRef(null);
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
    const [countryData, setCountryData] = useState([]);


    const gridApiRef = useGridApi();
    const query = useSelector(e => e.appdata.query.builder);
    const Companies = useSelector(e => e.appdata.DropDownData?.Companies);


    const { data, isLoading, status, refetch } = useEntitiesQuery({
        url: API.COUNTRY,
        params: {
            limit: offSet.current.limit,
            lastKeyId: offSet.current.isLoadMore ? offSet.current.lastKeyId : "",
            searchParams: JSON.stringify(query)
        }
    });

    const { addEntity, updateOneEntity, removeEntity } = useEntityAction();

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
        const { setFormValue } = formApi.current;

        const companydata = countries.find(a => a.id === id);
        setFormValue({
            companyName: companydata.companyName
        });
        setOpenPopup(true);
    }

    const handleActiveInActive = (id) => {
        updateOneEntity({ url: API.COUNTRY, data: { _id: id } });
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
                removeEntity({ url: API.COUNTRY, params: idTobeDelete }).then(res => {
                    setSelectionModel([]);
                })
            },
        });

    }


    useEffect(() => {
        offSet.current.isLoadFirstTime = false;

        dispatch(enableFilterAction(false));
        dispatch(builderFieldsAction(fields));
        dispatch(handleGetActions(API.ALL_COUNTRY)).then(res => {
            setCountryData(res.data);
        });

    }, [dispatch])

    const columns = getColumns(gridApiRef, handleEdit, handleActiveInActive, handelDeleteItems);

    const handleSubmit = (e) => {
        const { getValue, validateFields } = formApi.current
        if (validateFields()) {
            let values = getValue();
            let dataToInsert = values.country;
            dataToInsert._id = null;
            dataToInsert.fkCompanyId = values.company._id;
            if (isEdit.current)
                dataToInsert._id = editId

            addEntity({ url: API.COUNTRY, data: [dataToInsert] });
        }
    }

    const formData = [
        {
            elementType: "ad_dropdown",
            name: "country",
            label: "Country",
            required: true,
            validate: {
                errorMessage: "Country is required",
            },
            dataName: 'name',
            options: countryData,
            defaultValue: null
        },
        {
            elementType: "ad_dropdown",
            name: "company",
            label: "Company",
            required: true,
            validate: {
                errorMessage: "Company is required",
            },
            dataName: 'companyName',
            options: Companies,
            defaultValue: null
        },
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
                title="Add Country"
                openPopup={openPopup}
                maxWidth="sm"
                isEdit={isEdit.current}
                keepMounted={true}
                addOrEditFunc={handleSubmit}
                setOpenPopup={setOpenPopup}>
                <AutoForm formData={formData} ref={formApi} isValidate={true} />
            </Popup>
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
                gridToolBar={CountryToolbar}
                selectionModel={selectionModel}
                setSelectionModel={setSelectionModel}
                onRowsScrollEnd={loadMoreData}
            />
            <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
        </>
    );
}
export default Country;

function CountryToolbar(props) {
    const { apiRef, onAdd, onDelete, selectionModel } = props;

    return (
        <>
            <GridToolbarContainer sx={{ justifyContent: "flex-end" }}>

                <Box >
                    {selectionModel?.length ? <Controls.Button onClick={() => onDelete(selectionModel)} startIcon={<DeleteIcon />} text="Delete Items" /> : null}
                    <Controls.Button onClick={onAdd} startIcon={<AddIcon />} text="Add record" />
                </Box>
            </GridToolbarContainer>
        </>

    );
}

CountryToolbar.propTypes = {
    apiRef: PropTypes.shape({
        current: PropTypes.object,
    }).isRequired,
    onAdd: PropTypes.func,
    onDelete: PropTypes.func,
    selectionModel: PropTypes.array
};