// eslint-disable-next-line react-hooks/exhaustive-deps
import React, { useEffect, useState } from "react";
import Controls from '../../../components/controls/Controls';
import Popup from '../../../components/Popup';
import { AutoForm } from '../../../components/useForm';
import { API } from '../_Service';
import { useDispatch } from 'react-redux';
import { handleGetActions, handlePostActions } from '../../../store/actions/httpactions';
import useDropDownData from "../../../components/useDropDown";
import { Typography, Stack } from "../../../deps/ui";
import DataGrid, { useGridApi, getActions } from '../../../components/useDataGrid';

function CombineDetail(params) {
  return (
    <Stack flexWrap="wrap" flex="1 0 20%">
      <Typography variant="caption"><strong>Create On:</strong> {params.row['createdOn']}</Typography>
      <Typography variant="caption"><strong>Created By:</strong> {params.row['createdBy']}</Typography>
      <Typography variant="caption"><strong>Modified On:</strong> {params.row['modifiedOn']}</Typography>
      <Typography variant="caption"><strong>Modified By:</strong> {params.row['modifiedBy']}</Typography>
    </Stack>
  )
}

const getColumns = (apiRef, onEdit, onActive) => {
  const actionKit = {
    onActive: onActive,
    onEdit: onEdit
  }
  return [
    { field: '_id', headerName: 'Id', hide: true },
    {
      field: 'areaName', headerName: 'Area', width: 180
      // preProcessEditCellProps: (params) => {
      //   const hasError = params.props.value.length < 3;
      //   return { ...params.props, error: hasError };
      // },
    },
    { field: 'countryName', headerName: 'Country' },
    { field: 'stateName', headerName: 'State' },
    { field: 'cityName', headerName: 'City' },
    { field: 'isActive', headerName: 'Active' },
    {
      field: 'detail',
      headerName: 'Detail',
      width: 180,
      renderCell: CombineDetail
    },
    getActions(apiRef, actionKit)
  ]
}
let editId = 0;
const Area = () => {
  const dispatch = useDispatch();
  const [openPopup, setOpenPopup] = useState(false);
  const isEdit = React.useRef(false);
  const formRef = React.useRef(null);
  const gridApiRef = useGridApi();
  const [areas, setArea] = useState([]);
  const { countries, cities, states, filterType, setFilter } = useDropDownData();

  const handleEdit = (id) => {
    isEdit.current = true;
    editId = id;
    const { setFormValue } = formRef.current;
    const area = areas.find(a => a.id === id);
    setFormValue({
      fkCountryId: countries.find(c => c._id === area.country_id),
      fkStateId: states.find(s => s._id === area.state_id),
      fkCityId: cities.find(ct => ct._id === area.city_id),
      areaName: area.areaName
    });
    setOpenPopup(true);
  }
  const handleActiveInActive = (id) => {

  }
  const getAreaData = () => {
    dispatch(handleGetActions(API.GET_AREA)).then(res => {
      // console.log({res});
      if (res.data) {
        setArea(res.data);
      }
    });
  }

  useEffect(() => {
    getAreaData();
  }, [dispatch])

  const columns = getColumns(gridApiRef, handleEdit, handleActiveInActive);

  const handleSubmit = (e) => {
    const { getValue, validateFields } = formRef.current
    if (validateFields()) {
      let values = getValue();
      if(isEdit.current)
        values.id = editId;
      else
        values.id = 0;

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
      onChange: (data) => setFilter(data, filterType.COUNTRY, "id"),
      defaultValue: null
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
      onChange: (data) => setFilter(data, filterType.STATE, "id"),
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
    <>
      <Popup
        title="Add Area"
        openPopup={openPopup}
        maxWidth="sm"
        isEdit={isEdit.current}
        keepMounted={true}
        addOrEditFunc={handleSubmit}
        setOpenPopup={setOpenPopup}>
        <AutoForm formData={formData} ref={formRef} isValidate={true} />
      </Popup>
      <Controls.Button onClick={() => { isEdit.current = false; setOpenPopup(true) }} text="Add Record" />
      <DataGrid columns={columns} apiRef={gridApiRef} rows={areas} />
    </>
  );
}
export default Area;