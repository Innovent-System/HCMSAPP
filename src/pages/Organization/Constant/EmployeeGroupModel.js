import React, { useEffect } from "react";
import { Grid,makeStyles } from "@material-ui/core";
import Controls from "../../../components/controls/Controls";
import { useForm, Form } from "../../../components/useForm";
// import * as employeeService from "../../../services/employeeService";
import { API_CONSTANT_INSERTEMPLOYEEGROUP } from '../../../services/UrlService'; 
import { handlePostActions } from '../../../store/actions/authactions';
import { useSelector, useDispatch } from "react-redux";

const initialFValues = {
  groupName: "",
};


const useStyles = makeStyles((theme) => ({
  inputStyle: {
    width: '170%',
  },

}));

export default function EmployeeGroupModel(props) {
  const dispatch = useDispatch();
  const selector = useSelector(state => state[Object.keys(state)[0]]);
  const { addOrEdit, recordForEdit } = props;
  const classes = useStyles();
  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("groupName" in fieldValues)
      temp.groupName = fieldValues.groupName ? "" : "This field is required.";

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
      const employeeGroupData = {
        groupName:values.groupName, 
      }
     
      dispatch(handlePostActions(API_CONSTANT_INSERTEMPLOYEEGROUP,employeeGroupData));
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
            name="groupName"
            label="Group Name"
            value={values.groupName}
            onChange={handleInputChange}
            error={errors.groupName}
            className={classes.inputStyle}
          />
            <Controls.Button type="submit" text="Submit" />
            <Controls.Button text="Reset" color="default" onClick={resetForm} />

        </Grid>
     
      </Grid>
    </Form>
  );
}
