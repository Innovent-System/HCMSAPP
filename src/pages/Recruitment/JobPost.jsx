// eslint-disable-next-line react-hooks/exhaustive-deps
import React, { useEffect, useRef, useState } from "react";
import Popup from '../../components/Popup';
import { API } from './_Service';
import { builderFieldsAction, useEntityAction, useEntitiesQuery, showDropDownFilterAction, useLazyEntityByIdQuery } from '../../store/actions/httpactions';
import { PeopleOutline, Delete, AdminPanelSettings, AttachMoney, Person, Circle } from "../../deps/ui/icons";
import { Chip, Divider } from "../../deps/ui";
import DataGrid, { getActions, GridToolbar, renderStatusCell, useGridApi } from '../../components/useDataGrid';
import { useSocketIo } from '../../components/useSocketio';
import ConfirmDialog from '../../components/ConfirmDialog';
import { AutoForm } from '../../components/useForm'
import PageHeader from '../../components/PageHeader'
import { formateDate, formateISODate, formateISODateTime, systemFormatDate } from '../../services/dateTimeService'
import Loader from '../../components/Circularloading'
import { useDropDown, useDropDownIds } from "../../components/useDropDown";
import { useAppDispatch, useAppSelector } from "../../store/storehook";
import { useExcelReader } from "../../hooks/useExcelReader";

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

const mapJobPost = (values) => {
    const map = { ...values };

    return {
        title: map.title,
        employmentType: map.employmentType,
        closingDate: systemFormatDate(map.closingDate),
        skills: map.skills,
        experience: "",
        description: map?.description,
        numberOfPositions: map.numberOfPositions,
        fkPipelineTemplateId: map.fkPipelineTemplateId._id,
        fkDepartmentId: map.fkDepartmentId._id,
        fkCountryId: map.fkCountryId._id,
        fkStateId: map.fkStateId._id,
        fkCityId: map.fkCityId._id,
        salary: {
            min: map.minSalary,
            max: map.maxSalary,
        },
        age: {
            min: map.minAge,
            max: map.maxAge
        }
    }
}

const EmployeementType = [
    { id: 'Full-time', title: 'Full-time' },
    { id: "Part-time", title: "Part-time" },
    { id: "Contract", title: "Contract" },
    { id: "Internship", title: "Internship" },
]

const getColumns = (onActive, onEdit) => [
    { field: '_id', headerName: 'Id', hide: true },
    { field: 'rowNo', headerName: 'Sr#', width: 8, sortable: false, filterable: false },
    {
        field: 'title', headerName: 'Title', flex: 1
    },
    {
        field: 'employmentType', headerName: 'Type', flex: 1
    },
    { field: 'closingDate', headerName: 'Closed On', flex: 1, valueGetter: ({ row }) => formateDate(row.closingDate) },
    {
        field: 'salaryRange', headerName: 'Salary Range', flex: 1
    },
    {
        field: 'age', headerName: 'Age', flex: 1
    },
    {
        field: 'isActive', headerName: 'Status', renderCell: (param) => (
            param.row["isActive"] ? <Circle color="success" /> : <Circle color="disabled" />
        ),
        // flex: '0 1 5%',
        align: 'center',
    },
    { field: 'modifiedOn', headerName: 'Modified On', flex: 1, valueGetter: ({ row }) => formateISODateTime(row.modifiedOn) },
    { field: 'createdOn', headerName: 'Created On', flex: 1, valueGetter: ({ row }) => formateISODateTime(row.createdOn) },
    getActions(null, { onActive, onEdit })
];
const breakpoints = { size: { md: 3, sm: 6, xs: 12 } }
const AddJobPost = ({ openPopup, setOpenPopup, isEdit, editId, colData = [] }) => {
    const formApi = useRef(null);
    const [loader, setLoader] = useState(false);
    const [filterTemplate, setFilterTemplate] = useState([]);
    const { countries, states, cities, departments, filterType, setFilter } = useDropDown();

    const { addEntity } = useEntityAction();
    const { data: template, isFetching, refetch: fetchTemplate } = useEntitiesQuery({
        url: `${API.PipelineTemplate}/get`,
        data: { limit: 100, page: 1, sort: { createdAt: -1 } },
    }, { selectFromResult: ({ data, isFetching }) => ({ data: data?.entityData, isFetching }) });

    const [getJobPostById] = useLazyEntityByIdQuery();

    const getJobPost = () => {
        setLoader(true);
        getJobPostById({ url: DEFAULT_API, id: editId }).then(({ data }) => {
            const { result: map } = data;
            const { setFormValue } = formApi.current;
            setFormValue({
                title: map.title,
                employmentType: map.employmentType,
                closingDate: new Date(map.closingDate),
                skills: map?.skills ?? [],
                experience: "",
                description: map?.description,
                numberOfPositions: map.numberOfPositions,
                fkPipelineTemplateId: template.find(t => t._id === map.fkPipelineTemplateId),
                fkDepartmentId: departments.find(d => d._id === map.fkDepartmentId),
                fkCountryId: countries.find(c => c._id === map.fkCountryId),
                fkStateId: states.find(s => s._id === map.fkStateId),
                fkCityId: cities.find(c => c._id === map.fkCityId),
                minSalary: map.salary.min,
                maxSalary: map.salary.max,
                minAge: map.age.min,
                maxAge: map.age.max
            })

        }).finally(() => setLoader(false))
    }

    useEffect(() => {
        if (!formApi.current || !openPopup) return;
        const { resetForm, setFormValue } = formApi.current;
        if (openPopup && !isEdit)
            resetForm();
        else {
            getJobPost()
        }


    }, [openPopup, formApi])
    const formData = [
        {
            elementType: "inputfield",
            name: "title",
            required: true,
            label: "Title",
            breakpoints: breakpoints,
            validate: {
                errorMessage: "Title required",
            },
            defaultValue: "",
            excel: {
                sampleData: "Admin Officer"
            }
        },
        {
            elementType: "inputfield",
            name: "numberOfPosition",
            required: true,
            type: "number",
            label: "No. Of Postions",
            breakpoints: breakpoints,
            validate: {
                errorMessage: "No. of Position required",
            },
            defaultValue: 1,
            excel: {
                sampleData: 1
            }
        },
        {
            elementType: "clearfix",
        },
        {
            elementType: "ad_dropdown",
            name: "fkCountryId",
            label: "Country",
            breakpoints,
            required: true,
            validate: {
                errorMessage: "Country is required",
            },
            dataName: 'name',
            dataId: '_id',
            options: countries,
            onChange: (data) => setFilter(data, filterType.COUNTRY, "id"),
            defaultValue: countries?.length ? countries[0] : null,
            excel: {
                sampleData: "Country"
            }
        },
        {
            elementType: "ad_dropdown",
            name: "fkStateId",
            label: "State",
            breakpoints,
            required: true,
            dataName: "name",
            dataId: '_id',
            validate: {
                errorMessage: "State is required",
            },
            options: states,
            onChange: (data) => setFilter(data, filterType.STATE, "id"),
            defaultValue: null,
            excel: {
                sampleData: "State"
            }
        },
        { elementType: "clearfix" },
        {
            elementType: "ad_dropdown",
            name: "fkCityId",
            label: "City",
            breakpoints,
            required: true,
            dataId: '_id',
            dataName: "name",
            onChange: (data) => setFilter(data, filterType.CITY, "_id"),
            validate: {
                errorMessage: "City is required",
            },
            options: cities,
            defaultValue: null,
            excel: {
                sampleData: "City"
            }
        },
        {
            elementType: "ad_dropdown",
            name: "fkDepartmentId",
            label: "Department",
            breakpoints,
            required: true,
            onChange: (data) => {
                const { setFormValue, getValue } = formApi.current;
                const match = template.filter(e => e.fkDepartmentId === data._id);
                setFilterTemplate(match);
                if (!match.length && getValue().fkPipelineTemplateId)
                    setFormValue({ fkPipelineTemplateId: null });

            },
            dataName: "departmentName",
            dataId: '_id',
            validate: {
                errorMessage: "Department is required",
            },
            options: departments,
            defaultValue: null,
            excel: {
                sampleData: "Department"
            }
        },
        { elementType: "clearfix" },
        {
            elementType: "ad_dropdown",
            name: "fkPipelineTemplateId",
            label: "Pipeline Template",
            breakpoints,
            required: true,
            dataName: "name",
            dataId: '_id',
            validate: {
                when: 1,
                errorMessage: "Template is required",
            },
            options: filterTemplate,
            defaultValue: null,
            excel: {
                sampleData: "Template"
            }
        },
        {
            elementType: "dropdown",
            name: "employmentType",
            label: "Employement Type",
            breakpoints,
            dataId: "id",
            isNone: false,
            dataName: "title",
            defaultValue: "Contract",
            options: EmployeementType,
            excel: {
                sampleData: "Contract"
            }
        },
        {
            elementType: "clearfix"
        },
        {
            elementType: "datetimepicker",
            name: "closingDate",
            breakpoints: breakpoints,
            required: true,
            disablePast: true,
            validate: {
                errorMessage: "Select Closing Date please",
            },
            label: "Closing Date",
            defaultValue: new Date()
        },
        {
            elementType: "clearfix"
        },
        {
            elementType: "taginput",
            name: "skills",
            required: true,
            label: "Skills",
            breakpoints: { size: { md: 6, sm: 12, xs: 12 } },
            validate: {
                errorMessage: "Skills required",
            },
            defaultValue: [],
            excel: {
                sampleData: "Lerner"
            }
        },
        {
            elementType: "custom",
            breakpoints: { size: { sm: 12, md: 12, xl: 12 } },
            NodeElement: () => <Divider variant="middle"><Chip size="small" label="Salary Range" icon={<AttachMoney />} /></Divider>
        },
        {
            elementType: "inputfield",
            name: "minSalary",
            type: "number",
            label: "Min",
            breakpoints: breakpoints,
            defaultValue: 0,
            excel: {
                sampleData: 0
            }
        },
        {
            elementType: "inputfield",
            name: "maxSalary",
            type: "number",
            label: "Max",
            breakpoints: breakpoints,
            defaultValue: 0,
            excel: {
                sampleData: 0
            }
        },
        {
            elementType: "custom",
            breakpoints: { size: { sm: 12, md: 12, xl: 12 } },
            NodeElement: () => <Divider variant="middle"><Chip size="small" label="Age" icon={<Person />} /></Divider>
        },
        {
            elementType: "inputfield",
            name: "minAge",
            type: "number",
            label: "Min",
            breakpoints: breakpoints,
            defaultValue: 18,
            excel: {
                sampleData: 18
            }
        },
        {
            elementType: "inputfield",
            name: "maxAge",
            type: "number",
            label: "Max",
            breakpoints: breakpoints,
            defaultValue: 40,
            excel: {
                sampleData: 40
            }
        },
        {
            elementType: "clearfix"
        },
        {
            elementType: "inputfield",
            name: "description",
            required: true,
            label: "Description",
            multiline: true,
            validate: {
                errorMessage: "Description required",
            },
            minRows: 5,
            variant: "outlined",
            breakpoints: { size: { md: 6, sm: 12, xs: 12 } },
            defaultValue: "",
            excel: {
                sampleData: "Personl reson"
            }
        }
    ];
    colData.current = formData;

    const handleSubmit = (e) => {
        const { getValue, validateFields } = formApi.current
        if (validateFields()) {
            let values = getValue();
            let dataToInsert = mapJobPost(values);
            if(isEdit)
                dataToInsert._id = editId;

            addEntity({ url: DEFAULT_API, data: [dataToInsert] });
        }
    }
    return <>
        <Loader open={loader} />
        <Popup
            title="Add Job Post"
            openPopup={openPopup}
            // maxWidth="lg"
            fullScreen={true}
            isEdit={isEdit}
            keepMounted={true}
            addOrEditFunc={handleSubmit}
            setOpenPopup={setOpenPopup}>

            <AutoForm formData={formData} ref={formApi} isValidate={true} />
        </Popup>
    </>
}
const DEFAULT_API = API.JobPost;
let editId = null;
const JobPost = () => {
    const dispatch = useAppDispatch();
    const [openPopup, setOpenPopup] = useState(false);
    const isEdit = useRef(false);
    const [selectionModel, setSelectionModel] = React.useState([]);

    const [gridFilter, setGridFilter] = useState({
        lastKey: null,
        limit: 10,
        page: 0,
        totalRecord: 0
    })

    const excelColData = useRef([]);

    const [sort, setSort] = useState({ sort: { createdAt: -1 } });
    const { inProcess, setFile, excelData, getTemplate } = useExcelReader({
        formTemplate: excelColData.current,
        transform: mapJobPost,
        fileName: "JobPost.xlsx"
    });

    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        title: "",
        subTitle: "",
    });


    const gridApiRef = useGridApi();
    const query = useAppSelector(e => e.appdata.query.builder);
    const { countryIds, stateIds, cityIds, areaIds } = useDropDownIds();
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

    const { removeEntity, updateOneEntity, addEntity } = useEntityAction();


    useEffect(() => {
        if (excelData)
            addEntity({ url: DEFAULT_API, data: excelData });

    }, [excelData])

    const { socketData } = useSocketIo("changeInJobPost", refetch);

    const handleActiveInActive = (id) => {
        updateOneEntity({ url: DEFAULT_API, data: { _id: id } });
    }
    const handleEdit = (id) => {
        isEdit.current = true;
        editId = id;
        setOpenPopup(true);
    }

    const columns = getColumns(handleActiveInActive, handleEdit);

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
            <PageHeader
                title="Job Post"
                enableFilter={true}
                handleUpload={(e) => setFile(e.target.files[0])}
                handleTemplate={getTemplate}
                subTitle="Manage Job Post"
                icon={<PeopleOutline fontSize="large" />}
            />
            <AddJobPost colData={excelColData} openPopup={openPopup} isEdit={isEdit.current} editId={editId} setOpenPopup={setOpenPopup} />

            <DataGrid apiRef={gridApiRef}
                columns={columns} rows={data}
                page={gridFilter.page}
                checkboxSelection={false}
                disableSelectionOnClick={true}
                getRowHeight={() => 40}
                loading={isLoading} pageSize={gridFilter.limit}
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

export default JobPost;