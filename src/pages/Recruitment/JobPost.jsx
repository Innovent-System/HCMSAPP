// eslint-disable-next-line react-hooks/exhaustive-deps
import React, { useEffect, useRef, useState } from "react";
import Popup from '../../components/Popup';
import { API } from './_Service';

import { builderFieldsAction, useEntityAction, useEntitiesQuery, showDropDownFilterAction, useLazySingleQuery } from '../../store/actions/httpactions';
import { PeopleOutline, Delete, AdminPanelSettings, AttachMoney, Person } from "../../deps/ui/icons";
import { Chip, Divider } from "../../deps/ui";
import DataGrid, { getActions, GridToolbar, renderStatusCell, useGridApi } from '../../components/useDataGrid';
import { useSocketIo } from '../../components/useSocketio';
import ConfirmDialog from '../../components/ConfirmDialog';
import { AutoForm } from '../../components/useForm'
import PageHeader from '../../components/PageHeader'
import { startOfDay, addDays, isEqual, formateISODate } from '../../services/dateTimeService'
import { formateISODateTime } from "../../services/dateTimeService";
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
        closingDate: map.closingDate,
        skills: map.skills,
        experience: "",
        description: map?.description,
        numberOfPositions: map.numberOfPositions,
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

const getColumns = () => [
    { field: '_id', headerName: 'Id', hide: true },
    {
        field: 'title', headerName: 'Title', flex: 1
    },
    {
        field: 'employmentType', headerName: 'Type', flex: 1
    },

    {
        field: 'salaryRange', headerName: 'Salary Range', flex: 1
    },
    {
        field: 'age', headerName: 'Age', flex: 1
    },
    { field: 'modifiedOn', headerName: 'Modified On', flex: 1, valueGetter: ({ row }) => formateISODateTime(row.modifiedOn) },
    { field: 'createdOn', headerName: 'Created On', flex: 1, valueGetter: ({ row }) => formateISODateTime(row.createdOn) },
    getActions(null)
];
const breakpoints = { size: { md: 3, sm: 6, xs: 12 } }
const AddJobPost = ({ openPopup, setOpenPopup, colData = [] }) => {
    const formApi = useRef(null);
    const [loader, setLoader] = useState(false);
    const { countries, states, cities, departments, filterType, setFilter } = useDropDown();
    const { addEntity } = useEntityAction();

    useEffect(() => {
        if (formApi.current && openPopup) {
            const { resetForm } = formApi.current;
            resetForm();
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
            defaultValue: 0,
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
                when: 1,
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
                when: 1,
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
                when: 1,
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
            dataName: "departmentName",
            dataId: '_id',
            // modal: {
            //   Component: <AddModal name="country" />,
            // },
            validate: {
                when: 1,
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
            isEdit={false}
            keepMounted={true}
            addOrEditFunc={handleSubmit}
            setOpenPopup={setOpenPopup}>

            <AutoForm formData={formData} ref={formApi} isValidate={true} />
        </Popup>
    </>
}
const DEFAULT_API = API.JobPost;
const JobPost = () => {
    const dispatch = useAppDispatch();
    const [openPopup, setOpenPopup] = useState(false);

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

    const columns = getColumns();

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
            <AddJobPost colData={excelColData} openPopup={openPopup} setOpenPopup={setOpenPopup} />

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