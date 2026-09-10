import React, { useState } from 'react'
import { useDropDownIds } from '../../../../components/useDropDown';
import { getMonthStartEnd, systemFormatDate } from '../../../../services/dateTimeService';
import CommonDropDown from '../../../../components/CommonDropDown';
import { Grid } from '../../../../deps/ui'
import Controls from '../../../../components/controls/Controls';
import { compressQuery } from '../../../../util/reporthelper';


const { monthStart, monthEnd } = getMonthStartEnd();

const DefaultLimit = 30, DefaultPage = 0;

const AttendanceRegisterFilter = () => {

    const [dateRange, setDateRange] = useState([monthStart, monthEnd])
    const { countryIds, stateIds, cityIds, areaIds, departmentIds, groupIds, employeeIds } = useDropDownIds();

    const handleViewer = () => {
        const query = {
            page: DefaultPage,
            limit: DefaultLimit,
            searchParams: {
                ...(employeeIds && { "employeeId": { value: employeeIds.split(','), operator: "In" } }),
                ...(countryIds && { "countryId": { value: countryIds.split(','), operator: "In" } }),
                ...(stateIds && { "stateId": { value: stateIds.split(','), operator: "In" } }),
                ...(cityIds && { "cityId": { value: cityIds.split(','), operator: "In" } }),
                ...(areaIds && { "areaId": { value: areaIds.split(','), operator: "In" } }),
                ...(groupIds && { "employeeGroupId": { value: groupIds.split(','), operator: "In" } }),
                ...(departmentIds && { "departmentId": { value: departmentIds.split(','), operator: "In" } }),
                scheduleStartDt: { value: systemFormatDate(dateRange[0]), operator: "GreaterThanOrEqual" },
                scheduleEndDt: { value: systemFormatDate(dateRange[1]), operator: "LessThanOrEqual" }
                // ...query
            }
        }

        const url = `/attendanceregisterreport?data=${compressQuery(query)}`;
        window.open(url, "_blank", "width=1200,height=800,scrollbars=yes");
    }

    return (
        <>

            <Grid item size={{ xs: 10, md: 3 }}>
                <CommonDropDown flexDirection='column' breakpoints={{ size: { xs: 10, md: 10 } }} showFilters={{
                    country: true,
                    state: true,
                    city: true,
                    area: true,
                    department: true,
                    group: true,
                    employee: true
                }}>
                    <Grid item size={{ xs: 10, md: 10 }}>
                        <Controls.DateRangePicker onChange={({ target }) => { setDateRange(target.value) }} value={dateRange} />
                    </Grid>
                    <Grid item size={{ xs: 10, md: 10 }} pr={1}>
                        <Controls.Button text="Generate" onClick={() => handleViewer()} fullWidth />
                    </Grid>
                </CommonDropDown>
            </Grid>

        </>
    )
}

export default AttendanceRegisterFilter