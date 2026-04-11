import React, { useEffect, useState } from 'react'
import PageHeader from '../../../components/PageHeader'
import { PeopleOutline, Add as AddIcon, TrendingUp, TrendingDown, AccountBalance, ExpandMore } from "../../../deps/ui/icons";
import { GridToolbarContainer, Grid, Typography, Divider, Chip, Box, Paper, Avatar, Collapse, IconButton, Stack } from "../../../deps/ui";
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

// ─── Summary Cards ───────────────────────────────────────────────────────────

const SummaryCards = ({ records }) => {
    const totalGross = records.reduce((s, r) => s + (r.monthlySalary || 0), 0);
    const totalDeductions = records.reduce((s, r) => s + (r.totalDeduction || 0), 0);
    const totalNet = records.reduce((s, r) => s + (r.totalSalary || 0), 0);

    const cards = [
        {
            label: 'Total Gross',
            value: currFormat.format(totalGross),
            icon: <TrendingUp fontSize="small" />,
            color: '#1976d2',
            bg: '#e3f2fd',
        },
        {
            label: 'Total Deductions',
            value: currFormat.format(totalDeductions),
            icon: <TrendingDown fontSize="small" />,
            color: '#d32f2f',
            bg: '#ffebee',
        },
        {
            label: 'Net Payable',
            value: currFormat.format(totalNet),
            icon: <AccountBalance fontSize="small" />,
            color: '#2e7d32',
            bg: '#e8f5e9',
        },
    ];

    return (
        <Grid container spacing={2} sx={{ mb: 2.5 }}>
            {cards.map(({ label, value, icon, color, bg }) => (
                <Grid item size={{ xs: 12, md: 4 }} key={label}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2,
                            borderRadius: 3,
                            border: '1px solid',
                            borderColor: 'divider',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            transition: 'box-shadow 0.2s',
                            '&:hover': { boxShadow: 3 },
                        }}
                    >
                        <Box
                            sx={{
                                width: 44,
                                height: 44,
                                borderRadius: 2.5,
                                bgcolor: bg,
                                color: color,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                            }}
                        >
                            {icon}
                        </Box>
                        <Box>
                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                {label}
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 700, color, lineHeight: 1.2, fontVariantNumeric: 'tabular-nums' }}>
                                {value}
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>
            ))}
        </Grid>
    );
};

// ─── Detail Panel ─────────────────────────────────────────────────────────────

const SectionColumn = ({ title, items, total, accentColor }) => (
    <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <Box sx={{ width: 3, height: 14, borderRadius: 1, bgcolor: accentColor, flexShrink: 0 }} />
            <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'text.secondary' }}>
                {title}
            </Typography>
        </Box>

        <Stack spacing={0.75}>
            {items.map((e, i) => (
                <Box
                    key={i}
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        px: 1.25,
                        py: 0.75,
                        borderRadius: 1.5,
                        bgcolor: 'grey.50',
                        '&:hover': { bgcolor: 'grey.100' },
                        transition: 'background 0.15s',
                    }}
                >
                    <Typography variant="body2" sx={{ color: 'text.primary', fontSize: '0.8rem' }}>
                        {e.item}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums', fontSize: '0.8rem', color: 'text.primary' }}>
                        {e.displayAmount}
                    </Typography>
                </Box>
            ))}
        </Stack>

        {total !== undefined && (
            <Box sx={{ mt: 1.25, pt: 1, borderTop: `2px solid`, borderColor: accentColor + '33', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Total
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: accentColor, fontVariantNumeric: 'tabular-nums' }}>
                    {currFormat.format(total)}
                </Typography>
            </Box>
        )}
    </Box>
);

const DetailPanelContent = ({ row }) => (
    <Box sx={{ bgcolor: 'grey.50', borderTop: '1px solid', borderColor: 'divider', px: 3, py: 2.5 }}>
        <Grid container spacing={3}>
            {/* Earnings */}
            <Grid item size={{ xs: 12, md: 4 }}>
                <SectionColumn
                    title="Earnings"
                    items={row.earnings}
                    total={row.totalEarning}
                    accentColor="#1976d2"
                />
            </Grid>

            {/* Deductions */}
            <Grid item size={{ xs: 12, md: 4 }}>
                <SectionColumn
                    title="Deductions"
                    items={row.deductions}
                    total={row.totalDeduction}
                    accentColor="#d32f2f"
                />
            </Grid>

            {/* Others */}
            <Grid item size={{ xs: 12, md: 4 }}>
                <SectionColumn
                    title="Others"
                    items={row.others}
                    accentColor="#7b1fa2"
                />
            </Grid>
        </Grid>

        {/* Net Summary Bar */}
        <Box
            sx={{
                mt: 2,
                px: 2,
                py: 1.25,
                bgcolor: 'white',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                flexWrap: 'wrap',
            }}
        >
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>Net Calculation:</Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#1976d2', fontVariantNumeric: 'tabular-nums' }}>
                {currFormat.format(row.totalEarning)}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>earnings</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', mx: 0.5 }}>−</Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#d32f2f', fontVariantNumeric: 'tabular-nums' }}>
                {currFormat.format(row.totalDeduction)}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>deductions</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', mx: 0.5 }}>=</Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#2e7d32', fontVariantNumeric: 'tabular-nums' }}>
                {currFormat.format(row.totalSalary)}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>net salary</Typography>
        </Box>
    </Box>
);

// ─── Column Definitions ───────────────────────────────────────────────────────

const getColumns = (apiRef, onEdit, onActive) => [
    { field: '_id', headerName: 'Id', hide: true, hideable: false },
    {
        field: 'fullName',
        headerName: 'Employee',
        width: 240,
        hideable: false,
        renderCell: ({ row }) => (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar
                    sx={{
                        width: 32,
                        height: 32,
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        bgcolor: `hsl(${(row.fullName?.charCodeAt(0) * 37) % 360}, 45%, 88%)`,
                        color: `hsl(${(row.fullName?.charCodeAt(0) * 37) % 360}, 45%, 30%)`,
                        borderRadius: 1.5,
                    }}
                >
                    {row.fullName?.split(' ').slice(-2).map(n => n[0]).join('').toUpperCase()}
                </Avatar>
                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.82rem' }}>
                    {row.fullName}
                </Typography>
            </Box>
        ),
    },
    {
        field: 'payrollSetup',
        headerName: 'Payroll Setup',
        hideable: false,
        renderCell: ({ value }) => (
            <Chip
                label={value}
                size="small"
                sx={{
                    height: 22,
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    bgcolor: '#e8f4fd',
                    color: '#1565c0',
                    borderRadius: 1,
                }}
            />
        ),
    },
    {
        field: 'month',
        headerName: 'Month',
        hideable: false,
        valueGetter: ({ value }) => monthNames[value],
    },
    {
        field: 'monthlySalary',
        headerName: 'Monthly Salary',
        hideable: false,
        renderCell: ({ value }) => (
            <Typography variant="body2" sx={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: '#1565c0' }}>
                {currFormat.format(value)}
            </Typography>
        ),
    },
    {
        field: 'totalSalary',
        headerName: 'Net Salary',
        hideable: false,
        renderCell: ({ value }) => (
            <Typography variant="body2" sx={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: '#2e7d32' }}>
                {currFormat.format(value)}
            </Typography>
        ),
    },
    {
        field: 'annualSalary',
        headerName: 'Annual Salary',
        hideable: false,
        renderCell: ({ value }) => (
            <Typography variant="body2" sx={{ fontVariantNumeric: 'tabular-nums', color: 'text.secondary' }}>
                {currFormat.format(value)}
            </Typography>
        ),
    },
    {
        field: 'remarks',
        headerName: 'Remarks',
        width: 200,
        hideable: false,
        renderCell: ({ value }) =>
            value ? (
                <Chip
                    label={value}
                    size="small"
                    sx={{
                        height: 22,
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        bgcolor: '#fff8e1',
                        color: '#e65100',
                        borderRadius: 1,
                        maxWidth: 190,
                    }}
                />
            ) : (
                <Chip
                    label="✓ Clear"
                    size="small"
                    sx={{
                        height: 22,
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        bgcolor: '#e8f5e9',
                        color: '#2e7d32',
                        borderRadius: 1,
                    }}
                />
            ),
    },
];

// ─── Grid SX overrides ───────────────────────────────────────────────────────

const gridSx = {
    border: 'none',
    '& .MuiDataGrid-columnHeaders': {
        bgcolor: 'grey.50',
        borderRadius: 2,
        borderBottom: '2px solid',
        borderColor: 'divider',
        '& .MuiDataGrid-columnHeaderTitle': {
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: 'text.secondary',
        },
    },
    '& .MuiDataGrid-row': {
        borderRadius: 2,
        mb: 0.5,
        '&:hover': {
            bgcolor: 'primary.50',
        },
        '&.Mui-selected': {
            bgcolor: 'primary.50',
        },
    },
    '& .MuiDataGrid-cell': {
        borderBottom: '1px solid',
        borderColor: 'grey.100',
        py: 1,
    },
    '& .MuiDataGrid-detailPanel': {
        borderRadius: '0 0 12px 12px',
        overflow: 'hidden',
    },
    '& .error': {
        color: 'error.main',
    },
};

//Panel Height Constants
const DETAIL_PANEL = {
    HEADER_H: 48,
    ITEM_H: 36,
    TOTAL_H: 36,
    SUMMARY_H: 52,
    PADDING_H: 40,
    MIN_H: 200,
};

// ─── Main Component ───────────────────────────────────────────────────────────


const DEFAULT_API = API.Process;

const RunPayroll = ({ setOpenPopup }) => {
    const dispatch = useAppDispatch();
    const query = useAppSelector(e => e.appdata.query.builder);
    const [selectionModel, setSelectionModel] = React.useState([]);

    const [gridFilter, setGridFilter] = useState({ limit: 10, page: 0, totalRecord: 0 });
    const [records, setRecords] = useState([]);
    const [extraData, setExtraData] = useState({ loanDetail: [], bounsDetail: [], leaveDetail: [] });

    const { addEntity } = useEntityAction();
    const gridApiRef = useGridApi();
    const { countryIds, stateIds, cityIds, areaIds, departmentIds, groupIds, designationIds, employeeIds } = useDropDownIds();
    const [getEmployeePayroll] = useLazyPostQuery();

    useEffect(() => {
        dispatch(showDropDownFilterAction({
            company: true, country: true, state: true, city: true,
            area: true, department: true, group: true, designation: true, employee: true
        }));
        dispatch(builderFieldsAction(fields));
    }, [dispatch]);

    const getDetailPanelContent = React.useCallback(
        ({ row }) => <DetailPanelContent row={row} />,
        []
    );
    const getDetailPanelHeight = React.useCallback(({ row }) => {
        const { HEADER_H, ITEM_H, TOTAL_H, SUMMARY_H, PADDING_H, MIN_H } = DETAIL_PANEL;
        const maxItems = Math.max(
            row.earnings?.length || 0,
            row.deductions?.length || 0,
            row.others?.length || 0,
        );
        return Math.max(PADDING_H + HEADER_H + (maxItems * ITEM_H) + TOTAL_H + SUMMARY_H, MIN_H);
    }, []);

    const [detailPanelExpandedRowIds, setDetailPanelExpandedRowIds] = React.useState([]);
    const handleDetailPanelExpandedRowIdsChange = React.useCallback((newIds) => {
        setDetailPanelExpandedRowIds(newIds);
    }, []);

    const columns = getColumns(gridApiRef);

    const handleProcessPayroll = () => {
        getEmployeePayroll({
            url: DEFAULT_API,
            data: {
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
            const { payrollDetails, ...extra } = data;
            setGridFilter({ ...gridFilter, limit: 10, page: 0 });
            setRecords(payrollDetails);
            setExtraData(extra);
            setDetailPanelExpandedRowIds(payrollDetails.filter(c => c.isProcess).map(e => e.fkEmployeeId));
        });
    };

    const handleSavePayroll = () => {
        const processData = records.filter(c => c.isProcess);
        addEntity({
            url: `${DEFAULT_API}/save`,
            data: {
                payrollData: processData,
                year: records[0].year,
                month: records[0].month,
                employeeIds: processData.map(c => c.fkEmployeeId),
                ...extraData
            }
        }).finally(() => setOpenPopup(false));
    };

    return (
        <Box sx={{ bgcolor: 'grey.50', minHeight: '100%' }}>
            <PageHeader
                title="Run Payroll"
                enableFilter={true}
                handleApply={handleProcessPayroll}
                subTitle="Process & review employee payroll"
                icon={<PeopleOutline fontSize="large" />}
            />

            <Box sx={{ p: { xs: 1, md: 1 } }}>
                {/* Summary Cards — shown only when records are loaded */}
                {records.length > 0 && <SummaryCards records={records} />}

                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: 'divider',
                        overflow: 'hidden',
                    }}
                >
                    <DataGrid
                        apiRef={gridApiRef}
                        columns={columns}
                        rows={records}
                        loading={false}
                        sx={gridSx}
                        totalCount={records?.length}
                        // autoHeight={true}
                        getRowHeight={() => 52}
                        disableSelectionOnClick
                        page={gridFilter.page}
                        pageSize={gridFilter.limit}
                        editMode="row"
                        paginationMode="client"
                        setFilter={setGridFilter}
                        toolbarProps={{
                            apiRef: gridApiRef,
                            onAdd: handleSavePayroll,
                            records,
                            selectionModel,
                        }}
                        checkboxSelection={false}
                        getRowId={(r) => r.fkEmployeeId}
                        detailPanelExpandedRowIds={detailPanelExpandedRowIds}
                        onDetailPanelExpandedRowIdsChange={handleDetailPanelExpandedRowIdsChange}
                        getDetailPanelContent={getDetailPanelContent}
                        getDetailPanelHeight={getDetailPanelHeight}
                        gridToolBar={RunPayrollToolbar}
                        selectionModel={selectionModel}
                        setSelectionModel={setSelectionModel}
                    />
                </Paper>
            </Box>
        </Box>
    );
};

// ─── Toolbar ─────────────────────────────────────────────────────────────────

export function RunPayrollToolbar(props) {
    const { onAdd, records } = props;

    return (
        <GridToolbarContainer
            sx={{
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid',
                borderColor: 'divider',
            }}
        >
            <GridToolbarQuickFilter
                sx={{
                    '& .MuiInputBase-root': {
                        borderRadius: 2,
                        bgcolor: 'grey.50',
                        fontSize: '0.85rem',
                        px: 1,
                    },
                    '& .MuiInputBase-root:before, & .MuiInputBase-root:after': {
                        display: 'none',
                    },
                }}
            />

            {records?.length > 0 && (
                <Controls.Button
                    onClick={onAdd}
                    startIcon={<AddIcon />}
                    text="Save Payroll"
                // sx={{
                //     borderRadius: 2,
                //     textTransform: 'none',
                //     fontWeight: 600,
                //     px: 2.5,
                //     py: 0.75,
                //     fontSize: '0.85rem',
                //     boxShadow: '0 2px 8px rgba(25,118,210,0.25)',
                //     '&:hover': {
                //         boxShadow: '0 4px 12px rgba(25,118,210,0.35)',
                //     },
                // }}
                />
            )}
        </GridToolbarContainer>
    );
}

export default RunPayroll;