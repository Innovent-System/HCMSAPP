import { createSlice } from "@reduxjs/toolkit"

const emptyString = "";
//global setting should be direct 
// and module setting should be in their relative field 
const MODULE_SETTINGS = {
  roundOffAmount: true,
  payroll: {
    checkPfBalance: false
  }
}

export const moduleSettingSlice = createSlice({
  name: "modulesetting",
  initialState: structuredClone(MODULE_SETTINGS),
  reducers: {
    setRoundOff(state, action: import('@reduxjs/toolkit').PayloadAction<boolean>) {
      state.roundOffAmount = action.payload
    },
    setPayrolConfig(state, action: import('@reduxjs/toolkit').PayloadAction<typeof MODULE_SETTINGS["payroll"]>) {
      state.payroll = { ...state, ...action.payload }
    }

  }
})