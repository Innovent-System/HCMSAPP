// eslint-disable-next-line react-hooks/exhaustive-deps
import React, { useEffect, useRef, useState } from "react";
import Controls from '../../../components/controls/Controls';
import Popup from '../../../components/Popup';
import { AutoForm } from '../../../components/useForm';
import { API } from '../_Service';
import { useDispatch, useSelector } from 'react-redux';
import { handleGetActions, handlePostActions, handlePatchActions, handleDeleteActions } from '../../../store/actions/httpactions';
import { useDropDown, useDropDownIds, useFilterBarEvent } from "../../../components/useDropDown";
import { Typography, Stack, GridToolbarContainer, InputAdornment, IconButton, Box } from "../../../deps/ui";
import { Circle, Search, Add as AddIcon, Delete as DeleteIcon } from "../../../deps/ui/icons";
import DataGrid, { useGridApi, getActions } from '../../../components/useDataGrid';
import { useSocketIo } from '../../../components/useSocketio';
import ConfirmDialog from '../../../components/ConfirmDialog';
import { SET_QUERY_FIELDS, SET_SHOW_FILTER, ENABLE_FILTERS } from '../../../store/actions/types'
import PropTypes from 'prop-types'

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

const fields = {
  areaName: {
    label: 'Area',
    type: 'text',
    valueSources: ['value'],
    preferWidgets: ['text'],
  },
  createdAt: {
    label: 'Created Date',
    type: 'date',
    fieldSettings: {
      dateFormat: "D/M/YYYY",
      mongoFormatValue: val => ({ $date: new Date(val).toISOString() }),
    },
    valueSources: ['value'],
    preferWidgets: ['date'],
  },

  isActive: {
    label: 'Status',
    type: 'boolean',
    operators: ['equal'],
    valueSources: ['value'],
  },
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
  const formApi = React.useRef(null);
  const [loader, setloader] = useState(false);
  const [selectionModel, setSelectionModel] = React.useState([]);
  const offSet = useRef({
    limit: 10,
    lastKeyId: null,
    totalRecord: 0,
    isLoadFirstTime: true,
  })

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });

  const [areas, setArea] = useState([]);

  const gridApiRef = useGridApi();
  const { countries, cities, states, filterType, setFilter } = useDropDown();
  const query = useSelector(e => e.query.builder);
  const dropDownIds = useDropDownIds();
  const getAreaData = (pageSize = 10, isLoadMore = false) => {
    const { countryIds, stateIds, cityIds } = dropDownIds;
    setloader(true);
    dispatch(handleGetActions(API.GET_AREA, {
      limit: pageSize,
      lastKeyId: isLoadMore ? offSet.current.lastKeyId : null,
      countryIds,
      stateIds,
      cityIds,
      searchParams: query ?? null
    })).then(res => {
      if (res.data) {
        offSet.current.totalRecord = res.data.totalRecord;
        offSet.current.lastKeyId = res.data.entityData?.length ? res.data.entityData[res.data.entityData.length - 1].id : null;
        setloader(false);
        if (isLoadMore)
          setArea([...res.data.entityData, ...areas]);
        else
          setArea(res.data.entityData)
      }
    });
  }

  const { socketData } = useSocketIo("changeInArea", getAreaData);
  useEffect(() => {
    if (Array.isArray(socketData)) {
      setArea(socketData);
    }
  }, [socketData])

  useFilterBarEvent(getAreaData, getAreaData);

  const loadMoreData = (params) => {
    if (areas.length < offSet.current.totalRecord && params.viewportPageSize !== 0) {
      getAreaData(params.viewportPageSize, true);
    }
  }

  const handleEdit = (id) => {
    isEdit.current = true;
    editId = id;
    const { setFormValue } = formApi.current;

    const area = areas.find(a => a.id === id);
    setFilter(countries.find(c => c._id === area.country_id), filterType.COUNTRY, "id", (data) => {
      const { states, cities } = data;
      setFormValue({
        fkCountryId: countries.find(c => c._id === area.country_id),
        fkStateId: states.find(s => s._id === area.state_id),
        fkCityId: cities.find(ct => ct._id === area.city_id),
        areaName: area.areaName
      });
      setOpenPopup(true);
    });


  }

  const handleActiveInActive = (id) => {
    dispatch(handlePatchActions(API.ACTIVE_INACTIVE_AREA, { _id: id }));
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
        dispatch(handleDeleteActions(API.DELETE_AREA, idTobeDelete)).then(res => {
          setSelectionModel([]);
        })
      },
    });

  }


  useEffect(() => {
    offSet.current.isLoadFirstTime = false;
    getAreaData();
    dispatch({
      type: SET_SHOW_FILTER, payload: {
        country: true,
        state: true,
        city: true
      }
    })

    dispatch({ type: ENABLE_FILTERS, payload: true })

    dispatch({
      type: SET_QUERY_FIELDS, payload: {
        fields
      }
    })
  }, [dispatch])

  const columns = getColumns(gridApiRef, handleEdit, handleActiveInActive, handelDeleteItems);

  const handleSubmit = (e) => {
    const { getValue, validateFields } = formApi.current
    if (validateFields()) {
      let values = getValue();
      let dataToInsert = {};
      dataToInsert.areaName = values.areaName;
      dataToInsert.country = { country_id: values.fkCountryId._id, countryName: values.fkCountryId.name };
      dataToInsert.state = { state_id: values.fkStateId._id, stateName: values.fkStateId.name };
      dataToInsert.city = { city_id: values.fkCityId._id, cityName: values.fkCityId.name };
      if (isEdit.current)
        dataToInsert._id = editId


      dispatch(handlePostActions(API.INSERT_UPDATE_AREA, [dataToInsert]));
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
    }
  ];

  const showAddModal = () => {
    isEdit.current = false;
    const { resetForm } = formApi.current;
    resetForm();
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
        <AutoForm formData={formData} ref={formApi} isValidate={true} />
      </Popup>
      <DataGrid apiRef={gridApiRef}
        columns={columns} rows={areas}
        loading={loader} pageSize={pageSize}
        onAdd={showAddModal}
        onDelete={handelDeleteItems}
        getData={getAreaData}
        toolbarProps={{
          apiRef: gridApiRef,
          onAdd: showAddModal,
          onDelete: handelDeleteItems,
          selectionModel
        }}
        gridToolBar={AreaToolbar}
        selectionModel={selectionModel}
        setSelectionModel={setSelectionModel}
        onRowsScrollEnd={loadMoreData}
      />
      <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
    </>
  );
}
export default Area;

function AreaToolbar(props) {
  const { apiRef, onAdd, onDelete, selectionModel } = props;


  return (
    <>
      <GridToolbarContainer sx={{ justifyContent: "flex-end" }}>
        <Box >
          {selectionModel?.length ? <Controls.Button onClick={() => onDelete(selectionModel)} startIcon={<DeleteIcon />} text="Delete Items" /> : null}
          <Controls.Button onClick={onAdd} startIcon={<AddIcon />} text="Add record" />
        </Box>
      </GridToolbarContainer>
    </>

  );
}

AreaToolbar.propTypes = {
  apiRef: PropTypes.shape({
    current: PropTypes.object.isRequired,
  }).isRequired,
  onAdd: PropTypes.func,
  onDelete: PropTypes.func,
  selectionModel: PropTypes.array,
};