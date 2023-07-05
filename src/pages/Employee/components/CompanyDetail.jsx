import React, { useState, useRef, useEffect } from 'react'
import { AutoForm } from '../../../components/useForm';
import { useDropDown } from '../../../components/useDropDown';
import { Box, Divider, IconButton, Chip } from '../../../deps/ui';
import { AddCountry } from '../../Organization/components/Country';
import { AddArea } from '../../Organization/components/Area';
import { Launch, Person } from '../../../deps/ui/icons';
import Controls from '../../../components/controls/Controls';
import { useSelector } from 'react-redux';
import { useEntityAction, setCompanyAction } from '../../../store/actions/httpactions';
import { API } from '../_Service';

const MapModel = {
    country: AddCountry,
    area: AddArea
}
const AddModal = ({ name }) => {
    const [openPopup, setOpenPopup] = useState(false);

    const Modal = MapModel[name];
    return (

        <Box position="absolute" top={0} right={0}>
            <IconButton size='small' onClick={() => {
                setOpenPopup(true);
            }}>
                <Launch fontSize="small" />
            </IconButton>
            <Modal openPopup={openPopup} setOpenPopup={setOpenPopup} />
        </Box>
    )
}
const Add_Employee = API.Employee;
const breakpoints = { md: 4, sm: 6, xs: 6 }
const CompanyDetail = ({ isEdit = false, setTab }) => {
    const formApi = useRef(null);
    const { companies, countries, states, cities, areas, groups, departments, designations, schedules, filterType, setFilter } = useDropDown();
    const comapnyData = useSelector(s => s.employee.companyTab);
    const generalData = useSelector(s => s.employee.generalTab);
    const { addEntity } = useEntityAction();
    useEffect(() => {
        if (comapnyData?.fkCompanyId) {
            const { setFormValue } = formApi.current;
            setFormValue(comapnyData);
        }
    }, [comapnyData])
    const formData = [{
        elementType: "ad_dropdown",
        name: "fkCompanyId",
        label: "Company",
        breakpoints,
        required: true,
        validate: {
            when: 1,
            errorMessage: "Company is required",
        },
        dataName: 'companyName',
        dataId: '_id',
        options: companies,
        onChange: (data) => setFilter(data, filterType.COMPANY, "_id"),
        defaultValue: companies?.length ? companies[0] : null
    },
    {
        elementType: "ad_dropdown",
        name: "fkCountryId",
        label: "Country",
        breakpoints,
        required: true,
        modal: {
            Component: <AddModal name="country" />,
        },
        validate: {
            when: 1,
            errorMessage: "Country is required",
        },
        dataName: 'name',
        dataId: '_id',
        options: countries,
        onChange: (data) => setFilter(data, filterType.COUNTRY, "id"),
        defaultValue: countries?.length ? countries[0] : null
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
        defaultValue: null
    },
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
        defaultValue: null
    },
    {
        elementType: "ad_dropdown",
        name: "fkAreaId",
        label: "Area",
        modal: {
            Component: <AddModal name="area" />,
        },
        breakpoints,
        required: true,
        dataId: '_id',
        dataName: "areaName",
        validate: {
            when: 1,
            errorMessage: "Area is required",
        },
        options: areas,
        defaultValue: null
    },
    {
        elementType: "ad_dropdown",
        name: "fkEmployeeGroupId",
        label: "Group",
        breakpoints,
        required: true,
        dataId: '_id',
        dataName: "groupName",
        validate: {
            when: 1,
            errorMessage: "Group is required",
        },
        options: groups,
        defaultValue: null
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
        defaultValue: null
    },
    {
        elementType: "ad_dropdown",
        name: "fkDesignationId",
        label: "Designation",
        breakpoints,
        dataId: '_id',
        dataName: "name",
        options: designations,
        defaultValue: null
    },
    {
        elementType: "ad_dropdown",
        name: "scheduleId",
        label: "Assigne Schedule",
        required: true,
        breakpoints,
        disabled: (value) => isEdit,
        validate: {
            when: 1,
            errorMessage: "Schedule is required",
        },
        dataId: '_id',
        dataName: "scheduleName",
        options: schedules,
        defaultValue: null
    },
    {
        elementType: "custom",
        breakpoints: { sm: 12, md: 12, xl: 12 },
        NodeElement: () => <Divider><Chip label="JCR Detail" icon={<Person />} /></Divider>
    },
    {
        elementType: "datetimepicker",
        name: "joiningDate",
        breakpoints,
        label: "Joining Date",
        defaultValue: new Date()
    },
    {
        elementType: "datetimepicker",
        name: "confirmationDate",
        breakpoints,
        label: "Confrimation Date",
        defaultValue: null
    },
    {
        elementType: "datetimepicker",
        name: "resignationDate",
        label: "Resign Date",
        breakpoints,
        defaultValue: null
    }];

    const handleSubmit = () => {
        const { getValue, validateFields } = formApi.current
        if (validateFields()) {
            const values = getValue();
            const { payload } = setCompanyAction({
                scheduleId: values.scheduleId,
                fkAreaId: values.fkAreaId,
                fkCityId: values.fkCityId,
                fkCountryId: values.fkCountryId,
                fkDepartmentId: values.fkDepartmentId,
                fkDesignationId: values.fkDesignationId,
                fkEmployeeGroupId: values.fkEmployeeGroupId,
                fkStateId: values.fkStateId,
                joiningDate: values.joiningDate,
                confirmationDate: values.confirmationDate,
                fkManagerId: generalData?.fkManagerId?._id

            })
            const employeeData = {
                emplyeeRefNo: generalData.emplyeeRefNo,
                punchCode: generalData.punchCode,
                firstName: generalData.firstName,
                lastName: generalData.lastName,
                isAllowLogin: generalData.isAllowLogin,
                timezone: values.fkCountryId.timezones[0].zoneName,
                fkCompanyId: values.fkCompanyId._id,
                generalInfo: generalData,
                companyInfo: {
                    fkAreaId: values.fkAreaId._id,
                    fkCityId: values.fkCityId._id,
                    fkCountryId: values.fkCountryId._id,
                    fkDepartmentId: values.fkDepartmentId._id,
                    fkDesignationId: values.fkDesignationId._id,
                    fkEmployeeGroupId: values.fkEmployeeGroupId._id,
                    fkStateId: values.fkStateId._id,
                    joiningDate: new Date().toISOString(),
                    confirmationDate: values.confirmationDate,
                    fkManagerId: generalData?.fkManagerId?._id ?? null
                },
                // contactDetial: {
                //     address1: values.address1,
                //     address2: values.address2,
                //     zipCode: values.zipCode,
                //     country: values.country,
                //     state: values.state,
                //     city: values.city,
                //     mobileNo: values.mobileNo,
                //     workNo: values.workNo,
                //     emergencyNo: values.emergencyNo
                // },
                scheduleId: values?.scheduleId._id
            }

            addEntity({ url: Add_Employee, data: [employeeData] });
        }
    }

    return <>
        <AutoForm formData={formData} ref={formApi} isValidate={true} />
        {/* <Divider /> */}
        <Controls.Button onClick={() => setTab('0')} text="Prev" />
        <Controls.Button onClick={handleSubmit} text="Save" />
    </>
}

export default CompanyDetail