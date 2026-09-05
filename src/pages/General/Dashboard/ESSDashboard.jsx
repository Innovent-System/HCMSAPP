import { useMemo, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import NightsStayOutlinedIcon from "@mui/icons-material/NightsStayOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";

import NotificationBanner from "./AnnouncementBar";
import AttendanceCalendarCard from "./AttendanceCalendarCard";
import TodayStatusCard from "./TodayStatusCard";
import AlertStatCard from "./AlertStatCard";
import WorkHoursChart from "./WorkHoursChart";
import CompanyNewsCard from "./CompanyNewsCard";
import { essColors } from "./theme";
import PendingRequestsCard from "./PendingCard";
import MissingCard from "./MissingCard";
import PayslipCard from "./PayslipCard";
import LeaveBalanceChart from "./LeaveBalanceCard";
import { useSingleQuery } from "@/store/actions/httpactions";

// ---------------------------------------------------------------------------
// Sample data — shaped the way this page expects its API response.
// Replace with a real fetch (e.g. GET /api/v1/Dashboard/Employee) that
// reuses AttendanceQueries.GetAttendanceSummarySql for the attendance/summary
// pieces and the existing payroll/leave endpoints for the rest.
// ---------------------------------------------------------------------------

const SAMPLE_EMPLOYEE = {
  fullName: "Admin",
  department: "Engineering department",
};

const SAMPLE_NOTIFICATIONS = [
  {
    icon: <PaidOutlinedIcon />,
    iconBg: essColors.tealBg,
    iconColor: essColors.teal,
    text: "Payroll processing for August has been completed.",
    href: "/payroll/payslips",
  },
  {
    icon: <VerifiedUserOutlinedIcon />,
    iconBg: essColors.amberBg,
    iconColor: essColors.amberText,
    text: "Annual health insurance renewal deadline: Sep 15",
    href: "/benefits",
  },
  {
    icon: <ShowChartIcon />,
    iconBg: essColors.blueBg,
    iconColor: essColors.blue,
    text: "Q3 performance review cycle begins next week",
    href: "/performance",
  },
];

const SAMPLE_ATTENDANCE_SUMMARY = { Present: 18, Late: 2, Short: 1, Absent: 1, Leave: 3 };

// Flat, Monday-first, already padded with leading/trailing blanks for August 2026
const SAMPLE_DAYS = [
  { day: 1, status: "Present" }, { day: 2, status: "Weekend" }, { day: 3, status: "Present" },
  { day: 4, status: "Present" }, { day: 5, status: "Absent" }, { day: 6, status: "Present" },
  { day: 7, status: "Present" },
  { day: 8, status: "Present" }, { day: 9, status: "Weekend" }, { day: 10, status: "Leave" },
  { day: 11, status: "Leave" }, { day: 12, status: "Leave" }, { day: 13, status: "Present" },
  { day: 14, status: "Late" },
  { day: 15, status: "Present" }, { day: 16, status: "Weekend" }, { day: 17, status: "Present" },
  { day: 18, status: "Present" }, { day: 19, status: "Present" }, { day: 20, status: "Present" },
  { day: 21, status: "Late" },
  { day: 22, status: "Present" }, { day: 23, status: "Weekend" }, { day: 24, status: "Present" },
  { day: 25, status: "Present", isToday: true }, { day: 26, status: "Present" }, { day: 27, status: "Present" },
  { day: 28, status: "Late" },
  { day: 29, status: "Present" }, { day: 30, status: "Weekend" }, { day: 31, status: "Empty" },
];

const SAMPLE_TODAY = {
  status: "Present",
  checkInTime: "09:02 AM",
  checkInTimestamp: new Date(new Date().setHours(9, 2, 0, 0)).toISOString(),
  shiftLabel: "09:00 AM — 06:00 PM",
  shiftName: "General shift",
};

const SAMPLE_WORK_HOURS_MONTHLY = [
  { date: "1", hours: 8.3 }, { date: "2", hours: 1.5 }, { date: "3", hours: 8.7 },
  { date: "4", hours: 8.4 }, { date: "5", hours: 1.2 }, { date: "6", hours: 7.5 },
  { date: "7", hours: 0 }, { date: "8", hours: 8.6 }, { date: "9", hours: 6.5 },
  { date: "10", hours: 7.1 }, { date: "11", hours: 8.8 }, { date: "12", hours: 8.5 },
  { date: "13", hours: 8.2 }, { date: "14", hours: 7.9 }, { date: "15", hours: 1.4 },
  { date: "16", hours: 0 }, { date: "17", hours: 8.4 }, { date: "18", hours: 8.5 },
  { date: "19", hours: 8.3 },
];

const SAMPLE_NEWS = [
  { icon: <NightsStayOutlinedIcon />, iconBg: essColors.amberBg, iconColor: essColors.amberText, title: "Eid ul-Adha holidays", date: "Aug 15" },
  { icon: <DescriptionOutlinedIcon />, iconBg: essColors.blueBg, iconColor: essColors.blue, title: "Updated leave policy", date: "Aug 12" },
  { icon: <FavoriteBorderIcon />, iconBg: essColors.redBg, iconColor: essColors.red, title: "Annual health camp", date: "Aug 10" },
  { icon: <AssignmentOutlinedIcon />, iconBg: essColors.tealBg, iconColor: essColors.teal, title: "Employee engagement survey", date: "Aug 8" },
];

const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  if (hour < 21) return 'Good evening';

  return 'Good night';
};

export default function EssDashboard() {
  const [monthLabel, setMonthLabel] = useState("August 2026");
  const [isClockedIn, setIsClockedIn] = useState(true);
  const [workHoursView, setWorkHoursView] = useState("monthly");

  const { data } = useSingleQuery(
    { url: "ESSDashboard/userprofile", params: {} },
    { selectFromResult: ({ data }) => ({ data: data?.result ?? SAMPLE_EMPLOYEE }) }
  );

  const todayDateLabel = useMemo(
    () =>
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    []
  );

  return (
    <Box sx={{ p: 2, bgcolor: "#EEF1F4", minHeight: "100%", width: "100%" }}>
      <Typography sx={{ fontSize: 19, fontWeight: 500, color: essColors.navy }}>
        {getGreeting()}, {data.fullName}
      </Typography>
      <Typography sx={{ fontSize: 13, color: essColors.textMuted, mt: 0.25 }}>
        Here's what's happening with you today.
      </Typography>
      <Typography sx={{ fontSize: 12, color: essColors.textFaint, mb: 2 }}>
        {todayDateLabel} · {data.department}
      </Typography>

      <NotificationBanner items={SAMPLE_NOTIFICATIONS} />

      <Grid container spacing={1.5} sx={{ mb: 2.5 }}>
        <Grid item xs={12} md={8}>
          <AttendanceCalendarCard />
        </Grid>
        <Grid item xs={12} md={4}>
          <TodayStatusCard
            {...SAMPLE_TODAY}
            isClockedIn={isClockedIn}
            onClockToggle={() => setIsClockedIn((v) => !v)}
          />
        </Grid>
      </Grid>

      <Grid container spacing={1.5} sx={{ mb: 2.5 }}>
        <Grid item xs={12} sm={6} md={3}>
          <LeaveBalanceChart />
          {/* <AlertStatCard
            label="LEAVE"
            accentColor={essColors.teal}
            value={<>14 <Box component="span" sx={{ fontSize: 12, fontWeight: 400, color: essColors.textMuted }}>days</Box></>}
            sublabel="Available"
            actionLabel="Apply leave"
          /> */}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <PendingRequestsCard />
         
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
         
          <MissingCard />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <PayslipCard />
         
        </Grid>
      </Grid>

      <Grid container spacing={1.5}>
        <Grid item xs={12} md={7}>
          <WorkHoursChart
            thisMonthTotal="162h 40m"
            averagePerDay="8h 12m"
            vsLastMonthPct={4}
            data={SAMPLE_WORK_HOURS_MONTHLY}
            view={workHoursView}
            onViewChange={setWorkHoursView}
          />
        </Grid>
        <Grid item xs={12} md={5}>
          <CompanyNewsCard items={SAMPLE_NEWS} />
        </Grid>
      </Grid>
    </Box>
  );
}
