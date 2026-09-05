import { useEffect, useRef } from "react";
import { Box, Paper, Stack, Typography, Button } from "@mui/material";
import { essColors } from "./theme";
import { useAppSelector, useAppDispatch } from "@/store/storehook";
import { formateISOTime, intervalToDuration } from "@/services/dateTimeService";
import { useEntityAction } from "@/store/actions/httpactions";
import { API, fetchLocation } from "../../Attendance/_Service";
import { setMarkDetail } from "@/store/slicer/attendance";

const STATUS_COLOR = {
  Present: essColors.teal,
  Late: essColors.amber,
  Absent: essColors.red,
  Leave: essColors.blue,
};

export default function TodayStatusCard({ shiftLabel, shiftName }) {
  const detail = useAppSelector((e) => e.attendance.markDetail);
  const dispatch = useAppDispatch();
  const { addEntity } = useEntityAction();

  const hRef = useRef(null);
  const mRef = useRef(null);
  const sRef = useRef(null);
  const intervalRef = useRef(null);
  
  const isClockedIn = Boolean(detail?.startDateTime) && !detail?.endDateTime;

  useEffect(() => {
    if (!detail?.startDateTime) return;

    const checkIn = new Date(detail.startDateTime).getTime();

    const tick = () => {
      const { hours, minutes, seconds } = intervalToDuration({
        start: checkIn,
        end: detail?.endDateTime ? new Date(detail.endDateTime).getTime() : Date.now(),
      });
      if (hRef.current) hRef.current.textContent = String(hours ?? 0).padStart(2, "0");
      if (mRef.current) mRef.current.textContent = String(minutes ?? 0).padStart(2, "0");
      if (sRef.current) sRef.current.textContent = String(seconds ?? 0).padStart(2, "0");
      if (detail?.endDateTime) clearInterval(intervalRef.current);
    };

    tick();
    intervalRef.current = setInterval(tick, 1000);
    return () => clearInterval(intervalRef.current);
  }, [detail]);

  const handleClockToggle = async () => {
    let location = null;
    const mode = isClockedIn ? "OUT" : "IN";

    try {
      location = await fetchLocation();
    } catch {
      // best-effort here — see note below on gpsMandatory
    }

    const payload = {
      Mode: mode,
      ...(location && { location: { latitude: location.lat, longitude: location.lng, accuracy: location.accuracy } }),
    };

    const { data } = await addEntity({ url: API.MarkAttendance, data: payload });
    if (data) {
      dispatch(setMarkDetail({
        start: new Date(data.result.startDateTime),
        end: data.result.endDateTime ? new Date(data.result.endDateTime) : null,
        ...data.result,
      }));
    }
  };

  return (
    <Paper elevation={0} sx={{ borderRadius: "10px", p: 2.25, boxShadow: "0 1px 2px rgba(16,28,48,0.06)", height: "100%", display: "flex", flexDirection: "column" }}>
      <Typography sx={{ fontSize: 11, letterSpacing: "0.5px", color: essColors.textFaint, mb: 1.25 }}>TODAY</Typography>

      <Stack direction="row" alignItems="center" spacing={0.75} mb={2}>
        <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: STATUS_COLOR[detail?.flagName] ?? "GrayText" }} />
        <Typography sx={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.3px", color: STATUS_COLOR[detail?.flagName] ?? "GrayText" }}>
          {detail?.flagName?.toUpperCase()}
        </Typography>
      </Stack>

      <Typography sx={{ fontSize: 12, color: essColors.textMuted, mb: 0.5 }}>Check-in</Typography>
      <Typography sx={{ fontSize: 20, fontWeight: 600, color: essColors.navy, mb: 2 }}>
        {detail?.startDateTime ? formateISOTime(new Date(detail.startDateTime)) : "—"}
      </Typography>

      <Typography sx={{ fontSize: 12, color: essColors.textMuted, mb: 0.5 }}>Working today</Typography>
      <Typography sx={{ fontSize: 32, fontWeight: 700, color: essColors.navy, mb: 2, lineHeight: 1 }}>
        <span ref={hRef}>00</span>
        <Typography component="span" sx={{ fontSize: 14, fontWeight: 500, color: essColors.textFaint }}>h</Typography>{" "}
        <span ref={mRef}>00</span>
        <Typography component="span" sx={{ fontSize: 14, fontWeight: 500, color: essColors.textFaint }}>m</Typography>{" "}
        <Typography component="span" sx={{ fontSize: 22, fontWeight: 500, color: "#C3C9D1" }}>
          <span ref={sRef}>00</span>
          <Typography component="span" sx={{ fontSize: 12 }}>s</Typography>
        </Typography>
      </Typography>

      <Typography sx={{ fontSize: 12, color: essColors.textMuted, mb: 0.25 }}>Shift</Typography>
      <Typography sx={{ fontSize: 13, fontWeight: 500, color: essColors.navy, mb: 0.25 }}>{detail?.shiftLabel ?? shiftLabel}</Typography>
      <Typography sx={{ fontSize: 11, color: essColors.textFaint, mb: 2.5 }}>{detail?.shiftName ?? shiftName}</Typography>

      <Button
        onClick={handleClockToggle}
        variant="contained"
        disabled={!detail?.isAbleToMark}
        disableElevation
        sx={{ mt: "auto", bgcolor: essColors.navy, textTransform: "none", borderRadius: "8px", py: 1.1, fontSize: 13, fontWeight: 500, "&:hover": { bgcolor: essColors.navyDark } }}
      >
        {isClockedIn ? "Clock out" : "Clock in"}
      </Button>
    </Paper>
  );
}