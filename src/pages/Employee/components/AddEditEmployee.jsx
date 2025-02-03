import React, { useState, useEffect, useRef, useId } from 'react';
import { Stepper, Collapse, Box, Step, StepLabel, Divider, Typography, IconButton, Chip } from '../../../deps/ui';
import { Launch, Person, Call, Business } from '../../../deps/ui/icons';
import { AutoForm } from '../../../components/useForm';
import Controls from '../../../components/controls/Controls';
import { API } from '../_Service';
import { useDropDown } from '../../../components/useDropDown';
import PropTypes from 'prop-types'
import { useEntityAction, useLazyEntityByIdQuery } from '../../../store/actions/httpactions';
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
    <Box  position="absolute" top={-15} right={0}>
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

// 'Work & Educational'
const getSteps = () => {
  return ['General', 'Company'];
}
const bindObject = (obj) => {
  const result = {};
  Object.keys(obj).forEach(k => {
    if (typeof obj[k] === "object") Object.assign(result, bindObject(obj[k]))
    else result[k] = obj[k]
  })
  return result;
}

const emptyString = "";
const breakpoints = { md: 4, sm: 6, xs: 6 }
export default function EmployaaModal({ isEdit = false, formApi, editId, coldata, mapEmployeeData, setActiveStep, activeStep = 0, add_edit_API = API.Employee }) {

  // const formApi = useRef(null);
  // const [activeStep, setActiveStep] = React.useState(0);
  const [loader, setLoader] = useState(false);
  const steps = getSteps();
  const [GetEmpolyee] = useLazyEntityByIdQuery();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

  const { companies, countries, states, cities, areas, designations, groups, schedules, departments,
    employees, roleTemplates, religion, employeeStatus, filterType, setFilter } = useDropDown();

  const handleEdit = () => {
    setLoader(true);
    GetEmpolyee({ url: add_edit_API, id: editId }).then(({ data: { result: values } }) => {
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
        fkReligionId: values.generalInfo.fkReligionId,
        nic: values.generalInfo.nic,
        fkAreaId: areas.find(a => a._id === values.companyInfo.fkAreaId),
        fkCityId: cities.find(a => a._id === values.companyInfo.fkCityId),
        fkCountryId: countries.find(c => c._id === values.companyInfo.fkCountryId),
        fkDepartmentId: departments.find(d => d._id === values.companyInfo.fkDepartmentId),
        fkDesignationId: designations.find(d => d._id === values.companyInfo.fkDesignationId),
        fkEmployeeGroupId: groups.find(g => g._id === values.companyInfo.fkEmployeeGroupId),
        fkEmployeeStatusId: employeeStatus.find(e => e._id === values.companyInfo.fkEmployeeStatusId) ?? null,
        fkStateId: states.find(s => s._id === values.companyInfo.fkStateId),
        scheduleId: schedules.find(s => s._id === values.schedule?._id) ?? null,
        fkManagerId: employees.find(e => e._id === values.companyInfo?.fkManagerId) ?? null,
        fkRoleTemplateId: values.companyInfo?.fkRoleTemplateId ?? '',
        joiningDate: values.companyInfo.joiningDate,
        confirmationDate: values.companyInfo.confirmationDate,
        address1: values?.contactDetial?.address1,
        address2: values?.contactDetial?.address2,
        zipCode: values?.contactDetial?.zipCode,
        country: values?.contactDetial?.country,
        state: values?.contactDetial?.state,
        city: values?.contactDetial?.city,
        mobileNo: values?.contactDetial?.mobileNo,
        workNo: values?.contactDetial?.workNo,
        emergencyNo: values?.contactDetial?.emergencyNo
      });
    }).finally(() => {
      setLoader(false);

    })

  }

  useEffect(() => {
    if (isEdit && companies?.length) {
      setActiveStep(0);
      handleEdit();
    }
    else {
      const { resetForm } = formApi.current;
      setActiveStep(0);
      resetForm();
    }

  }, [isEdit, companies, editId])


  const { addEntity } = useEntityAction();

  /**
   * @type {import('../../../types/fromstype').FormType}
   */
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
          defaultValue: emptyString,
          excel: {
            sampleData: emptyString
          }
        },
        {
          elementType: "inputfield",
          name: "emplyeeRefNo",
          label: "Employee Code",
          disabled: isEdit,
          required: true,
          breakpoints,
          validate: {
            when: 0,
            errorMessage: "Employee Ref is required",
          },
          defaultValue: emptyString,
          excel: {
            sampleData: 222
          }
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
          defaultValue: emptyString,
          excel: {
            sampleData: 222
          }
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
          defaultValue: emptyString,
          excel: {
            sampleData: "Faizan"
          }
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
          defaultValue: emptyString,
          excel: {
            sampleData: "Siddiqui"
          }
        },
        {
          elementType: "inputfield",
          name: "fName",
          label: "Father/Husband Name",
          breakpoints,
          defaultValue: emptyString,
          excel: {
            sampleData: emptyString
          }
        },
        {
          elementType: "ad_dropdown",
          name: "fkManagerId",
          label: "Reports To",
          breakpoints,
          dataName: 'fullName',
          dataId: '_id',
          options: employees,
          defaultValue: null,
          excel: {
            sampleData: emptyString
          }
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
          options: Maritalstatus,
          excel: {
            sampleData: "Single"
          }
        },
        {
          elementType: "dropdown",
          name: "gender",
          label: "Gender",
          breakpoints,
          dataId: "id",
          dataName: "title",
          defaultValue: "Male",
          options: genderItems,
          excel: {
            sampleData: "Male"
          }
        },
        {
          elementType: "dropdown",
          name: "fkReligionId",
          label: "Religion",
          breakpoints,
          dataId: "_id",
          dataName: "name",
          defaultValue: emptyString,
          options: religion,
          excel: {
            sampleData: emptyString
          }
        },
        {
          elementType: "datetimepicker",
          name: "dateofBirth",
          breakpoints,
          label: "D.O.B",
          defaultValue: null,
          excel: {
            sampleData: new Date().toLocaleDateString('en-US')
          }
        },
        {
          elementType: "inputfield",
          name: "nic",
          label: "National ID",
          breakpoints,
          defaultValue: emptyString,
          excel: {
            sampleData: emptyString
          }
        },
        {
          elementType: "checkbox",
          name: "isAllowLogin",
          breakpoints: { md: 12, sm: 12, xs: 12 },
          label: "Allow Login",
          defaultValue: false,
          excel: {
            sampleData: false
          }
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
          defaultValue: emptyString,
          excel: {
            sampleData: emptyString
          }
        },
        {
          elementType: "dropdown",
          name: "fkRoleTemplateId",
          label: "User Template",
          breakpoints,
          dataId: "_id",
          dataName: "templateName",
          disabled: (value) => value["isAllowLogin"] === false,
          defaultValue: emptyString,
          options: roleTemplates?.length ? roleTemplates : [],
          excel: {
            sampleData: emptyString
          }
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
          defaultValue: companies?.length ? companies[0] : null,
          excel: {
            sampleData: "Company"
          }
        },
        {
          elementType: "ad_dropdown",
          name: "fkCountryId",
          label: "Country",
          breakpoints,
          required: true,
          modal: {
            Component: <AddModal key="country-modal" name="country" />,
          },
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
          name: "fkAreaId",
          label: "Area",
          modal: {
            Component: <AddModal key="area-modal" name="area" />,
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
          defaultValue: null,
          excel: {
            sampleData: "Area"
          }
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
          defaultValue: null,
          excel: {
            sampleData: "Group"
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
        {
          elementType: "ad_dropdown",
          name: "fkDesignationId",
          label: "Designation",
          breakpoints,
          dataId: '_id',
          dataName: "name",
          options: designations,
          defaultValue: null,
          excel: {
            sampleData: "Designation"
          }
        },
        {
          elementType: "ad_dropdown",
          name: "scheduleId",
          label: "Assigne Schedule",
          required: true,
          breakpoints,
          // disabled: (value) => isEdit,
          validate: {
            when: 1,
            errorMessage: "Schedule is required",
          },
          dataId: '_id',
          dataName: "scheduleName",
          options: schedules,
          defaultValue: null,
          excel: {
            sampleData: emptyString
          }
        },
        {
          elementType: "custom",
          breakpoints: { sm: 12, md: 12, xl: 12 },
          NodeElement: () => <Divider><Chip size='small' label="JCR Detail" icon={<Person />} /></Divider>
        },
        {
          elementType: "datetimepicker",
          name: "joiningDate",
          breakpoints,
          label: "Joining Date",
          defaultValue: new Date(),
          excel: {
            sampleData: emptyString
          }
        },
        {
          elementType: "datetimepicker",
          name: "confirmationDate",
          breakpoints,
          label: "Confrimation Date",
          defaultValue: null,
          excel: {
            sampleData: emptyString
          }
        },
        {
          elementType: "datetimepicker",
          name: "resignationDate",
          label: "Resign Date",
          breakpoints,
          defaultValue: null,
          excel: {
            sampleData: emptyString
          }
        },
        {
          elementType: "ad_dropdown",
          name: "fkEmployeeStatusId",
          label: "Employee Status",
          required: true,
          validate: {
            when: 1,
            errorMessage: "Employee Status is required",
          },
          breakpoints,
          dataId: '_id',
          dataName: "name",
          options: employeeStatus,
          defaultValue: employeeStatus?.length ? employeeStatus[0] : null,
          excel: {
            sampleData: "Probation"
          }
        },
        {
          elementType: "custom",
          breakpoints: { sm: 12, md: 12, xl: 12 },
          NodeElement: () => <Divider><Chip size='small' label="Contact Detail" icon={<Person />} /></Divider>
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
          defaultValue: emptyString,
          excel: {
            sampleData: emptyString
          }
        },
        {
          elementType: "inputfield",
          name: "address2",
          label: "Street 2",
          breakpoints,
          defaultValue: emptyString,
          excel: {
            sampleData: emptyString
          }
        },
        {
          elementType: "inputfield",
          name: "city",
          label: "City",
          breakpoints,
          defaultValue: emptyString,
          excel: {
            sampleData: emptyString
          }
        },
        {
          elementType: "inputfield",
          name: "state",
          label: "State",
          breakpoints,
          defaultValue: emptyString,
          excel: {
            sampleData: emptyString
          }
        },
        {
          elementType: "inputfield",
          name: "zipCode",
          label: "Zip/Postal Code",
          breakpoints,
          defaultValue: emptyString,
          excel: {
            sampleData: emptyString
          }
        },
        {
          elementType: "inputfield",
          name: "country",
          label: "Country",
          breakpoints,
          defaultValue: emptyString,
          excel: {
            sampleData: emptyString
          }
        },
        {
          elementType: "custom",
          breakpoints: { sm: 12, md: 12, xl: 12 },
          NodeElement: () => <Divider><Chip size='small' label="Telephone" icon={<Call />} /></Divider>
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
          defaultValue: emptyString,
          excel: {
            sampleData: emptyString
          }
        },
        {
          elementType: "inputfield",
          name: "workNo",
          label: "Work",
          breakpoints,
          defaultValue: emptyString,
          excel: {
            sampleData: emptyString
          }
        },
        {
          elementType: "inputfield",
          name: "emergencyNo",
          label: "Emergency",
          breakpoints,
          defaultValue: emptyString,
          excel: {
            sampleData: emptyString
          }
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




  // const handleReset = () => {
  //   setActiveStep(0);
  // };


  const handleSubmit = (e) => {
    const { getValue, validateFields } = formApi.current
    if (validateFields()) {

      const values = getValue();
      const setEmployee = mapEmployeeData(values, false);
      if (isEdit)
        setEmployee._id = editId

      addEntity({ url: add_edit_API, data: [setEmployee] });

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
            <Step key={label}>
              <StepLabel sx={{ cursor: "pointer" }}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>

      <AutoForm formData={formData} ref={formApi} isValidate={true} />
      {/* <Box display='flex' p={2} flexDirection='column' justifyContent='space-between'>
        <Box>
          <Controls.Button onClick={handleBack} disabled={activeStep === 0} sx={Styles.button} text="Back" />
          {activeStep !== steps.length - 1 && <Controls.Button onClick={handleNext} sx={Styles.button} text={'Next'} />}
          {activeStep === steps.length - 1 && <Controls.Button onClick={handleSubmit} sx={Styles.button} text="Submit" />}
        </Box>
      </Box> */}

    </Box>
  );
}