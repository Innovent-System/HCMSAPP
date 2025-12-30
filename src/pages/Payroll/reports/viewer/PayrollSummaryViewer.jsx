import React, { useState } from 'react'
import { BaseReportWrapper } from '../../../../components/ReportViewer';
import { Box, Stack, TableCell, TableRow, Typography, IconButton, ButtonGroup, TableHead } from '../../../../deps/ui'
import { formatNumber, monthNames } from '../../../../util/common';
import ReportTable from '../../../../components/ReportTable';

const reportColumns = [
    { field: 'employeeRefNo', headerName: 'Code', valueGetter: ({ row }) => row.employee.employeeRefNo },
    { field: 'fullName', headerName: 'Employee', valueGetter: ({ row }) => row.employee.fullName },
    { field: 'department', headerName: 'Department', valueGetter: ({ row }) => row.employee.department },
    { field: 'designation', headerName: 'Designation', valueGetter: ({ row }) => row.employee.designation },
    { field: 'workingDays', headerName: 'P. Days' },
    { field: 'monthlySalary', headerName: 'Monthly Salary' },
    { field: 'basicSalary', headerName: 'Basic Salary', valueGetter: ({ row }) => row.earnings["Basic Salary"] ?? 0 },
    { field: 'totalEarning', headerName: 'Gross Pay' },
    { field: 'absentdeduction', headerName: 'Abs. Deduction', valueGetter: ({ row }) => row.deductions["Absent Deduction"] ?? 0 },
    { field: 'eobi', headerName: 'EOBI', valueGetter: ({ row }) => row.deductions["EOBI"] ?? 0 },
    { field: 'advSalary', headerName: 'Adv. Salary', valueGetter: ({ row }) => row.deductions["Advance Salary"] ?? 0 },
    { field: 'healthInc', headerName: 'Health Inc.', valueGetter: ({ row }) => row.deductions["Health Inc."] ?? 0 },
    { field: 'pf', headerName: 'PF', valueGetter: ({ row }) => row.deductions["PF"] ?? 0 },
    { field: 'taxIncome', headerName: 'Tax Income', valueGetter: ({ row }) => row.deductions["Tax Income"] ?? 0 },
    { field: 'loanPersonal', headerName: 'Loan (Personal)', valueGetter: ({ row }) => row.deductions["Loan (Personal)"] ?? 0 },
    { field: 'loanPF', headerName: 'Loan (PF)', valueGetter: ({ row }) => row.deductions["Loan (PF)"] ?? 0 },
    { field: 'shortTime', headerName: 'ShortTime', valueGetter: ({ row }) => row.deductions["ShortTime"] ?? 0 },
    { field: 'totalDeduction', headerName: 'Deductions' },
    { field: 'totalSalary', headerName: 'Net Pay' }
];

const HeadElement = ({ row }) => {
    return <TableHead><TableCell colSpan={12}><Typography><b>Department</b>: {row?.employee.department} </Typography></TableCell> </TableHead>
}
const subTotalBy = { "monthlySalary": 0, "totalEarning": 0, "totalDeduction": 0, "totalSalary": 0 };

const SubTotal = ({ row, subTotal }) => {
    return <TableRow >
        <TableCell colSpan={5}>Total</TableCell>

        <TableCell colSpan={2}>{formatNumber(subTotal.monthlySalary)}</TableCell>
        <TableCell colSpan={10}>{formatNumber(subTotal.totalEarning)}</TableCell>
        <TableCell >{formatNumber(subTotal.totalDeduction)}</TableCell>
        <TableCell>{formatNumber(subTotal.totalSalary)}</TableCell>

    </TableRow>
}

const GrandTotal = ({ row, grandTotal }) => {
    return grandTotal && <TableRow >
        <TableCell colSpan={5}>Grand Total</TableCell>

        <TableCell colSpan={2} >{formatNumber(grandTotal.monthlySalary)}</TableCell>
        <TableCell colSpan={10}>{formatNumber(grandTotal.totalEarning)}</TableCell>
        <TableCell >{formatNumber(grandTotal.totalDeduction)}</TableCell>
        <TableCell>{formatNumber(grandTotal.totalSalary)}</TableCell>

    </TableRow>
}
const PayrollSummaryViewer = ({ API_NAME, fileName }) => {

    const [records, setRecords] = useState([]);
    const [option, setOption] = useState({
        groupByField: "",
        month: "",
        year: ""
    })
    const handleRecord = (data, { searchParams, groupBy }) => {
        setRecords(data)

        setOption({ groupByField: groupBy, month: searchParams?.month, year: searchParams?.year })

    }


    return (

        <BaseReportWrapper API_NAME={API_NAME} header='Payroll Summary Report'
            subHeader={`${monthNames[option.month]} ${option.year}`}
            fileName={fileName}
            handleRecord={handleRecord}
        >
            <ReportTable
                reportData={records}
                columnPrint={reportColumns}
                HeadElement={HeadElement}
                groupByField={(row) => row?.employee[option.groupByField]}
                subTotal={{
                    isShow: true,
                    Element: SubTotal,
                    fields: subTotalBy
                }}
                grandTotal={{
                    isShow: true,
                    Element: GrandTotal,
                    fields: subTotalBy
                }}
            />
        </BaseReportWrapper>
    )
}

export default PayrollSummaryViewer