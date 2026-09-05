import { useEffect, useState } from "react";
import { Box, Paper, Stack, Typography, IconButton, Autocomplete, TextField, CircularProgress, Tooltip } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { essColors, attendanceStatusColor } from "./theme";
import { useSingleQuery } from "@/store/actions/httpactions";
import { API } from "@/pages/Attendance/_Service";
import { format } from "date-fns";
import Controls from "@/components/controls/Controls";
import { useDropDown } from "@/components/useDropDown";
import Auth from "@/services/AuthenticationService";
import { setAttendanceList } from "@/store/slicer/attendance";
import { useAppDispatch } from "@/store/storehook";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const SUMMARY_ROWS = [
  { key: "Present", label: "Present", field: "present" },
  { key: "Late", label: "Late", field: "late" },
  { key: "Short", label: "Short", field: "shortDay" },
  { key: "Absent", label: "Absent", field: "absent" },
  { key: "Leave", label: "Leave", field: "leave" },
];

const DEFAULT_API = "ESSDashboard";

function formatTime(value) {
  if (!value) return "—";
  return format(new Date(value), "hh:mm a");
}

function DayTooltipContent({ cell }) {
  return (
    <Stack spacing={0.4} sx={{ p: 0.5 }}>
      <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>
        {format(new Date(cell.scheduleStartDt), "d MMM, EEE")}
      </Typography>
      <Stack direction="row" justifyContent="space-between" spacing={2}>
        <Typography sx={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>Status</Typography>
        <Typography sx={{ fontSize: 11, fontWeight: 500, color: "#fff" }}>{cell.remarks ?? "—"}</Typography>
      </Stack>
      <Stack direction="row" justifyContent="space-between" spacing={2}>
        <Typography sx={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>Check-in</Typography>
        <Typography sx={{ fontSize: 11, fontWeight: 500, color: "#fff" }}>{formatTime(cell.startDateTime)}</Typography>
      </Stack>
      <Stack direction="row" justifyContent="space-between" spacing={2}>
        <Typography sx={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>Check-out</Typography>
        <Typography sx={{ fontSize: 11, fontWeight: 500, color: "#fff" }}>{formatTime(cell.endDateTime)}</Typography>
      </Stack>
      <Stack direction="row" justifyContent="space-between" spacing={2}>
        <Typography sx={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>Worked</Typography>
        <Typography sx={{ fontSize: 11, fontWeight: 500, color: "#fff" }}>{cell.workHrs ? `${cell.workHrs} Hrs` : "—"}</Typography>
      </Stack>
    </Stack>
  );
}

function getAttendanceRate(summary) {
  if (!summary || Object.keys(summary).length <= 0) return 0;
  const workingDays = summary.totalDays;
  if (workingDays <= 0) return 0;
  return Math.round(((summary.paidDays - summary.holidays) / workingDays) * 100);
}

// Small ring chart — no need to pull in amCharts for a single inline stat
function AttendanceRateRing({ rate, size = 64, thickness = 5 }) {
  return (
    <Tooltip title="Attendance Rate">
      <Box sx={{ position: "relative", display: "inline-flex", width: size, height: size }}>
        <CircularProgress
          variant="determinate"
          value={100}
          size={size}
          thickness={thickness}
          sx={{ color: "#EEF0F2", position: "absolute" }}
        />
        <CircularProgress
          variant="determinate"
          value={rate}
          size={size}
          thickness={thickness}
          sx={{ color: essColors.teal, position: "absolute" }}
        />
        <Box sx={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Typography sx={{ fontSize: 15, fontWeight: 600, color: essColors.navy }}>{rate}%</Typography>
        </Box>
      </Box>
    </Tooltip>
  );
}

/**
 * @param {{
 *   monthLabel: string,
 *   onPrevMonth?: () => void,
 *   onNextMonth?: () => void,
 * }} props
 */
export default function AttendanceCalendarCard({ monthLabel, onPrevMonth, onNextMonth }) {
  const { employees } = useDropDown();
  const [selectedEmployee, setSelectedEmployee] = useState(null); // null = self (employeeId: 0)
  const dispatch = useAppDispatch();
  // NOTE: adjust the endpoint/shape to whatever your employee-list API actually is —
  // this assumes { id, fullName } objects back.
  useEffect(() => {
    if (employees.length)
      setSelectedEmployee(employees.find(e => e.id == Auth.getitem("userInfo").employeeId))
  }, [employees])
  const employeeId = selectedEmployee?.id ?? 0;

  const { data } = useSingleQuery(
    { url: `${DEFAULT_API}/AttendanceSummary`, params: { employeeId } },
    { selectFromResult: ({ data }) => ({ data: data?.result }) }
  );
  useEffect(() => {
    if (data?.attendanceList) {
      dispatch(setAttendanceList(data?.attendanceList))
    }
  }, [data])
  const summary = data?.summary?.[0] ?? {};
  const attendanceRate = getAttendanceRate(summary);

  return (
    <Paper elevation={0} sx={{ borderRadius: "10px", p: 2.25, boxShadow: "0 1px 2px rgba(16,28,48,0.06)", height: "100%" }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap" rowGap={1}>
        <Typography sx={{ fontSize: 15, fontWeight: 500, color: essColors.navy }}>Attendance Summary</Typography>

        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Controls.MultiSelect
            options={employees}
            sx={{ width: 200 }}
            name="employeeId"
            value={selectedEmployee}
            dataId="id"
            dataName="fullName"
            onChange={(e) => setSelectedEmployee(e.target.value)}
          />

        </Stack>
      </Stack>

      <Stack direction="row" spacing={2.5}>
        {/* Left rail: ring chart + status counts */}
        <Box sx={{ flexShrink: 0, width: 110 }}>
          <AttendanceRateRing rate={attendanceRate} />


          {SUMMARY_ROWS.map((row) => (
            <Stack key={row.key} direction="row" alignItems="center" spacing={0.75} mb={0.75}>
              <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: attendanceStatusColor[row.key]?.fg }} />
              <Typography sx={{ fontSize: 12, color: essColors.navy }}>{row.label}</Typography>
              <Typography sx={{ fontSize: 12, fontWeight: 500, color: essColors.navy, ml: "auto" }}>
                {String(summary[row.field] ?? 0).padStart(2, "0")}
              </Typography>
            </Stack>
          ))}
        </Box>

        {/* Right: calendar grid */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: "grid", mt: 2, gridTemplateColumns: "repeat(12, 1fr)", gap: "6px" }}>
            {data?.attendanceList?.map((cell, i) => {
              const day = format(new Date(cell?.scheduleStartDt), "d");
              const currentDay = format(new Date(), "d");
              const today = format(new Date(), "d") == day;
              const isPast = +currentDay > +day;
              const colors = attendanceStatusColor[isPast ? cell.remarks ?? "Empty" : "Empty"] ?? "Empty";

              const dayBox = (
                <Box
                  sx={{
                    aspectRatio: "1",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: today ? 600 : 400,
                    bgcolor: today ? "#fff" : colors.bg,
                    color: today ? essColors.navy : colors.fg,
                    border: today ? `2px solid ${essColors.navy}` : "none",
                    cursor: isPast || today ? "pointer" : "default",
                  }}
                >
                  {day ?? ""}
                </Box>
              );

              // Only worth a tooltip for days that actually have a record
              if (!isPast && !today) return <Box key={i}>{dayBox}</Box>;

              return (
                <Tooltip key={i} title={<DayTooltipContent cell={cell} />} arrow placement="top">
                  {dayBox}
                </Tooltip>
              );
            })}
          </Box>

          <Stack direction="row" spacing={1.75} mt={1.5} flexWrap="wrap" useFlexGap>
            {["Present", "Late", "Absent", "Leave", "Holiday"].map((key) => (
              <Stack key={key} direction="row" alignItems="center" spacing={0.6}>
                <Box sx={{ width: 8, height: 8, borderRadius: "2px", bgcolor: attendanceStatusColor[key].bg }} />
                <Typography sx={{ fontSize: 11, color: essColors.textMuted }}>{key}</Typography>
              </Stack>
            ))}
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
}