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

// ─── CRUD Actions (logic unchanged) ──────────────────────────────────────────

export const getCrudActions = (apiRef, onSave, onDelete) => {
  const handleEditClick   = (id) => () => apiRef.current.startRowEditMode(id);
  const handleCancelClick = (id) => () => apiRef.current.stopRowEditMode({ id });

  const handleSaveClick = (id) => async (event) => {
    event.stopPropagation();
    const isValid = await apiRef.current.commitRowChange(id);
    if (isValid) {
      apiRef.current.setRowMode(id, 'view');
      const row = apiRef.current.getRow(id);
      onSave(row, () => {
        apiRef.current.updateRows([{ ...row, isNew: false }]);
      });
    }
  };

  const handleDeleteClick = (id) => (event) => {
    event.stopPropagation();
    apiRef.current.updateRows([{ id, _action: 'delete' }]);
  };

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
          <GridActionsCellItem icon={<SaveIcon />}   label="Save"   size="small" onClick={handleSaveClick(id)}   color="primary" />,
          <GridActionsCellItem icon={<CancelIcon />} label="Cancel" size="small" onClick={handleCancelClick(id)} color="inherit" />,
        ];
      }
      return [
        <GridActionsCellItem icon={<EditIcon />}   label="Edit"   size="small" onClick={handleEditClick(id)}   color="inherit" />,
        <GridActionsCellItem icon={<DeleteIcon />} label="Delete" size="small" onClick={handleDeleteClick(id)} color="inherit" />,
      ];
    },
  };
};

// ─── Status Chip ──────────────────────────────────────────────────────────────

export const renderStatusCell = ({ row }) => {
  const config = {
    Rejected : { color: '#fef2f2', text: '#c62828', dot: '#ef4444' },
    Approved : { color: '#eff6ff', text: '#1565c0', dot: '#3b82f6' },
    Cancel   : { color: '#fff8e1', text: '#e65100', dot: '#f59e0b' },
    Pending  : { color: '#f0fdf4', text: '#166534', dot: '#22c55e' },
  };
  const c = config[row.status] ?? { color: '#f3f4f6', text: '#374151', dot: '#9ca3af' };
  return (
    <Box sx={{
      display: 'inline-flex', alignItems: 'center', gap: 0.6,
      px: 1, py: 0.25, borderRadius: 1.5,
      bgcolor: c.color,
    }}>
      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: c.dot, flexShrink: 0 }} />
      <Box sx={{ fontSize: '0.72rem', fontWeight: 700, color: c.text, letterSpacing: '0.02em' }}>
        {row.status}
      </Box>
    </Box>
  );
};

// ─── Row Actions ──────────────────────────────────────────────────────────────

export const getActions = (
  apiRef,
  actionKit = { onActive: null, onApproval: null, onEdit: null, onDelete: null, onCancel: null },
  allowCancelAfterApprove = false
) => ({
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

    if (typeof onActive === 'function')
      toolKit.push(
        <GridActionsCellItem
          icon={<ToggleOn fontSize="small" />}
          label="Active" size="small"
          onClick={() => onActive(id)} color="primary"
        />
      );

    if (typeof onEdit === 'function')
      toolKit.push(
        <GridActionsCellItem
          icon={<EditIcon fontSize="small" />}
          label="Edit" size="small"
          onClick={() => onEdit(id)} color="primary" showInMenu
        />
      );

    if (typeof onDelete === 'function')
      toolKit.push(
        <GridActionsCellItem
          icon={<DeleteIcon fontSize="small" />}
          label="Delete" size="small"
          onClick={() => onDelete(id)} color="primary" showInMenu
        />
      );

    if (typeof onApproval === 'function')
      toolKit.push(
        <GridActionsCellItem
          icon={<SaveIcon fontSize="small" />}
          label="Approval" size="small"
          onClick={() => onApproval(id)} color="primary" showInMenu
        />
      );

    if (typeof onCancel === 'function')
      toolKit.push(
        !['Pending', ...(allowCancelAfterApprove ? ['Approved'] : [])].includes(row.status)
          ? <GridActionsCellItem size="small" label="Action Taken" icon={<AdminPanelSettings fontSize="small" />} />
          : <GridActionsCellItem icon={<Cancel color="warning" fontSize="small" />} size="small" label="Cancel" onClick={() => onCancel(id)} color="primary" />
      );

    return toolKit;
  },
});

export const useGridApi = () => useGridApiRef();

// ─── Loading Overlay ──────────────────────────────────────────────────────────

function CustomLoadingOverlay() {
  return (
    <GridOverlay>
      <Box sx={{ position: 'absolute', top: 0, width: '100%' }}>
        <LinearProgress sx={{ height: 3, borderRadius: 0 }} />
      </Box>
    </GridOverlay>
  );
}

// ─── Empty Overlay ────────────────────────────────────────────────────────────

function CustomNoRowsOverlay() {
  return (
    <GridOverlay>
      <Box sx={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 1, py: 6, color: 'text.secondary',
      }}>
        <Box sx={{
          width: 48, height: 48, borderRadius: 3,
          bgcolor: 'grey.100',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <rect x="2" y="5" width="18" height="14" rx="2" stroke="#9ca3af" strokeWidth="1.5"/>
            <path d="M2 9h18" stroke="#9ca3af" strokeWidth="1.5"/>
            <path d="M7 2v3M15 2v3" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </Box>
        <Box sx={{ fontSize: '0.82rem', fontWeight: 600, color: 'text.secondary' }}>No records found</Box>
        <Box sx={{ fontSize: '0.75rem', color: 'text.disabled' }}>Try adjusting your filters</Box>
      </Box>
    </GridOverlay>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────

function Pagination({ page, onPageChange, className, count, rowsPerPage }) {
  return (
    <MuiPagination
      color="primary"
      className={className}
      count={Math.ceil(count / rowsPerPage)}
      page={page + 1}
      shape="rounded"
      size="small"
      onChange={(event, newPage) => onPageChange(newPage - 1)}
      sx={{
        '& .MuiPaginationItem-root': {
          fontSize    : '0.78rem',
          fontWeight  : 600,
          borderRadius: 1.5,
          minWidth    : 30,
          height      : 30,
        },
        '& .Mui-selected': {
          fontWeight: 700,
        },
      }}
    />
  );
}

function CustomPagination(props) {
  return <GridPagination ActionsComponent={Pagination} {...props} />;
}

// ─── Styled DataGrid ──────────────────────────────────────────────────────────

const StripedDataGrid = styled(DataGridPro)(({ theme }) => ({

  border      : 'none',
  borderRadius: 0,
  fontSize    : '0.82rem',
  fontFamily  : theme.typography.fontFamily,

  // ── Column Headers
  [`& .MuiDataGrid-columnHeaders`]: {
    backgroundColor: theme.palette.grey[50],
    borderBottom   : `2px solid ${theme.palette.divider}`,
    borderRadius   : 0,
  },
  [`& .MuiDataGrid-columnHeaderTitle`]: {
    fontSize     : '0.72rem',
    fontWeight   : 700,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color        : theme.palette.text.secondary,
  },
  [`& .MuiDataGrid-columnSeparator`]: {
    color: theme.palette.divider,
  },

  // ── Rows
  [`& .${gridClasses.row}`]: {
    transition: 'background-color 0.15s ease',
    '&:hover, &.Mui-hovered': {
      backgroundColor: alpha(theme.palette.primary.main, 0.04),
    },
    '&.Mui-selected': {
      backgroundColor: alpha(theme.palette.primary.main, 0.08),
      '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.12),
      },
    },
  },

  // ── Even rows (subtle stripe)
  [`& .${gridClasses.row}.even`]: {
    backgroundColor: theme.palette.grey[50],
    '&:hover, &.Mui-hovered': {
      backgroundColor: alpha(theme.palette.primary.main, 0.04),
    },
    '&.Mui-selected': {
      backgroundColor: alpha(theme.palette.primary.main, 0.08),
    },
  },

  // ── Cells
  [`& .MuiDataGrid-cell`]: {
    borderBottom : `1px solid ${theme.palette.grey[100]}`,
    color        : theme.palette.text.primary,
    '&:focus, &:focus-within': {
      outline: 'none',
    },
  },

  // ── Footer / Pagination
  [`& .MuiDataGrid-footerContainer`]: {
    borderTop      : `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.grey[50],
    minHeight      : 48,
  },

  // ── Detail Panel
  [`& .MuiDataGrid-detailPanel`]: {
    overflow: 'hidden',
  },

  // ── Checkbox
  [`& .MuiCheckbox-root`]: {
    color: theme.palette.grey[400],
    '&.Mui-checked': {
      color: theme.palette.primary.main,
    },
  },

  // ── Scrollbar
  '& ::-webkit-scrollbar': {
    width: 6, height: 6,
  },
  '& ::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '& ::-webkit-scrollbar-thumb': {
    background    : theme.palette.grey[300],
    borderRadius  : 3,
    '&:hover'     : { background: theme.palette.grey[400] },
  },

  // ── Error cell (remarks etc)
  '& .error': {
    color: theme.palette.error.main,
  },
}));

// ─── Main DataGrid Component ──────────────────────────────────────────────────

/**
 * @param {import('@mui/x-data-grid-pro/models/dataGridProProps').DataGridProPropsWithoutDefaultValue} props
 * @returns {JSX.Element}
 */
export default function FeaturedCrudGrid(props) {
  const {
    apiRef,
    columns,
    rows,
    loading        = false,
    pageSize       = 10,
    onRowsScrollEnd,
    page           = 0,
    setSelectionModel,
    setFilter,
    editable       = false,
    density        = 'compact',
    sortingMode    = 'server',
    paginationMode = 'server',
    checkboxSelection = true,
    rowHeight      = null,
    totalCount     = 0,
    gridHeight     = 175,
    sx             = {},
    gridToolBar: GridToolBar,
    toolbarProps,
    ...others
  } = props;

  return (
    <Box sx={{ height: `calc(100vh - ${gridHeight}px)` }}>
      <StripedDataGrid
        density={density}
        rows={rows ?? []}
        loading={loading}
        columns={columns}
        apiRef={apiRef}
        checkboxSelection={checkboxSelection}
        getRowHeight={() => rowHeight ?? 'auto'}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
        }
        sortingMode={sortingMode}
        rowCount={totalCount}
        rowsPerPageOptions={[10, 25, 50, 100]}
        pagination
        page={page}
        pageSize={pageSize}
        paginationMode={paginationMode}
        onPageSizeChange={(_z) => setFilter?.((pre) => ({ ...pre, limit: _z, page: 0 }))}
        {...(setSelectionModel && {
          onSelectionModelChange: (newSelectionModel) => setSelectionModel(newSelectionModel),
        })}
        {...(onRowsScrollEnd && { onRowsScrollEnd })}
        components={{
          LoadingOverlay : CustomLoadingOverlay,
          NoRowsOverlay  : CustomNoRowsOverlay,
          Toolbar        : GridToolBar,
          Pagination     : CustomPagination,
        }}
        componentsProps={{
          toolbar   : toolbarProps,
          pagination: {
            onPageChange: (n) => setFilter?.((pre) => ({ ...pre, page: n })),
            page,
          },
        }}
        sx={{
          // Allow caller to override sx
          ...sx,
        }}
        {...others}
      />
    </Box>
  );
}

FeaturedCrudGrid.propTypes = {
  columns          : PropTypes.array.isRequired,
  rows             : PropTypes.array,
  totalCount       : PropTypes.number,
  apiRef           : PropTypes.shape({ current: PropTypes.object.isRequired }),
  density          : PropTypes.oneOf(['compact', 'standard', 'comfortable']),
  pageSize         : PropTypes.number,
  page             : PropTypes.number,
  checkboxSelection: PropTypes.bool,
  onRowsScrollEnd  : PropTypes.func,
  loading          : PropTypes.bool,
  selectionModel   : PropTypes.array,
  setSelectionModel: PropTypes.func,
  setFilter        : PropTypes.func,
  gridToolBar      : PropTypes.elementType,
  toolbarProps     : PropTypes.object,
  sx               : PropTypes.object,
};

// ─── Default Toolbar ──────────────────────────────────────────────────────────

export function GridToolbar(props) {
  const { apiRef, onAdd, onDelete, selectionModel } = props;

  return (
    <GridToolbarContainer sx={{
      justifyContent: 'space-between',
      alignItems    : 'center',
      px            : 1.5,
      py            : 1,
      borderBottom  : '1px solid',
      borderColor   : 'divider',
      bgcolor       : 'grey.50',
      gap           : 1,
    }}>
      <GridToolbarQuickFilter
        sx={{
          '& .MuiInputBase-root': {
            borderRadius: 2,
            bgcolor     : 'white',
            fontSize    : '0.82rem',
            px          : 1,
            boxShadow   : '0 1px 3px rgba(0,0,0,0.06)',
          },
          '& .MuiInputBase-root:before, & .MuiInputBase-root:after': {
            display: 'none',
          },
        }}
      />
      <Controls.Button
        onClick={onAdd}
        startIcon={<AddIcon />}
        text="Add Record"
        // sx={{
        //   borderRadius: 2,
        //   textTransform: 'none',
        //   fontWeight  : 600,
        //   fontSize    : '0.82rem',
        //   px          : 2,
        //   boxShadow   : '0 2px 6px rgba(25,118,210,0.2)',
        //   '&:hover'   : { boxShadow: '0 3px 10px rgba(25,118,210,0.3)' },
        // }}
      />
    </GridToolbarContainer>
  );
}

GridToolbar.propTypes = {
  apiRef        : PropTypes.shape({ current: PropTypes.object }),
  onAdd         : PropTypes.func,
  onDelete      : PropTypes.func,
  selectionModel: PropTypes.array,
};