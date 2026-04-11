import React, { useLayoutEffect, useRef, useState } from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import {
    Box, Grid, Paper, Typography, Stack, Chip, Avatar,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
} from "../../deps/ui";
import {
    PeopleOutline, TrendingUp, TrendingDown,
    AccountBalance, CalendarToday, ArrowUpward, ArrowDownward,
} from "../../deps/ui/icons";
import { monthNames } from '../../util/common';
import { useEntitiesQuery } from '../../store/actions/httpactions';

am4core.useTheme(am4themes_animated);

// ─── Constants ────────────────────────────────────────────────────────────────

const currFormat = new Intl.NumberFormat();
// Last month — current month incomplete hota hai, last month ka data finalized hota hai
const today = new Date();
const LAST_MONTH = today.getMonth() === 0 ? 11 : today.getMonth() - 1;
const CURRENT_YEAR = today.getMonth() === 0 ? today.getFullYear() - 1 : today.getFullYear();

// ─── Mock Data (replace with API calls) ──────────────────────────────────────

const MOCK_SUMMARY = {
    totalEmployees: 36,
    processedEmployees: 34,
    totalGross: 3682221,
    totalDeductions: 781381,
    totalNet: 2901740,
    avgSalary: 85360,
    month: LAST_MONTH,
    year: CURRENT_YEAR,
};

const MOCK_MONTHLY_TREND = [
    { month: 'Aug', gross: 3210000, net: 2540000, deductions: 670000 },
    { month: 'Sep', gross: 3340000, net: 2650000, deductions: 690000 },
    { month: 'Oct', gross: 3290000, net: 2600000, deductions: 690000 },
    { month: 'Nov', gross: 3510000, net: 2780000, deductions: 730000 },
    { month: 'Dec', gross: 3620000, net: 2860000, deductions: 760000 },
    { month: 'Jan', gross: 3682221, net: 2901740, deductions: 781381 },
];

const MOCK_DEPT_DATA = [
    { dept: 'Engineering', employees: 12, gross: 1240000, net: 980000 },
    { dept: 'Sales', employees: 8, gross: 820000, net: 650000 },
    { dept: 'HR', employees: 5, gross: 410000, net: 325000 },
    { dept: 'Finance', employees: 4, gross: 480000, net: 378000 },
    { dept: 'Operations', employees: 5, gross: 420000, net: 332000 },
    { dept: 'Management', employees: 2, gross: 312221, net: 236740 },
];

const MOCK_RECENT = [
    { id: 'H000002', name: 'JAWAID PATNI', setup: 'General', monthly: 226688, net: 191837, status: 'Processed' },
    { id: 'H000005', name: 'SOHAIL OWAIS', setup: 'General', monthly: 92554, net: 75487, status: 'Processed' },
    { id: 'H000009', name: 'AHMED RAZA', setup: 'Executive', monthly: 185000, net: 162400, status: 'Processed' },
    { id: 'H000011', name: 'SARA KHAN', setup: 'General', monthly: 78000, net: 64200, status: 'Processed' },
    { id: 'H000014', name: 'USMAN ALI', setup: 'General', monthly: 95000, net: 79800, status: 'Pending' },
    { id: 'H000017', name: 'FARAH NOOR', setup: 'Executive', monthly: 142000, net: 124000, status: 'Processed' },
];

// ─── Summary Card ─────────────────────────────────────────────────────────────

const SummaryCard = ({ label, value, sub, icon, color, bg, trend, trendVal, delay = 0 }) => (
    <Paper elevation={0} sx={{
        p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', height: '100%',
        animation: 'fadeUp 0.35s ease both', animationDelay: `${delay}ms`,
        transition: 'box-shadow 0.2s, transform 0.2s',
        '&:hover': { boxShadow: 4, transform: 'translateY(-2px)' },
    }}>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
            <Box>
                <Typography variant="caption" sx={{
                    color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase',
                    letterSpacing: '0.07em', display: 'block', mb: 0.5,
                }}>
                    {label}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color, lineHeight: 1.1, mb: 0.25 }}>
                    {value}
                </Typography>
                {sub && (
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>{sub}</Typography>
                )}
            </Box>
            <Box sx={{
                width: 48, height: 48, borderRadius: 2.5, bgcolor: bg, color,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
                {icon}
            </Box>
        </Stack>
        {trendVal && (
            <Stack direction="row" alignItems="center" gap={0.5}
                sx={{ mt: 1.5, pt: 1.5, borderTop: '1px solid', borderColor: 'divider' }}>
                {trend === 'up'
                    ? <ArrowUpward sx={{ fontSize: 13, color: '#2e7d32' }} />
                    : <ArrowDownward sx={{ fontSize: 13, color: '#d32f2f' }} />
                }
                <Typography variant="caption" sx={{
                    color: trend === 'up' ? '#2e7d32' : '#d32f2f', fontWeight: 700,
                }}>
                    {trendVal}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>vs last month</Typography>
            </Stack>
        )}
    </Paper>
);

// ─── Chart: Monthly Trend (amcharts4 Area) ────────────────────────────────────

const MonthlyTrendChart = ({ data }) => {
    const chartRef = useRef(null);

    useLayoutEffect(() => {
        const chart = am4core.create("payroll-trend-chart", am4charts.XYChart);
        chart.paddingRight = 10;
        chart.paddingLeft = 0;
        chart.data = data;

        // X Axis
        const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "month";
        categoryAxis.renderer.grid.template.disabled = true;
        categoryAxis.renderer.labels.template.fontSize = 11;
        categoryAxis.renderer.labels.template.fill = am4core.color("#9ca3af");
        categoryAxis.renderer.minGridDistance = 20;

        // Y Axis
        const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.grid.template.stroke = am4core.color("#f0f0f0");
        valueAxis.renderer.grid.template.strokeWidth = 1;
        valueAxis.renderer.labels.template.fontSize = 11;
        valueAxis.renderer.labels.template.fill = am4core.color("#9ca3af");
        valueAxis.renderer.baseGrid.disabled = true;
        valueAxis.renderer.labels.template.adapter.add("text", (text, target) => {
            const val = target.dataItem?.value;
            return val != null ? `${(val / 1000000).toFixed(1)}M` : text;
        });

        // Helper to create area series
        const createSeries = (field, name, color, dashed = false) => {
            const series = chart.series.push(new am4charts.LineSeries());
            series.dataFields.valueY = field;
            series.dataFields.categoryX = "month";
            series.name = name;
            series.stroke = am4core.color(color);
            series.strokeWidth = 2.5;
            series.tensionX = 0.8;
            series.tooltipText = `[bold]${name}[/]: {valueY}`;

            if (dashed) {
                series.strokeDasharray = "4,3";
            } else {
                // Fill gradient
                series.fillOpacity = 1;
                const gradient = new am4core.LinearGradient();
                gradient.addColor(am4core.color(color), 0.15);
                gradient.addColor(am4core.color(color), 0);
                gradient.rotation = 90;
                series.fill = gradient;
            }

            // Bullet dot
            const bullet = series.bullets.push(new am4charts.CircleBullet());
            bullet.circle.radius = 3;
            bullet.circle.fill = am4core.color(color);
            bullet.circle.strokeWidth = 0;

            return series;
        };

        createSeries("gross", "Gross", "#1976d2");
        createSeries("net", "Net", "#2e7d32");
        createSeries("deductions", "Deductions", "#d32f2f", true);

        // Cursor
        chart.cursor = new am4charts.XYCursor();
        chart.cursor.lineY.disabled = true;
        chart.cursor.lineX.strokeDasharray = "3,3";
        chart.cursor.lineX.stroke = am4core.color("#9ca3af");

        // Legend
        chart.legend = new am4charts.Legend();
        chart.legend.labels.template.fontSize = 11;
        chart.legend.labels.template.fill = am4core.color("#6b7280");
        chart.legend.itemContainers.template.paddingTop = 4;
        chart.legend.itemContainers.template.paddingBottom = 4;

        // Tooltip style
        chart.tooltip.getFillFromObject = false;
        chart.tooltip.background.fill = am4core.color("#fff");
        chart.tooltip.background.stroke = am4core.color("#e5e7eb");
        chart.tooltip.label.fill = am4core.color("#374151");

        chartRef.current = chart;
        return () => chart.dispose();
    }, [data]);

    return <div id="payroll-trend-chart" style={{ width: '100%', height: 280 }} />;
};

// ─── Chart: Department Bar (amcharts4) ────────────────────────────────────────

const DeptBarChart = ({ data }) => {
    const chartRef = useRef(null);

    useLayoutEffect(() => {
        const chart = am4core.create("payroll-dept-chart", am4charts.XYChart);
        chart.paddingRight = 10;
        chart.paddingLeft = 0;
        chart.data = data;

        // X Axis
        const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "dept";
        categoryAxis.renderer.grid.template.disabled = true;
        categoryAxis.renderer.labels.template.fontSize = 11;
        categoryAxis.renderer.labels.template.fill = am4core.color("#9ca3af");
        categoryAxis.renderer.minGridDistance = 10;

        // Y Axis
        const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.grid.template.stroke = am4core.color("#f0f0f0");
        valueAxis.renderer.grid.template.strokeWidth = 1;
        valueAxis.renderer.labels.template.fontSize = 11;
        valueAxis.renderer.labels.template.fill = am4core.color("#9ca3af");
        valueAxis.renderer.baseGrid.disabled = true;
        valueAxis.renderer.labels.template.adapter.add("text", (text, target) => {
            const val = target.dataItem?.value;
            return val != null ? `${(val / 1000).toFixed(0)}K` : text;
        });

        // Helper to create bar series
        const createBar = (field, name, color) => {
            const series = chart.series.push(new am4charts.ColumnSeries());
            series.dataFields.valueY = field;
            series.dataFields.categoryX = "dept";
            series.name = name;
            series.fill = am4core.color(color);
            series.stroke = am4core.color(color);
            series.tooltipText = `[bold]${name}[/]: {valueY}`;
            series.columns.template.cornerRadiusTopLeft = 4;
            series.columns.template.cornerRadiusTopRight = 4;
            series.columns.template.maxWidth = 28;
            series.columns.template.column.fillOpacity = 0.9;
            series.columns.template.column.adapter.add("fillOpacity", (fo, target) => {
                return target.isHover ? 1 : 0.85;
            });
            return series;
        };

        createBar("gross", "Gross", "#1976d2");
        createBar("net", "Net", "#2e7d32");

        chart.cursor = new am4charts.XYCursor();
        chart.cursor.lineY.disabled = true;

        chart.legend = new am4charts.Legend();
        chart.legend.labels.template.fontSize = 11;
        chart.legend.labels.template.fill = am4core.color("#6b7280");
        chart.legend.itemContainers.template.paddingTop = 4;
        chart.legend.itemContainers.template.paddingBottom = 4;

        chartRef.current = chart;
        return () => chart.dispose();
    }, [data]);

    return <div id="payroll-dept-chart" style={{ width: '100%', height: 260 }} />;
};

// ─── Chart: Department Pie (amcharts4) ───────────────────────────────────────

const DeptPieChart = ({ data }) => {
    const chartRef = useRef(null);

    useLayoutEffect(() => {
        const chart = am4core.create("payroll-pie-chart", am4charts.PieChart);
        chart.innerRadius = am4core.percent(55); // donut
        chart.data = data;

        const series = chart.series.push(new am4charts.PieSeries());
        series.dataFields.value = "gross";
        series.dataFields.category = "dept";
        series.slices.template.tooltipText = "{category}: {value}";
        series.slices.template.cornerRadius = 4;
        series.slices.template.innerCornerRadius = 4;
        series.labels.template.disabled = true;
        series.ticks.template.disabled = true;

        // Colors
        const colorSet = new am4core.ColorSet();
        colorSet.list = ["#1976d2", "#2e7d32", "#e65100", "#6a1b9a", "#00695c", "#c62828"]
            .map(c => am4core.color(c));
        series.colors = colorSet;

        // Legend
        chart.legend = new am4charts.Legend();
        chart.legend.position = "bottom";
        chart.legend.labels.template.fontSize = 11;
        chart.legend.labels.template.fill = am4core.color("#6b7280");
        chart.legend.itemContainers.template.paddingTop = 3;
        chart.legend.itemContainers.template.paddingBottom = 3;

        // Center label
        const label = chart.seriesContainer.createChild(am4core.Label);
        label.text = `${data.length}\nDepts`;
        label.horizontalCenter = "middle";
        label.verticalCenter = "middle";
        label.fontSize = 14;
        label.fontWeight = "700";
        label.fill = am4core.color("#374151");
        label.textAlign = "middle";

        chartRef.current = chart;
        return () => chart.dispose();
    }, [data]);

    return <div id="payroll-pie-chart" style={{ width: '100%', height: 260 }} />;
};

// ─── Recent Payroll Table Row ─────────────────────────────────────────────────

const PayrollRow = ({ row, index }) => (
    <TableRow sx={{
        '&:hover': { bgcolor: '#f0f7ff' },
        animation: 'fadeUp 0.3s ease both',
        animationDelay: `${index * 40}ms`,
    }}>
        <TableCell sx={{ py: 1.25 }}>
            <Stack direction="row" alignItems="center" gap={1.5}>
                <Avatar sx={{
                    width: 32, height: 32, fontSize: '0.65rem', fontWeight: 700, borderRadius: 1.5,
                    bgcolor: `hsl(${(row.name.charCodeAt(0) * 37) % 360}, 45%, 88%)`,
                    color: `hsl(${(row.name.charCodeAt(0) * 37) % 360}, 45%, 30%)`,
                }}>
                    {row.name.split(' ').slice(-2).map(n => n[0]).join('')}
                </Avatar>
                <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.82rem', lineHeight: 1.2 }}>
                        {row.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>{row.id}</Typography>
                </Box>
            </Stack>
        </TableCell>
        <TableCell sx={{ py: 1.25 }}>
            <Chip label={row.setup} size="small" sx={{
                height: 20, fontSize: '0.7rem', fontWeight: 600,
                bgcolor: '#e8f4fd', color: '#1565c0', borderRadius: 1,
            }} />
        </TableCell>
        <TableCell sx={{ py: 1.25 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#1565c0' }}>
                {currFormat.format(row.monthly)}
            </Typography>
        </TableCell>
        <TableCell sx={{ py: 1.25 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#2e7d32' }}>
                {currFormat.format(row.net)}
            </Typography>
        </TableCell>
        <TableCell sx={{ py: 1.25 }}>
            <Chip label={row.status} size="small" sx={{
                height: 20, fontSize: '0.7rem', fontWeight: 600, borderRadius: 1,
                bgcolor: row.status === 'Processed' ? '#e8f5e9' : '#fff8e1',
                color: row.status === 'Processed' ? '#2e7d32' : '#e65100',
            }} />
        </TableCell>
    </TableRow>
);

// ─── Main Dashboard ───────────────────────────────────────────────────────────

const API = 'payroll/dashboard/get'
const PayrollDashboard = () => {
    const [summaryDef] = useState(MOCK_SUMMARY);
    const [monthlyDef] = useState(MOCK_MONTHLY_TREND);
    const [deptDataDef] = useState(MOCK_DEPT_DATA);
    const [recentDef] = useState(MOCK_RECENT);

    const { summary, monthly, deptData, recent, isLoading, refetch, data } = useEntitiesQuery({
        url: API,
        data: {

        }
    }, {
        selectFromResult: ({ data, isLoading, refetch }) => ({
            summary: data?.summary ?? summaryDef,
            monthly: data?.monthlyTrend ?? monthlyDef,
            deptData: data?.deptBreakdown ?? deptDataDef,
            recent: data?.recentPayroll ?? recentDef,
            data,
            isLoading,
            refetch
        })
    });
    console.log(data, "payrolldashboarddata");
    const deductionRate = ((summary.totalDeductions / summary.totalGross) * 100).toFixed(1);

    const CARDS = [
        {
            label: 'Total Employees',
            value: summary.totalEmployees,
            sub: `${summary.processedEmployees} processed this month`,
            icon: <PeopleOutline fontSize="small" />,
            color: '#1565c0', bg: '#e3f2fd',
            trend: 'up', trendVal: '+2 from last month',
        },
        {
            label: 'Total Gross',
            value: currFormat.format(summary.totalGross),
            sub: `Avg ${currFormat.format(summary.avgSalary)} / employee`,
            icon: <TrendingUp fontSize="small" />,
            color: '#1565c0', bg: '#e3f2fd',
            trend: 'up', trendVal: '1.7% increase',
        },
        {
            label: 'Total Deductions',
            value: currFormat.format(summary.totalDeductions),
            sub: `${deductionRate}% of gross salary`,
            icon: <TrendingDown fontSize="small" />,
            color: '#c62828', bg: '#ffebee',
            trend: 'up', trendVal: '2.8% increase',
        },
        {
            label: 'Net Payable',
            value: currFormat.format(summary.totalNet),
            sub: 'Final disbursement amount',
            icon: <AccountBalance fontSize="small" />,
            color: '#1b5e20', bg: '#e8f5e9',
            trend: 'up', trendVal: '1.4% increase',
        },
    ];

    return (
        <Box sx={{ bgcolor: '#f8fafc', minHeight: '100%', p: { xs: 1.5, md: 2.5 } }}>
            <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(8px); }
                    to   { opacity: 1; transform: translateY(0);   }
                }
            `}</style>

            {/* ── Header ── */}
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2.5 }}>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.02em', color: 'text.primary' }}>
                        Payroll Dashboard
                    </Typography>
                    <Stack direction="row" alignItems="center" gap={0.75} sx={{ mt: 0.4 }}>
                        <CalendarToday sx={{ fontSize: 12, color: 'text.secondary' }} />
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                            {monthNames[summary.month]} {summary.year} · Current Month
                        </Typography>
                    </Stack>
                </Box>
                <Chip
                    label={`${summary.processedEmployees} / ${summary.totalEmployees} Processed`}
                    sx={{
                        bgcolor: '#e8f5e9', color: '#2e7d32', fontWeight: 700,
                        fontSize: '0.78rem', borderRadius: 2, px: 0.5,
                    }}
                />
            </Stack>

            {/* ── Summary Cards ── */}
            <Grid container spacing={2} sx={{ mb: 2.5 }}>
                {CARDS.map((card, i) => (
                    <Grid item size={{ xs: 12, sm: 6, md: 3 }} key={card.label}>
                        <SummaryCard {...card} delay={i * 60} />
                    </Grid>
                ))}
            </Grid>

            {/* ── Charts Row 1: Trend + Pie ── */}
            <Grid container spacing={2} sx={{ mb: 2.5 }}>
                <Grid item size={{ xs: 12, md: 8 }}>
                    <Paper elevation={0} sx={{
                        p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider',
                        animation: 'fadeUp 0.4s ease both', animationDelay: '240ms',
                    }}>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                Monthly Payroll Trend
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                Last 6 months — Gross, Net & Deductions
                            </Typography>
                        </Box>
                        <MonthlyTrendChart data={monthly} />
                    </Paper>
                </Grid>

                <Grid item size={{ xs: 12, md: 4 }}>
                    <Paper elevation={0} sx={{
                        p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', height: '100%',
                        animation: 'fadeUp 0.4s ease both', animationDelay: '300ms',
                    }}>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                Department-wise
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                Gross salary distribution
                            </Typography>
                        </Box>
                        <DeptPieChart data={deptData} />
                    </Paper>
                </Grid>
            </Grid>

            {/* ── Charts Row 2: Dept Bar ── */}
            <Grid container spacing={2} sx={{ mb: 2.5 }}>
                <Grid item size={{ xs: 12 }}>
                    <Paper elevation={0} sx={{
                        p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider',
                        animation: 'fadeUp 0.4s ease both', animationDelay: '360ms',
                    }}>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                Department Comparison
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                Gross vs Net salary by department
                            </Typography>
                        </Box>
                        <DeptBarChart data={deptData} />
                    </Paper>
                </Grid>
            </Grid>

            {/* ── Recent Payroll Table ── */}
            <Paper elevation={0} sx={{
                borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden',
                animation: 'fadeUp 0.4s ease both', animationDelay: '420ms',
            }}>
                <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Recent Payroll</Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                {monthNames[summary.month]} {summary.year} — latest entries
                            </Typography>
                        </Box>
                        <Chip label={`${recent.length} records`} size="small" sx={{
                            bgcolor: '#f1f5f9', color: 'text.secondary',
                            fontWeight: 600, fontSize: '0.72rem', borderRadius: 1,
                        }} />
                    </Stack>
                </Box>
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'grey.50' }}>
                                {['Employee', 'Setup', 'Monthly Salary', 'Net Salary', 'Status'].map(h => (
                                    <TableCell key={h} sx={{
                                        fontSize: '0.72rem', fontWeight: 700,
                                        textTransform: 'uppercase', letterSpacing: '0.06em',
                                        color: 'text.secondary', borderBottom: '2px solid',
                                        borderColor: 'divider', py: 1.25,
                                    }}>
                                        {h}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {recent.map((row, i) => (
                                <PayrollRow key={row.id} row={row} index={i} />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
};

export default PayrollDashboard;