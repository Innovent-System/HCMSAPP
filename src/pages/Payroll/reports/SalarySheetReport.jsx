import React, { useState } from 'react'
import { useLazyFileQuery } from '../../../store/actions/httpactions';
import { useDropDownIds } from '../../../components/useDropDown';
import { formateISODateTime, getMonthStartEnd } from '../../../services/dateTimeService';
import { DetailPanelContent, ReportHeader } from '../../../components/ReportViewer';
import CommonDropDown from '../../../components/CommonDropDown';
import { Grid, TableCell, TableHead, Typography } from '../../../deps/ui'
import { API } from '../_Service';
import Controls from '../../../components/controls/Controls';
import { AttendanceflagMap, currencyFormat } from '../../../util/common';
import ReportTable from '../../../components/ReportTable';

const reportColumns = [
    { field: 'emplyeeRefNo', headerName: 'Code' },
    { field: 'fullName', headerName: 'Employee' },
    { field: 'department', headerName: 'Department' },
    { field: 'designation', headerName: 'Designation' },
    { field: 'monthlySalary', headerName: 'Monthly Salary', valueGetter: ({ row }) => currencyFormat.format(row.payroll.monthlySalary) },
    { field: 'workingDays', headerName: 'Present Days', valueGetter: ({ row }) => row.payroll?.workingDays },
    { field: 'totalEarning', headerName: 'Gross Pay', valueGetter: ({ row }) => currencyFormat.format(row.payroll.totalEarning) },
    { field: 'totalDeduction', headerName: 'Deductions', valueGetter: ({ row }) => currencyFormat.format(row.payroll.totalDeduction) },
    { field: 'totalSalary', headerName: 'Net Pay', valueGetter: ({ row }) => currencyFormat.format(row.payroll.totalSalary) },
];

const HeadElement = ({ row }) => {
    return <TableHead><TableCell colSpan={11}><Typography><b>Department</b>: {row?.department} </Typography></TableCell> </TableHead>
}

const SalarySheetReport = ({ loader, setLoader }) => {
    const [records, setRecords] = useState([]);


    const [gridFilter, setGridFilter] = useState({
        lastKey: null,
        limit: 30,
        page: 0,
        totalRecord: 0
    })
    const [getReport] = useLazyFileQuery();

    const { countryIds, stateIds, cityIds, areaIds, departmentIds, groupIds, designationIds, employeeIds, monthIds, yearIds } = useDropDownIds();

    const handleReport = (isDownload = false) => {
        setLoader(!loader);
        getReport({
            url: `${API.SalarySheetReport}/${isDownload ? 'download' : 'view'}`,
            fileName: "SalarySheetReport",
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
                    ...(designationIds && { "companyInfo.fkDesignationId": { $in: designationIds.split(',') } }),
                    month: monthIds,
                    year: yearIds
                    // ...query
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
                    employee: true,
                    month: true,
                    year: true
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
                    HeadElement={HeadElement}
                    groupByField='department'
                />


            </Grid>
        </>
    )
}

export default SalarySheetReport