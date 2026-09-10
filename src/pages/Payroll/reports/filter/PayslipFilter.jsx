import React from 'react'
import { useDropDownIds } from '../../../../components/useDropDown';
import CommonDropDown from '../../../../components/CommonDropDown';
import { Grid } from '../../../../deps/ui'
import Controls from '../../../../components/controls/Controls';
import { compressQuery } from '../../../../util/reporthelper';


const PaySlipFilter = () => {

    const { countryIds, stateIds, cityIds, areaIds, departmentIds, groupIds, designationIds, employeeIds, monthIds, yearIds } = useDropDownIds();

    const handleViewer = () => {
        const query = {
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

        const url = `/payslipreport?data=${compressQuery(query)}`;
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
                    employee: true,
                    month: true,
                    year: true
                }}>
                    <Grid item size={{ xs: 10, md: 10 }} pr={1}>
                        <Controls.Button text="Generate" onClick={() => handleViewer()} fullWidth />
                    </Grid>
                </CommonDropDown>
            </Grid>

        </>
    )
}

export default PaySlipFilter