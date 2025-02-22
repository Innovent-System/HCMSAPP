import React, { useEffect, useState } from 'react'
import PageHeader from '../../../components/PageHeader'
import { Circle, Add as AddIcon, PeopleOutline, DisplaySettings, RestartAlt } from "../../../deps/ui/icons";
import { GridToolbarContainer, Grid, Typography, Divider, Chip, Box } from "../../../deps/ui";
import { useAppDispatch, useAppSelector } from '../../../store/storehook';
import { builderFieldsAction, showDropDownFilterAction, useEntityAction, useLazyPostQuery } from '../../../store/actions/httpactions';
import { useDropDownIds } from '../../../components/useDropDown';
import DataGrid, { GridToolbarQuickFilter, useGridApi } from '../../../components/useDataGrid';
import Controls from "../../../components/controls/Controls";
import { API } from '../_Service';
import { getDefaultMonth, getYears, monthNames } from '../../../util/common';



/**
 * @type {import('@react-awesome-query-builder/mui').Fields}
 */
const fields = {
    month: {
        label: "Month",
        type: "select",
        fieldName: "month",
        valueSources: ["value"],
        defaultOperator: "select_equals",
        defaultValue: getDefaultMonth(),
        hideForCompare: true,
        operators: ["select_equals"],
        listValues: monthNames.map((e, i) => ({ value: i, title: e })),

    },
    year: {
        label: 'Year',
        type: 'select',
        fieldName: "year",
        valueSources: ['value'],
        operators: ["select_equals"],
        defaultOperator: "select_equals",
        defaultValue: new Date().getFullYear(),
        listValues: getYears(2020).map(e => ({ title: e.title, value: e.id }))
    }

}


const currFormat = new Intl.NumberFormat();
/**
 * @param {Function} apiRef 
 * @param {Function} onEdit 
 * @param {Function} onActive 
 * @returns {import("@mui/x-data-grid-pro").GridColumns}
 */
const getColumns = (apiRef, onEdit, onActive) => {
    const actionKit = {
        onActive: onActive,
        onEdit: onEdit
    }
    return [

        { field: '_id', headerName: 'Id', hide: true, hideable: false },
        {
            field: 'fullName', headerName: 'Name', width: 220, hideable: false
        },
        {
            field: 'payrollSetup', headerName: 'Payroll Setup', hideable: false
        },
        {
            field: 'month', headerName: 'Month', hideable: false, valueGetter: ({ value }) => monthNames[value]
        },
        { field: 'monthlySalary', headerName: 'Monthly Salary', hideable: false, valueGetter: ({ value }) => currFormat.format(value) },
        { field: 'totalSalary', headerName: 'Net Salary', hideable: false, valueGetter: ({ value }) => currFormat.format(value) },
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
        <Grid container>
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
                    <Box>
                        {row.others.map(e => (
                            <Typography key={e.item}>{e.item}</Typography>
                        ))}
                    </Box>
                    <Box textAlign='right'>
                        {row.others.map((e) => (
                            <Typography key={e.item + '-amount'}>{e.displayAmount}</Typography>
                        ))}
                    </Box>
                </Box>
            </Grid>
            <Grid container display='flex'>
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
const RunPayroll = ({ setOpenPopup }) => {
    const dispatch = useAppDispatch();
    const query = useAppSelector(e => e.appdata.query.builder);
    const [selectionModel, setSelectionModel] = React.useState([]);

    const [gridFilter, setGridFilter] = useState({
        limit: 10,
        page: 0,
        totalRecord: 0
    })

    const [records, setRecords] = useState([]);
    const [extraData, setExtraData] = useState({
        loanDetail: [],
        bounsDetail: [],
        leaveDetail: []
    });
    const { addEntity } = useEntityAction();
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

    const getDetailPanelHeight = React.useCallback(() => 250, []);

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
                ...(groupIds && { "companyInfo.fkEmployeeGroupId": { $in: groupIds.split(',') } }),
                ...(departmentIds && { "companyInfo.fkDepartmentId": { $in: departmentIds.split(',') } }),
                ...(designationIds && { "companyInfo.fkDesignationId": { $in: designationIds.split(',') } }),
                ...query
            }
        }).then(({ data }) => {
            const { payrollDetails, ...extra } = data
            setGridFilter({ ...gridFilter, limit: 10, page: 0 });
            setRecords(payrollDetails)
            setExtraData(extra)
            setDetailPanelExpandedRowIds(payrollDetails.filter(c => c.isProcess).map(e => e.fkEmployeeId));
            // console.log(data);
        })
    }
    const handleSavePayroll = () => {
        const processData = records.filter(c => c.isProcess);
        addEntity({
            url: `${DEFAULT_API}/save`, data: {
                payrollData: processData,
                year: records[0].year,
                month: records[0].month,
                employeeIds: processData.map(c => c.fkEmployeeId),
                ...extraData
            }
        }).finally(e => setOpenPopup(false))
    }

    return (
        <>
            <PageHeader
                title="Run Payroll"
                enableFilter={true}
                handleApply={handleProcessPayroll}
                subTitle="Run Payroll Process"
                icon={<PeopleOutline fontSize="large" />}
            />
            <DataGrid apiRef={gridApiRef}
                columns={columns} rows={records}
                loading={false}
                sx={gridCellStyle}
                totalCount={records?.length}
                autoHeight={true}
                getRowHeight={() => 40}
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
                    onAdd: handleSavePayroll,
                    // getPayroll: handleProcessPayroll,

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
        <GridToolbarContainer sx={{ justifyContent: "space-between" }}>
            <GridToolbarQuickFilter />

            {records?.length ? <Controls.Button onClick={onAdd} startIcon={<AddIcon />} text="Save" /> : null}
            {/* <Controls.Button onClick={getPayroll} startIcon={<RestartAlt />} text="Process" /> */}
        </GridToolbarContainer>
    );
}


export default RunPayroll