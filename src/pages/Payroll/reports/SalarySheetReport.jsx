import React, { useState } from 'react'
import { useLazyFileQuery } from '../../../store/actions/httpactions';
import { useDropDownIds } from '../../../components/useDropDown';
import { formateISODateTime, getMonthStartEnd } from '../../../services/dateTimeService';
import { DetailPanelContent, ReportHeader } from '../../../components/ReportViewer';
import CommonDropDown from '../../../components/CommonDropDown';
import { Grid } from '../../../deps/ui'
import { API } from '../_Service';
import Controls from '../../../components/controls/Controls';
import { AttendanceflagMap, currencyFormat } from '../../../util/common';

const TableHead = [
    { id: 'emplyeeRefNo', disableSorting: false, label: 'Code' },
    { id: 'fullName', disableSorting: false, label: 'Employee' },
    { id: 'department', disableSorting: false, label: 'Department' },
    { id: 'designation', disableSorting: false, label: 'Designation' },
    { id: 'monthlySalary', disableSorting: false, label: 'Monthly Salary', valueGetter: ({ row }) => currencyFormat.format(row.payroll.monthlySalary) },
    { id: 'workingDays', disableSorting: false, label: 'Present Days', valueGetter: ({ row }) => row.payroll?.workingDays },
    { id: 'totalEarning', disableSorting: false, label: 'Gross Pay', valueGetter: ({ row }) => currencyFormat.format(row.payroll.totalEarning) },
    { id: 'totalDeduction', disableSorting: false, label: 'Deductions', valueGetter: ({ row }) => currencyFormat.format(row.payroll.totalDeduction) },
    { id: 'totalSalary', disableSorting: false, label: 'Net Pay', valueGetter: ({ row }) => currencyFormat.format(row.payroll.totalSalary) },
];


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
                <DetailPanelContent row={records} headCells={TableHead} />
            </Grid>
        </>
    )
}

export default SalarySheetReport