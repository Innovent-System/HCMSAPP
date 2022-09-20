import React, { useState, useEffect, useRef } from 'react';
import { Stepper, Collapse, Box, Step, StepLabel, Typography, IconButton } from '../../../deps/ui';
import { Launch } from '../../../deps/ui/icons';
import { AutoForm } from '../../../components/useForm';
import Controls from '../../../components/controls/Controls';
import { API } from '../_Service';
import Popup from '../../../components/Popup';
import DepartmentModel from './DepartmentModal'
import { useDropDown } from '../../../components/useDropDown';
import PropTypes from 'prop-types'
import { useEntityAction, useLazyEntityQuery } from '../../../store/actions/httpactions';
import Loader from '../../../components/Circularloading'
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
  const formApi = useRef(null);
  const Modal = MapModel[name];
  return (
    <Box position="absolute" top={0} right={0}>
      <IconButton size='small' onClick={() => {
        const { resetForm } = formApi.current;
        resetForm(); setOpenPopup(true);
      }}>
        <Launch fontSize="small" />
      </IconButton>
      <Modal formApi={formApi} openPopup={openPopup} setOpenPopup={setOpenPopup} />
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
  return ['General', 'Company', 'Educational'];
}

const mapEmployee = (values) => {
  if (!Object.keys(values).length) return;
  const employee = {
    emplyeeRefNo: values.emplyeeRefNo,
    punchCode: values.punchCode,
    firstName: values.firstName,
    lastName: values.lastName,
    isAllowLogin: values.isAllowLogin,
    fkCompanyId: values.fkCompanyId._id,
    generalInfo: {
      maritalstatus: values.maritalstatus,
      email: values.email,
      // addresses: [],
      // mobileNumber: values.mobileNumber,
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
      confirmationDate: values.confirmationDate
    }
  }
  if (values.fkRoleTemplateId)
    employee.companyInfo.fkRoleTemplateId = values.fkRoleTemplateId


  return employee;
}

const breakpoints = { md: 4, sm: 6, xs: 6 }
export default function EmployaaModal({ isEdit = false, editId }) {

  const formApi = useRef(null);
  const [activeStep, setActiveStep] = React.useState(1);
  const [loader, setLoader] = useState(isEdit);
  const steps = getSteps();
  const [GetEmpolyee] = useLazyEntityQuery();

  const { companies, countries, states, cities, areas, designations, groups, departments, employees, roleTemplates, filterType, setFilter } = useDropDown();

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
        // mobileNumber: values.generalInfo.mobileNumber,
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
        fkRoleTemplateId: values.companyInfo.fkRoleTemplateId,
        joiningDate: values.companyInfo.joiningDate,
        confirmationDate: values.companyInfo.confirmationDate
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
          elementType: "clearfix",
          breakpoints: { md: 12, sm: 12, xs: 12 }
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
          required: true,
          validate: {
            when: 0,
            errorMessage: "This Field is required",
          },
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
          options: roleTemplates
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
          dataId: 'id',
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
          dataId: 'id',
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
          dataId: 'id',
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
          dataName: "areaName",
          validate: {
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
          dataName: "name",
          options: designations,
          defaultValue: null
        },
        // {
        //   elementType: "inputfield",
        //   name: "address",
        //   label: "Address",
        //   multiline:true,
        //   defaultValue: ""
        // },
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
        }
      ]
    },
  ];

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
      }} activeStep={activeStep} orientation="vertical">
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