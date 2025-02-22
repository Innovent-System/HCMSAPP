import React, { useState } from 'react'
import { useLazyFileQuery } from '../../../store/actions/httpactions';
import { useDropDownIds } from '../../../components/useDropDown';
import { formateISODateTime, getMonthStartEnd } from '../../../services/dateTimeService';
import { DetailPanelContent, ReportHeader } from '../../../components/ReportViewer';
import CommonDropDown from '../../../components/CommonDropDown';
import { Grid, TableCell, TableHead, TableRow, Typography } from '../../../deps/ui'
import { API } from '../_Service';
import Controls from '../../../components/controls/Controls';
import { formatNumber } from '../../../util/common';
import ReportTable from '../../../components/ReportTable';

const reportColumns = [
    { field: 'emplyeeRefNo', headerName: 'Code' },
    { field: 'fullName', headerName: 'Employee' },
    { field: 'department', headerName: 'Department' },
    { field: 'designation', headerName: 'Designation' },
    { field: 'monthlySalary', headerName: 'Monthly Salary', valueGetter: ({ row }) => formatNumber(row.payroll.monthlySalary) },
    { field: 'workingDays', headerName: 'Present Days', valueGetter: ({ row }) => row.payroll?.workingDays },
    { field: 'totalEarning', headerName: 'Gross Pay', valueGetter: ({ row }) => formatNumber(row.payroll.totalEarning) },
    { field: 'totalDeduction', headerName: 'Deductions', valueGetter: ({ row }) => formatNumber(row.payroll.totalDeduction) },
    { field: 'totalSalary', headerName: 'Net Pay', valueGetter: ({ row }) => formatNumber(row.payroll.totalSalary) },
];

const HeadElement = ({ row }) => {
    return <TableHead><TableCell colSpan={11}><Typography><b>Department</b>: {row?.department} </Typography></TableCell> </TableHead>
}
const subTotalBy = { "monthlySalary": 0, "totalEarning": 0, "totalDeduction": 0, "totalSalary": 0 };

const SubTotal = ({ row, subTotal }) => {
    return <TableRow >
        <TableCell colSpan={4}>Total</TableCell>

        <TableCell colSpan={2}>{currencyFormat.format(subTotal.monthlySalary)}</TableCell>
        <TableCell>{currencyFormat.format(subTotal.totalEarning)}</TableCell>
        <TableCell>{currencyFormat.format(subTotal.totalDeduction)}</TableCell>
        <TableCell>{currencyFormat.format(subTotal.totalSalary)}</TableCell>

    </TableRow>
}

const GrandTotal = ({ row, grandTotal }) => {
    return grandTotal && <TableRow >
        <TableCell colSpan={4}>Grand Total</TableCell>

        <TableCell colSpan={2}>{currencyFormat.format(grandTotal.monthlySalary)}</TableCell>
        <TableCell>{currencyFormat.format(grandTotal.totalEarning)}</TableCell>
        <TableCell>{currencyFormat.format(grandTotal.totalDeduction)}</TableCell>
        <TableCell>{currencyFormat.format(grandTotal.totalSalary)}</TableCell>

    </TableRow>
}
const SalarySheetReport = ({ loader, setLoader }) => {
    const [records, setRecords] = useState([]);
    const [option, setOption] = useState({
        groupByField: "",
        SubTotal: SubTotal,
        GrandTotal: GrandTotal
    })
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
                groupBy: option.groupByField,
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

    const handleGroupby = (e) => {
        const opt = { ...option }
        if(e.target.value){
            opt.groupByField = e.target.name;
            opt.GrandTotal = GrandTotal;
            opt.SubTotal = SubTotal
        }else{
            opt.groupByField = "";
            opt.GrandTotal = null;
            opt.SubTotal = null
        }

        setRecords([]);
        setOption(opt)
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
                        <Controls.Checkbox label="Department Wise Group" name="department"
                            value={Boolean(option?.groupByField)}
                            onChange={handleGroupby}
                            fullWidth />
                    </Grid>
                    <Grid item sm={10} md={10} lg={10} pr={1}>
                        <Controls.Button text="Generate Report" onClick={() => handleReport()} fullWidth />
                    </Grid>

                </CommonDropDown>
            </Grid>
            <Grid item sm={9} md={9} lg={9}>
                {/* <DetailPanelContent row={records} headCells={TableHead} /> */}
                <ReportTable
                    reportData={records}
                    columnPrint={reportColumns}
                    HeadElement={HeadElement}
                    groupByField={option.groupByField}
                    subTotalBy={subTotalBy}
                    SubTotal={SubTotal}
                    GrandTotal={GrandTotal}
                    subTotalpath='payroll'
                />


            </Grid>
        </>
    )
}

export default SalarySheetReport