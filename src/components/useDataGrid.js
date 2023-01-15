import * as React from 'react';
import PropTypes from 'prop-types';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {  ToggleOn } from '../deps/ui/icons'
import {  Box,Chip } from '../deps/ui'
import { alpha, styled } from '@mui/material/styles';
import Controls from '../components/controls/Controls'
import {
  useGridApiRef,
  DataGridPro,
  gridClasses,
  GridToolbarContainer,
  GridActionsCellItem,
  LicenseInfo,
  GridOverlay, GridToolbarExport, GridToolbarFilterButton
} from '@mui/x-data-grid-pro';
import LinearProgress from '@mui/material/LinearProgress';


const Key = '0f94d8b65161817ca5d7f7af8ac2f042T1JERVI6TVVJLVN0b3J5Ym9vayxFWFBJUlk9MTY1NDg1ODc1MzU1MCxLRVlWRVJTSU9OPTE=';
LicenseInfo.setLicenseKey(Key);



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

const ODD_OPACITY = 0.2;

const StripedDataGrid = styled(DataGridPro)(({ theme }) => ({
  [`& .${gridClasses.row}.even`]: {
    backgroundColor: theme.palette.grey[200],
    '&:hover, &.Mui-hovered': {
      backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
      '@media (hover: none)': {
        backgroundColor: 'transparent',
      },
    },
    '&.Mui-selected': {
      backgroundColor: alpha(
        theme.palette.primary.main,
        ODD_OPACITY + theme.palette.action.selectedOpacity,
      ),
      '&:hover, &.Mui-hovered': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          ODD_OPACITY +
          theme.palette.action.selectedOpacity +
          theme.palette.action.hoverOpacity,
        ),
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: alpha(
            theme.palette.primary.main,
            ODD_OPACITY + theme.palette.action.selectedOpacity,
          ),
        },
      },
    },
  },
}));

export const renderStatusCell = ({ row }) => <Chip size="small" color={row.status === "Rejected" ? "error" : row.status === "Approved" ? "info" : "default"} label={row.status} />

export const getActions = (apiRef, actionKit = { onActive: null, onApproval: null, onEdit: null, onDelete: null }) => {

  return {
    field: 'actions',
    type: 'actions',
    headerName: 'Actions',
    flex: 1,
    align: 'center',
    hideable: false,
    cellClassName: 'actions',
    getActions: ({ id }) => {
      const toolKit = [];
      const { onActive, onApproval, onEdit, onDelete } = actionKit;
      if (typeof onActive === "function") {
        toolKit.push(<GridActionsCellItem
          icon={<ToggleOn fontSize='small' />}
          label="Active"
          onClick={() => onActive(id)}
          color={"primary"}

        />)
      }
      if (typeof onEdit === "function") {
        toolKit.push(<GridActionsCellItem
          icon={<EditIcon fontSize='small' />}
          label="Edit"
          onClick={() => onEdit(id)}
          color={"primary"}
          showInMenu
        />)
      }
      if (typeof onDelete === "function") {
        toolKit.push(<GridActionsCellItem
          icon={<DeleteIcon fontSize='small' />}
          label="Delete"
          onClick={() => onDelete(id)}
          color={"primary"}
          showInMenu
        />)
      }
      if (typeof onApproval === "function") {
        toolKit.push(<GridActionsCellItem
          icon={<SaveIcon fontSize='small' />}
          label="Approval"
          onClick={() => onApproval(id)}
          color={"primary"}
          showInMenu
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
    pageSize, onRowsScrollEnd,
    setSelectionModel,
    density = "compact",
    checkboxSelection = true,
    rowHeight = null,
    totalCount = 0,
    gridToolBar: GridToolBar, toolbarProps, ...others
  } = props;
  // const handleRowEditStart = (params, event) => {
  //   event.defaultMuiPrevented = true;
  // };

  // const handleRowEditStop = (params, event) => {
  //   event.defaultMuiPrevented = true;
  // };

  // const handleCellFocusOut = (params, event) => {
  //   event.defaultMuiPrevented = true;
  // };

  return (
    <Box
      sx={{
        height: 500,
        //width: '100%',
        // '& .actions': {
        //   color: 'text.secondary',
        // },
        // '& .textPrimary': {
        //   color: 'text.primary',
        // },
      }}
    >
      <StripedDataGrid
        density={density}
        rows={rows}
        loading={loading}
        {...(setSelectionModel && {
          onSelectionModelChange: (newSelectionModel) => {
            setSelectionModel(newSelectionModel);
          }
        })}
        
        getRowHeight={() => rowHeight ?? 'auto'}
        columns={columns}
        checkboxSelection={checkboxSelection}
        {...(onRowsScrollEnd && { onRowsScrollEnd })}
        apiRef={apiRef}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
        }
        editMode="row"
        scrollEndThreshold={20}
        rowCount={totalCount}
        // onRowEditStart={handleRowEditStart}
        // onRowEditStop={handleRowEditStop}
        // onCellFocusOut={handleCellFocusOut}
        components={{
          LoadingOverlay: CustomLoadingOverlay,
          Toolbar: GridToolBar,
        }}
        {...others}
        componentsProps={{
          toolbar: toolbarProps,
        }}
      />
    </Box>
  );
}

FeaturedCrudGrid.propTypes = {
  columns: PropTypes.array.isRequired,
  rows: PropTypes.array.isRequired,
  totalCount: PropTypes.number,
  apiRef: PropTypes.shape({
    current: PropTypes.object.isRequired,
  }),
  density: PropTypes.oneOfType(["compact", "standard", "comfortable"]),
  pageSize: PropTypes.number,
  checkboxSelection: PropTypes.bool,
  onRowsScrollEnd: PropTypes.func,
  loading: PropTypes.bool,
  onDelete: PropTypes.func,
  OnAdd: PropTypes.func,
  getData: PropTypes.func,
  selectionModel: PropTypes.array,
  setSelectionModel: PropTypes.func,
  gridToolBar: PropTypes.elementType,
  toolbarProps: PropTypes.object
}

FeaturedCrudGrid.defaultProps = {
  checkboxSelection: true,
  pageSize: 30,
  loading: false,
  editable: false
}

export function GridToolbar(props) {
  const { apiRef, onAdd, onDelete, selectionModel } = props;

  return (
    <GridToolbarContainer sx={{ justifyContent: "flex-end" }}>
      {selectionModel?.length ? <Controls.Button onClick={() => onDelete(selectionModel)} startIcon={<DeleteIcon />} text="Delete Items" /> : null}
      <Controls.Button onClick={onAdd} startIcon={<AddIcon />} text="Add Record" />
    </GridToolbarContainer>
  );
}

GridToolbar.propTypes = {
  apiRef: PropTypes.shape({
    current: PropTypes.object,
  }),
  onAdd: PropTypes.func,
  onDelete: PropTypes.func,
  selectionModel: PropTypes.array
};