import React, { useRef, useState } from 'react'
import { BaseReportWrapper } from '../../../../components/ReportViewer';
import { Box, Stack, TableCell, TableRow, Typography, IconButton, ButtonGroup, TableHead } from '../../../../deps/ui'
import { formatNumber, monthNames } from '../../../../util/common';
import ReportTable from '../../../../components/ReportTable';

const reportColumns = [
    { field: 'employeeRefNo', headerName: 'Code', valueGetter: ({ row }) => row.employeeRefNo },
    { field: 'fullName', headerName: 'Employee', valueGetter: ({ row }) => row.fullName },
    { field: 'department', headerName: 'Department', valueGetter: ({ row }) => row.department },
    { field: 'workingDays', headerName: 'P. Days' },
    { field: 'monthlySalary', headerName: 'Monthly Salary', valueGetter: ({ row }) => formatNumber(row.monthlySalary) },
    { field: 'totalEarning', headerName: 'Gross Pay', valueGetter: ({ row }) => formatNumber(row.totalEarning) },
];

const HeadElement = ({ row }) => {
    return <TableHead><TableCell colSpan={12}><Typography><b>Department</b>: {row?.department} </Typography></TableCell> </TableHead>
}
const subTotalBy = { "monthlySalary": 0, "totalEarning": 0, "totalDeduction": 0, "netSalary": 0 };

const SubTotal = ({ row, subTotal, colSpan }) => {
    return <TableRow >
        <TableCell colSpan={4}>Total</TableCell>

        <TableCell >{formatNumber(subTotal.monthlySalary)}</TableCell>
        <TableCell >{formatNumber(subTotal.totalEarning)}</TableCell>
        <TableCell colSpan={colSpan}></TableCell>
        <TableCell >{formatNumber(subTotal.totalDeduction)}</TableCell>
        <TableCell>{formatNumber(subTotal.netSalary)}</TableCell>

    </TableRow>
}

const GrandTotal = ({ row, grandTotal, colSpan }) => {
    return grandTotal && <TableRow >
        <TableCell colSpan={4}>Grand Total</TableCell>

        <TableCell  >{formatNumber(grandTotal.monthlySalary)}</TableCell>
        <TableCell>{formatNumber(grandTotal.totalEarning)}</TableCell>
        <TableCell colSpan={colSpan}></TableCell>
        <TableCell >{formatNumber(grandTotal.totalDeduction)}</TableCell>
        <TableCell>{formatNumber(grandTotal.netSalary)}</TableCell>

    </TableRow>
}
const PayrollSummaryViewer = ({ API_NAME, fileName }) => {

    const [columns, setColmun] = useState([]);
    const [records, setRecords] = useState([]);
    const colSpan = useRef(5);
    const [option, setOption] = useState({
        groupByField: "",
        month: 1,
        year: ""
    })
    const handleRecord = (data, { searchParams, groupBy, month, year }) => {

        setRecords(data?.rows)
        const dynamicColumns = data.columns.map((headName) => ({
            field: headName,
            headerName: headName,
            width: 130,
            type: 'number',
            valueGetter: ({ row }) => formatNumber(row[headName])
        }));
        colSpan.current = dynamicColumns.length;
        setColmun([...reportColumns, ...dynamicColumns,
        { field: 'totalDeduction', headerName: 'Deductions', valueGetter: ({ row }) => formatNumber(row.totalDeduction) },
        { field: 'netSalary', headerName: 'Net Pay', valueGetter: ({ row }) => formatNumber(row.netSalary) }
        ])
        setOption({ groupByField: groupBy, month: month, year: year })

    }


    return (

        <BaseReportWrapper API_NAME={API_NAME} header='Payroll Summary Report'
            subHeader={`${monthNames[option.month - 1]} ${option.year}`}
            fileName={fileName}
            handleRecord={handleRecord}
        >
            <ReportTable
                reportData={records}
                columnPrint={columns}
                HeadElement={HeadElement}
                groupByField={(row) => row?.[option.groupByField]}
                subTotal={{
                    isShow: true,
                    Element: SubTotal,
                    fields: subTotalBy,
                    props: {
                        colSpan: colSpan.current
                    }
                }}
                grandTotal={{
                    isShow: true,
                    Element: GrandTotal,
                    fields: subTotalBy,
                    props: {
                        colSpan: colSpan.current
                    }
                }}
            />
        </BaseReportWrapper>
    )
}

export default PayrollSummaryViewer