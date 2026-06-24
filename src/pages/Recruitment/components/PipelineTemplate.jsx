// eslint-disable-next-line react-hooks/exhaustive-deps
import React, { useEffect, useRef, useState } from "react";
import Popup from '../../../components/Popup';
import { API } from '../_Service';

import { builderFieldsAction, useEntityAction, useEntitiesQuery, showDropDownFilterAction, useLazySingleQuery, useLazyEntityByIdQuery } from '../../../store/actions/httpactions';
import { PeopleOutline, Delete, AdminPanelSettings, Cancel, Circle, Check } from "../../../deps/ui/icons";
import { GridActionsCellItem } from "../../../deps/ui";
import DataGrid, { getActions, GridToolbar, renderStatusCell, useGridApi } from '../../../components/useDataGrid';
import { useSocketIo } from '../../../components/useSocketio';
import ConfirmDialog from '../../../components/ConfirmDialog';
import { AutoForm } from '../../../components/useForm'
import PageHeader from '../../../components/PageHeader'
import { formateISODateTime, formateISODate, systemFormatDate } from '../../../services/dateTimeService'
import Loader from '../../../components/Circularloading'
import { useDropDownIds } from "../../../components/useDropDown";
import { useAppDispatch, useAppSelector } from "../../../store/storehook";
import { useExcelReader } from "../../../hooks/useExcelReader";
import PipelineTemplateBuilder from "./PipelineBuilder";
import { STAGE_COLORS, emptyStage, getDefaultStages } from "./constants";

const fields = {
    status: {
        label: "Status",
        type: "select",
        valueSources: ["value"],
        fieldSettings: {
            listValues: [
                { value: "Pending", title: "Pending" },
                { value: "Approved", title: "Approved" },
                { value: "Rejected", title: "Rejected" }
            ]
        }
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
    }
}


const getColumns = (onEdit, onActive) => [
    { field: '_id', headerName: 'Id', hide: true },
    { field: 'rowNo', headerName: 'Sr#', width: 8, sortable: false, filterable: false },
    {
        field: 'name', headerName: 'Template', flex: 1,
    },
    { field: 'department', headerName: 'Department', valueGetter: ({ row }) => row.department.departmentName },
    { field: 'isDefault', headerName: 'Default', renderCell: ({ row }) => (row["isDefault"] ? <Check color="success" /> : "--") },
    {
        field: 'isActive', headerName: 'Status', renderCell: (param) => (
            param.row["isActive"] ? <Circle color="success" /> : <Circle color="disabled" />
        ),
        // flex: '0 1 5%',
        align: 'center',
    },
    { field: 'modifiedOn', headerName: 'Modified On', flex: 1, valueGetter: ({ row }) => formateISODateTime(row.modifiedOn) },
    { field: 'createdOn', headerName: 'Created On', flex: 1, valueGetter: ({ row }) => formateISODateTime(row.createdOn) },
    getActions(null, { onEdit, onActive })
];

const DEFAULT_API = API.PipelineTemplate;
const DEFAULT_NAME = "Pipeline Template";

const AddPipelineTemplate = ({ isEdit = false, editId, openPopup, setOpenPopup }) => {
    const formApi = useRef(null);
    const [loader, setLoader] = useState(false);
    const [values, setValues] = useState({
        name: "",
        fkDepartmentId: null,
        isDefault: false
    })
    const [errors, setErrors] = useState({});
    const [stages, setStages] = useState([getDefaultStages()]);
    const { Employees } = useAppSelector(e => e.appdata.employeeData);
    const { addEntity } = useEntityAction();
    const [getTemplateById] = useLazyEntityByIdQuery();

    const handleEdit = () => {
        getTemplateById({ url: DEFAULT_API, id: editId }).then(({ data }) => {
            const { result } = data;
            setValues({
                name: result.name,
                fkDepartmentId: result.fkDepartmentId,
                isDefault: result.isDefault
            })
            setStages(result.stages);
        })
    }
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value })
    }
    const resetState = () => {
        setValues({ name: '', fkDepartmentId: null, isDefault: false });
        setStages(getDefaultStages())
        setErrors({});
    }
    useEffect(() => {
        if (!openPopup) return;
        if (openPopup && !isEdit) {
            resetState();
        }
        else {
            handleEdit()
        }


    }, [openPopup])

    const validate = () => {
        const newErrors = {};
        stages.forEach((s, i) => {
            if (!s.name?.trim()) newErrors[i] = 'Stage name is required';
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0 && Boolean(values.name?.trim()) && Boolean(values.fkDepartmentId);
    };

    const handleSubmit = (e) => {

        if (validate()) {
            const orderedStages = stages.map((s, i) => ({
                ...s,
                order: i + 1,
                color: STAGE_COLORS[i % STAGE_COLORS.length].mid,
            }));
            const payload = {
                ...values,
                stages: orderedStages
            }

            if (isEdit)
                payload._id = editId

            addEntity({ url: DEFAULT_API, data: [payload] });

        }
    }
    return <>
        <Loader open={loader} />
        <Popup
            title={`Add ${DEFAULT_NAME}`}
            openPopup={openPopup}
            maxWidth="xl"
            isEdit={isEdit}
            fullScreen={true}
            addOrEditFunc={handleSubmit}
            setOpenPopup={setOpenPopup}>
            <PipelineTemplateBuilder setValues={setValues} values={values}
                setStages={setStages} stages={stages}
                handleInputChange={handleInputChange}
                errors={errors} setErrors={setErrors}
            />
        </Popup>
    </>
}
let editId = null;
const PipelineTemplate = () => {
    const dispatch = useAppDispatch();
    const isEdit = useRef(false);
    const [openPopup, setOpenPopup] = useState(false);

    const [selectionModel, setSelectionModel] = React.useState([]);

    const [gridFilter, setGridFilter] = useState({
        lastKey: null,
        limit: 10,
        page: 0,
        totalRecord: 0
    })

    const [sort, setSort] = useState({ sort: { createdAt: -1 } });

    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        title: "",
        subTitle: "",
    });


    const gridApiRef = useGridApi();
    const query = useAppSelector(e => e.appdata.query.builder);
    const { countryIds, stateIds, cityIds, areaIds } = useDropDownIds();
    const { data, isFetching, refetch, totalRecord } = useEntitiesQuery({
        url: `${DEFAULT_API}/get`,
        data: {
            limit: gridFilter.limit,
            page: gridFilter.page + 1,
            lastKeyId: gridFilter.lastKey,
            ...sort,
            searchParams: { ...query }
        }
    }, { selectFromResult: ({ data, isFetching }) => ({ data: data?.entityData, totalRecord: data?.totalRecord, isFetching }) });

    const { removeEntity, updateOneEntity, addEntity } = useEntityAction();


    const handleEdit = (id) => {
        isEdit.current = true;
        editId = id;
        setOpenPopup(true);
    }

    const handleActiveInActive = (id) => {
        updateOneEntity({ url: DEFAULT_API, data: { _id: id } });
    }


    const { socketData } = useSocketIo("changeInPipeline", refetch);

    const columns = getColumns(handleEdit, handleActiveInActive);

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
            employee: true,
        }));
        dispatch(builderFieldsAction(fields));
    }, [dispatch])


    const showAddModal = () => {
        isEdit.current = false;
        setOpenPopup(true);
    }

    return (
        <>
            <AddPipelineTemplate openPopup={openPopup} isEdit={isEdit.current} editId={editId}
                setOpenPopup={setOpenPopup} />

            <DataGrid apiRef={gridApiRef}
                columns={columns} rows={data}
                page={gridFilter.page}
                checkboxSelection={false}
                disableSelectionOnClick={true}
                getRowHeight={() => 40}
                loading={isFetching} pageSize={gridFilter.limit}
                setFilter={setGridFilter}
                onSortModelChange={(s) => setSort({ sort: s.reduce((a, v) => ({ ...a, [v.field]: v.sort === 'asc' ? 1 : -1 }), {}) })}
                totalCount={totalRecord}
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

export default PipelineTemplate;