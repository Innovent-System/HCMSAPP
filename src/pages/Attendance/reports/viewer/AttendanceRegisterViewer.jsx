import React, { useState } from 'react'
import { formateISODateTime, getMonthStartEnd } from '../../../../services/dateTimeService';
import { BaseReportWrapper } from '../../../../components/ReportViewer';
import { Box, Stack, TableCell, TableRow, Typography, IconButton, ButtonGroup, TableHead } from '../../../../deps/ui'
import ReportTable from '../../../../components/ReportTable';


const fixColumns = [
    { field: 'punchCode', headerName: 'Code' },
    { field: 'fullName', headerName: 'Employee' },
    // { field: 'department', headerName: 'Department' }
];

const HeadElement = ({ row, index }) => {
    return <TableHead> <TableRow><TableCell sx={{ backgroundColor: '#fff' }} colSpan={reportColumns.length}>
        <Box pb={1} pl={1} borderRadius={1} borderColor="whitesmoke" component="fieldset">
            <Typography component="legend">Detail</Typography>
            <Stack flexDirection="row" justifyContent="space-evenly">
                <Stack>
                    <Typography variant='caption' >EmployeeRef : {row.employeeRefNo}</Typography>
                    <Typography variant='caption'>Name : {row.fullName}</Typography>
                    <Typography variant='caption'>Designation : {row.designation}</Typography>
                </Stack>
                <Stack>
                    <Typography variant='caption'>Department : {row.department}</Typography>
                    <Typography variant='caption'>Area : {row.area}</Typography>
                    <Typography variant='caption'>Group : {row.group}</Typography>

                </Stack>
                {/* <Stack>
                    <Typography variant='subtitle2'>Half Days : {e.halfDay}</Typography>
                    <Typography variant='subtitle2'>Short Days : {e.shortDay}</Typography>
                </Stack> */}


            </Stack>

        </Box>
    </TableCell>
    </TableRow>
    </TableHead>
}


const AttendanceRegisterViewer = ({ API_NAME, fileName }) => {

    const [records, setRecords] = useState({
        columns: [],
        rows: [],
        totalEmployees: 0
    });
    const handleRecord = (data) => {

        const dynamicColumns = data.columns.map((headName) => ({
            field: headName,
            headerName: headName
        }));
        // colSpan.current = dynamicColumns.length;
        const columns = [...fixColumns, ...dynamicColumns,
        { field: 'TP', headerName: 'P' },
        { field: 'TA', headerName: 'A' },
        { field: 'TL', headerName: 'L' },
        { field: 'TH', headerName: 'H' },
        { field: 'TLV', headerName: 'LV' }
        ]
        setRecords({
            rows: data.rows,
            columns
        })
    }

    return (

        <BaseReportWrapper API_NAME={API_NAME} fileName={fileName}
            handleRecord={handleRecord}
        >
            <ReportTable columnPrint={records?.columns}

                reportData={records?.rows}
            // HeadElement={HeadElement}
            />
        </BaseReportWrapper>
    )
}

export default AttendanceRegisterViewer