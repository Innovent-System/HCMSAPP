import React, { useState } from 'react'
import { BaseReportWrapper } from '../../../../components/ReportViewer';
import { Box, Stack, TableCell, TableRow, Typography, IconButton, ButtonGroup, TableHead } from '../../../../deps/ui'
import { formatNumber } from '../../../../util/common';
import ReportTable from '../../../../components/ReportTable';
import { formateDate } from '../../../../services/dateTimeService';

const reportColumns = [
    { field: 'employeeRefNo', headerName: 'Code' },
    { field: 'fullName', headerName: 'Employee' },
    { field: 'department', headerName: 'Department' },
    { field: 'designation', headerName: 'Designation' },
    { field: 'date', headerName: 'Date' ,valueGetter: ({ row }) => formateDate(row.date)},
    { field: 'type', headerName: 'Type' },
    { field: 'principleAmount', headerName: 'Principle Amount', valueGetter: ({ row }) => formatNumber(row.principleAmount) },
    { field: 'distributedMonth', headerName: 'Installments' },
    { field: 'repayAmount', headerName: 'Installment Amount', valueGetter: ({ row }) => formatNumber(row.repayAmount) },
    { field: 'paidInstallment', headerName: 'Paid Installment' }
];


const LoanViewer = ({ API_NAME, fileName }) => {

    const [records, setRecords] = useState([]);
    const handleRecord = (data, queryParams) => {
        setRecords(data)
    }

    return (

        <BaseReportWrapper API_NAME={API_NAME} fileName={fileName}
            handleRecord={handleRecord}
        >
            <ReportTable
                reportData={records}
                columnPrint={reportColumns}

            />
        </BaseReportWrapper>
    )
}

export default LoanViewer