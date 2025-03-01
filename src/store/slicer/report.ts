import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
    pageBreak: false,
    pageBreakOn: '',
    isGroupBy: false,
    groupByField: '',
    isPrintHeader: true,
    HeadElement: null,
    Summary: null,
    summaryProps: null,
    GrandTotal: null,
    grandTotalProps: null,
    subTotalBy: null,
    SubTotal: null,
    subTotalpath: "",
    columnPrint: [], reportData: []
};

export const reportSlice = createSlice({
    name: "report",
    initialState: structuredClone(initialState),
    reducers: {
        setReportData: (state, action: PayloadAction<typeof initialState>) => {
            state = { ...action.payload };
        },
        resetReportData: (state) => {
            state = {
                pageBreak: false,
                pageBreakOn: '',
                isGroupBy: false,
                groupByField: '',
                isPrintHeader: true,
                HeadElement: null,
                Summary: null,
                summaryProps: null,
                GrandTotal: null,
                grandTotalProps: null,
                subTotalBy: null,
                SubTotal: null,
                subTotalpath: "",
                columnPrint: [], reportData: []
            }
        }
    },
});

export const { setReportData, resetReportData } = reportSlice.actions;

