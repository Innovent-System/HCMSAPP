import React, { useState } from 'react'
import { useDropDownIds } from '../../../../components/useDropDown';
import { getMonthStartEnd } from '../../../../services/dateTimeService';
import CommonDropDown from '../../../../components/CommonDropDown';
import { Grid } from '../../../../deps/ui'
import Controls from '../../../../components/controls/Controls';
import { compressQuery } from '../../../../util/reporthelper';


const { monthStart, monthEnd } = getMonthStartEnd();

const DefaultLimit = 30, DefaultPage = 0;

const AttendanceFilter = () => {

    const [dateRange, setDateRange] = useState([monthStart, monthEnd])
    const { countryIds, stateIds, cityIds, areaIds, departmentIds, groupIds, designationIds, employeeIds } = useDropDownIds();

    const handleViewer = () => {
        const query = {
            page: DefaultPage,
            limit: DefaultLimit,
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

        const url = `/attendancereport?data=${compressQuery(query)}`;
        window.open(url, "_blank", "width=1200,height=800,scrollbars=yes");
    }

    return (
        <>

            <Grid item size={{ xs: 3, md: 3 }}>
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

export default AttendanceFilter