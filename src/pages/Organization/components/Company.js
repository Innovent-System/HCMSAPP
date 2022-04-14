// eslint-disable-next-line react-hooks/exhaustive-deps
import React, { useEffect, useRef, useState } from "react";
import Controls from '../../../components/controls/Controls';
import Popup from '../../../components/Popup';
import { AutoForm } from '../../../components/useForm';
import { API } from '../_Service';
import { useDispatch, useSelector } from 'react-redux';
import { handleGetActions, handlePostActions, handlePatchActions, handleDeleteActions } from '../../../store/actions/httpactions';
import { useFilterBarEvent } from "../../../components/useDropDown";
import { GridToolbarContainer, Box } from "../../../deps/ui";
import { Circle, Add as AddIcon, Delete as DeleteIcon } from "../../../deps/ui/icons";
import DataGrid, { useGridApi, getActions } from '../../../components/useDataGrid';
import { useSocketIo } from '../../../components/useSocketio';
import ConfirmDialog from '../../../components/ConfirmDialog';
import { SET_QUERY_FIELDS, ENABLE_FILTERS } from '../../../store/actions/types'
import PropTypes from 'prop-types'

const fields = {
    companyName: {
        label: 'Company',
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
            field: 'companyName', headerName: 'Company', width: 180
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
const Company = () => {
    const dispatch = useDispatch();
    const [openPopup, setOpenPopup] = useState(false);
    const [pageSize, setPageSize] = useState(30);
    const isEdit = React.useRef(false);
    const formApi = React.useRef(null);
    const [loader, setloader] = useState(false);
    const [selectionModel, setSelectionModel] = React.useState([]);
    const offSet = useRef({
        limit: 10,
        lastKeyId: null,
        totalRecord: 0,
        isLoadFirstTime: true,
    })


    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        title: "",
        subTitle: "",
    });

    const [company, setCompany] = useState([]);

    const gridApiRef = useGridApi();
    const query = useSelector(e => e.query.builder);

    const getCompanyData = (pageSize = 10, isLoadMore = false) => {
        setloader(true);
        dispatch(handleGetActions(API.GET_COMPANY, {
            limit: pageSize,
            lastKeyId: isLoadMore ? offSet.current.lastKeyId : null,
            searchParams: query ?? null
        })).then(res => {
            if (res.data) {
                offSet.current.totalRecord = res.data.totalRecord;
                offSet.current.lastKeyId = res.data.entityData?.length ? res.data.entityData[res.data.entityData.length - 1].id : null;
                setloader(false);
                if (isLoadMore)
                    setCompany([...res.data.entityData, ...company]);
                else
                    setCompany(res.data.entityData)
            }
        });
    }

    const { socketData } = useSocketIo("changeInCompany", getCompanyData);
    useEffect(() => {
        if (Array.isArray(socketData)) {
            setCompany(socketData);
        }
    }, [socketData])

    useFilterBarEvent(getCompanyData, getCompanyData);

    const loadMoreData = (params) => {
        if (company.length < offSet.current.totalRecord && params.viewportPageSize !== 0) {
            getCompanyData(params.viewportPageSize, true);
        }
    }

    const handleEdit = (id) => {
        isEdit.current = true;
        editId = id;
        const { setFormValue } = formApi.current;

        const companydata = company.find(a => a.id === id);
        setFormValue({
            companyName: companydata.companyName
        });
        setOpenPopup(true);


    }

    const handleActiveInActive = (id) => {
        dispatch(handlePatchActions(API.ACTIVE_INACTIVE_COMPANY, { _id: id }));
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
                dispatch(handleDeleteActions(API.DELETE_COMPANY, idTobeDelete)).then(res => {
                    setSelectionModel([]);
                })
            },
        });

    }


    useEffect(() => {
        offSet.current.isLoadFirstTime = false;
        getCompanyData();
        dispatch({ type: ENABLE_FILTERS, payload: false })

        dispatch({
            type: SET_QUERY_FIELDS, payload: {
                fields
            }
        })
    }, [dispatch])

    const columns = getColumns(gridApiRef, handleEdit, handleActiveInActive, handelDeleteItems);

    const handleSubmit = (e) => {
        const { getValue, validateFields } = formApi.current
        if (validateFields()) {
            let values = getValue();
            let dataToInsert = {};
            dataToInsert.companyName = values.companyName;
            if (isEdit.current)
                dataToInsert._id = editId

            dispatch(handlePostActions(API.INSERT_UPDATE_COMPANY, [dataToInsert]));
        }
    }

    const formData = [
        {
            elementType: "inputfield",
            name: "companyName",
            label: "Company",
            required: true,
            validate: {
                errorMessage: "Company is required"
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
                title="Add Company"
                openPopup={openPopup}
                maxWidth="sm"
                isEdit={isEdit.current}
                keepMounted={true}
                addOrEditFunc={handleSubmit}
                setOpenPopup={setOpenPopup}>
                <AutoForm formData={formData} ref={formApi} isValidate={true} />
            </Popup>
            <DataGrid apiRef={gridApiRef}
                columns={columns} rows={company}
                loading={loader} pageSize={pageSize}
                onAdd={showAddModal}
                onDelete={handelDeleteItems}
                getData={getCompanyData}
                toolbarProps={{
                    apiRef: gridApiRef,
                    onAdd: showAddModal,
                    onDelete: handelDeleteItems,
                    selectionModel
                }}
                gridToolBar={CompanyToolbar}
                selectionModel={selectionModel}
                setSelectionModel={setSelectionModel}
                onRowsScrollEnd={loadMoreData}
            />
            <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
        </>
    );
}
export default Company;

function CompanyToolbar(props) {
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

CompanyToolbar.propTypes = {
    apiRef: PropTypes.shape({
        current: PropTypes.object.isRequired,
    }).isRequired,
    onAdd: PropTypes.func,
    onDelete: PropTypes.func,
    selectionModel: PropTypes.array
};