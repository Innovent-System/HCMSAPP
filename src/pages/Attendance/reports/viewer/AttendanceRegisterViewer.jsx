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

const HeadElement = ({ row }) => {
    return <TableHead><TableCell colSpan={12}><Typography><b>Department</b>: {row?.department} </Typography></TableCell> </TableHead>
}


const AttendanceRegisterViewer = ({ API_NAME, fileName }) => {

    const [records, setRecords] = useState({
        columns: [],
        rows: [],
        totalEmployees: 0
    });

    const [option, setOption] = useState({
        groupByField: ""
    })
    const handleRecord = (data, { searchParams, groupBy }) => {

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

        setOption({ groupByField: groupBy });
    }

    return (

        <BaseReportWrapper API_NAME={API_NAME} fileName={fileName}
            handleRecord={handleRecord}
        >
            <ReportTable columnPrint={records?.columns}

                reportData={records?.rows}
                HeadElement={HeadElement}
                groupByField={(row) => row?.[option.groupByField]}
            />
        </BaseReportWrapper>
    )
}

export default AttendanceRegisterViewer