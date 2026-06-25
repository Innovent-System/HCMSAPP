import { fetchLocation } from "@/pages/Attendance/_Service";
import { commandToRegExp } from "../../util/common";

// ─────────────────────────────────────────────────────────────────────────────
// ROUTE COMMANDS  ("go to payroll", "open employee list", "navigate to attendance")
// ─────────────────────────────────────────────────────────────────────────────
export const routeCommand = (routes = [], navigate) => {
  const commands = routes?.map((r) => {
    const pathSlug = r.path.substring(6).replace("/", " ").toLowerCase();

    return {
      formId: r.formId,
      category: "route",
      speak: `Going to ${r.title}`,
      matchText: [
        commandToRegExp(`go to ${pathSlug}.`),
        commandToRegExp(`open ${pathSlug}.`),
        commandToRegExp(`navigate to ${pathSlug}.`),
      ],
      onMatch: () => navigate(`${r.path.substring(5).toLowerCase()}/${r._id}`),
    };
  });
  
  for (const cmd of commands) {
    cmd.matchText.push(...getRouteAliases(cmd.formId));
  }

  return commands;
};

const getRouteAliases = (formId) => {
  const c = (t) => commandToRegExp(t);
  switch (formId) {
    case 2:
      return [
        c("go to employee."),
        c("open employee."),
        c("go to imply."),
        c("go to employ.")
      ];
    case 4:
      return [
        c("go to profile."),
        c("open profile."),
        c("go to employee profile."),
        c("open employee profile."),
        c("go to profile request."),
      ];
    case 7:
      return [
        c("go to employee approval."),
        c("go to employ approval."),
        c("open approval."),
      ];
    case 8:
      return [
        c("go to employee setting."),
        c("go to employ setting."),
        c("open employee settings."),
      ];
    case 10:
      return [c("go to manage company."), c("open company.")];
    case 11:
      return [c("go to organization setting."), c("open organization.")];
    case 12:
      return [c("go to attendance."), c("open attendance.")];
    case 13:
      return [c("go to exemption."), c("open exemption.")];
    case 16:
      return [c("go to attendance setting."), c("open attendance settings.")];
    case 24:
      return [c("go to payroll setup."), c("open payroll setup.")];
    case 32:
      return [c("go to payroll setting."), c("open payroll settings.")];
    default:
      return [];
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// ACTION COMMANDS  ("save", "submit form", "cancel", "delete", "go back")
// ─────────────────────────────────────────────────────────────────────────────
export const actionCommand = ({ onSave, onCancel, onDelete, onBack, onSubmit } = {}) => {
  const c = (t) => commandToRegExp(t);
  const commands = [];

  if (onSave)
    commands.push({
      category: "action",
      speak: "Saving.",
      matchText: [c("save."), c("save changes."), c("save record.")],
      onMatch: onSave,
    });

  if (onSubmit)
    commands.push({
      category: "action",
      speak: "Submitting.",
      matchText: [c("submit."), c("submit form."), c("confirm.")],
      onMatch: onSubmit,
    });

  if (onCancel)
    commands.push({
      category: "action",
      speak: "Cancelled.",
      matchText: [c("cancel."), c("discard."), c("cancel changes.")],
      onMatch: onCancel,
    });

  if (onDelete)
    commands.push({
      category: "action",
      speak: "Deleted.",
      matchText: [c("delete."), c("remove."), c("delete record.")],
      onMatch: onDelete,
    });

  if (onBack)
    commands.push({
      category: "action",
      speak: "Going back.",
      matchText: [c("go back."), c("back."), c("previous page.")],
      onMatch: onBack,
    });

  return commands;
};

// ─────────────────────────────────────────────────────────────────────────────
// SEARCH COMMANDS  ("search employee Ali", "find payroll June", "look up Hassan")
// commandToRegExp passes RegExp instances through as-is (with i flag added)
// ─────────────────────────────────────────────────────────────────────────────
export const searchCommand = (onSearch) => {
  if (!onSearch) return [];

  return [
    {
      category: "search",
      speak: "Searching.",
      matchText: [
        commandToRegExp(/^(search|find|look up)\s+(.+)$/),
      ],
      onMatch: (text) => {
        const match = text.match(/^(?:search|find|look up)\s+(.+)$/i);
        if (match) onSearch(match[1].trim());
      },
    },
  ];
};

// ─────────────────────────────────────────────────────────────────────────────
// FILTER COMMANDS  ("filter by department HR", "show status active")
// ─────────────────────────────────────────────────────────────────────────────
export const filterCommand = (onFilter) => {
  if (!onFilter) return [];

  return [
    {
      category: "filter",
      speak: "Filter applied.",
      matchText: [
        commandToRegExp(/^filter by\s+(\w+)\s+(.+)$/),
        commandToRegExp(/^show\s+(\w+)\s+(.+)$/),
      ],
      onMatch: (text) => {
        const match =
          text.match(/^filter by\s+(\w+)\s+(.+)$/i) ||
          text.match(/^show\s+(\w+)\s+(.+)$/i);
        if (match) onFilter({ field: match[1].trim(), value: match[2].trim() });
      },
    },
  ];
};

// ─────────────────────────────────────────────────────────────────────────────
// FORM FILL COMMANDS  ("set name to Ali Hassan", "enter salary as 50000")
// ─────────────────────────────────────────────────────────────────────────────
export const formFillCommand = (onFormFill) => {
  if (!onFormFill) return [];

  return [
    {
      category: "form",
      speak: "Field updated.",
      matchText: [
        commandToRegExp(/^set\s+(.+?)\s+to\s+(.+)$/),
        commandToRegExp(/^enter\s+(.+?)\s+as\s+(.+)$/),
      ],
      onMatch: (text) => {
        const match =
          text.match(/^set\s+(.+?)\s+to\s+(.+)$/i) ||
          text.match(/^enter\s+(.+?)\s+as\s+(.+)$/i);
        if (match) onFormFill({ field: match[1].trim(), value: match[2].trim() });
      },
    },
  ];
};


 
// ─────────────────────────────────────────────────────────────────────────────
// ATTENDANCE COMMANDS  ("check in", "check out", "mark attendance")
//
// Options:
//   addEntity       — API call function, receives { url, data: { Mode, latitude?, longitude?, accuracy? } }
//   url             — API endpoint string (DEFAULT_API)
//   getLocation     — optional async fn that resolves to { lat, lng, accuracy } or null
//   confirm         — boolean (default: false) — agar true hai toh pehle confirm karega
//   onSuccess       — callback({ result }) — timer/state update ke liye
//   onConfirmNeeded — callback({ mode, label }) — UI pe confirm dialog dikhane ke liye (confirm: true hone par)
//
// Flow (confirm: false):  "check in" → API call → onSuccess
// Flow (confirm: true):   "check in" → onConfirmNeeded({ mode, label }) → user "yes" bole → API call → onSuccess
//                         "yes" / "confirm" command alag se register hota hai, pending resolve karta hai
// ─────────────────────────────────────────────────────────────────────────────
export const attendanceCommand = ({
  addEntity,
  url = "attendance/mark",
  gpsEnable = true,
  confirm = false,
  onSuccess = () => {},
  onConfirmNeeded = () => {},
} = {}) => {
  if (!addEntity || !url) return [];
 
  // Pending confirmation store — agar confirm:true hai
  let pendingMode = null;
 
  const executeAttendance = async (mode) => {
    let location = null;
    if (gpsEnable) {
      try {
        location = await fetchLocation();
      } catch {
        location = null;
      }
    }
 
    const payload = {
      Mode: mode,
      ...(location && {
        latitude: location.lat,
        longitude: location.lng,
        accuracy: location.accuracy,
      }),
    };
 
    addEntity({ url, data: payload }).then(({ data }) => {
      if (data) onSuccess(data.result);
    });
  };
 
  const handleAttendance = (mode, modeLabel) => {
    if (confirm) {
      pendingMode = mode;
      onConfirmNeeded({ mode, label: modeLabel });
      // speak text is returned from the command object below
    } else {
      executeAttendance(mode);
    }
  };
 
  const c = (t) => commandToRegExp(t);
 
  const commands = [
    // ── Check In ───────────────────────────────────────────────────────────
    {
      category: "attendance",
      speak: confirm ? "You are about to check in. Say yes to confirm." : "Checking in.",
      matchText: [
        c("check in."),
        c("checkin."),
        c("check-in."),
        c("mark check in."),
        c("attendance in."),
        c("mark attendance in."),
      ],
      onMatch: () => handleAttendance("In", "Check In"),
    },
 
    // ── Check Out ──────────────────────────────────────────────────────────
    {
      category: "attendance",
      speak: confirm ? "You are about to check out. Say yes to confirm." : "Checking out.",
      matchText: [
        c("check out."),
        c("checkout."),
        c("check-out."),
        c("mark check out."),
        c("attendance out."),
        c("mark attendance out."),
      ],
      onMatch: () => handleAttendance("Out", "Check Out"),
    },
 
    // ── Generic "mark attendance" — system decides In/Out based on last state ─
    // {
    //   category: "attendance",
    //   speak: confirm ? "You are about to mark attendance. Say yes to confirm." : "Marking attendance.",
    //   matchText: [
    //     c("mark attendance."),
    //     c("attendance."),
    //     c("log attendance."),
    //   ],
    //   onMatch: () => handleAttendance("Auto", "Mark Attendance"),
    // },
  ];
 
  // ── Confirmation command — sirf tab active hota hai jab confirm:true ho ──
  if (confirm) {
    commands.push({
      category: "attendance",
      speak: "Attendance marked.",
      matchText: [c("yes."), c("confirm."), c("yes confirm."), c("okay.")],
      onMatch: () => {
        if (pendingMode) {
          executeAttendance(pendingMode);
          pendingMode = null;
        }
      },
    });
 
    commands.push({
      category: "attendance",
      speak: "Cancelled.",
      matchText: [c("no."), c("cancel."), c("no cancel.")],
      onMatch: () => {
        pendingMode = null;
      },
    });
  }
 
  return commands;
};
 