// eslint-disable-next-line react-hooks/exhaustive-deps
import React, { useEffect, useRef, useState } from "react";
import Controls from '../../../components/controls/Controls';
import Popup from '../../../components/Popup';
import { AutoForm } from '../../../components/useForm';
import { API } from '../_Service';
import { useDispatch } from 'react-redux';
import { handleGetActions, handlePostActions, handlePatchActions, handleDeleteActions } from '../../../store/actions/httpactions';
import useDropDownData from "../../../components/useDropDown";
import { Typography, Stack } from "../../../deps/ui";
import { Circle } from "../../../deps/ui/icons";
import DataGrid, { useGridApi, getActions } from '../../../components/useDataGrid';
import { useSocketIo } from '../../../components/useSocketio';
import ConfirmDialog from '../../../components/ConfirmDialog'


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

const getColumns = (apiRef, onEdit, onActive, onDelete) => {
  const actionKit = {
    onActive: onActive,
    onEdit: onEdit,
    onDelete: onDelete
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
    { field: 'stateName', headerName: 'State', align: 'center' },
    { field: 'cityName', headerName: 'City' },
    {
      field: 'isActive', headerName: 'Status', renderCell: (param) => (
        param.row["isActive"] ? <Circle color="success" /> : <Circle color="disabled" />
      ),
      flex: '0 1 5%',
      align: 'center',
    },
    {
      field: 'detail',
      headerName: 'Detail',
      flex: '0 1 30%',
      renderCell: CombineDetail
    },
    getActions(apiRef, actionKit)
  ]
}
let editId = 0;
const Area = () => {
  const dispatch = useDispatch();
  const [openPopup, setOpenPopup] = useState(false);
  const [pageSize, setPageSize] = useState(30);
  const isEdit = React.useRef(false);
  const formRef = React.useRef(null);
  const [loader, setloader] = useState(false);
  const [selectionModel, setSelectionModel] = React.useState([]);
  const offSet = useRef({
    limit: 10,
    lastKeyId: null,
    totalRecord: 0
  })

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });

  const gridApiRef = useGridApi();
  const [areas, setArea] = useState([]);
  const { countries, cities, states, filterType, setFilter } = useDropDownData();

  const getAreaData = () => {
    setloader(true);
    dispatch(handleGetActions(API.GET_AREA)).then(res => {
      if (res.data) {
        offSet.current.totalRecord = res.data.totalRecord;
        offSet.current.lastKeyId = res.data.AreaData?.length ? res.data.AreaData[res.data.AreaData.length - 1].id : null;
        setloader(false);
        setArea(res.data.AreaData);
      }
    });
  }
  const { socketData } = useSocketIo("changeInArea", getAreaData);
  useEffect(() => {
    if (Array.isArray(socketData)) {
      setArea(socketData);
    }
  }, [socketData])

  const loadMoreData = () => {
    if (areas.length < offSet.current.totalRecord) {
      setloader(true);
      dispatch(handleGetActions(API.GET_AREA, {
        limit: offSet.current.limit,
        lastKeyId: offSet.current.lastKeyId
      })).then(res => {
        setloader(false);
        if (res.data) {
          offSet.current.lastKeyId = res.data.AreaData?.length ? res.data.AreaData[res.data.AreaData.length - 1].id : null;
          setArea(areas.concat(res.data.AreaData));
        }
      });
    }

  }

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
    dispatch(handlePatchActions(API.ACTIVE_INACTIVE_AREA, { areaId: id }));
  }

  const handelDeleteItems = (ids) => {
    let idTobeDelete = ids;
    if (Array.isArray(ids)) {
      idTobeDelete = ids.join(',');
    }

    setConfirmDialog({
      isOpen: true,
      title: "Are you sure to delete this records?",
      subTitle: "You can't undo this operation",
      onConfirm: () => {
        dispatch(handleDeleteActions(API.DELETE_AREA, { areaIds: idTobeDelete })).then(res => {
          setSelectionModel([]);
        })
      },
    });

  }


  useEffect(() => {
    getAreaData();
  }, [dispatch])

  const columns = getColumns(gridApiRef, handleEdit, handleActiveInActive, handelDeleteItems);

  const handleSubmit = (e) => {
    const { getValue, validateFields } = formRef.current
    if (validateFields()) {
      let values = getValue();
      let dataToInsert = {};
      dataToInsert.areaName = values.areaName;
      dataToInsert.country = { country_id: values.fkCountryId._id, countryName: values.fkCountryId.name };
      dataToInsert.state = { state_id: values.fkStateId._id, stateName: values.fkStateId.name };
      dataToInsert.city = { city_id: values.fkCityId._id, cityName: values.fkCityId.name };
      if (isEdit.current)
        dataToInsert._id = editId


      dispatch(handlePostActions(API.INSERT_AREA, [dataToInsert]));
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

  const showAddModal = () => {
    isEdit.current = false;
    setOpenPopup(true);
  }

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
      <DataGrid apiRef={gridApiRef}
        columns={columns} rows={areas}
        loading={loader} pageSize={pageSize}
        onAdd={showAddModal}
        onDelete={handelDeleteItems}
        selectionModel={selectionModel}
        setSelectionModel={setSelectionModel}
        onRowsScrollEnd={loadMoreData}
      />
      <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
    </>
  );
}
export default Area;