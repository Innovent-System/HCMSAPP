import React, { useEffect } from "react";
import { Grid, makeStyles } from "@material-ui/core";
import Controls from "../../../../components/controls/Controls";
import { AutoForm } from "../../../../components/useForm";


const genderItems = [
  { id: "male", title: "Male" },
  { id: "female", title: "Female" },
  { id: "other", title: "Other" },
];

const initialFValues = {
  id: 0,
  groupName: "",
};


const useStyles = makeStyles((theme) => ({
  inputStyle: {
    width: '170%',
  },

}));

export default function EmployeeGroupModel(props) {

  const { addOrEdit, recordForEdit } = props;
  const classes = useStyles();
  const formData = [{
    elementType:"inputfield",
    name:"groupName",
    label:"Group Name",
    defaultValue :"",
    classes:classes.inputStyle,
    register:{
      errorMessage:"Group Name is required",
      type:"string"
    }
    },
  ];


  const handleSubmit = (e) => {
    e.preventDefault();

    // if (validate()) {
    //   addOrEdit(values, resetForm);
    // }
  };

  useEffect(() => {
    // if (recordForEdit != null)
      // setValues({
      //   ...recordForEdit,
      // });
  }, [recordForEdit]);

  return (
    <AutoForm style={{flexDirection:"column"}} formData={formData} isValidate={true} onSubmit={handleSubmit}>
        <Grid  item xs={6}>
          <Controls.Button type="submit" text="Submit" />
          <Controls.Button text="Reset" color="default"  />
        </Grid>
    </AutoForm>
  );
}
