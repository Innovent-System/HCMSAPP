import PropTypes from 'prop-types';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import { ToggleOn, AdminPanelSettings, Cancel } from '../deps/ui/icons'
import { Box, Chip, Pagination as MuiPagination, Stack } from '../deps/ui'
import { alpha, styled } from '@mui/material/styles';
import Controls from './controls/Controls'
import {
  useGridApiRef,
  DataGridPro,
  gridClasses,
  GridToolbarContainer,
  GridToolbarQuickFilter,
  GridActionsCellItem,
  LicenseInfo,
  GridOverlay,
  GridPagination,

} from '@mui/x-data-grid-pro';
export { GridRowModes, GridActionsCellItem, GridRowEditStopReasons, GridToolbarQuickFilter } from '@mui/x-data-grid-pro'
import LinearProgress from '@mui/material/LinearProgress';

const Key = '0f94d8b65161817ca5d7f7af8ac2f042T1JERVI6TVVJLVN0b3J5Ym9vayxFWFBJUlk9MTY1NDg1ODc1MzU1MCxLRVlWRVJTSU9OPTE=';
LicenseInfo.setLicenseKey(Key);

export const getCrudActions = (apiRef, onSave, onDelete) => {

  const handleEditClick = (id) => (event) => {
    // event.stopPropagation();
    // apiRef.current.startRowEditMode()
    apiRef.current.startRowEditMode(id);
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
    // event.stopPropagation();
    apiRef.current.stopRowEditMode({ id });

    // const row = apiRef.current.getRow(id);
    // if (row.isNew) {
    //   apiRef.current.updateRows([{ id, _action: 'delete' }]);
    // }
  }

  return {
    field: 'actions',
    type: 'actions',
    headerName: 'Actions',
    width: 100,
    cellClassName: 'actions',
    getActions: ({ id, ...test }) => {
      
      const isInEditMode = apiRef.current.getRowMode(id) === 'edit';

      if (isInEditMode) {
        return [
          <GridActionsCellItem
            icon={<SaveIcon />}
            label="Save"
            size='small'
            onClick={handleSaveClick(id)}
            color="primary"
          />,
          <GridActionsCellItem
            icon={<CancelIcon />}
            label="Cancel"
            size='small'
            className="textPrimary"
            onClick={handleCancelClick(id)}
            color="inherit"
          />,
        ];
      }

      return [
        <GridActionsCellItem
          icon={<EditIcon />}
          size='small'
          label="Edit"
          className="textPrimary"
          onClick={handleEditClick(id)}
          color="inherit"
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          size='small'
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

export const renderStatusCell = ({ row }) => <Chip size="small" color={row.status === "Rejected" ? "error" : row.status === "Approved" ? "info" : row.status === "Cancel" ? 'warning' : "default"} label={row.status} />

export const getActions = (apiRef, actionKit = { onActive: null, onApproval: null, onEdit: null, onDelete: null, onCancel: null }, allowCancelAfterApprove = false) => {

  return {
    field: 'actions',
    type: 'actions',
    headerName: 'Actions',
    flex: 1,
    align: 'center',
    hideable: false,
    cellClassName: 'actions',
    getActions: ({ id, row }) => {
      const toolKit = [];
      
      const { onActive, onApproval, onEdit, onDelete, onCancel } = actionKit;
      if (typeof onActive === "function") {
        toolKit.push(<GridActionsCellItem
          icon={<ToggleOn fontSize='small' />}
          label="Active"
          size='small'
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
          size='small'
          onClick={() => onDelete(id)}
          color={"primary"}
          showInMenu
        />)
      }
      if (typeof onApproval === "function") {
        toolKit.push(<GridActionsCellItem
          icon={<SaveIcon fontSize='small' />}
          label="Approval"
          size='small'
          onClick={() => onApproval(id)}
          color={"primary"}
          showInMenu
        />)
      }

      if (typeof onCancel === "function") {
        toolKit.push(!["Pending", ...(allowCancelAfterApprove ? ["Approved"] : [])].includes(row.status) ? <GridActionsCellItem
          size='small'
          label="Action Taken"
          icon={<AdminPanelSettings fontSize="small" />}
        /> :
          <GridActionsCellItem
            icon={<Cancel color="warning" fontSize='small' />}
            size='small'
            label="Cancel"
            onClick={() => onCancel(id)}
            color={"primary"}

          />
        )

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
const pageSizes = [
  { id: 10, name: 10 },
  { id: 30, name: 30 },
  { id: 50, name: 50 },
  { id: 100, name: 100 }
];

/**
 * 
 * @param {Pick<import('@mui/material').TablePaginationProps, 'page' | 'onPageChange' | 'className'>} param0 
 * @returns {JSX.Element}
 */
function Pagination({
  page,
  onPageChange,
  className,
  count, rowsPerPage
}) {

  return (
    <MuiPagination
      color='primary'
      className={className}
      count={Math.ceil(count / rowsPerPage)}
      page={page + 1}
      onChange={(event, newPage) => {
        onPageChange(newPage - 1);
      }}
    />
  );
}

function CustomPagination(props) {
  return <GridPagination ActionsComponent={Pagination} {...props} />;
}

/**
 * @param {import('@mui/x-data-grid-pro/models/dataGridProProps').DataGridProPropsWithoutDefaultValue} props 
 * @returns {JSX.Element}
 */
export default function FeaturedCrudGrid(props) {

  const { apiRef, columns, rows, loading = false,
    pageSize = 10, onRowsScrollEnd,
    page = 0,
    setSelectionModel,
    setFilter,
    editable = false,
    density = "compact",
    sortingMode = 'server',
    paginationMode = 'server',
    checkboxSelection = true,
    rowHeight = null,
    totalCount = 0,
    gridHeight = 175,
    gridToolBar: GridToolBar, toolbarProps, ...others
  } = props;


  return (
    <Box
      sx={{
        height: `calc(100vh - ${gridHeight}px)`
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
        rows={rows ?? []}

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

        sortingMode={sortingMode}
        rowCount={totalCount}
        rowsPerPageOptions={[10, 25, 50, 100]}
        pagination
        page={page}

        pageSize={pageSize}
        onPageSizeChange={(_z) => setFilter((pre) => ({ ...pre, limit: _z, page: 0 }))}
        paginationMode={paginationMode}
        components={{
          LoadingOverlay: CustomLoadingOverlay,
          Toolbar: GridToolBar,

          Pagination: CustomPagination
        }}
        {...others}
        componentsProps={{
          toolbar: toolbarProps,
          pagination: { onPageChange: (n) => setFilter((pre) => ({ ...pre, page: n })), page: page }

        }}
      />
    </Box>
  );
}

FeaturedCrudGrid.propTypes = {
  columns: PropTypes.array.isRequired,
  rows: PropTypes.array,
  totalCount: PropTypes.number,
  apiRef: PropTypes.shape({
    current: PropTypes.object.isRequired,
  }),
  density: PropTypes.oneOf(["compact", "standard", "comfortable"]),
  pageSize: PropTypes.number,
  page: PropTypes.number,
  checkboxSelection: PropTypes.bool,
  onRowsScrollEnd: PropTypes.func,
  loading: PropTypes.bool,
  onDelete: PropTypes.func,
  OnAdd: PropTypes.func,
  getData: PropTypes.func,
  selectionModel: PropTypes.array,
  setSelectionModel: PropTypes.func,
  setFilter: PropTypes.func,
  gridToolBar: PropTypes.elementType,
  toolbarProps: PropTypes.object
}

export function GridToolbar(props) {
  const { apiRef, onAdd, onDelete, selectionModel } = props;

  return (
    <GridToolbarContainer sx={{ justifyContent: "space-between" }}>
      <GridToolbarQuickFilter />
      {/* {selectionModel?.length ? <Controls.Button onClick={() => onDelete(selectionModel)} startIcon={<DeleteIcon />} text="Delete Items" /> : null} */}
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