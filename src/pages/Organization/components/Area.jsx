// eslint-disable-next-line react-hooks/exhaustive-deps
import React, { useEffect, useRef, useState } from "react";
import Controls from '../../../components/controls/Controls';
import Popup from '../../../components/Popup';
import { AutoForm } from '../../../components/useForm';
import { API } from '../_Service';
import { enableFilterAction, builderFieldsAction, showDropDownFilterAction, useEntitiesQuery, useEntityAction } from '../../../store/actions/httpactions';
import { useDropDown, useDropDownIds } from "../../../components/useDropDown";
import { Typography, Stack, GridToolbarContainer } from "../../../deps/ui";
import { Circle, Add as AddIcon, Delete as DeleteIcon } from "../../../deps/ui/icons";
import DataGrid, { useGridApi, getActions, GridToolbar } from '../../../components/useDataGrid';
import { useSocketIo } from '../../../components/useSocketio';
import ConfirmDialog from '../../../components/ConfirmDialog';
import PropTypes from 'prop-types'
import { useAppDispatch, useAppSelector } from "../../../store/storehook";

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
    { field: 'stateName', headerName: 'State', align: 'center' },
    { field: 'cityName', headerName: 'City' },
    {
      field: 'isActive', headerName: 'Status', renderCell: (param) => (
        param.row["isActive"] ? <Circle color="success" /> : <Circle color="disabled" />
      ),
      // flex: '0 1 5%',
      align: 'center',
    },
    {
      field: 'detail',
      headerName: 'Detail',
      flex:1,
      renderCell: CombineDetail
    },
    getActions(apiRef, actionKit)
  ]
}
let editId = 0;
const DEFAULT_API = API.AREA;
export const AddArea = ({ openPopup, setOpenPopup, isEdit = false, row = null }) => {
  const { addEntity } = useEntityAction();
  const formApi = useRef(null);
  const { countries, cities, states, employees, filterType, setFilter } = useDropDown();

  useEffect(() => {
    if (!formApi.current || !openPopup) return;
    const { resetForm, setFormValue } = formApi.current;
    if (openPopup && !isEdit)
      resetForm();
    else {
      setFilter(countries.find(c => c._id === row.country_id), filterType.COUNTRY, "id", (data) => {
        const { states, cities } = data;
        setFormValue({
          fkCountryId: countries.find(c => c._id === row.country_id),
          fkStateId: states.find(s => s._id === row.state_id),
          fkCityId: cities.find(ct => ct._id === row.city_id),
          areaName: row.areaName
        });
      });
    }
  }, [openPopup, formApi])

  const handleSubmit = (e) => {
    const { getValue, validateFields } = formApi.current
    if (validateFields()) {
      let values = getValue();
      let dataToInsert = { ...values };
      dataToInsert.areaHead = dataToInsert.areaHead?._id ?? null;
      dataToInsert.country = { country_id: values.fkCountryId._id, countryName: values.fkCountryId.name, intId: values.fkCountryId.id };
      dataToInsert.state = { state_id: values.fkStateId._id, stateName: values.fkStateId.name, intId: values.fkStateId.id };
      dataToInsert.city = { city_id: values.fkCityId._id, cityName: values.fkCityId.name, intId: values.fkCityId.id };
      if (isEdit)
        dataToInsert._id = editId

      addEntity({ url: DEFAULT_API, data: [dataToInsert] }).then(r => {
        if (r?.data) setOpenPopup(false);
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
      onKeyDown: (e) => e.keyCode == 13 && handleSubmit(),
      validate: {
        errorMessage: "Area is required"
      },
      defaultValue: ""
    },
    {
      elementType: "ad_dropdown",
      name: "areaHead",
      label: "Area Head",
      dataName: 'fullName',
      dataId: '_id',
      options: employees,
      defaultValue: null
    },
  ];

  return <Popup
    title="Add Area"
    openPopup={openPopup}
    maxWidth="sm"
    isEdit={isEdit}
    keepMounted={true}
    addOrEditFunc={handleSubmit}
    setOpenPopup={setOpenPopup}>
    <AutoForm formData={formData} ref={formApi} isValidate={true} />
  </Popup>

}

const Area = () => {
  const dispatch = useAppDispatch();
  const [openPopup, setOpenPopup] = useState(false);

  const isEdit = React.useRef(false);
  const row = useRef(null);
  const [selectionModel, setSelectionModel] = React.useState([]);

  const [sort, setSort] = useState({ sort: { createdAt: -1 } });

  const [filter, setFilter] = useState({
    lastKey: null,
    limit: 10,
    page: 0,
    totalRecord: 0
  })

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });

  const gridApiRef = useGridApi();
  const query = useAppSelector(e => e.appdata.query.builder);
  const { countryIds, stateIds, cityIds } = useDropDownIds();

  const { data, isLoading, refetch, totalRecord } = useEntitiesQuery({
    url: DEFAULT_API,
    data: {
      limit: filter.limit,
      page: filter.page + 1,
      lastKeyId: filter.lastKey,
      ...sort,
      searchParams: {
        ...query,
        ...(countryIds && { "country.country_id": countryIds }),
        ...(stateIds && { "state.state_id": stateIds }),
        ...(cityIds && { "city.city_id": cityIds })
      }
    }
  }, { selectFromResult: ({ data, isLoading }) => ({ data: data?.entityData, totalRecord: data?.totalRecord, isLoading }) });


  const { updateOneEntity, removeEntity } = useEntityAction();

  const { socketData } = useSocketIo("changeInArea", refetch);

  const handleEdit = (id) => {
    isEdit.current = true;
    editId = id;
    row.current = data.find(a => a.id === id);
    setOpenPopup(true);

  }

  const handleActiveInActive = (id) => {
    updateOneEntity({ url: DEFAULT_API, data: { _id: id } });
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
        removeEntity({ url: DEFAULT_API, params: idTobeDelete }).then(res => {
          setSelectionModel([]);
        })
      },
    });

  }

  useEffect(() => {
    dispatch(showDropDownFilterAction({
      country: true,
      state: true,
      city: true
    }))
    dispatch(enableFilterAction(true));
    dispatch(builderFieldsAction(fields))

  }, [dispatch])

  const columns = getColumns(gridApiRef, handleEdit, handleActiveInActive, handelDeleteItems);

  const showAddModal = () => {
    isEdit.current = false;
    setOpenPopup(true);
  }

  return (
    <>
      <AddArea openPopup={openPopup} setOpenPopup={setOpenPopup} row={row.current} isEdit={isEdit.current} />
      <DataGrid apiRef={gridApiRef}
        columns={columns} rows={data}
        loading={isLoading}
        totalCount={totalRecord}
        pageSize={filter.limit}
        page={filter.page}
        setFilter={setFilter}
        onSortModelChange={(s) => setSort({ sort: s.reduce((a, v) => ({ ...a, [v.field]: v.sort === 'asc' ? 1 : -1 }), {}) })}
        toolbarProps={{
          apiRef: gridApiRef,
          onAdd: showAddModal,
          selectionModel
        }}
        gridToolBar={GridToolbar}
        selectionModel={selectionModel}
        setSelectionModel={setSelectionModel}
      />
      <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
    </>
  );
}
export default Area;