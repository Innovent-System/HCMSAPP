// eslint-disable-next-line react-hooks/exhaustive-deps
import React, { useEffect, useRef, useState } from "react";
import Controls from '../../components/controls/Controls';
import Popup from '../../components/Popup';
import { API, alphabets } from './_Service';
import { builderFieldsAction, useEntityAction, useEntitiesQuery, showDropDownFilterAction } from '../../store/actions/httpactions';
import { Typography, Stack, Link, ButtonGroup, Grid, Divider, Box } from "../../deps/ui";
import { Circle, PeopleOutline, Add as AddIcon } from "../../deps/ui/icons";
import DataGrid, { useGridApi, getActions, GridToolbar } from '../../components/useDataGrid';
import { useSocketIo } from '../../components/useSocketio';
import ConfirmDialog from '../../components/ConfirmDialog';
import EmpoyeeModal from './components/AddEditEmployee';
import PageHeader from '../../components/PageHeader'
import { useExcelReader } from "../../hooks/useExcelReader";
import Loader from '../../components/Circularloading'
import { useDropDownIds } from '../../components/useDropDown';
import AddEmployee from "./components/AddEmployee";
import { useAppDispatch, useAppSelector } from "../../store/storehook";
import { downloadTextFIle } from "../../util/common";
import LinearLoader from '../../components/LinearLoader'
import ResponsiveEmployeeGrid from "./components/ResponsiveGrid";

/**
 * @type {import('@react-awesome-query-builder/mui').Fields}
 */
const fields = {
    fullName: {
        label: 'Full Name',
        type: 'text',
        fieldName: "fullName",
        defaultOperator: "like",
        operators: ["like", "equal"],
        defaultValue: undefined,
        valueSources: ['value'],
        preferWidgets: ['text'],
    },
    createdAt: {
        label: 'Created Date',
        defaultOperator: "equal",
        fieldName: "createdAt",
        defaultValue: null,
        type: 'date',
        fieldSettings: {
            dateFormat: "D/M/YYYY",
            // mongoFormatValue: val => ({ $date: new Date(val).toISOString() }),
        },
        valueSources: ['value'],
        preferWidgets: ['date'],
    },
    isActive: {
        label: 'Status',
        type: 'boolean',
        fieldName: "isActive",
        operators: ['equal'],
        valueSources: ['value'],
        preferWidgets: ['boolean']

    },
}
const getColumns = (apiRef, onEdit, onActive) => {
    const actionKit = {
        onActive: onActive,
        onEdit: onEdit
    }
    return [
        { field: '_id', headerName: 'Id', hide: true },
        {
            field: 'fullName', headerName: 'Employee', flex: 1, hideable: false, renderCell: ({ row }) => (
                <Stack>
                    <Link underline="hover">{row.fullName}</Link>
                    <Typography variant="caption"><strong>Department :</strong>{row.department.departmentName}</Typography>
                    <Typography variant="caption"><strong>Designation :</strong>{row.designation?.name}</Typography>
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
const DEFAULT_API = API.Employee;
const StepperCount = 2;
const Employee = () => {
    const dispatch = useAppDispatch();
    const [openPopup, setOpenPopup] = useState(false);
    const isEdit = React.useRef(false);
    const [selectionModel, setSelectionModel] = React.useState([]);
    const [word, setWord] = useState("");
    const [sort, setSort] = useState({ sort: { createdAt: -1 } });
    const formApi = useRef(null);
    const [activeStep, setActiveStep] = React.useState(0);
    const [record, setRecord] = useState([]);
    const excelColData = useRef([]);
    const [queryFilter, setQueryFilter] = useState({});

    const { Employees } = useAppSelector(e => e.appdata.employeeData);

    const mapEmployee = (values, isExcel = true) => {
        if (!Object.keys(values).length) return;

        const employee = {
            employeeImage: values.employeeImage,
            emplyeeRefNo: values.emplyeeRefNo,
            punchCode: values.punchCode,
            firstName: values.firstName,
            lastName: values.lastName,
            isAllowLogin: values.isAllowLogin,
            timezone: values.fkCountryId.timezones[0].zoneName,
            fkCompanyId: values.fkCompanyId._id,
            generalInfo: {
                maritalstatus: values.maritalstatus,
                email: values.email,
                gender: values.gender,
                dateofBirth: values?.dateofBirth,
                fkReligionId: values?.fkReligionId,
                nic: values.nic
            },
            companyInfo: {
                fkAreaId: values.fkAreaId._id,
                fkCityId: values.fkCityId._id,
                fkCountryId: values.fkCountryId._id,
                fkDepartmentId: values.fkDepartmentId._id,
                fkDesignationId: values?.fkDesignationId?._id,
                fkEmployeeGroupId: values.fkEmployeeGroupId._id,
                fkEmployeeStatusId: values.fkEmployeeStatusId._id,
                fkStateId: values.fkStateId._id,
                joiningDate: values.joiningDate,
                confirmationDate: values.confirmationDate,
                fkManagerId: values.fkManagerId?._id ?? null
            },
            contactDetial: {
                address1: values.address1,
                address2: values?.address2,
                zipCode: values.zipCode,
                country: values?.country,
                state: values?.state,
                city: values?.city,
                mobileNo: values.mobileNo,
                workNo: values?.workNo,
                emergencyNo: values?.emergencyNo
            },
            scheduleId: values?.scheduleId._id
        }
        if (values.fkRoleTemplateId)
            employee.companyInfo.fkRoleTemplateId = values.fkRoleTemplateId;

        if (isExcel) {
            const refNo = values.emplyeeRefNo.toLocaleLowerCase();
            const updateEmp = Employees.find(e => e.emplyeeRefNo.toLocaleLowerCase() === refNo);
            if (updateEmp) {
                employee._id = updateEmp._id;
            }
        }


        return employee;
    }
    const { inProcess, setFile, excelData, getTemplate } = useExcelReader(excelColData.current, mapEmployee);

    const [gridFilter, setGridFilter] = useState({
        startIndex: 0,
        limit: 12,
        isFromScroll: false
    })

    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        title: "",
        subTitle: "",
    });

    const gridApiRef = useGridApi();
    const query = useAppSelector(e => e.appdata.query.builder);

    const dropdownIds = useDropDownIds();
    useEffect(() => {
        const { countryIds, stateIds, cityIds, areaIds, departmentIds, groupIds, designationIds } = dropdownIds;
        const setquery = {
            ...query,
            ...(word && { firstName: { "$regex": `^${word}`, "$options": "i" } }),
            ...(countryIds && { "companyInfo.fkCountryId": { $in: countryIds.split(',') } }),
            ...(stateIds && { "companyInfo.fkStateId": { $in: stateIds.split(',') } }),
            ...(cityIds && { "companyInfo.fkCityId": { $in: cityIds.split(',') } }),
            ...(areaIds && { "companyInfo.fkAreaId": { $in: areaIds.split(',') } }),
            ...(groupIds && { "companyInfo.fkEmployeeGroupId": { $in: groupIds.split(',') } }),
            ...(departmentIds && { "companyInfo.fkDepartmentId": { $in: departmentIds.split(',') } }),
            ...(designationIds && { "companyInfo.fkDesignationId": { $in: designationIds.split(',') } })
        }
        if (query || Object.keys(setquery).length) {
            setRecord([]);
            setGridFilter({ ...gridFilter, startIndex: 0, isFromScroll: false })
            setQueryFilter(setquery)
        }

    }, [query, dropdownIds])

    const { data = [], isLoading, refetch, totalRecord } = useEntitiesQuery({
        url: `${DEFAULT_API}/get`,
        data: {
            limit: gridFilter.limit,
            startIndex: gridFilter.startIndex,
            // page: gridFilter.page + 1,
            // lastKeyId: gridFilter.lastKey,
            ...sort,
            searchParams: queryFilter
        }
    }, { selectFromResult: ({ data, isLoading }) => ({ data: data?.entityData, totalRecord: data?.totalRecord, isLoading }) });

    const { updateOneEntity, addEntity, removeEntity } = useEntityAction();

    const { socketData } = useSocketIo("changeInEmployee", refetch);

    const handleEdit = (id) => {
        isEdit.current = true;
        editId = id;
        setOpenPopup(true);
    }

    useEffect(() => {
        if (data) {
            if (gridFilter.isFromScroll)
                setRecord((prev) => [...prev, ...data]); 
            else {
                setRecord((prev) => {
                    
                    if (!prev?.length) {
                        return [...data]; 
                    }
                    const updates = data.reduce((map, item) => {
                        map[item.id] = item; 
                        return map;
                    }, {});

                    return prev.map((item) =>
                        updates[item.id] ? { ...item, ...updates[item.id] } : item
                    );
                });
            }


        }
    }, [data]);

    const handleActiveInActive = (id) => {
        setGridFilter({ ...gridFilter, isFromScroll: false })
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
    const handleAlphabetSearch = (e) => {
        const filter = {
            ...query,
        };

        if (word === e.target.innerText) {
            setQueryFilter({ ...filter })
            setWord("");
        }
        else {
            setQueryFilter({ ...filter, firstName: { "$regex": `^${e.target.innerText}`, "$options": "i" } });
            setWord(e.target.innerText);
        }
        setGridFilter({ ...gridFilter, startIndex: 0, isFromScroll: false })
        setRecord([]);
    }

    useEffect(() => {
        dispatch(builderFieldsAction(fields));
        dispatch(showDropDownFilterAction({
            company: true,
            country: true,
            state: true,
            city: true,
            area: true,
            department: true,
            group: true,
            designation: true
        }))
    }, [dispatch])

    const columns = getColumns(gridApiRef, handleEdit, handleActiveInActive);
    useEffect(() => {
        if (excelData) {
            addEntity({ url: DEFAULT_API, data: excelData });
        }
    }, [excelData])

    const showAddModal = () => {
        isEdit.current = false;
        setOpenPopup(true);
    }


    //stepper Func
    const handleNext = () => {
        const { validateWhen } = formApi.current;
        if (validateWhen(activeStep))
            setActiveStep((prevActiveStep) => prevActiveStep + 1);

    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSubmit = (e) => {
        const { getValue, validateFields } = formApi.current
        if (validateFields()) {

            const values = getValue();
            const setEmployee = mapEmployee(values, false);
            if (isEdit)
                setEmployee._id = editId

            addEntity({ url: DEFAULT_API, data: [setEmployee] });

        }
    }

    return (
        <>
            <Loader open={inProcess} />

            <PageHeader
                title="Employee"
                enableFilter={true}
                handleUpload={(e) => setFile(e.target.files[0])}
                handleTemplate={getTemplate}
                subTitle="Manage Employees"
                icon={<PeopleOutline fontSize="large" />}
            />
            <Popup
                title="Add Employee Information"
                openPopup={openPopup} maxWidth="xl"
                keepMounted={true}
                fullScreen={true} isEdit={isEdit.current}
                footer={<>
                    <Controls.Button onClick={handleBack} disabled={activeStep === 0} text="Back" />
                    {activeStep !== StepperCount - 1 && <Controls.Button onClick={handleNext} text={'Next'} />}
                    {activeStep === StepperCount - 1 && <Controls.Button onClick={handleSubmit} text="Submit" />}
                </>}
                setOpenPopup={setOpenPopup}>
                {/* <AddEmployee /> */}
                <EmpoyeeModal coldata={excelColData} isEdit={isEdit.current}
                    mapEmployeeData={mapEmployee} editId={editId}
                    setOpenPopup={setOpenPopup}
                    formApi={formApi}
                    activeStep={activeStep}
                    setActiveStep={setActiveStep}
                />
            </Popup>

            <ButtonGroup size="small" fullWidth >
                {alphabets.map(alpha => (
                    <Controls.Button key={`word-${alpha}`} onClick={handleAlphabetSearch} color={word === alpha ? 'info' : 'inherit'} text={alpha} />
                ))}
            </ButtonGroup>
            <Stack flexDirection="row" justifyContent="space-between">
                <Typography pt={1} >Total Employees : {totalRecord}</Typography>
                <Controls.Button
                    onClick={showAddModal}
                    startIcon={<AddIcon />}
                    text="Add Record"
                    sx={{ float: "right" }}
                />
            </Stack>

            <ResponsiveEmployeeGrid data={record} handleActive={handleActiveInActive} handleEdit={handleEdit}
                totalRecord={totalRecord}
                setGridFilter={setGridFilter}

            />
            <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
        </>
    );
}
export default Employee;