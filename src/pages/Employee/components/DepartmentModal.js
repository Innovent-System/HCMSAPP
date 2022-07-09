import React, { useEffect } from "react";
import { Grid } from "../../../deps/ui";
import Controls from "../../../components/controls/Controls";
import { useForm, Form } from "../../../components/useForm";
import PropTypes from 'prop-types'

const initialFValues = {
  id:0,
  departmentName: "",
};


const Styles = {
  inputStyle: {
    width: '170%',
  },

};

export default function DepartmentModel(props) {
  
  const { addOrEdit, recordForEdit } = props;
  
  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("departmentName" in fieldValues)
      temp.designationName = fieldValues.designationName ? "" : "This field is required.";

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
            name="departmentName"
            label="Department Name"
            value={values.departmentName}
            onChange={handleInputChange}
            error={errors.departmentName}
            className={Styles.inputStyle}
          />
            <Controls.Button type="submit" text="Submit" />
            <Controls.Button text="Reset" color="inherit" onClick={resetForm} />

        </Grid>
     
      </Grid>
    </Form>
  );
}

DepartmentModel.propTypes = {
    addOrEdit:PropTypes.func,
    recordForEdit:PropTypes.object
}