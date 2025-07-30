import React, { useState } from 'react'
import { BaseReportWrapper } from '../../../../components/ReportViewer';
import { Box, Stack, TableCell, TableRow, Typography, IconButton, ButtonGroup, TableHead } from '../../../../deps/ui'
import { formatNumber } from '../../../../util/common';
import ReportTable from '../../../../components/ReportTable';

const reportColumns = [
    { field: 'employeeRefNo', headerName: 'Code', valueGetter: ({ row }) => row.employee.employeeRefNo },
    { field: 'fullName', headerName: 'Employee', valueGetter: ({ row }) => row.employee.fullName },
    { field: 'department', headerName: 'Department', valueGetter: ({ row }) => row.employee.department },
    { field: 'designation', headerName: 'Designation', valueGetter: ({ row }) => row.employee.designation },
    { field: 'title', headerName: 'Type' },
    { field: 'entitled', headerName: 'Entitle' },
    { field: 'taken', headerName: 'Taken' },
    { field: 'pending', headerName: 'Pending' },
    { field: 'remaining', headerName: 'Remaining' }
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
const LeaveBalanceViewer = ({ API_NAME, fileName }) => {

    const [records, setRecords] = useState([]);
    const [option, setOption] = useState({
        groupByField: ""
    })
    const handleRecord = (data, queryParams) => {
        setRecords(data)
        if (queryParams?.groupBy) {
            setOption({ groupByField: queryParams?.groupBy })
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
                groupByField={(row) => row?.employee[option.groupByField]}
            // subTotal={{
            //     isShow: true,
            //     Element: SubTotal,
            //     fields: subTotalBy
            // }}
            // grandTotal={{
            //     isShow: true,
            //     Element: GrandTotal,
            //     fields: subTotalBy
            // }}
            />
        </BaseReportWrapper>
    )
}

export default LeaveBalanceViewer