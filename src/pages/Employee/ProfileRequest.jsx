// eslint-disable-next-line react-hooks/exhaustive-deps
import React, { useEffect, useRef, useState } from "react";
import Controls from '../../components/controls/Controls';
import Popup from '../../components/Popup';
import { API, alphabets } from './_Service';
import { builderFieldsAction, useEntityAction, useEntitiesQuery, showDropDownFilterAction } from '../../store/actions/httpactions';
import { Typography, Stack, Link, ButtonGroup } from "../../deps/ui";
import { Circle, PeopleOutline, Person2Rounded, PersonOffRounded } from "../../deps/ui/icons";
import DataGrid, { useGridApi, getActions, GridToolbar, renderStatusCell } from '../../components/useDataGrid';
import { useSocketIo } from '../../components/useSocketio';
import ConfirmDialog from '../../components/ConfirmDialog';
import EmpoyeeModal from './components/AddEditEmployee';
import PageHeader from '../../components/PageHeader'
import { useExcelReader } from "../../hooks/useExcelReader";
import Loader from '../../components/Circularloading'
import { useDropDownIds } from '../../components/useDropDown';
import { useAppDispatch, useAppSelector } from "../../store/storehook";


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
        {
            field: 'status', headerName: 'Status', flex: 1, renderCell: renderStatusCell
        },
        { field: 'modifiedOn', headerName: 'Modified On', flex: 1 },
        { field: 'createdOn', headerName: 'Created On', flex: 1 },
        {
            field: 'isActive', headerName: 'Active', renderCell: ({ row }) => (
                row["isActive"] ? <Person2Rounded color="success" /> : <PersonOffRounded color="disabled" />
            ),
            flex: '0 1 5%',
            align: 'center',
        },
        getActions(apiRef, actionKit)
    ]
}
let editId = 0;
const DEFAULT_API = API.ProfileRequest;
const ProfileRequest = () => {
    const dispatch = useAppDispatch();
    const [openPopup, setOpenPopup] = useState(false);
    const isEdit = React.useRef(false);
    const [selectionModel, setSelectionModel] = React.useState([]);
    const [word, setWord] = useState("");
    const [sort, setSort] = useState({ sort: { createdAt: -1 } });

    const excelColData = useRef([]);

    const { Employees } = useAppSelector(e => e.appdata.employeeData);

    const mapEmployee = (values, isExcel = true) => {
        if (!Object.keys(values).length) return;

        const employee = {
            employeeImage: values.employeeImage,
            employeeRefNo: values.employeeRefNo,
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
            const refNo = values.employeeRefNo.toLocaleLowerCase();
            const updateEmp = Employees.find(e => e.employeeRefNo.toLocaleLowerCase() === refNo);
            if (updateEmp) {
                employee._id = updateEmp._id;
            }
        }


        return employee;
    }

    const { inProcess, setFile, excelData, getTemplate } = useExcelReader({ formTemplate: excelColData.current, transform: mapEmployee });


    const [gridFilter, setGridFilter] = useState({
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

    const { countryIds, stateIds, cityIds, areaIds, departmentIds, groupIds, designationIds } = useDropDownIds();

    const { data, isLoading, refetch, totalRecord } = useEntitiesQuery({
        url: `${DEFAULT_API}/get`,
        data: {
            limit: gridFilter.limit,
            page: gridFilter.page + 1,
            lastKeyId: gridFilter.lastKey,
            ...sort,
            searchParams: {
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
        }
    }, { selectFromResult: ({ data, isLoading }) => ({ data: data?.entityData, totalRecord: data?.totalRecord, isLoading }) });

    const { updateOneEntity, addEntity, removeEntity } = useEntityAction();


    const { socketData } = useSocketIo("changeInProfile", refetch);


    const handleEdit = (id) => {
        isEdit.current = true;
        editId = id;
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
    const handleAlphabetSearch = (e) => {
        if (word === e.target.innerText)
            setWord("")
        else
            setWord(e.target.innerText)
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
            addEntity({ url: DEFAULT_API, data: resultData });
        }
    }, [excelData])

    const showAddModal = () => {
        isEdit.current = false;
        setOpenPopup(true);
    }


    return (
        <>
            <Loader open={inProcess} />
            <PageHeader
                title="Profile Request"
                enableFilter={true}
                handleUpload={(e) => setFile(e.target.files[0])}
                handleTemplate={getTemplate}
                subTitle="Manage Profile Request"
                icon={<PeopleOutline fontSize="large" />}
            />
            <Popup
                title="Add Employee Information"
                openPopup={openPopup} maxWidth="xl"
                fullScreen={true} isEdit={isEdit.current}
                footer={<></>} keepMounted={true}
                setOpenPopup={setOpenPopup}>
                <EmpoyeeModal coldata={excelColData} isEdit={isEdit.current} mapEmployeeData={mapEmployee} add_edit_API={DEFAULT_API} editId={editId} setOpenPopup={setOpenPopup} />
            </Popup>

            <ButtonGroup fullWidth >
                {alphabets.map(alpha => (
                    <Controls.Button onClick={handleAlphabetSearch} color="inherit" key={alpha} text={alpha} />
                ))}
            </ButtonGroup>
            <DataGrid apiRef={gridApiRef}
                columns={columns} rows={data}
                totalCount={totalRecord}
                pageSize={gridFilter.limit}
                page={gridFilter.page}
                rowHeight={100}
                setFilter={setGridFilter}
                onSortModelChange={(s) => setSort({ sort: s.reduce((a, v) => ({ ...a, [v.field]: v.sort === 'asc' ? 1 : -1 }), {}) })}
                loading={isLoading}
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
export default ProfileRequest;