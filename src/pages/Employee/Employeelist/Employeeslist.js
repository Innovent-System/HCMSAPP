import React, { useCallback } from 'react';
import { makeStyles, Grid, Collapse, Box } from '@material-ui/core';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Form, useForm, AutoForm } from '../../../components/useForm';
import Controls from '../../../components/controls/Controls';
import avatar from '../../../assests/images/avatar_6.png'


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}))

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

const GeneralInfromation = ({ detail, onchange, errors }) => {
  return (
    <>
      <h4>General Information</h4>
      <Grid spacing={3} xs={8} container>
        <Grid item sx={6}>
          <Controls.Input
            name="emplyeeRefNo"
            label="Employee Code"
            type="number"
            InputProps={{
              inputProps: { min: 0 }
            }}
            value={detail.emplyeeRefNo}
            onChange={onchange}
            error={errors.emplyeeRefNo}

          />
        </Grid>
        <Grid item sx={6}>
          <Controls.Input
            name="punchCode"
            label="Punch Code"
            value={detail.punchCode}
            onChange={onchange}
            error={errors.punchCode}

          />
        </Grid>
        <Grid item sx={6}>
          <Controls.Input
            name="firstName"
            label="First Name"
            value={detail.firstName}
            onChange={onchange}
            error={errors.firstName}

          />
        </Grid>
        <Grid item sx={6}>
          <Controls.Input
            name="lastName"
            label="Last Name"
            value={detail.lastName}
            onChange={onchange}
            error={errors.lastName}

          />
        </Grid>
        <Grid item sx={6}>
          <Controls.Checkbox
            name="isAllowManualAttendance"
            label="Allow Manual Attendance"
            value={detail.isAllowManualAttendance}
            onChange={onchange}
          />
        </Grid>
        <Grid item sx={6}>
          <Controls.Checkbox
            name="isAllowLogin"
            label="Allow Login"
            value={detail.isAllowLogin}
            onChange={onchange}

          />
        </Grid>
      </Grid>

    </>


  )
}

const AdditionalInfromation = ({ detail, onchange, errors }) => {
  return (
    <h4>Additional Information</h4>
  )
}

const CompanyInfromation = ({ detail, onchange, errors }) => {
  return (
    <h4>Company Information</h4>
  )
}



export default function HorizontalLinearStepper() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const steps = getSteps();

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
              defaultValue: '1',
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
              defaultValue: '2',
              options: [{
                id: 0, title: "Single"
              },
              { id: 1, title: "Married" },
              { id: 2, title: "Widowed" },
              { id: 3, title: "Divorced" }
              ]
            },
            {
              elementType: "dropdown",
              name: "gender",
              label: "Gender",
              defaultValue: '1',
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
              elementType: "dropdown",
              name: "fkCompanyId",
              label: "Organization",
              required: true,
              validate: {
                errorMessage: "Company is required",
              },
              options: [{ id: 0, title: "Biltexco" },
              { id: 1, title: "Spursole" }],
              defaultValue: { id: 0, title: "Biltexco" }
            },
            {
              elementType: "ad_dropdown",
              name: "fkCountryId",
              label: "Country",
              required: true,
              dataId: "id",
              dataName: "title",
              validate: {
                errorMessage: "Country is required",
              },
              options: [{ id: 0, title: "Pakistan" },
              { id: 1, title: "America" }],
              defaultValue: { id: 0, title: "Pakistan" }
            },
            {
              elementType: "ad_dropdown",
              name: "fkStateId",
              label: "State",
              required: true,
              dataId: "id",
              dataName: "title",
              validate: {
                errorMessage: "State is required",
              },
              options: [{ id: 0, title: "Sindh" },
              { id: 1, title: "Punjab" }],
              defaultValue: { id: 0, title: "Sindh" }
            },

          ]
        },

      ]
    },
    [activeStep],
  )

  const getStepContent = useCallback((step, objectValues, onChange, errors) => {
    switch (step) {
      case 0:
        return <GeneralInfromation detail={objectValues} onchange={onChange} errors={errors} />;
      case 1:
        return <AdditionalInfromation detail={objectValues.companyInfo} onchange={onChange} errors={errors} />;
      case 2:
        return <CompanyInfromation detail={objectValues} onchange={onChange} errors={errors} />;
      default:
        return 'Unknown step';
    }
  },
    [activeStep],
  )

  const isStepOptional = (step) => {
    return step === 1;
  }
  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("fullName" in fieldValues)
      temp.fullName = fieldValues.fullName ? "" : "This field is required.";
    if ("email" in fieldValues)
      temp.email = /$^|.+@.+..+/.test(fieldValues.email)
        ? ""
        : "Email is not valid.";
    if ("mobile" in fieldValues)
      temp.mobile =
        fieldValues.mobile.length > 9 ? "" : "Minimum 10 numbers required.";
    if ("departmentId" in fieldValues)
      temp.departmentId =
        fieldValues.departmentId.length != 0 ? "" : "This field is required.";

    setErrors({
      ...temp,
    });

    if (fieldValues == values) return Object.values(temp).every((x) => x == "");
  };




  const { errors, setValues, values, resetForm, setErrors, handleInputChange } = useForm(initialFValues, true, validate);

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
    <div className={classes.root}>
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
      <div>
        {activeStep === steps.length ? (
          <div>
            <Typography className={classes.instructions}>
              All steps completed - you&apos;re finished
            </Typography>
            <Button onClick={handleReset} className={classes.button}>
              Reset
            </Button>
          </div>
        ) : (
          <Box display='flex' flexDirection='column' justifyContent='space-between'>
            <AutoForm formData={formData()} isValidate={true} />
            <div>
              <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                Back
              </Button>
              {isStepOptional(activeStep) && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSkip}
                  className={classes.button}
                >
                  Skip
                </Button>
              )}

              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                className={classes.button}
              >
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </div>
          </Box>
        )}
      </div>
    </div>
  );
}
