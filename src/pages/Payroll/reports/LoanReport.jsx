import React, { useState } from 'react'
import { useLazyFileQuery } from '../../../store/actions/httpactions';
import { useDropDownIds } from '../../../components/useDropDown';
import { formateISODateTime, getMonthStartEnd } from '../../../services/dateTimeService';
import { DetailPanelContent, ReportHeader } from '../../../components/ReportViewer';
import CommonDropDown from '../../../components/CommonDropDown';
import { Grid, TableCell, TableHead, Typography } from '../../../deps/ui'
import { API } from '../_Service';
import Controls from '../../../components/controls/Controls';
import { formatNumber } from '../../../util/common';
import ReportTable from '../../../components/ReportTable';

const reportColumns = [
    { field: 'emplyeeRefNo', headerName: 'Code' },
    { field: 'fullName', headerName: 'Employee' },
    { field: 'department', headerName: 'Department' },
    { field: 'designation', headerName: 'Designation' },
    { field: 'type', headerName: 'Type' },
    { field: 'principleAmount', headerName: 'Principle Amount', valueGetter: ({ row }) => formatNumber(row.principleAmount) },
    { field: 'distributedMonth', headerName: 'Installments' },
    { field: 'repayAmount', headerName: 'Installment Amount', valueGetter: ({ row }) => formatNumber(row.repayAmount) }
];

const HeadElement = ({ row }) => {
    return <TableHead><TableCell colSpan={11}><Typography><b>Department</b>: {row?.department} </Typography></TableCell> </TableHead>
}

const LoanReport = ({ loader, setLoader }) => {
    const [records, setRecords] = useState([]);


    const [gridFilter, setGridFilter] = useState({
        lastKey: null,
        limit: 30,
        page: 0,
        totalRecord: 0
    })
    const [getReport] = useLazyFileQuery();

    const { countryIds, stateIds, cityIds, areaIds, departmentIds, groupIds, designationIds, employeeIds } = useDropDownIds();

    const handleReport = (isDownload = false) => {
        setLoader(!loader);
        getReport({
            url: `${API.LoanReport}/${isDownload ? 'download' : 'view'}`,
            fileName: "LoanReport",
            data: {
                page: gridFilter.page,
                limit: gridFilter.limit,
                searchParams: {
                    ...(employeeIds && { "_id": { $in: employeeIds.split(',') } }),
                    ...(countryIds && { "companyInfo.fkCountryId": { $in: countryIds.split(',') } }),
                    ...(stateIds && { "companyInfo.fkStateId": { $in: stateIds.split(',') } }),
                    ...(cityIds && { "companyInfo.fkCityId": { $in: cityIds.split(',') } }),
                    ...(areaIds && { "companyInfo.fkAreaId": { $in: areaIds.split(',') } }),
                    ...(groupIds && { "companyInfo.fkEmployeeGroupId": { $in: groupIds.split(',') } }),
                    ...(departmentIds && { "companyInfo.fkDepartmentId": { $in: departmentIds.split(',') } }),
                    ...(designationIds && { "companyInfo.fkDesignationId": { $in: designationIds.split(',') } })
                }
            }
        }).then(c => {
            setLoader(false);
            if (!isDownload)
                setRecords(c.data.result)
        })

    }
    return (
        <>
            <Grid item sm={9} md={9} lg={9}>
                <ReportHeader handleReport={handleReport} component={{
                    pagination: null
                }} />
            </Grid>
            <Grid item sm={3} md={3} lg={3}>
                <CommonDropDown flexDirection='column' breakpoints={{ sm: 10, md: 10, lg: 10 }} showFilters={{
                    area: true,
                    department: true,
                    group: true,
                    employee: true
                }}>
                    <Grid item sm={10} md={10} lg={10} pr={1}>
                        <Controls.Button text="Generate" onClick={() => handleReport()} fullWidth />
                    </Grid>
                </CommonDropDown>
            </Grid>
            <Grid item sm={9} md={9} lg={9}>
                {/* <DetailPanelContent row={records} headCells={TableHead} /> */}
                <ReportTable
                    reportData={records}
                    columnPrint={reportColumns}

                />


            </Grid>
        </>
    )
}

export default LoanReport