import React, { useEffect } from "react";
import { Grid,Stepper,Step,StepButton } from "@material-ui/core";
import Controls from "../../../components/controls/Controls";
import { useForm, Form } from "../../../components/useForm";
import * as employeeService from "../../../services/employeeService";
import { Send } from '@material-ui/icons'

const genderItems = [
  { id: "male", title: "Male" },
  { id: "female", title: "Female" },
  { id: "other", title: "Other" },
];

const initialFValues = {
  id: 0,
  fullName: "",
  email: "",
  mobile: "",
  city: "",
  gender: "male",
  departmentId: "",
  hireDate: new Date(),
  isPermanent: false,
};

const getSteps = () => {
    return ['General Information', 'Additional Information', 'Company Information'];
  }

  const GeneralInfromation = () => {
      return(
          <h4>General Information</h4>
      )
  }

  const AdditionalInfromation = () => {
    return(
        <h4>Additional Information</h4>
    )
 }

 const CompanyInfromation = () => {
    return(
        <h4>Company Information</h4>
    )
 }

  const  getStepContent =(step)=> {
    switch (step) {
      case 0:
        return <GeneralInfromation/>;
      case 1:
        return <AdditionalInfromation/>;
      case 2:
        return <CompanyInfromation/>;
      default:
        return 'Unknown step';
    }
  }

export default function EmployeeNewForm(props) {
  const { addOrEdit, recordForEdit } = props;
  const steps = getSteps();
  const [activeStep, setActiveStep] = useState(0);
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

  const {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    resetForm,
  } = useForm(initialFValues, true, validate);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      addOrEdit(values, resetForm);
    }
  };

  useEffect(() => {
    if (recordForEdit != null)
      setValues({
        ...recordForEdit,
      });
  }, [recordForEdit]);

  return (
    <Form onSubmit={handleSubmit}>
       <Stepper alternativeLabel nonLinear activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const buttonProps = {};
          if (isStepOptional(index)) {
            buttonProps.optional = <Typography variant="caption">Optional</Typography>;
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepButton
                onClick={handleStep(index)}
                completed={isStepComplete(index)}
                {...buttonProps}
              >
                {label}
              </StepButton>
            </Step>
          );
        })}
      </Stepper>
    </Form>
  );
}
