import React, { useState } from "react";
import Controls from '../../../components/controls/Controls';
import Popup from '../../../components/Popup';
import { AutoForm } from '../../../components/useForm';
import { API } from '../_Service';
import { useDispatch } from 'react-redux';
import { handlePostActions } from '../../../store/actions/httpactions';
import useDropDownData from "../../../components/useDropDownData";
import DataGrid from '../../../components/useDataGrid';

export default function Area() {
  const [openPopup, setOpenPopup] = useState(false);
  const formRef = React.useRef(null);

  const dispatch = useDispatch();
  const { countries, cities, states, setFilter } = useDropDownData();


  const filterState = (data) => {
    setFilter({ type: "country", data: [data], matchWith: "id" });
  }

  const filterCity = (data) => {
    setFilter({ type: "state", data: [data], matchWith: "id" });
  }

  const handleSubmit = (e) => {
    const { getValue, validateFields } = formRef.current
    const values = getValue();
    if (validateFields()) {
      dispatch(handlePostActions(API.INSERT_AREA, values)).then(res => {
        console.log(res);
      });
    }
  }
  const formData = [
    {
      elementType: "ad_dropdown",
      name: "fkCountryId",
      label: "Country",
      required: true,
      validate: {
        errorMessage: "Company is required",
      },
      dataName: 'name',
      options: countries,
      onChange: filterState,
      defaultValue: countries?.length ? countries[0] : null
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
      onChange: filterCity,
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
      defaultValue: null
    },
    {
      elementType: "inputfield",
      name: "areaName",
      label: "Area",
      required: true,
      validate: {
        errorMessage: "Area is required"
      },
      defaultValue: ""
    },

  ];
  return (
    <><Popup
      title="Add Country"
      openPopup={openPopup}
      maxWidth="sm"
      addOrEditFunc={handleSubmit}
      setOpenPopup={setOpenPopup}>
      <AutoForm formData={formData} ref={formRef} isValidate={true} />
    </Popup><Controls.Button onClick={() => { setOpenPopup(true); }} text="Add Area" /><DataGrid /></>
  );
}
