// eslint-disable-next-line react-hooks/exhaustive-deps
import React, { useEffect, useRef, useState } from "react";
import Controls from '../../../../components/controls/Controls';
import Popup from '../../../../components/Popup';
import { AutoForm } from '../../../../components/useForm';
import { API } from '../../_Service';
import { useDispatch, useSelector } from 'react-redux';
import { builderFieldsAction, useEntityAction, useEntitiesQuery, enableFilterAction } from '../../../../store/actions/httpactions';
import { GridToolbarContainer, Box } from "../../../../deps/ui";
import { Circle, Add as AddIcon, Delete as DeleteIcon } from "../../../../deps/ui/icons";
import DataGrid, { useGridApi, getActions } from '../../../../components/useDataGrid';
import { useSocketIo } from '../../../../components/useSocketio';
import ConfirmDialog from '../../../../components/ConfirmDialog';
import PropTypes from 'prop-types'

const fields = {
    name: {
        label: 'Designation',
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
        { field: '_id', headerName: 'Id', hide: true, hideable: false },
        {
            field: 'name', headerName: 'Designation', width: 180, hideable: false
        },
        { field: 'modifiedOn', headerName: 'Modified On', hideable: false },
        { field: 'createdOn', headerName: 'Created On', hideable: false },
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
const DEFAUL_API = API.Designation;
let editId = 0;
const Designation = () => {
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

    const [records, setRecords] = useState([]);

    const gridApiRef = useGridApi();
    const query = useSelector(e => e.appdata.query.builder);

    const { data, status, isLoading, refetch } = useEntitiesQuery({
        url: DEFAUL_API,
        params: {
            limit: filter.limit,
            lastKeyId: filter.lastKey,
            searchParams: JSON.stringify(query)
        }
    });

    const { addEntity, updateOneEntity, removeEntity } = useEntityAction();

    useEffect(() => {
        if (status === "fulfilled") {
            const { entityData, totalRecord } = data.result;
            if (offSet.current.isLoadMore) {
                setRecords([...entityData, ...records]);
            }
            else
                setRecords(entityData)

            setFilter({ ...filter, totalRecord: totalRecord });
            offSet.current.isLoadMore = false;
        }

    }, [data, status])

    const { socketData } = useSocketIo("changeInDesignation", refetch);

    useEffect(() => {
        if (Array.isArray(socketData)) {
            setRecords(socketData);
        }
    }, [socketData])

    const loadMoreData = (params) => {
        if (records.length < filter.totalRecord && params.viewportPageSize !== 0) {
            offSet.current.isLoadMore = true;
            setFilter({ ...filter, lastKey: records.length ? records[records.length - 1].id : null });
        }
    }

    const handleEdit = (id) => {
        isEdit.current = true;
        editId = id;
        const { setFormValue } = formApi.current;

        const data = records.find(a => a.id === id);
        setFormValue({
            name: data.name
        });
        setOpenPopup(true);
    }

    const handleActiveInActive = (id) => {
        updateOneEntity({ url: DEFAUL_API, data: { _id: id } });
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
                removeEntity({ url: DEFAUL_API, params: idTobeDelete }).then(res => {
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

    const handleSubmit = (e) => {
        const { getValue, validateFields } = formApi.current
        if (validateFields()) {
            let values = getValue();
            let dataToInsert = {};
            dataToInsert.name = values.name;
            if (isEdit.current)
                dataToInsert._id = editId

            addEntity({ url: DEFAUL_API, data: [dataToInsert] });

        }
    }

    const formData = [
        {
            elementType: "inputfield",
            name: "name",
            label: "Designation",
            required: true,
            validate: {
                errorMessage: "Designation is required"
            },
            defaultValue: ""
        }
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
                title="Add Designation"
                openPopup={openPopup}
                maxWidth="sm"
                isEdit={isEdit.current}
                keepMounted={true}
                addOrEditFunc={handleSubmit}
                setOpenPopup={setOpenPopup}>
                <AutoForm formData={formData} ref={formApi} isValidate={true} />
            </Popup>
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
                gridToolBar={DesignationToolbar}
                selectionModel={selectionModel}
                setSelectionModel={setSelectionModel}
                onRowsScrollEnd={loadMoreData}
            />
            <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
        </>
    );
}
export default Designation;

function DesignationToolbar(props) {
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

DesignationToolbar.propTypes = {
    apiRef: PropTypes.shape({
        current: PropTypes.object,
    }).isRequired,
    onAdd: PropTypes.func,
    onDelete: PropTypes.func,
    selectionModel: PropTypes.array
};