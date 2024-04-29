import {
    Card, CardActionArea, CardActions, CardContent
    , MenuItem, ListItemIcon, ListItemText, MenuList, Typography, GridActionsCellItem
} from '../../../deps/ui'
import SpeedDial from './SpeedDial'
import { useState } from 'react'
import Controls from '../../../components/controls/Controls'
import { AccessTime, Check, Beenhere, Edit, Cancel, SaveTwoTone } from '../../../deps/ui/icons'
import DataGrid, { useGridApi, getActions, getCrudActions } from '../../../components/useDataGrid';
import { GridRowEditStopReasons, GridRowModes } from '@mui/x-data-grid-pro'

/**
 * @param {Function} handleChange 
 * @param {Function} handleCopy 
 * @param {number} index 
 * @param {Array<any>} shifts 
 * @returns {import("@mui/x-data-grid-pro").GridColumns}
 */
const getColumns = (apiRef, handleChange, shifts) => {
    return [
        {
            field: 'index', headerName: 'Sr#', hideable: false, valueGetter: ({ api, row }) => api.getRowIndex(row.name) + 1
        },
        {
            field: 'name', headerName: 'Working Day', hideable: false,

        },
        {
            field: 'isNextDay', headerName: 'Is Next Day', hideable: false,
            renderCell: ({ row }) => row.isNextDay ? <GridActionsCellItem icon={<Beenhere color='info' fontSize='small' />} /> : null,
            align: 'center'
        },
        {
            field: 'isHoliday', headerName: 'Is HoliDay', hideable: false,
            renderCell: ({ row }) => row.isHoliday ? <GridActionsCellItem icon={<Check color='info' fontSize='small' />} /> : null,
            align: 'center'
        },
        {
            field: 'fkShiftId', headerName: 'Shift', hideable: false,
            editable: true,
            type: "singleSelect",
            valueGetter: ({ api, row }) => row?.fkShiftId ? shifts.find(s => s.id === row?.fkShiftId).shiftName : null,
            valueOptions: shifts.map(c => ({ value: c.id, label: c.shiftName }))
        },
        {
            field: 'startTime', headerName: 'Start Time', hideable: false
        },
        {
            field: 'endTime', headerName: 'End Time', hideable: false
        },
        {
            field: 'minTime', headerName: 'Grace Start Time', hideable: false
        },
        {
            field: 'maxTime', headerName: 'Grace End Time', hideable: false
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={<SaveTwoTone />}
                            label="Save"
                            sx={{
                                color: 'primary.main',
                            }}
                            onClick={handleSaveClick(id)}
                        />,
                        <GridActionsCellItem
                            icon={<Cancel />}
                            label="Cancel"
                            className="textPrimary"
                            onClick={handleCancelClick(id)}
                            color="inherit"
                        />,
                    ];
                }

                return [
                    <GridActionsCellItem
                        icon={<Edit />}
                        label="Edit"
                        className="textPrimary"
                        onClick={handleEditClick(id)}
                        color="inherit"
                    />
                ];
            },
        },


    ]
}


export default ({ data, handleChange, handleCopy, index, shifts }) => {

    const gridApi = useGridApi();
    const processRowUpdate = (newRow) => {
        if (!newRow?.fkShiftId) return { ...newRow, isNew: false }
        const update = handleChange({ target: { name: "fkShiftId", value: newRow.fkShiftId } }, gridApi.current.getRowIndex(newRow.name));
        return { ...update, isNew: false };
    }

    const [rowModesModel, setRowModesModel] = useState({});

    const handleRowEditStop = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleEditClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleSaveClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleDeleteClick = (id) => () => {
        setRows(rows.filter((row) => row.id !== id));
    };

    const handleCancelClick = (id) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        // const editedRow = rows.find((row) => row.id === id);
        // if (editedRow.isNew) {
        //     setRows(rows.filter((row) => row.id !== id));
        // }
    };


    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    /**
     *@type {import("@mui/x-data-grid-pro").GridColumns} 
     */
    const columns = [
        {
            field: 'index', headerName: 'Sr#', hideable: false, valueGetter: ({ api, row }) => api.getRowIndex(row.name) + 1
        },
        {
            field: 'name', headerName: 'Working Day', hideable: false,

        },
        {
            field: 'isNextDay', headerName: 'Is Next Day', hideable: false,
            renderCell: ({ row }) => row.isNextDay ? <GridActionsCellItem icon={<Beenhere color='info' fontSize='small' />} /> : null,
            align: 'center'
        },
        {
            field: 'isHoliday', headerName: 'Is Holiday', hideable: false,
            renderCell: ({ row }) => row.isHoliday ? <GridActionsCellItem icon={<Check color='info' fontSize='small' />} /> : null,
            align: 'center'
        },
        {
            field: 'fkShiftId', headerName: 'Shift', hideable: false,
            editable: true,
            type: "singleSelect",
            valueGetter: ({ api, row }) => row?.fkShiftId ? shifts.find(s => s.id === row?.fkShiftId)?.shiftName : '',
            valueOptions: shifts.map((c) => ({ value: c.id, label: c.shiftName }))
        },
        {
            field: 'startTime', headerName: 'Start Time', hideable: false
        },
        {
            field: 'endTime', headerName: 'End Time', hideable: false
        },
        {
            field: 'minTime', headerName: 'Grace Start Time', hideable: false
        },
        {
            field: 'maxTime', headerName: 'Grace End Time', hideable: false
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={<SaveTwoTone />}
                            label="Save"
                            sx={{
                                color: 'primary.main',
                            }}
                            onClick={handleSaveClick(id)}
                        />,
                        <GridActionsCellItem
                            icon={<Cancel />}
                            label="Cancel"
                            className="textPrimary"
                            onClick={handleCancelClick(id)}
                            color="inherit"
                        />,
                    ];
                }

                return [
                    <GridActionsCellItem
                        icon={<Edit />}
                        label="Edit"
                        className="textPrimary"
                        onClick={handleEditClick(id)}
                        color="inherit"
                    />
                ];
            },
        },


    ];

    return <DataGrid
        rowHeight={35}
        hideFooter
        gridHeight={310}
        apiRef={gridApi}
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        // onRowEditStop={handleRowEditStop}
        editMode='row'
        sx={{
            "& .MuiDataGrid-root": {
                border: 'none'
            },
            "& .MuiDataGrid-row": {
                marginBottom: 2,
                backgroundColor: '#e0e0e0',
                boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',

                borderRadius: 1
            }
        }}
        getRowId={(row) => row.name}
        processRowUpdate={processRowUpdate}
        experimentalFeatures={{ newEditingApi: true }}
        checkboxSelection={false}
        columns={columns} rows={data}
    />

    return (<Card sx={{ width: 345, maxWidth: "100%" }}>
        <CardActionArea disableTouchRipple={true}>
            <CardContent title="Testing" >
                <Typography gutterBottom variant="h5" component="div">
                    {data.name}
                </Typography>
                <Controls.Select name="fkShiftId" onChange={(e) => handleChange(e, index)} value={data.fkShiftId} label="Shifts" options={shifts} dataId="id" dataName="shiftName" />
                <MenuList>
                    <MenuItem>
                        <ListItemIcon>
                            <AccessTime fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Start Time</ListItemText>
                        <Typography variant="body2" color="text.secondary">
                            {data.startTime}
                        </Typography>
                    </MenuItem>
                    <MenuItem>
                        <ListItemIcon>
                            <AccessTime fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>End Time</ListItemText>
                        <Typography variant="body2" color="text.secondary">
                            {data.endTime}
                        </Typography>
                    </MenuItem>
                    <MenuItem>
                        <ListItemIcon>
                            <Check fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Shift End On Next Day?</ListItemText>
                        <Typography variant="body2" color="text.secondary">
                            {data.isNextDay ? "Yes" : "No"}
                        </Typography>
                    </MenuItem>
                    <MenuItem>
                        <ListItemIcon>
                            <AccessTime fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Grace Start Time</ListItemText>
                        <Typography variant="body2" color="text.secondary">
                            {data.minTime}
                        </Typography>
                    </MenuItem>
                    <MenuItem>
                        <ListItemIcon>
                            <AccessTime fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Grace End Time</ListItemText>
                        <Typography variant="body2" color="text.secondary">
                            {data.maxTime}
                        </Typography>
                    </MenuItem>
                </MenuList>
            </CardContent>
        </CardActionArea>
        <CardActions sx={{ minHeight: 100, transform: 'translateZ(0px)', flexGrow: 1 }}>
            <SpeedDial weekName={data.name} handleCopy={(e) => handleCopy(e, data)} isHidden={!Boolean(data.fkShiftId)} />
            {/* <Controls.Button color="secondary" startIcon={<FileCopy />} text="Copy" /> */}
        </CardActions>
    </Card>)
}
