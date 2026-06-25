import { createSlice } from "@reduxjs/toolkit"
//global setting should be direct 
// and module setting should be in their relative field 
const InitialState = {
    markDetail: {
        mode: "IN",
        start: null,
        end: null
    }
}

export const attendanceSlice = createSlice({
    name: "attendance",
    initialState: structuredClone(InitialState),
    reducers: {
        setMarkDetail(state, action: import('@reduxjs/toolkit').PayloadAction<typeof InitialState["markDetail"]>) {
            state.markDetail = { ...state.markDetail, ...action.payload }
        }
    }
})

export const { setMarkDetail } = attendanceSlice.actions