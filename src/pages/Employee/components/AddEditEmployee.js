import React, { useState, useEffect, useRef } from 'react';
import { Stepper, Collapse, Box, Step, StepLabel, Divider, Typography, IconButton, Chip } from '../../../deps/ui';
import { Launch, Person, Call, Business } from '../../../deps/ui/icons';
import { AutoForm } from '../../../components/useForm';
import Controls from '../../../components/controls/Controls';
import { API } from '../_Service';

import { useDropDown } from '../../../components/useDropDown';
import PropTypes from 'prop-types'
import { useEntityAction, useLazyEntityQuery } from '../../../store/actions/httpactions';
import Loader from '../../../components/Circularloading'
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { AddCountry } from '../../Organization/components/Country';
import { AddArea } from '../../Organization/components/Area';



const Styles = {
  root: {
    width: '100%',
    display: 'flex',
    alignItems: 'flex-start'

  },
  button: {
    marginRight: 1,
  },
  instructions: {
    marginTop: 1,
    marginBottom: 1,
  },
}

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

const genderItems = [
  { id: "Male", title: "Male" },
  { id: "Female", title: "Female" },
  { id: "Other", title: "Other" },
]

const Religion = [
  { id: "Islam", title: "Islam" },
  { id: "Hindu", title: "Hindu" },
  { id: "Christian", title: "Christian" },
  { id: "Other", title: "Other" },
];

const Maritalstatus = [
  { id: "Single", title: "Single" },
  { id: "Married", title: "Married" },
  { id: "Widowed", title: "Widowed" },
  { id: "Divorced", title: "Divorced" },
]


const getSteps = () => {
  return ['General', 'Company', 'Work & Educational'];
}

export const mapEmployee = (values) => {
  if (!Object.keys(values).length) return;
  const employee = {
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
      dateofBirth: values.dateofBirth,
      religion: values.religion,
    },
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
      fkManagerId: values.fkManagerId?._id ?? null
    },
    contactDetial: {
      address1: values.address1,
      address2: values.address2,
      zipCode: values.zipCode,
      country: values.country,
      state: values.state,
      city: values.city,
      mobileNo: values.mobileNo,
      workNo: values.workNo,
      emergencyNo: values.emergencyNo
    },
    scheduleId: values?.scheduleId._id
  }
  if (values.fkRoleTemplateId)
    employee.companyInfo.fkRoleTemplateId = values.fkRoleTemplateId._id;


  return employee;
}

const breakpoints = { md: 4, sm: 6, xs: 6 }
export default function EmployaaModal({ isEdit = false, editId, coldata }) {

  const formApi = useRef(null);
  const [activeStep, setActiveStep] = React.useState(0);
  const [loader, setLoader] = useState(isEdit);
  const steps = getSteps();
  const [GetEmpolyee] = useLazyEntityQuery();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

  const { companies, countries, states, cities, areas, designations, groups, schedules, departments, employees, roleTemplates, filterType, setFilter } = useDropDown();

  const handleEdit = () => {

    GetEmpolyee({ url: API.Employee, id: editId }).then(({ data: { result: values } }) => {
      const { setFormValue } = formApi.current;
      setFormValue({
        emplyeeRefNo: values.emplyeeRefNo,
        punchCode: values.punchCode,
        firstName: values.firstName,
        lastName: values.lastName,
        isAllowLogin: values.isAllowLogin,
        fkCompanyId: companies.find(c => c._id === values.fkCompanyId),
        maritalstatus: values.generalInfo.maritalstatus,
        email: values.generalInfo.email,
        gender: values.generalInfo.gender,
        dateofBirth: values.generalInfo.dateofBirth,
        religion: values.generalInfo.religion,
        fkAreaId: areas.find(a => a._id === values.companyInfo.fkAreaId),
        fkCityId: cities.find(a => a._id === values.companyInfo.fkCityId),
        fkCountryId: countries.find(c => c._id === values.companyInfo.fkCountryId),
        fkDepartmentId: departments.find(d => d._id === values.companyInfo.fkDepartmentId),
        fkDesignationId: designations.find(d => d._id === values.companyInfo.fkDesignationId),
        fkEmployeeGroupId: groups.find(g => g._id === values.companyInfo.fkEmployeeGroupId),
        fkStateId: states.find(s => s._id === values.companyInfo.fkStateId),
        fkManagerId: employees.find(e => e._id === values.companyInfo?.fkManagerId) ?? null,
        fkRoleTemplateId: values.companyInfo.fkRoleTemplateId,
        joiningDate: values.companyInfo.joiningDate,
        confirmationDate: values.companyInfo.confirmationDate,
        address1: values?.contactDetial.address1,
        address2: values?.contactDetial.address2,
        zipCode: values?.contactDetial.zipCode,
        country: values?.contactDetial.country,
        state: values?.contactDetial.state,
        city: values?.contactDetial.city,
        mobileNo: values?.contactDetial.mobileNo,
        workNo: values?.contactDetial.values,
        emergencyNo: values?.contactDetial.emergencyNo
      });
    })

    setLoader(false);
  }

  useEffect(() => {
    if (isEdit && companies?.length) {
      handleEdit();
    }

  }, [isEdit, companies])


  const { addEntity } = useEntityAction();

  const formData = [
    {
      Component: Collapse,
      in: activeStep === 0,
      _children: [
        {
          elementType: "uploadavatar",
          name: "employeeImage",
          breakpoints: { md: 12, sm: 12, xs: 12 },
          defaultValue: null
        },
        {
          elementType: "inputfield",
          name: "prefix",
          label: "Prefix",
          breakpoints,
          defaultValue: ""
        },
        {
          elementType: "inputfield",
          name: "emplyeeRefNo",
          label: "Employee Code",
          required: true,
          type: 'number',
          breakpoints,
          validate: {
            when: 0,
            errorMessage: "Employee Ref is required",
          },
          defaultValue: ""
        },
        {
          elementType: "inputfield",
          name: "punchCode",
          label: "Punch Code",
          required: true,
          type: 'number',
          breakpoints,
          validate: {
            when: 0,
            errorMessage: "Punch Code is required"
          },
          defaultValue: ""
        },
        {
          elementType: "inputfield",
          name: "firstName",
          label: "First Name",
          required: true,
          breakpoints,
          validate: {
            when: 0,
            errorMessage: "First Name is required",
          },
          defaultValue: ""
        },
        {
          elementType: "inputfield",
          name: "lastName",
          label: "Last Name",
          breakpoints,
          required: true,
          validate: {
            errorMessage: "Last Name is required",
            type: "string"
          },
          defaultValue: ""
        },
        {
          elementType: "inputfield",
          name: "fName",
          label: "Father/Husband Name",
          breakpoints,
          defaultValue: ""
        },
        {
          elementType: "ad_dropdown",
          name: "fkManagerId",
          label: "Reports To",
          breakpoints,
          dataName: 'fullName',
          dataId: '_id',
          options: employees,
          defaultValue: null
        },
        // {
        //   elementType: "clearfix",
        //   breakpoints: { md: 12, sm: 12, xs: 12 }
        // },
        {
          elementType: "dropdown",
          name: "maritalstatus",
          label: "Marital Status",
          breakpoints,
          dataId: "id",
          dataName: "title",
          defaultValue: "Single",
          options: Maritalstatus
        },
        {
          elementType: "dropdown",
          name: "gender",
          label: "Gender",
          breakpoints,
          dataId: "id",
          dataName: "title",
          defaultValue: "Male",
          options: genderItems
        },
        {
          elementType: "dropdown",
          name: "religion",
          label: "Religion",
          breakpoints,
          dataId: "id",
          dataName: "title",
          defaultValue: "",
          options: Religion
        },
        {
          elementType: "datetimepicker",
          name: "dateofBirth",
          breakpoints,
          label: "D.O.B",
          defaultValue: null
        },
        {
          elementType: "checkbox",
          name: "isAllowLogin",
          breakpoints: { md: 12, sm: 12, xs: 12 },
          label: "Allow Login",
          defaultValue: false,
        },
        {
          elementType: "inputfield",
          name: "email",
          label: "Email",
          breakpoints,
          required: (value) => value["isAllowLogin"],
          type: "email",
          validate: {
            when: 0,
            errorMessage: "Email is required",
            validate: (val) => /$^|.+@.+..+/.test(val.email)
          },
          defaultValue: ""
        },
        {
          elementType: "dropdown",
          name: "fkRoleTemplateId",
          label: "User Template",
          breakpoints,
          dataId: "_id",
          dataName: "templateName",
          disabled: (value) => value["isAllowLogin"] === false,
          defaultValue: "",
          options: roleTemplates?.length ? roleTemplates : []
        },
      ]
    },
    {
      Component: Collapse,
      in: activeStep === 1,
      _children: [
        {
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
        },
        {
          elementType: "custom",
          breakpoints: { sm: 12, md: 12, xl: 12 },
          NodeElement: () => <Divider><Chip label="Contact Detail" icon={<Person />} /></Divider>
        },
        {
          elementType: "inputfield",
          name: "address1",
          label: "Street 1",
          required: true,
          breakpoints,
          validate: {
            when: 1,
            errorMessage: "Street 1 is required",
          },
          defaultValue: ""
        },
        {
          elementType: "inputfield",
          name: "address2",
          label: "Street 2",
          breakpoints,
          defaultValue: ""
        },
        {
          elementType: "inputfield",
          name: "city",
          label: "City",
          breakpoints,
          defaultValue: ""
        },
        {
          elementType: "inputfield",
          name: "state",
          label: "State",
          breakpoints,
          defaultValue: ""
        },
        {
          elementType: "inputfield",
          name: "zipCode",
          label: "Zip/Postal Code",
          breakpoints,
          defaultValue: ""
        },
        {
          elementType: "inputfield",
          name: "country",
          label: "Country",
          breakpoints,
          defaultValue: ""
        },
        {
          elementType: "custom",
          breakpoints: { sm: 12, md: 12, xl: 12 },
          NodeElement: () => <Divider><Chip label="Telephone" icon={<Call />} /></Divider>
        },
        {
          elementType: "inputfield",
          name: "mobileNo",
          label: "Mobile",
          required: true,
          validate: {
            when: 1,
            errorMessage: "Mobile No is required",
          },
          breakpoints,
          defaultValue: ""
        },
        {
          elementType: "inputfield",
          name: "workNo",
          label: "Work",
          breakpoints,
          defaultValue: ""
        },
        {
          elementType: "inputfield",
          name: "emergencyNo",
          label: "Emergency",
          breakpoints,
          defaultValue: ""
        },
      ]
    },
  ];

  coldata.current = formData;

  useEffect(() => {
    if (companies?.length) {
      setFilter(companies[0], filterType.COMPANY, "_id");
    }
  }, [companies]);


  const handleNext = () => {
    const { validateWhen } = formApi.current;
    if (validateWhen(activeStep))
      setActiveStep((prevActiveStep) => prevActiveStep + 1);

  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };


  const handleSubmit = (e) => {
    const { getValue, validateFields } = formApi.current
    if (validateFields()) {

      const values = getValue();
      const setEmployee = mapEmployee(values);
      if (isEdit)
        setEmployee._id = editId

      addEntity({ url: API.Employee, data: [setEmployee] });

    }
  }



  return (
    <Box sx={Styles.root}>
      <Loader open={loader} />
      <Stepper sx={{
        flex: '1 0 15%',
      }} activeStep={activeStep} orientation={isDesktop ? "vertical" : "horizontal"}>
        {steps.map((label, index) => {
          return (
            <Step key={label} onClick={() => alert("working")}>
              <StepLabel sx={{ cursor: "pointer" }}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <Box>
        {activeStep === steps.length ? (
          <Box>
            <Typography sx={Styles.instructions}>
              All steps completed - you&apos;re finished
            </Typography>
            <Controls.Button onClick={handleReset} sx={Styles.button} text="Reset" />
          </Box>
        ) : (
          <Box display='flex' flexDirection='column' justifyContent='space-between'>
            <AutoForm formData={formData} ref={formApi} isValidate={true} />
            <Box>
              <Controls.Button onClick={handleBack} disabled={activeStep === 0} sx={Styles.button} text="Back" />
              <Controls.Button onClick={handleNext} sx={Styles.button} text={activeStep === steps.length - 1 ? 'Finish' : 'Next'} />
              {activeStep === steps.length - 1 && <Controls.Button onClick={handleSubmit} sx={Styles.button} text="Submit" />}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}

EmployaaModal.propTypes = {
  isEdit: PropTypes.bool
};