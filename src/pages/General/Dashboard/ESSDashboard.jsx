import React, { useLayoutEffect, useRef } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
  Typography,
  Chip,
  Divider,
  IconButton,
  Badge,
  Stack,
  Button,
} from "@/deps/ui";
import {
  AccessTime,
  EventAvailable,
  AccountBalanceWallet,
  NotificationsNone,
  WbSunny,
  Celebration,
  ChevronRight,
  Visibility,
  VisibilityOff,
} from "@/deps/ui/icons";

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

// ---------------------------------------------------------------------------
// MOCK DATA — replace with GET /api/employee-dashboard/summary response
// ---------------------------------------------------------------------------
const mockEmployee = {
  name: "Ayesha Malik",
  designation: "Senior QA Engineer",
  department: "Engineering",
  initials: "AM",
};

const mockAttendance = {
  present: 19,
  absent: 1,
  late: 2,
  leave: 2,
  workingDays: 24,
  todayStatus: "checked-in",
  checkInTime: "09:12 AM",
};

// Daily breakdown for the current month — status, check-in/out, late minutes,
// short-hours deduction. Powers the attendance bar chart below. Full month
// (24 working days, weekends excluded) — chart scrolls via scrollbarX.
const mockDailyAttendance = [
  { day: "Jul 1", status: "Present", checkIn: "09:02", checkOut: "18:05", workedHrs: 8, lateMins: 0, shortHrs: 0 },
  { day: "Jul 2", status: "Late", checkIn: "09:34", checkOut: "18:01", workedHrs: 7.5, lateMins: 34, shortHrs: 0 },
  { day: "Jul 3", status: "Present", checkIn: "08:58", checkOut: "18:10", workedHrs: 8, lateMins: 0, shortHrs: 0 },
  { day: "Jul 6", status: "Short", checkIn: "09:05", checkOut: "15:30", workedHrs: 6, lateMins: 5, shortHrs: 2 },
  { day: "Jul 7", status: "Present", checkIn: "08:57", checkOut: "18:00", workedHrs: 8, lateMins: 0, shortHrs: 0 },
  { day: "Jul 8", status: "Absent", checkIn: "-", checkOut: "-", workedHrs: 0, lateMins: 0, shortHrs: 0 },
  { day: "Jul 9", status: "Present", checkIn: "08:55", checkOut: "18:00", workedHrs: 8, lateMins: 0, shortHrs: 0 },
  { day: "Jul 10", status: "Late", checkIn: "09:21", checkOut: "18:02", workedHrs: 7.7, lateMins: 21, shortHrs: 0 },
  { day: "Jul 13", status: "Leave", checkIn: "-", checkOut: "-", workedHrs: 0, lateMins: 0, shortHrs: 0 },
  { day: "Jul 14", status: "Present", checkIn: "09:00", checkOut: "18:03", workedHrs: 8, lateMins: 0, shortHrs: 0 },
  { day: "Jul 15", status: "Present", checkIn: "08:50", checkOut: "18:15", workedHrs: 8, lateMins: 0, shortHrs: 0 },
  { day: "Jul 16", status: "Present", checkIn: "08:59", checkOut: "18:02", workedHrs: 8, lateMins: 0, shortHrs: 0 },
  { day: "Jul 17", status: "Short", checkIn: "09:03", checkOut: "16:00", workedHrs: 6.5, lateMins: 3, shortHrs: 1.5 },
  { day: "Jul 20", status: "Present", checkIn: "08:56", checkOut: "18:04", workedHrs: 8, lateMins: 0, shortHrs: 0 },
  { day: "Jul 21", status: "Present", checkIn: "08:58", checkOut: "18:00", workedHrs: 8, lateMins: 0, shortHrs: 0 },
  { day: "Jul 22", status: "Leave", checkIn: "-", checkOut: "-", workedHrs: 0, lateMins: 0, shortHrs: 0 },
  { day: "Jul 23", status: "Present", checkIn: "09:01", checkOut: "18:05", workedHrs: 8, lateMins: 0, shortHrs: 0 },
  { day: "Jul 24", status: "Present", checkIn: "08:54", checkOut: "18:10", workedHrs: 8, lateMins: 0, shortHrs: 0 },
  { day: "Jul 27", status: "Present", checkIn: "08:59", checkOut: "18:01", workedHrs: 8, lateMins: 0, shortHrs: 0 },
  { day: "Jul 28", status: "Present", checkIn: "08:52", checkOut: "18:07", workedHrs: 8, lateMins: 0, shortHrs: 0 },
  { day: "Jul 29", status: "Present", checkIn: "08:57", checkOut: "18:03", workedHrs: 8, lateMins: 0, shortHrs: 0 },
  { day: "Jul 30", status: "Present", checkIn: "08:56", checkOut: "18:00", workedHrs: 8, lateMins: 0, shortHrs: 0 },
  { day: "Jul 31", status: "Present", checkIn: "08:58", checkOut: "18:02", workedHrs: 8, lateMins: 0, shortHrs: 0 },
];

const attendanceStatusColor = {
  Present: "#10b981",
  Late: "#f59e0b",
  Short: "#fb923c",
  Absent: "#f43f5e",
  Leave: "#94a3b8",
};

const mockLeaveBalance = [
  { type: "Annual", available: 8, total: 14 },
  { type: "Sick", available: 5, total: 8 },
  { type: "Casual", available: 3, total: 6 },
];

const mockPayslip = {
  month: "June 2026",
  netPay: 185000,
  currency: "PKR",
  status: "Paid",
};

// Consolidated "pending actions" — per 2026 ESS trend: one widget aggregating
// requests across modules (leave, attendance, approvals-you-owe) rather than
// separate module-oriented widgets.
const mockPendingActions = [
  { module: "Leave", label: "Annual leave · Jul 20-21", state: "Awaiting manager", color: "#6366f1" },
  { module: "Attendance", label: "Late check-in exemption · Jul 8", state: "Awaiting HR", color: "#0d9488" },
  { module: "Approvals", label: "Bilal Ahmed · Leave request", state: "Your action needed", color: "#e11d48" },
];

const mockHoliday = { name: "Independence Day", date: "Aug 14" };

// ---------------------------------------------------------------------------
// amCharts4: Attendance daily bar chart — worked hours per day, colored by
// status, with check-in/out, late minutes, and short-hours deduction in the
// tooltip. Small legend + summary chips give the monthly rollup at a glance.
// ---------------------------------------------------------------------------
function AttendanceBarChart({ daily }) {
  const chartRef = useRef(null);

  useLayoutEffect(() => {
    const chart = am4core.create(chartRef.current, am4charts.XYChart);
    chart.data = daily.map((d) => ({
      ...d,
      color: attendanceStatusColor[d.status],
    }));
    chart.paddingLeft = 0;
    chart.paddingRight = 0;

    const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "day";
    categoryAxis.renderer.grid.template.disabled = true;
    categoryAxis.renderer.labels.template.fontSize = 10;
    categoryAxis.renderer.labels.template.rotation = -35;
    categoryAxis.renderer.labels.template.horizontalCenter = "right";
    categoryAxis.renderer.minGridDistance = 20;

    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = "Hours";
    valueAxis.title.fontSize = 10;
    valueAxis.renderer.grid.template.strokeOpacity = 0.08;
    valueAxis.min = 0;
    valueAxis.max = 8;
    valueAxis.strictMinMax = true;

    const series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "workedHrs";
    series.dataFields.categoryX = "day";
    series.columns.template.propertyFields.fill = "color";
    series.columns.template.strokeWidth = 0;
    series.columns.template.width = am4core.percent(55);
    series.columns.template.column.cornerRadiusTopLeft = 3;
    series.columns.template.column.cornerRadiusTopRight = 3;

    series.columns.template.tooltipHTML = `
      <strong>{day} · {status}</strong><br/>
      Check-in: {checkIn} &nbsp; Check-out: {checkOut}<br/>
      Late: {lateMins} min &nbsp; Short: {shortHrs} hrs
    `;
    series.tooltip.getFillFromObject = false;
    series.tooltip.background.fill = am4core.color("#0f172a");
    series.tooltip.label.fontSize = 11;

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.lineY.disabled = true;
    chart.cursor.behavior = "none";

    // Scroll through the full month; default view shows the most recent days
    chart.scrollbarX = new am4core.Scrollbar();
    chart.scrollbarX.height = 8;
    chart.scrollbarX.marginTop = 8;
    chart.scrollbarX.background.fill = am4core.color("#f1f5f9");
    chart.scrollbarX.thumb.background.fill = am4core.color("#cbd5e1");

    // Built-in legend — driven by static status/color data, not the series
    // (columns are colored per-item via the "color" field, so the legend is
    // bound manually rather than to the single ColumnSeries).
    chart.legend = new am4charts.Legend();
    chart.legend.position = "bottom";
    chart.legend.fontSize = 10.5;
    chart.legend.marginTop = 4;
    chart.legend.markers.template.width = 9;
    chart.legend.markers.template.height = 9;
    chart.legend.data = Object.entries(attendanceStatusColor).map(([name, color]) => ({
      name,
      fill: am4core.color(color),
    }));

    chart.events.on("datavalidated", () => {
      const count = daily.length;
      categoryAxis.zoomToIndexes(Math.max(0, count - 10), count);
    });

    return () => chart.dispose();
  }, [daily]);

  return <div ref={chartRef} style={{ width: "100%", height: 230 }} />;
}

// ---------------------------------------------------------------------------
// amCharts4: Leave balance horizontal bar
// ---------------------------------------------------------------------------
function LeaveBalanceChart({ balances }) {
  const chartRef = useRef(null);

  useLayoutEffect(() => {
    const chart = am4core.create(chartRef.current, am4charts.XYChart);
    chart.data = balances.map((b) => ({
      type: b.type,
      available: b.available,
      used: b.total - b.available,
    }));

    const categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "type";
    categoryAxis.renderer.grid.template.disabled = true;
    categoryAxis.renderer.labels.template.fontSize = 11;
    categoryAxis.renderer.minGridDistance = 10;

    const valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.grid.template.strokeOpacity = 0.08;
    valueAxis.min = 0;

    function createSeries(field, name, color) {
      const s = chart.series.push(new am4charts.ColumnSeries());
      s.dataFields.valueX = field;
      s.dataFields.categoryY = "type";
      s.name = name;
      s.stacked = true;
      s.columns.template.fill = am4core.color(color);
      s.columns.template.strokeWidth = 0;
      s.columns.template.height = am4core.percent(50);
      s.columns.template.tooltipText = `${name}: {valueX}`;
    }
    createSeries("available", "Available", "#0d9488");
    createSeries("used", "Used", "#e2e8f0");

    chart.legend = new am4charts.Legend();
    chart.legend.fontSize = 11;
    chart.legend.position = "bottom";

    return () => chart.dispose();
  }, [balances]);

  return <div ref={chartRef} style={{ width: "100%", height: 170 }} />;
}

// ---------------------------------------------------------------------------
// Cards
// ---------------------------------------------------------------------------
function SectionCard({ icon, title, iconBg, children, footerLabel }) {
  return (
    <Card elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 3, height: "100%", display: "flex", flexDirection: "column" }}>
      <CardContent sx={{ flex: 1, pb: 1 }}>
        <Stack direction="row" alignItems="center" spacing={1.5} mb={1.5}>
          <Avatar sx={{ bgcolor: iconBg, width: 32, height: 32 }}>{icon}</Avatar>
          <Typography variant="subtitle2" fontWeight={600} color="#334155">
            {title}
          </Typography>
        </Stack>
        {children}
      </CardContent>
      {footerLabel && (
        <>
          <Divider />
          <Button
            endIcon={<ChevronRight fontSize="small" />}
            sx={{ justifyContent: "space-between", px: 2.5, py: 1.2, color: "#64748b", fontSize: 12, fontWeight: 500, textTransform: "none" }}
          >
            {footerLabel}
          </Button>
        </>
      )}
    </Card>
  );
}

function PayslipCard({ data }) {
  const [revealed, setRevealed] = React.useState(false);

  return (
    <SectionCard icon={<AccountBalanceWallet fontSize="small" />} iconBg="#d97706" title="Payslip">
      <Typography variant="caption" color="text.secondary">
        {data.month}
      </Typography>

      <Stack direction="row" alignItems="center" spacing={1} mt={0.5} mb={1.5}>
        <Typography variant="h5" fontWeight={700} color="#1e293b">
          {revealed ? `${data.currency} ${data.netPay.toLocaleString()}` : "PKR ••••••"}
        </Typography>
        <IconButton size="small" onClick={() => setRevealed((r) => !r)} sx={{ color: "#94a3b8" }}>
          {revealed ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
        </IconButton>
      </Stack>

      <Chip
        size="small"
        label={data.status}
        sx={{ bgcolor: "#ecfdf5", color: "#047857", fontWeight: 500, fontSize: 11, mb: 1.5 }}
      />

      <Button
        fullWidth
        variant="outlined"
        endIcon={<ChevronRight fontSize="small" />}
        sx={{
          justifyContent: "space-between",
          color: "#334155",
          borderColor: "#e2e8f0",
          textTransform: "none",
          fontWeight: 500,
          fontSize: 12.5,
          "&:hover": { borderColor: "#cbd5e1", bgcolor: "#f8fafc" },
        }}
      >
        View Payslip
      </Button>
    </SectionCard>
  );
}

function PendingActionsCard({ items }) {
  return (
    <SectionCard icon={<NotificationsNone fontSize="small" />} iconBg="#e11d48" title={`Pending Actions (${items.length})`} footerLabel="View all actions">
      <Stack spacing={1}>
        {items.map((item, i) => (
          <Box
            key={i}
            sx={{
              bgcolor: "#f8fafc",
              borderRadius: 2,
              px: 1.5,
              py: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography variant="caption" fontWeight={600} color="#334155" display="block">
                {item.label}
              </Typography>
              <Typography variant="caption" color="text.secondary" fontSize={11}>
                {item.state}
              </Typography>
            </Box>
            <Chip
              size="small"
              label={item.module}
              sx={{ bgcolor: `${item.color}1A`, color: item.color, fontSize: 10, fontWeight: 600, height: 20 }}
            />
          </Box>
        ))}
      </Stack>
    </SectionCard>
  );
}

// ---------------------------------------------------------------------------
export default function EmployeeDashboard() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh", p: 3 }}>
      {/* Greeting strip */}
      <Box
        sx={{
          bgcolor: "#0f172a",
          borderRadius: 3,
          px: 3,
          py: 2.5,
          mb: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ bgcolor: "#0d9488", width: 44, height: 44, fontWeight: 600 }}>
            {mockEmployee.initials}
          </Avatar>
          <Box>
            <Typography color="#fff" fontWeight={600}>
              Welcome back, {mockEmployee.name.split(" ")[0]}
            </Typography>
            <Typography color="#94a3b8" variant="caption">
              {mockEmployee.designation} · {mockEmployee.department}
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={2} alignItems="center">
          <Box textAlign="right">
            <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="flex-end">
              <WbSunny sx={{ fontSize: 14, color: "#cbd5e1" }} />
              <Typography variant="caption" color="#cbd5e1">
                {today}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="flex-end" mt={0.3}>
              <Celebration sx={{ fontSize: 14, color: "#2dd4bf" }} />
              <Typography variant="caption" color="#2dd4bf">
                {mockHoliday.name} · {mockHoliday.date}
              </Typography>
            </Stack>
          </Box>
          <IconButton sx={{ bgcolor: "#1e293b" }}>
            <Badge color="error" variant="dot">
              <NotificationsNone sx={{ color: "#cbd5e1", fontSize: 20 }} />
            </Badge>
          </IconButton>
        </Stack>
      </Box>

      {/* Widget grid */}
      <Grid container spacing={2.5}>
        <Grid item   size={{xs:12}}>
          <SectionCard icon={<AccessTime fontSize="small" />} iconBg="#0d9488" title="My Attendance" footerLabel="View full attendance">
            <AttendanceBarChart daily={mockDailyAttendance} />
            {mockAttendance.todayStatus === "checked-in" && (
              <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
                Checked in today at {mockAttendance.checkInTime}
              </Typography>
            )}
          </SectionCard>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <SectionCard icon={<EventAvailable fontSize="small" />} iconBg="#4f46e5" title="Leave Balance" footerLabel="Apply / view leave history">
            <LeaveBalanceChart balances={mockLeaveBalance} />
          </SectionCard>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <PayslipCard data={mockPayslip} />
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <PendingActionsCard items={mockPendingActions} />
        </Grid>
      </Grid>
    </Box>
  );
}