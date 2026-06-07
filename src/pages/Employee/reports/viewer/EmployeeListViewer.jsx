import React, { useState } from 'react'
import { BaseReportWrapper } from '../../../../components/ReportViewer';
import { Box, Stack, TableCell, TableRow, Typography, IconButton, ButtonGroup, TableHead } from '../../../../deps/ui'
import { formatNumber } from '../../../../util/common';
import ReportTable from '../../../../components/ReportTable';


const reportColumns = [
    { field: 'employeeRefNo', headerName: 'Employee ID' },
    { field: 'punchCode', headerName: 'Punch Code' },
    { field: 'fullName', headerName: 'Employee' },
    { field: 'department', headerName: 'Department' },
    { field: 'designation', headerName: 'Designation' },
    { field: 'group', headerName: 'Group' },
    { field: 'area', headerName: 'Area' },
    { field: 'joiningDate', headerName: 'Joining Date' },
    { field: 'monthlySalary', headerName: 'Monthly Salary' },
]

// const HeadElement = ({ row, groupBy }) => {
//     return <TableHead><TableCell colSpan={11}><Typography sx={{ '&::first-letter': { textTransform: "capitalize" } }}><b>{groupBy}</b>: {row[groupBy]} </Typography></TableCell> </TableHead>
// }

const HeadElement = ({ row }) => {
    return <TableHead><TableCell colSpan={11}><Typography><b>Department</b>: {row?.department} </Typography></TableCell> </TableHead>
}

const EmployeeListViewer = ({ API_NAME, fileName }) => {

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
                groupByField={(row) => row?.[option.groupByField]}
            />
        </BaseReportWrapper>
    )
}

export default EmployeeListViewer