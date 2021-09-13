import React, { useEffect } from "react";
import { Grid,makeStyles } from "@material-ui/core";
import Controls from "../../../../components/controls/Controls";
import { useForm, Form } from "../../../../components/useForm";


const initialFValues = {
  id:0,
  companyName: "",
};


const useStyles = makeStyles((theme) => ({
  inputStyle: {
    width: '170%',
  },

}));

export default function CompanyModel(props) {
  
  const { addOrEdit, recordForEdit } = props;
  const classes = useStyles();
  
  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("companyName" in fieldValues)
      temp.companyName = fieldValues.companyName ? "" : "This field is required.";

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
      <Grid container>
        <Grid item xs={6}>
          <Controls.Input
            name="companyName"
            label="Company Name"
            value={values.companyName}
            onChange={handleInputChange}
            error={errors.companyName}
            className={classes.inputStyle}
          />
            <Controls.Button type="submit" text="Submit" />
            <Controls.Button text="Reset" color="default" onClick={resetForm} />

        </Grid>
     
      </Grid>
    </Form>
  );
}
