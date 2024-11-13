import React, { useState } from 'react'
import { useLazyFileQuery } from '../../../store/actions/httpactions';
import { useDropDownIds } from '../../../components/useDropDown';
import { formateISODateTime, getMonthStartEnd } from '../../../services/dateTimeService';
import { DetailPanelContent, ReportHeader } from '../../../components/ReportViewer';
import CommonDropDown from '../../../components/CommonDropDown';
import { Grid } from '../../../deps/ui'
import { API } from '../_Service';
import Controls from '../../../components/controls/Controls';
import { AttendanceflagMap } from '../../../util/common';

const TableHead = [
    { id: 'employeeCode', disableSorting: false, label: 'Code' },
    { id: 'fullName', disableSorting: false, label: 'Employee' },
    { id: 'scheduleStartDt', disableSorting: false, label: 'Schedule Start', valueGetter: ({ row }) => formateISODateTime(row.scheduleStartDt) },
    { id: 'scheduleEndDt', disableSorting: false, label: 'Schedule End', valueGetter: ({ row }) => formateISODateTime(row.scheduleEndDt) },
    { id: 'startDateTime', disableSorting: false, label: 'Actual In', valueGetter: ({ row }) => formateISODateTime(row.startDateTime) },
    { id: 'endDateTime', disableSorting: false, label: 'Actual Out', valueGetter: ({ row }) => formateISODateTime(row.endDateTime) },
    { id: 'status', disableSorting: false, label: 'Remarks', valueGetter: ({ row }) => AttendanceflagMap[row?.status]?.tag }
];

const { monthStart, monthEnd } = getMonthStartEnd();

const AttendanceReport = ({ loader, setLoader }) => {
    const [records, setRecords] = useState([]);
   
    const [dateRange, setDateRange] = useState([monthStart, monthEnd])
    const [gridFilter, setGridFilter] = useState({
        lastKey: null,
        limit: 30,
        page: 0,
        totalRecord: 0
    })
    const [getAttendanceReport] = useLazyFileQuery();

    const { countryIds, stateIds, cityIds, areaIds, departmentIds, groupIds, designationIds, employeeIds } = useDropDownIds();

    const handleReport = (isDownload = false) => {
        setLoader(!loader);
        getAttendanceReport({
            url: `${API.AttendanceReport}/${isDownload ? 'download' : 'view'}`,
            fileName: "AttendanceReport",
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
                    scheduleStartDt: dateRange[0],
                    scheduleEndDt: dateRange[1]
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
                    country: true,
                    state: true,
                    city: true,
                    area: true,
                    department: true,
                    group: true,
                    employee: true,
                    month: true,
                    year: true
                }}>
                    <Grid item sm={10} md={10} lg={10}>
                        <Controls.DateRangePicker onChange={({ target }) => { setDateRange(target.value) }} value={dateRange} />
                    </Grid>
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

export default AttendanceReport