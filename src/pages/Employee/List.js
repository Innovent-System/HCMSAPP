// eslint-disable-next-line react-hooks/exhaustive-deps
import React, { useEffect, useRef, useState } from "react";
import Controls from '../../components/controls/Controls';
import Popup from '../../components/Popup';
import { API, alphabets } from './_Service';
import { useDispatch, useSelector } from 'react-redux';
import { builderFieldsAction, useEntityAction, useEntitiesQuery } from '../../store/actions/httpactions';
import { GridToolbarContainer, Box, Typography, Stack, Link, ButtonGroup } from "../../deps/ui";
import { Circle, Add as AddIcon, Delete as DeleteIcon, PeopleOutline } from "../../deps/ui/icons";
import DataGrid, { useGridApi, getActions } from '../../components/useDataGrid';
import { useSocketIo } from '../../components/useSocketio';
import ConfirmDialog from '../../components/ConfirmDialog';
import PropTypes from 'prop-types'
import EmpoyeeModal from './components/AddEditEmployee';
import PageHeader from '../../components/PageHeader'

const fields = {
    fullName: {
        label: 'Full Name',
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
            field: 'fullName', headerName: 'Employee', flex: 1, hideable: false, renderCell: ({ row }) => (
                <Stack>
                    <Link underline="hover">{row.fullName}</Link>
                    <Typography variant="caption"><strong>Department :</strong>{row.department.departmentName}</Typography>
                    <Typography variant="caption"><strong>Designation :</strong>{row.designation.name}</Typography>
                    <Typography variant="caption"><strong>Group :</strong>{row.group.groupName}</Typography>
                </Stack>
            )
        },
        {
            field: 'detail', headerName: 'Detail', renderCell: ({ row }) => (<Stack>
                <Typography variant="caption"><strong>Company :</strong>{row.company.companyName} </Typography>
                <Typography variant="caption"><strong>Country :</strong>{row.country.name}</Typography>
                <Typography variant="caption"><strong>State :</strong>{row.state.name}</Typography>
                <Typography variant="caption"><strong>City :</strong>{row.city.name}</Typography>
                <Typography variant="caption"><strong>Area :</strong>{row.area.areaName}</Typography>
            </Stack>), flex: 1
        },
        { field: 'modifiedOn', headerName: 'Modified On', flex: 1 },
        { field: 'createdOn', headerName: 'Created On', flex: 1 },
        {
            field: 'isActive', headerName: 'Status', renderCell: ({ row }) => (
                row["isActive"] ? <Circle color="success" /> : <Circle color="disabled" />
            ),
            flex: '0 1 5%',
            align: 'center',
        },
        getActions(apiRef, actionKit)
    ]
}
let editId = 0;

const Employee = () => {
    const dispatch = useDispatch();
    const [openPopup, setOpenPopup] = useState(false);
    const [pageSize, setPageSize] = useState(30);
    const isEdit = React.useRef(false);
    const formApi = React.useRef(null);
    const [selectionModel, setSelectionModel] = React.useState([]);
    const [word, setWord] = useState("");

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

    const [employees, setEmployees] = useState([]);

    const gridApiRef = useGridApi();
    const query = useSelector(e => e.appdata.query.builder);

    const { data, isLoading, status, refetch } = useEntitiesQuery({
        url: API.Employee,
        params: {
            limit: offSet.current.limit,
            lastKeyId: offSet.current.isLoadMore ? offSet.current.lastKeyId : "",
            searchParams: JSON.stringify({
                ...query,
                ...(word && { firstName: {"$regex":`^${word}`,"$options":"i"} })
            })
        }
    });

    const { updateOneEntity, removeEntity } = useEntityAction();

    useEffect(() => {
        if (status === "fulfilled") {
            const { entityData, totalRecord } = data.result;
            if (offSet.current.isLoadMore) {
                setEmployees([...entityData, ...employees]);
            }
            else
                setEmployees(entityData)

            setGridFilter({ ...gridFilter, totalRecord: totalRecord });
            offSet.current.isLoadMore = false;
        }
    }, [data, status])

    const { socketData } = useSocketIo("changeInEmployee", refetch);

    useEffect(() => {
        if (Array.isArray(socketData)) {
            setEmployees(socketData);
        }
    }, [socketData])


    const loadMoreData = (params) => {
        if (employees.length < gridFilter.totalRecord && params.viewportPageSize !== 0) {
            offSet.current.isLoadMore = true;
            setGridFilter({ ...gridFilter, lastKey: employees.length ? employees[employees.length - 1].id : null });
        }
    }

    const handleEdit = (id) => {
        isEdit.current = true;
        editId = id;
        setOpenPopup(true);
    }

    const handleActiveInActive = (id) => {
        updateOneEntity({ url: API.Employee, data: { _id: id } });
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
                removeEntity({ url: API.Employee, params: idTobeDelete }).then(res => {
                    setSelectionModel([]);
                })
            },
        });

    }
    const handleAlphabetSearch = (e) => {
        if (word === e.target.innerText)
            setWord("")
        else
            setWord(e.target.innerText)
    }

    useEffect(() => {
        offSet.current.isLoadFirstTime = false;
        dispatch(builderFieldsAction(fields));
    }, [dispatch])

    const columns = getColumns(gridApiRef, handleEdit, handleActiveInActive, handelDeleteItems);


    const showAddModal = () => {
        isEdit.current = false;
        setOpenPopup(true);
    }

    return (
        <>
            <PageHeader
                title="Employee"
                enableFilter={true}
                subTitle="Manage Employees"
                icon={<PeopleOutline fontSize="large" />}
            />
            <Popup
                title="Add Employee Information"
                openPopup={openPopup}
                maxWidth="xl"
                fullScreen={true}
                isEdit={isEdit.current}
                footer={<></>}
                // addOrEditFunc={handleSubmit}
                setOpenPopup={setOpenPopup}>
                <EmpoyeeModal isEdit={isEdit.current} editId={editId} setOpenPopup={setOpenPopup} formRef={formApi} />
            </Popup>
            <ButtonGroup fullWidth >
                {alphabets.map(alpha => (
                    <Controls.Button onClick={handleAlphabetSearch} color="inherit" key={alpha} text={alpha} />
                ))}
            </ButtonGroup>
            <DataGrid apiRef={gridApiRef}
                columns={columns} rows={employees}
                loading={isLoading} pageSize={pageSize}
                totalCount={offSet.current.totalRecord}
                rowHeight={100}
                toolbarProps={{
                    apiRef: gridApiRef,
                    onAdd: showAddModal,
                    onDelete: handelDeleteItems,
                    selectionModel
                }}
                gridToolBar={EmployeeToolbar}
                selectionModel={selectionModel}
                setSelectionModel={setSelectionModel}
                onRowsScrollEnd={loadMoreData}
            />
            <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
        </>
    );
}
export default Employee;

function EmployeeToolbar(props) {
    const { apiRef, onAdd, onDelete, selectionModel } = props;

    return (
        <GridToolbarContainer sx={{ justifyContent: "flex-end" }}>
            {selectionModel?.length ? <Controls.Button onClick={() => onDelete(selectionModel)} startIcon={<DeleteIcon />} text="Delete Items" /> : null}
            <Controls.Button onClick={onAdd} startIcon={<AddIcon />} text="Add record" />
        </GridToolbarContainer>
    );
}

EmployeeToolbar.propTypes = {
    apiRef: PropTypes.shape({
        current: PropTypes.object,
    }),
    onAdd: PropTypes.func,
    onDelete: PropTypes.func,
    selectionModel: PropTypes.array
};