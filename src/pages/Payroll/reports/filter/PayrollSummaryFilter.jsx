import React, { useState } from 'react'
import { useDropDownIds } from '../../../../components/useDropDown';
import CommonDropDown from '../../../../components/CommonDropDown';
import { Grid } from '../../../../deps/ui'
import Controls from '../../../../components/controls/Controls';
import { compressQuery } from '../../../../util/reporthelper';

const DefaultLimit = 30, DefaultPage = 0;

const PayrollSummaryFilter = () => {

    const { countryIds, stateIds, cityIds, areaIds, departmentIds, groupIds, designationIds, employeeIds, monthIds, yearIds } = useDropDownIds();
    const [groupByField, setGoupByField] = useState("");
    const handleViewer = () => {
        const query = {
            page: DefaultPage,
            limit: DefaultLimit,
            groupBy: groupByField,
            searchParams: {
                ...(employeeIds && { "employeeId": { value: employeeIds.split(','), operator: "In" } }),
                ...(countryIds && { "countryId": { value: countryIds.split(','), operator: "In" } }),
                ...(stateIds && { "stateId": { value: stateIds.split(','), operator: "In" } }),
                ...(cityIds && { "cityId": { value: cityIds.split(','), operator: "In" } }),
                ...(areaIds && { "areaId": { value: areaIds.split(','), operator: "In" } }),
                ...(groupIds && { "employeeGroupId": { value: groupIds.split(','), operator: "In" } }),
                ...(departmentIds && { "departmentId": { value: departmentIds.split(','), operator: "In" } })
            },
            month: monthIds,
            year: yearIds
        }

        const url = `/payrollsummaryreport?data=${compressQuery(query)}`;
        window.open(url, "_blank", "width=1200,height=800,scrollbars=yes");
    }


    return (
        <>
            <Grid item size={{ xs: 10, md: 3 }}>
                <CommonDropDown flexDirection='column' breakpoints={{ size: { xs: 10, md: 10 } }} showFilters={{
                    area: true,
                    department: true,
                    group: true,
                    employee: true,
                    month: true,
                    year: true
                }}>

                    <Grid item size={{ xs: 10, md: 10 }} pr={1}>
                        <Controls.Checkbox label="Department Wise Group" name="department"
                            value={Boolean(groupByField)}
                            onChange={e => e.target.value ? setGoupByField(e.target.name) : setGoupByField("")}
                            fullWidth />
                    </Grid>
                    <Grid item size={{ xs: 10, md: 10 }} pr={1}>
                        <Controls.Button text="Generate Report" onClick={() => handleViewer()} fullWidth />
                    </Grid>

                </CommonDropDown>
            </Grid>

        </>
    )
}

export default PayrollSummaryFilter