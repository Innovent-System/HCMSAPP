import React, { useEffect } from "react";
import { Grid,makeStyles } from "@material-ui/core";
import Controls from "../../../../components/controls/Controls";
import { useForm, Form } from "../../../../components/useForm";


const initialFValues = {
  id:0,
  countryName: "",
};


const useStyles = makeStyles((theme) => ({
  inputStyle: {
    width: '170%',
  },

}));

export default function CountryModel(props) {
  
  const { addOrEdit, recordForEdit } = props;
  const classes = useStyles();
  
  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("countryName" in fieldValues)
      temp.countryName = fieldValues.countryName ? "" : "This field is required.";

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
            name="countryName"
            label="Country Name"
            value={values.countryName}
            onChange={handleInputChange}
            error={errors.countryName}
            className={classes.inputStyle}
          />
            <Controls.Button type="submit" text="Submit" />
            <Controls.Button text="Reset" color="default" onClick={resetForm} />

        </Grid>
     
      </Grid>
    </Form>
  );
}
