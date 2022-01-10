import React, { useCallback,useEffect,useState } from 'react';
import { Stepper, Collapse, Box,Step,StepLabel,Typography } from '../../deps/ui';
import { AutoForm } from '../../components/useForm';
import Controls from '../../components/controls/Controls';
import {useDispatch} from 'react-redux';
import avatar from '../../assests/images/avatar_6.png';
import { API } from './_Service';
import { handleGetActions } from '../../store/actions/httpactions';


const Styles = {
  root: {
    width: '100%',
  },
  button: {
    marginRight: 1,
  },
  instructions: {
    marginTop: 1,
    marginBottom: 1,
  },
}

const genderItems = [
  { id: "male", title: "Male" },
  { id: "female", title: "Female" },
  { id: "other", title: "Other" },
]

const initialFValues = {
  id: 0,
  emplyeeRefNo: "",
  punchCode: "",
  firstName: "",
  lastName: "",

  maritalstatus: 0,
  nic: null,
  email: "", addresses: ["", ""],
  mobileNumber: "", gender: 0, dateofBirth: null, religion: 0,

  fkCompanyId: 0,
  fkCountryId: 0,
  fkStateId: 0,
  fkCityId: 0,
  fkAreaId: 0,
  fkDepartmentId: 0,
  fkEmployeeGroupId: 0,
  fkDesignationId: null,
  confirmationDate: null,
  resignationDate: null,
  isAllowManualAttendance: false,
  isAllowLogin: false,
  templateId:0
}

const getSteps = () => {
  return ['General Information', 'Additional Information', 'Company Information'];
}

let DROPDOWN_DATA = {};

export default function List() {
  
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const formRef = React.useRef(null);
  const steps = getSteps();
  const dispatch = useDispatch();
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]); 
  
  useEffect(() => {
    dispatch(handleGetActions(API.GET_REGULAR_DROPDOWN)).then(res => {
      if(res){
        DROPDOWN_DATA = res.data;
        setCountries(res.data.Countries);
      }
    });
  }, []);


  const filterState = (data) => {
    if(!data) return;
    setStates([...DROPDOWN_DATA.States.filter(f => f.country_id === data.id)]);
  }

  const filterCity = (data) => {
    if(!data) return;
    setCities([...DROPDOWN_DATA.Cities.filter(f => f.state_id === data.id)]);
  }

  const formData = useCallback(
    () => {
      return [
        {
          Component: Collapse,
          in: activeStep === 0,
          style: { width: 'inherit' },
          _children: [
            {
              elementType: "uploadavatar",
              name: "employeeImage",
              breakpoints: { md: 12, sm: 12, xs: 12 },
              defaultValue:null
            },
            {
              elementType: "inputfield",
              name: "emplyeeRefNo",
              label: "Employee Code",
              required: true,
              type: 'number',
              validate: {
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
              validate: {
                errorMessage: "Punch Code is required"
              },
              defaultValue: ""
            },
            {
              elementType: "inputfield",
              name: "firstName",
              label: "First Name",
              validate: {
                errorMessage: "First Name is required",
              },
              defaultValue: ""
            },
            {
              elementType: "inputfield",
              name: "lastName",
              label: "Last Name",
              required: true,
              validate: {
                errorMessage: "Last Name is required",
                type: "string"
              },
              defaultValue: ""
            },
            {
              elementType: "inputfield",
              name: "email",
              label: "Email",
              required: (value) => value["isAllowManualAttendance"],
              type: "email",
              validate: {
                errorMessage: "Email is required",
                validate: (val) => /$^|.+@.+..+/.test(val)
              },
              defaultValue: ""
            },
            {
              elementType: "inputfield",
              name: "mobileNumber",
              label: "Mobile No",
              validate: {
                errorMessage: "Mobile No is required",
              },
              defaultValue: ""
            },
            {
              elementType: "checkbox",
              name: "isAllowManualAttendance",
              label: "Manual Attendance",
              defaultValue: false,
            },
            {
              elementType: "dropdown",
              name: "templateId",
              label: "User Template",
              disabled: (value) => value["isAllowManualAttendance"] === false,
              defaultValue: 1,
              options: [{
                id: 0, title: "Manager"
              },
              { id: 1, title: "Hr Manager" },
              { id: 2, title: "SubOrdinates" }
              ]
            },
            {
              elementType: "dropdown",
              name: "maritalstatus",
              label: "Marital Status",
              defaultValue: 2,
              options: [{
                id: 0, title: "Single"
              },
              { id: 1, title: "Married" },
              { id: 2, title: "Widowed" },
              { id: 3, title: "Boxorced" }
              ]
            },
            {
              elementType: "dropdown",
              name: "gender",
              label: "Gender",
              defaultValue: 1,
              options: [{
                id: 1, title: "Male"
              },
              { id: 2, title: "Female" },
              { id: 3, title: "Others" }
              ]
            },
            {
              elementType: "dropdown",
              name: "religion",
              label: "Religion",
              defaultValue: 1,
              options: [{
                id: 1, title: "Islam"
              },
              { id: 2, title: "Hindu" },
              { id: 3, title: "Christain" },
              { id: 4, title: "Others" }
              ]
            },
            {
              elementType: "datetimepicker",
              name: "dateofBirth",
              label: "D.O.B",
              defaultValue: null
            }
          ]
        },
        {
          Component: Collapse,
          in: activeStep === 1,
          style: { width: 'inherit' },
          _children: [
            {
              elementType: "ad_dropdown",
              name: "fkCompanyId",
              label: "Country",
              required: true,
              validate: {
                errorMessage: "Company is required",
              },
              dataName:'name',
              options: countries,
              onChange:filterState,
              defaultValue: countries[0] ?? null
            },
            {
              elementType: "ad_dropdown",
              name: "fkStateId",
              label: "State",
              required: true,
              dataName: "name",
              validate: {
                errorMessage: "State is required",
              },
              options: states,
              onChange:filterCity,
              defaultValue: null
            },
            {
              elementType: "ad_dropdown",
              name: "fkCityId",
              label: "City",
              required: true,
              dataName: "name",
              validate: {
                errorMessage: "City is required",
              },
              options: cities,
              defaultValue:null
            }

          ]
        },

      ]
    },
    [activeStep,countries,states,cities],
  )



  const isStepOptional = (step) => {
    return step === 1;
  }

  const isStepSkipped = (step) => {
    return skipped.has(step);
  }

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Box sx={Styles.root}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          if (isStepOptional(index)) {
            labelProps.optional = <Typography variant="caption">Optional</Typography>;
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
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
            <Controls.Button onClick={handleReset} sx={Styles.button} text="Reset"/>
          </Box>
        ) : (
          <Box display='flex' flexDirection='column' justifyContent='space-between'>
            <AutoForm formData={formData()} ref={formRef} isValidate={true} />
            <Box>

              <Controls.Button onClick={handleBack} disabled={activeStep === 0} sx={Styles.button} text="Back"/>
              {isStepOptional(activeStep) && (

               <Controls.Button onClick={handleSkip} sx={Styles.button} text="Skip"/>
              )}

               <Controls.Button onClick={handleNext} sx={Styles.button} text={activeStep === steps.length - 1 ? 'Finish' : 'Next'}/>

            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}