import { intervalToDuration } from 'date-fns'
export const API = {
    Attendance: "attendance/amend",
    AttendanceReport: "attendance/attendancereport",
    AttendanceRegisterReport: "attendance/report/register",
    AttendanceInsert: "attendance/amend/insert",
    AttendanceRequest: "attendance/request",
    GetAttendanceDetail: "attendance/request/detail",
    ExemptionRequest: "attendance/exemption",
    GetExemptionDetail: "attendance/exemption/detail",
    Shift: "attendance/shift",
    ScheduleDetail: "attendance/schedule/scheduledetail",
    Schedule: "attendance/schedule",
    UpdateSchedule: "attendance/schedule/updateSchedule",
    Approval: "attendance/approval",
    MarkAttendance: "attendance/mark",
    AmendRoster: "attendance/amendroster",
    ApprovalAction: "attendance/approval/action",
    AttendanceRepost: "attendance/machine/repost"
    // Designation: "employee/designation",
}

export function getTimerDisplay(timer) {
    const duration = intervalToDuration({
        start: timer.start,
        end: timer.end ?? new Date()
    });
    const h = String(duration.hours ?? 0).padStart(2, '0');
    const m = String(duration.minutes ?? 0).padStart(2, '0');
    const s = String(duration.seconds ?? 0).padStart(2, '0');
    return `${h}:${m}:${s}`;
}

export const fetchLocation = () => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation not supported'));
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => resolve({
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
                accuracy: pos.coords.accuracy
            }),
            (err) => reject(new Error(err.message)),
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    });
};
// Haversine distance in meters
export const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371000;
    const toRad = (deg) => deg * (Math.PI / 180);
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}