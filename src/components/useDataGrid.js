import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {ToggleOff,ToggleOn} from '../deps/ui/icons'
import {
  useGridApiRef,
  DataGridPro,
  GridToolbarContainer,
  GridActionsCellItem,
  LicenseInfo
} from '@mui/x-data-grid-pro';

LicenseInfo.setLicenseKey(
  '0f94d8b65161817ca5d7f7af8ac2f042T1JERVI6TVVJLVN0b3J5Ym9vayxFWFBJUlk9MTY1NDg1ODc1MzU1MCxLRVlWRVJTSU9OPTE=',
);

function EditToolbar(props) {
  const { apiRef } = props;

  const handleClick = () => {
    // const id = Math.random();
    const id = Math.random();
    apiRef.current.updateRows([{ id, isNew: true }]);
    apiRef.current.setRowMode(id, 'edit');
    // Wait for the grid to render with the new row
    setTimeout(() => {
      apiRef.current.scrollToIndexes({
        rowIndex: apiRef.current.getRowsCount() - 1,
      });
      const model = apiRef.current.getEditRowsModel(); // This object contains all rows that are being edited
      const newRow = model[id];

      apiRef.current.setCellFocus(id, Object.keys(newRow)[0]);
    });
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add record
      </Button>
    </GridToolbarContainer>
  );
}

EditToolbar.propTypes = {
  apiRef: PropTypes.shape({
    current: PropTypes.object.isRequired,
  }).isRequired,
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

export const getActions = (apiRef, actionKit = {onActive:null,onApproval:null,onEdit:null} ) => {
  
  return {
    field: 'actions',
    type: 'actions',
    headerName: 'Actions',
    width: 100,
    cellClassName: 'actions',
    getActions: ({ id }) => {
      const toolKit = [];
      const {onActive,onApproval,onEdit} = actionKit;
      if(typeof onActive === "function"){
        toolKit.push(<GridActionsCellItem
          icon={<ToggleOn />}
          label="Active"
          onClick={() => onActive(id)}
          color={"primary"}
        />)
      }
      if(typeof onEdit === "function"){
        toolKit.push(<GridActionsCellItem
          icon={<EditIcon />}
          label="Active"
          onClick={() => onEdit(id)}
          color={"primary"}
        />)
      }
      if(typeof onApproval === "function"){
        toolKit.push(<GridActionsCellItem
          icon={<SaveIcon />}
          label="Active"
          onClick={() => onApproval(id)}
          color={"primary"}
        />)
      }

     return toolKit;
    },
  }
}

export const useGridApi = () => useGridApiRef();

export default function FeaturedCrudGrid({ apiRef, columns, rows,loading,editable }) {

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
        columns={columns}
        apiRef={apiRef}
        editMode="row"
        onRowEditStart={handleRowEditStart}
        onRowEditStop={handleRowEditStop}
        onCellFocusOut={handleCellFocusOut}
        {...(editable && {components:{Toolbar: EditToolbar}})}
        componentsProps={{
          toolbar: { apiRef },
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
  checkboxSelection: PropTypes.bool,
  loading:PropTypes.bool,
  editable:PropTypes.bool
}

FeaturedCrudGrid.defaultProps = {
  checkboxSelection: true,
  loading:false,
  editable:false
}
