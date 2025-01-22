// eslint-disable-next-line react-hooks/exhaustive-deps
import React, { useEffect, useRef, useState, useId } from "react";
import Controls from '../components/controls/Controls';
import Popup from '../components/Popup';
import { AutoForm } from '../components/useForm';
import { builderFieldsAction, useEntityAction, useEntitiesQuery, enableFilterAction } from '../store/actions/httpactions';
import { GridToolbarContainer, GridActionsCellItem, Box } from "../deps/ui";
import { Circle, Add as AddIcon, Delete as DeleteIcon, Check, ToggleOn, Edit, North, South } from "../deps/ui/icons";
import DataGrid, { useGridApi, getActions } from '../components/useDataGrid';
import { useSocketIo } from '../components/useSocketio';
import ConfirmDialog from '../components/ConfirmDialog';
import PropTypes from 'prop-types'
import { GET_STAGES, STAGES_REORDER } from "../services/UrlService";
import Auth from '../services/AuthenticationService';
import { useDropDown } from "../components/useDropDown";
import { formateISODateTime } from "../services/dateTimeService";
import { useAppDispatch, useAppSelector } from "../store/storehook";

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

const getColumns = (apiRef, onEdit, onActive) => {
    const actionKit = {
        onActive: onActive,
        onEdit: onEdit
    }
    return [
        { field: '_id', headerName: 'Id', hide: true, hideable: false },
        { field: 'name', headerName: 'Stage Name', width: 180, hideable: false },
        { field: 'orderNo', headerName: 'Order No', hideable: false },
        { field: 'isDepartmentHead', headerName: 'Department Head', renderCell: ({ row }) => (row["isDepartmentHead"] ? <Check color="success" /> : "--") },
        { field: 'isAreaHead', headerName: 'Area Head', renderCell: ({ row }) => (row["isAreaHead"] ? <Check color="success" /> : "--") },
        { field: 'isHrManager', headerName: 'HR Manager', renderCell: ({ row }) => (row["isHrManager"] ? <Check color="success" /> : "--") },
        { field: 'isLineManager', headerName: 'Line Manager', renderCell: ({ row }) => (row["isLineManager"] ? <Check color="success" /> : "--") },
        { field: 'levelOfManagers', headerName: 'No Of Manager' },
        { field: 'modifiedOn', headerName: 'Modified On', valueGetter: ({ row }) => formateISODateTime(row.modifiedOn) },
        { field: 'createdOn', headerName: 'Created On', valueGetter: ({ row }) => formateISODateTime(row.createdOn) },
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
const DEFAULT_API = GET_STAGES;
let editId = 0;
const stages = [{ id: 1, title: "Line Manager" },
{ id: 2, title: "Hr Manager" },
{ id: 3, title: "Area Head" },
{ id: 4, title: "Department Head" },
{ id: 5, title: "Specific Employee" }
]
const ModuleSetting = {
    "ATTENDANCE": [12, 13],
    "EMPLOYEE": [4],
    "LEAVE": [17],
    "PAYROLL": [26, 28, 29, 30, 31]
}
export const AddApprovalStages = ({ openPopup, setOpenPopup, isEdit = false, formId, row = null }) => {
    const formApi = useRef(null);
    const { addEntity } = useEntityAction();
    const { employees } = useDropDown();
    const routes = useAppSelector(e => e.appdata.routeData.appRoutes);
    useEffect(() => {
        if (!formApi.current || !openPopup) return;
        const { resetForm, setFormValue } = formApi.current;
        if (openPopup && !isEdit)
            resetForm();
        else {
            let stage, fkEmployeeId;
            if (row.isLineManager)
                stage = 1;
            else if (row.isHrManager)
                stage = 2;
            else if (row.isAreaHead)
                stage = 3;
            else if (row.isDepartmentHead)
                stage = 4;
            else {
                stage = 5;
                fkEmployeeId = employees.find(e => e._id === row.fkEmployeeId)
            }

            setFormValue({
                name: row.name,
                orderNo: row.orderNo,
                noOfManager: row.levelOfManagers ?? "",
                fkEmployeeId: fkEmployeeId ?? null,
                stages: stage
            });
        }
    }, [openPopup, formApi])
    const handleSubmit = (e) => {
        const { getValue, validateFields } = formApi.current
        if (validateFields()) {
            let values = getValue();
            let dataToInsert = {
                applicationFormId: formId,
                formName: routes.find(c => c._id === formId).title,
                name: values.name,
                isLineManager: values.stages == 1,
                isDepartmentHead: values.stages == 4,
                orderNo: values.orderNo,
                isAreaHead: values.stages == 3,
                isHrManager: values.stages == 2,
                fkEmployeeId: values.stages == 5 ? values.fkEmployeeId?._id ?? null : null,
                levelOfManagers: values.noOfManager
            };

            if (isEdit)
                dataToInsert._id = editId

            addEntity({ url: DEFAULT_API, data: [dataToInsert] });

        }
    }

    const formData = [
        {
            elementType: "inputfield",
            name: "name",
            label: "Stage Name",
            required: true,
            validate: {
                errorMessage: "Name is required"
            },
            defaultValue: ""
        },
        {
            elementType: "dropdown",
            name: "stages",
            label: "Is",
            dataId: "id",
            dataName: "title",
            required: true,
            validate: {
                errorMessage: "Stages is required"
            },
            options: stages,
            defaultValue: 1
        },
        {
            elementType: "inputfield",
            name: "orderNo",
            label: "Order",
            required: true,
            type: "number",
            validate: {
                errorMessage: "Order is required"
            },
            defaultValue: ""
        },
        {
            elementType: "inputfield",
            name: "noOfManager",
            label: "Level of Mangers",
            type: "number",
            isShow: (values) => values.stages == 1,
            required: true,
            validate: {
                errorMessage: "Name is required"
            },
            defaultValue: ""
        },
        {
            elementType: "ad_dropdown",
            isShow: (values) => values.stages == 5,
            name: "fkEmployeeId",
            label: "Employees",
            dataName: 'fullName',
            dataId: '_id',
            options: employees,
            defaultValue: null
        },
    ];
    return <Popup
        title="Add Stage"
        openPopup={openPopup}
        maxWidth="sm"
        isEdit={isEdit}
        keepMounted={true}
        addOrEditFunc={handleSubmit}
        setOpenPopup={setOpenPopup}>
        <AutoForm formData={formData} ref={formApi} isValidate={true} />

    </Popup>
}

const ApprovalStages = ({ moduleName }) => {
    const dispatch = useAppDispatch();
    const [openPopup, setOpenPopup] = useState(false);

    const isEdit = React.useRef(false);
    const row = React.useRef(null);
    const [formId, setFormId] = useState(null);
    const [selectionModel, setSelectionModel] = React.useState([]);


    const formList = useAppSelector(e => e.appdata.routeData?.sideMenuData)
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
            searchParams: {
                ...query,
                applicationFormId: formId ? formId : null
            }
        }
    }, { selectFromResult: ({ data, isLoading }) => ({ data: data?.entityData, totalRecord: data?.totalRecord, isLoading }) });

    const { updateEntity, updateOneEntity, removeEntity } = useEntityAction();



    const { socketData } = useSocketIo("changeInStages", refetch);


    const handleEdit = (id) => {
        isEdit.current = true;
        editId = id;
        row.current = data.find(a => a.id === id);
        setOpenPopup(true);
    }
    
    useEffect(() => {

        dispatch(enableFilterAction(false));
        // dispatch(builderFieldsAction(fields));
    }, [dispatch])
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

    const columns = getColumns(gridApiRef, handleEdit, handleActiveInActive);
    const handleRowOrderChange = (params) => {
        const { oldIndex, targetIndex } = params;
        const rowsClone = [...records];
        const row = rowsClone.splice(oldIndex, 1)[0];
        rowsClone.splice(targetIndex, 0, row);

        updateEntity({ url: STAGES_REORDER, data: rowsClone.map((r, index) => ({ _id: r._id, orderNo: ++index })) });
    }


    const showAddModal = () => {
        isEdit.current = false;
        setOpenPopup(true);
    }

    return (
        <>
            <AddApprovalStages formId={formId} openPopup={openPopup} setOpenPopup={setOpenPopup} isEdit={isEdit.current} row={row.current} />

            <DataGrid apiRef={gridApiRef}
                columns={columns} rows={data}
                rowReordering={true}
                checkboxSelection={false}
                onRowOrderChange={handleRowOrderChange}
                loading={isLoading}
                totalCount={totalRecord}
                pageSize={filter.limit}
                page={filter.page}
                setFilter={setFilter}
                onSortModelChange={(s) => setSort({ sort: s.reduce((a, v) => ({ ...a, [v.field]: v.sort === 'asc' ? 1 : -1 }), {}) })}
                toolbarProps={{
                    apiRef: gridApiRef,
                    onAdd: showAddModal,
                    formId: formId,
                    moduleName,
                    setFormId,
                    formList,
                    selectionModel
                }}
                gridToolBar={ApprovalStagesToolbar}

            />
            <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
        </>
    );
}
export default ApprovalStages;

function ApprovalStagesToolbar(props) {
    const { apiRef, onAdd, formList, setFormId, formId, moduleName } = props;

    return (
        <GridToolbarContainer sx={{ justifyContent: "space-between" }}>
            <Box width={300}>
                <Controls.Select onChange={(e) => setFormId(e.target.value)} name="formId" label="Form Name"
                    value={formId}
                    size='small'
                    options={formList.find(c => c.title == moduleName).
                        children.filter(c => ModuleSetting[moduleName].includes(c.formId))}
                    dataId="_id" dataName="title" />
            </Box>
            {formId && <Controls.Button onClick={onAdd} startIcon={<AddIcon />} text="Add Record" />}
        </GridToolbarContainer>
    );
}

ApprovalStagesToolbar.propTypes = {
    apiRef: PropTypes.shape({
        current: PropTypes.object,
    }).isRequired,
    onAdd: PropTypes.func,
    selectionModel: PropTypes.array
};