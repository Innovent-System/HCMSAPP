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
    { field: 'leavePenalty', headerName: 'Leave Penalty' },
    { field: 'pending', headerName: 'Pending' },
    { field: 'remaining', headerName: 'Remaining' }
];

const HeadElement = ({ row }) => {
    return <TableHead><TableCell colSpan={12}><Typography><b>Department</b>: {row?.employee.department} </Typography></TableCell> </TableHead>
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
            
            />
        </BaseReportWrapper>
    )
}

export default LeaveBalanceViewer