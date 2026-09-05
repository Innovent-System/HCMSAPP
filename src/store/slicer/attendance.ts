import { format, formateDate } from "@/services/dateTimeService";
import { createSlice } from "@reduxjs/toolkit"
//global setting should be direct 
// and module setting should be in their relative field 
const InitialState = {
    markDetail: {
        mode: "IN",
        start: null,
        end: null,
        isAbleToMark: false
    },
    attendanceList: [],
    missingAttendaceList: []
}

export const attendanceSlice = createSlice({
    name: "attendance",
    initialState: structuredClone(InitialState),
    reducers: {
        setMarkDetail(state, action: import('@reduxjs/toolkit').PayloadAction<typeof InitialState["markDetail"]>) {
            state.markDetail = { ...state.markDetail, ...action.payload }
        },
        setAttendanceList(state, action: import('@reduxjs/toolkit').PayloadAction<typeof InitialState["attendanceList"]>) {
            state.attendanceList = action.payload;
            const currentDay = format(new Date(), "d");

            state.missingAttendaceList = action.payload.filter(e => e.status == 7 || !Boolean(e.endDateTime))
                .map(m => {
                    const day = format(new Date(m?.scheduleStartDt), "d");
                    const isPast = +currentDay > +day;
                    if (isPast)
                        return {
                            title: m.status == 7 ? "Absent Entry" : "Missing Entry",
                            subtitle: "Apply for " + formateDate(new Date(m.attendanceDate)),
                            module: "Attendance",
                            formId: 12
                        }
                }).filter(e => e);
            // .sort((a, b) => new Date(a.attendanceDate) - new Date(b.attendanceDate));
        }
    }
})

export const { setMarkDetail, setAttendanceList } = attendanceSlice.actions