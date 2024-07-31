import { createSlice } from "@reduxjs/toolkit"

const emptyString = "";
const InitialState = {
    setup: {
        name: emptyString,
        startDay: 0,
        endDay: 0,
        deletePayrollAfterDays: 0,
        calculationMethod:"",
        basicSalaryType: "",
        percentage_or_amount: 0,
        allowances: [],
        deductions: []
    }

}

export const slicer = createSlice({
    name: "payroll",
    initialState: structuredClone(InitialState),
    reducers: {


    }
})