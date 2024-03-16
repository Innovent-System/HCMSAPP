import React, { useEffect, useState } from 'react'
import PageHeader from '../../components/PageHeader'
import { Circle, Add as AddIcon, PeopleOutline, DisplaySettings } from "../../deps/ui/icons";
import { GridToolbarContainer, Grid, Typography, Divider, Chip, Box } from "../../deps/ui";
import { useAppDispatch, useAppSelector } from '../../store/storehook';
import { builderFieldsAction, showDropDownFilterAction, useLazyPostQuery } from '../../store/actions/httpactions';
import { useDropDownIds } from '../../components/useDropDown';
import DataGrid, { useGridApi } from '../../components/useDataGrid';
import Controls from "../../components/controls/Controls";
import { API } from './_Service';


/**
 * @type {import('@react-awesome-query-builder/mui').Fields}
 */
const fields = {
    firstName: {
        label: 'Employee Name',
        type: 'text',
        valueSources: ['value'],
        preferWidgets: ['text'],
    },
    payrollDate: {
        label: 'Payroll Date',
        operators: ['equal'],
        type: 'date',
        fieldSettings: {
            dateFormat: "D/M/YYYY",
            mongoFormatValue: val => new Date(val).toISOString(),
        },
        valueSources: ['value'],
        preferWidgets: ['date'],
    },

}

const currFormat = new Intl.NumberFormat();
/**
 * @param {Function} apiRef 
 * @param {Function} onEdit 
 * @param {Function} onActive 
 * @param {Function} onDelete 
 * @returns {import("@mui/x-data-grid-pro").GridColumns}
 */
const getColumns = (apiRef, onEdit, onActive, onDelete) => {
    const actionKit = {
        onActive: onActive,
        onEdit: onEdit,
        onDelete: onDelete
    }
    return [

        { field: '_id', headerName: 'Id', hide: true, hideable: false },
        {
            field: 'fullName', headerName: 'Name', width: 220, hideable: false
        },
        {
            field: 'payrollSetup', headerName: 'Payroll Setup', hideable: false
        },
        { field: 'totalSalary', headerName: 'Total Salary', hideable: false, valueGetter: ({ value }) => currFormat.format(value) },
        { field: 'annualSalary', headerName: 'Annual Salary', hideable: false, valueGetter: ({ value }) => currFormat.format(value) },
        {
            field: 'remarks', headerName: 'Remarks', width: 220, hideable: false, cellClassName: 'error'
        },
    ]
}

const gridCellStyle = {
    '& .error': {
        color: 'error.main'
    }
}

const DetailPanelContent = ({ row }) => {

    return (
        <Grid container >
            <Grid item xs={4} md={4} lg={4} p={2}>
                <Divider><Chip label="Earnings" icon={<DisplaySettings fontSize='small' />} /></Divider>
                <Box display='flex' justifyContent='space-between'>
                    <Box>
                        {row.earnings.map(e => (
                            <Typography key={e.item}>{e.item}</Typography>
                        ))}
                    </Box>
                    <Box textAlign='right'>
                        {row.earnings.map((e) => (
                            <Typography key={e.item + '-amount'}>{e.displayAmount}</Typography>
                        ))}
                    </Box>
                </Box>

            </Grid>
            <Grid item xs={4} md={4} lg={4} p={2}>
                <Divider><Chip label="Deductions" icon={<DisplaySettings fontSize='small' />} /></Divider>
                <Box display='flex' justifyContent='space-between'>
                    <Box>
                        {row.deductions.map(e => (
                            <Typography key={e.item}>{e.item}</Typography>
                        ))}
                    </Box>
                    <Box textAlign='right'>
                        {row.deductions.map((e) => (
                            <Typography key={e.item + '-amount'}>{e.displayAmount}</Typography>
                        ))}
                    </Box>
                </Box>
            </Grid>
            <Grid item xs={4} md={4} lg={4} p={2}>
                <Divider><Chip label="Others" icon={<DisplaySettings fontSize='small' />} /></Divider>
                <Box display='flex' justifyContent='space-between'>

                </Box>
            </Grid>
            <Grid container display='flex' xs={12} md={12} lg={12}>
                <Grid item xs={4} md={4} lg={4} p={2}>
                    <Divider>Total</Divider>
                    <Box textAlign='right'>
                        <Typography >{currFormat.format(row.totalEarning)}</Typography>
                    </Box>
                </Grid>
                <Grid item xs={4} md={4} lg={4} p={2}><Divider>Total</Divider>
                    <Box textAlign='right'>
                        <Typography >{currFormat.format(row.totalDeduction)}</Typography>
                    </Box>
                </Grid>
                <Grid item xs={4} md={4} lg={4} p={2}><Divider>Total</Divider></Grid>
            </Grid>

        </Grid>
    )
}
const DEFAULT_API = API.Process;
const RunPayroll = () => {
    const dispatch = useAppDispatch();
    const query = useAppSelector(e => e.appdata.query.builder);
    const [selectionModel, setSelectionModel] = React.useState([]);

    const [gridFilter, setGridFilter] = useState({
        lastKey: null,
        limit: 10,
        page: 0,
        totalRecord: 0
    })

    const [records, setRecords] = useState([]);

    const gridApiRef = useGridApi();
    const { countryIds, stateIds, cityIds, areaIds, departmentIds, groupIds, designationIds, employeeIds } = useDropDownIds();
    const [getEmployeePayroll] = useLazyPostQuery();
    useEffect(() => {

        dispatch(showDropDownFilterAction({
            company: true,
            country: true,
            state: true,
            city: true,
            area: true,
            department: true,
            group: true,
            designation: true,
            employee: true
        }));

        dispatch(builderFieldsAction(fields));
    }, [dispatch])
    const getDetailPanelContent = React.useCallback(
        ({ row }) => <DetailPanelContent row={row} />,
        [],
    );

    const getDetailPanelHeight = React.useCallback(() => 220, []);

    const [detailPanelExpandedRowIds, setDetailPanelExpandedRowIds] = React.useState(
        [],
    );

    const handleDetailPanelExpandedRowIdsChange = React.useCallback((newIds) => {
        setDetailPanelExpandedRowIds(newIds);
    }, []);
    const columns = getColumns(gridApiRef);

    const handleProcessPayroll = () => {
        getEmployeePayroll({
            url: DEFAULT_API, data: {
                ...(employeeIds && { "_id": { $in: employeeIds.split(',') } }),
                ...(countryIds && { "companyInfo.fkCountryId": { $in: countryIds.split(',') } }),
                ...(stateIds && { "companyInfo.fkStateId": { $in: stateIds.split(',') } }),
                ...(cityIds && { "companyInfo.fkCityId": { $in: cityIds.split(',') } }),
                ...(areaIds && { "companyInfo.fkAreaId": { $in: areaIds.split(',') } }),
                ...(groupIds && { "companyInfo.fkGroupId": { $in: groupIds.split(',') } }),
                ...(departmentIds && { "companyInfo.fkDepartmentId": { $in: departmentIds.split(',') } }),
                ...(designationIds && { "companyInfo.fkDesignationId": { $in: designationIds.split(',') } }),
                ...query
            }
        }).then(({ data }) => {
            setRecords(data)
            // console.log(data);
        })
    }

    return (
        <>
            <PageHeader
                title="Run Payroll"
                enableFilter={true}
                subTitle="Run Payroll Process"
                icon={<PeopleOutline fontSize="large" />}
            />
            <DataGrid apiRef={gridApiRef}
                columns={columns} rows={records}
                loading={false}
                sx={gridCellStyle}
                totalCount={records?.length}
                disableSelectionOnClick
                // rowModesModel={cellModesModel}
                page={gridFilter.page}
                pageSize={gridFilter.limit}
                editMode='row'
                paginationMode='client'
                onRowModesModelChange={(model) => setCellModesModel(model)}
                setFilter={setGridFilter}
                // isCellEditable={console.log}
                toolbarProps={{
                    apiRef: gridApiRef,
                    // onAdd: handleSaveAttendance,
                    getPayroll: handleProcessPayroll,

                    records,
                    selectionModel
                }}
                checkboxSelection={false}
                getRowId={(r) => r.fkEmployeeId}
                detailPanelExpandedRowIds={detailPanelExpandedRowIds}

                onDetailPanelExpandedRowIdsChange={handleDetailPanelExpandedRowIdsChange}
                getDetailPanelContent={getDetailPanelContent}
                getDetailPanelHeight={getDetailPanelHeight} // Height based on the content.

                gridToolBar={RunPayrollToolbar}
                selectionModel={selectionModel}
                setSelectionModel={setSelectionModel}
            />
        </>

    )
}

export function RunPayrollToolbar(props) {
    const { onAdd, getPayroll, selectionModel, records } = props;

    return (
        <GridToolbarContainer sx={{ justifyContent: "flex-end" }}>

            {selectionModel?.length ? <Controls.Button onClick={onAdd} startIcon={<AddIcon />} text="Save" /> : null}
            <Controls.Button onClick={getPayroll} startIcon={<AddIcon />} text="Process" />
        </GridToolbarContainer>
    );
}


export default RunPayroll