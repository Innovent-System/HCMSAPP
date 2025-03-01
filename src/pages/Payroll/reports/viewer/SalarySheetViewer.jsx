import React, { useState } from 'react'
import { BaseReportWrapper } from '../../../../components/ReportViewer';
import { Box, Stack, TableCell, TableRow, Typography, IconButton, ButtonGroup, TableHead } from '../../../../deps/ui'
import {  formatNumber } from '../../../../util/common';
import ReportTable from '../../../../components/ReportTable';

const reportColumns = [
    { field: 'emplyeeRefNo', headerName: 'Code' },
    { field: 'fullName', headerName: 'Employee' },
    { field: 'department', headerName: 'Department' },
    { field: 'designation', headerName: 'Designation' },
    { field: 'monthlySalary', headerName: 'Monthly Salary', valueGetter: ({ row }) => formatNumber(row.payroll.monthlySalary) },
    { field: 'workingDays', headerName: 'Present Days', valueGetter: ({ row }) => row.payroll?.workingDays },
    { field: 'totalEarning', headerName: 'Gross Pay', valueGetter: ({ row }) => formatNumber(row.payroll.totalEarning) },
    { field: 'totalDeduction', headerName: 'Deductions', valueGetter: ({ row }) => formatNumber(row.payroll.totalDeduction) },
    { field: 'totalSalary', headerName: 'Net Pay', valueGetter: ({ row }) => formatNumber(row.payroll.totalSalary) },
];

const HeadElement = ({ row }) => {
    return <TableHead><TableCell colSpan={11}><Typography><b>Department</b>: {row?.department} </Typography></TableCell> </TableHead>
}
const subTotalBy = { "monthlySalary": 0, "totalEarning": 0, "totalDeduction": 0, "totalSalary": 0 };

const SubTotal = ({ row, subTotal }) => {
    return <TableRow >
        <TableCell colSpan={4}>Total</TableCell>

        <TableCell colSpan={2}>{currencyFormat.format(subTotal.monthlySalary)}</TableCell>
        <TableCell>{currencyFormat.format(subTotal.totalEarning)}</TableCell>
        <TableCell>{currencyFormat.format(subTotal.totalDeduction)}</TableCell>
        <TableCell>{currencyFormat.format(subTotal.totalSalary)}</TableCell>

    </TableRow>
}

const GrandTotal = ({ row, grandTotal }) => {
    return grandTotal && <TableRow >
        <TableCell colSpan={4}>Grand Total</TableCell>

        <TableCell colSpan={2}>{currencyFormat.format(grandTotal.monthlySalary)}</TableCell>
        <TableCell>{currencyFormat.format(grandTotal.totalEarning)}</TableCell>
        <TableCell>{currencyFormat.format(grandTotal.totalDeduction)}</TableCell>
        <TableCell>{currencyFormat.format(grandTotal.totalSalary)}</TableCell>

    </TableRow>
}
const SalarySheetViewer = ({ API_NAME, fileName }) => {

    const [records, setRecords] = useState([]);
    const [option, setOption] = useState({
        groupByField: ""
    })
    const handleRecord = (data, queryParams) => {
        setRecords(data)
        if (queryParams?.groupByField) {
            setOption({ groupByField: queryParams?.groupByField })
        }
    }


    return (

        <BaseReportWrapper API_NAME={API_NAME} fileName={fileName}
            handleRecord={handleRecord}
        >
            <ReportTable
                reportData={records}
                columnPrint={reportColumns}
                HeadElement={HeadElement}
                groupByField={option.groupByField}
                subTotalBy={subTotalBy}
                SubTotal={SubTotal}
                GrandTotal={GrandTotal}
                subTotalpath='payroll'
            />
        </BaseReportWrapper>
    )
}

export default SalarySheetViewer