// theme.js
// Shared color tokens for the ESS dashboard, matching HRNova's existing
// navy sidebar / teal accent brand. Pull these from your MUI theme palette
// instead if you'd rather centralize them there — kept local here so the
// dashboard can be dropped in and adjusted independently at first.

export const essColors = {
  navy: "#16283F",
  navyDark: "#0F1C30",
  navyLight: "#8A97A8",
  teal: "#12A989",
  tealBg: "#E4F5EF",
  amber: "#EFAA3E",
  amberBg: "#FDF1DC",
  amberText: "#C9861A",
  orange: "#EF8C3E",
  red: "#D8483F",
  redBg: "#FDECEC",
  blue: "#3B6FD6",
  blueBg: "#E9EEFB",
  textMuted: "#7C8798",
  textFaint: "#A2ABB8",
  border: "#EEF0F2",
  weekendBg: "#F3F4F6",
};

// Attendance day status -> {bg, fg} used by the calendar grid
export const attendanceStatusColor = {
  Present: { bg: essColors.tealBg, fg: essColors.teal },
  Late: { bg: essColors.amberBg, fg: essColors.amberText },
  Short: { bg: "#FCEEE0", fg: essColors.orange },
  Absent: { bg: essColors.redBg, fg: essColors.red },
  Leave: { bg: essColors.blueBg, fg: essColors.blue },
  Holiday: { bg: essColors.weekendBg, fg: "#C3C9D1" },
  Empty: { bg: "#F9FAFB", fg: "#DDE1E6" },
};

export const MODULE_BADGE_COLOR = {
  Attendance: { bg: essColors.amberBg, fg: essColors.amberText },
  Leave: { bg: "#F4EEFB", fg: "#6B4CB8" },
  Payroll: { bg: essColors.blueBg, fg: essColors.blue },
};