import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import { ToggleOff, ToggleOn, Search } from '../deps/ui/icons'
import { InputAdornment, IconButton } from '../deps/ui'
import Controls from '../components/controls/Controls'
import {
  useGridApiRef,
  DataGridPro,
  GridToolbarContainer,
  GridActionsCellItem,
  LicenseInfo, GridOverlay, GridToolbarExport, GridToolbarFilterButton
} from '@mui/x-data-grid-pro';
import LinearProgress from '@mui/material/LinearProgress';

LicenseInfo.setLicenseKey(
  '0f94d8b65161817ca5d7f7af8ac2f042T1JERVI6TVVJLVN0b3J5Ym9vayxFWFBJUlk9MTY1NDg1ODc1MzU1MCxLRVlWRVJTSU9OPTE=',
);

const generateQuery = (queryType, fieldName, value) => {
  let query = {};
  switch (queryType) {
    case "contains":
      query[fieldName] = `/${value}/i`;
      break;

    default:
      query[fieldName] = `/${value}/i`;
      break;
  }

  return query;

}

function EditToolbar(props) {
  const { apiRef, onAdd, onDelete, selectionModel, searchResult } = props;

  return (
    <>
      <GridToolbarContainer>
        <Controls.Input InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={searchResult}
              >
                <Search />
              </IconButton>
            </InputAdornment>
          ),
        }} />
        <Controls.Button onClick={onAdd} startIcon={<AddIcon />} text="Add record" />
        {selectionModel?.length ? <Controls.Button onClick={() => onDelete(selectionModel)} startIcon={<DeleteIcon />} text="Delete Items" /> : null}
      </GridToolbarContainer>
    </>

  );
}

EditToolbar.propTypes = {
  apiRef: PropTypes.shape({
    current: PropTypes.object.isRequired,
  }).isRequired,
  onAdd: PropTypes.func,
  onDelete: PropTypes.func,
  searchResult: PropTypes.func
};

export const getCrudActions = (apiRef, onSave, onDelete) => {

  const handleEditClick = (id) => (event) => {
    event.stopPropagation();
    apiRef.current.setRowMode(id, 'edit');
  };

  const handleSaveClick = (id) => async (event) => {
    event.stopPropagation();
    // Wait for the validation to run
    const isValid = await apiRef.current.commitRowChange(id);
    if (isValid) {
      apiRef.current.setRowMode(id, 'view');
      const row = apiRef.current.getRow(id);
      onSave(row, () => {
        apiRef.current.updateRows([{ ...row, isNew: false }]);
      })
    }
  };

  const handleDeleteClick = (id) => (event) => {
    event.stopPropagation();
    apiRef.current.updateRows([{ id, _action: 'delete' }]);
  }

  const handleCancelClick = (id) => (event) => {
    event.stopPropagation();
    apiRef.current.setRowMode(id, 'view');

    const row = apiRef.current.getRow(id);
    if (row.isNew) {
      apiRef.current.updateRows([{ id, _action: 'delete' }]);
    }
  }

  return {
    field: 'actions',
    type: 'actions',
    headerName: 'Actions',
    width: 100,
    cellClassName: 'actions',
    getActions: ({ id }) => {
      const isInEditMode = apiRef.current.getRowMode(id) === 'edit';

      if (isInEditMode) {
        return [
          <GridActionsCellItem
            icon={<SaveIcon />}
            label="Save"
            onClick={handleSaveClick(id)}
            color="primary"
          />,
          <GridActionsCellItem
            icon={<CancelIcon />}
            label="Cancel"
            className="textPrimary"
            onClick={handleCancelClick(id)}
            color="inherit"
          />,
        ];
      }

      return [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          className="textPrimary"
          onClick={handleEditClick(id)}
          color="inherit"
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={handleDeleteClick(id)}
          color="inherit"
        />,
      ];
    },
  }
}

export const getActions = (apiRef, actionKit = { onActive: null, onApproval: null, onEdit: null, onDelete: null }) => {

  return {
    field: 'actions',
    type: 'actions',
    headerName: 'Actions',
    flex: '0 1 30%',
    align: 'center',
    cellClassName: 'actions',
    getActions: ({ id }) => {
      const toolKit = [];
      const { onActive, onApproval, onEdit, onDelete } = actionKit;
      if (typeof onActive === "function") {
        toolKit.push(<GridActionsCellItem
          icon={<ToggleOn />}
          label="Active"
          onClick={() => onActive(id)}
          color={"primary"}
        />)
      }
      if (typeof onEdit === "function") {
        toolKit.push(<GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={() => onEdit(id)}
          color={"primary"}
        />)
      }
      if (typeof onDelete === "function") {
        toolKit.push(<GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => onDelete(id)}
          color={"primary"}
        />)
      }
      if (typeof onApproval === "function") {
        toolKit.push(<GridActionsCellItem
          icon={<SaveIcon />}
          label="Approval"
          onClick={() => onApproval(id)}
          color={"primary"}
        />)
      }

      return toolKit;
    },
  }
}

export const useGridApi = () => useGridApiRef();

function CustomLoadingOverlay() {
  return (
    <GridOverlay>
      <div style={{ position: 'absolute', top: 0, width: '100%' }}>
        <LinearProgress />
      </div>
    </GridOverlay>
  );
}

export default function FeaturedCrudGrid(props) {

  const { apiRef, columns, rows, loading,
    pageSize, onRowsScrollEnd, onDelete, onAdd,
    selectionModel, setSelectionModel,
    searchResult
  } = props;
  const handleRowEditStart = (params, event) => {
    event.defaultMuiPrevented = true;
  };

  const handleRowEditStop = (params, event) => {
    event.defaultMuiPrevented = true;
  };

  const handleCellFocusOut = (params, event) => {
    event.defaultMuiPrevented = true;
  };


  return (
    <Box
      sx={{
        height: 500,
        width: '100%',
        '& .actions': {
          color: 'text.secondary',
        },
        '& .textPrimary': {
          color: 'text.primary',
        },
      }}
    >
      <DataGridPro
        rows={rows}
        loading={loading}
        onSelectionModelChange={(newSelectionModel) => {
          setSelectionModel(newSelectionModel);
        }}
        selectionModel={selectionModel}
        columns={columns}
        checkboxSelection
        rowsPerPageOptions={[pageSize]}
        {...(onRowsScrollEnd && { onRowsScrollEnd })}
        apiRef={apiRef}
        editMode="row"
        onRowEditStart={handleRowEditStart}
        onRowEditStop={handleRowEditStop}
        onCellFocusOut={handleCellFocusOut}
        components={{
          LoadingOverlay: CustomLoadingOverlay,
          Toolbar: EditToolbar
        }}
        componentsProps={{
          toolbar: { apiRef, onDelete, onAdd, selectionModel, setSelectionModel },
        }}
      />
    </Box>
  );
}

FeaturedCrudGrid.propTypes = {
  columns: PropTypes.array.isRequired,
  rows: PropTypes.array.isRequired,
  apiRef: PropTypes.shape({
    current: PropTypes.object.isRequired,
  }).isRequired,
  pageSize: PropTypes.number,
  checkboxSelection: PropTypes.bool,
  onRowsScrollEnd: PropTypes.func,
  loading: PropTypes.bool,
  onDelete: PropTypes.func,
  OnAdd: PropTypes.func,
  searchResult:PropTypes.func,
  selectionModel: PropTypes.array,
  setSelectionModel: PropTypes.func
}

FeaturedCrudGrid.defaultProps = {
  checkboxSelection: true,
  pageSize: 30,
  loading: false,
  editable: false
}
