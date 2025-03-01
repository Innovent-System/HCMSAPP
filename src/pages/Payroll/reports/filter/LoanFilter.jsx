import React, { useState } from 'react'
import { useDropDownIds } from '../../../../components/useDropDown';
import CommonDropDown from '../../../../components/CommonDropDown';
import { Grid } from '../../../../deps/ui'
import Controls from '../../../../components/controls/Controls';
import { compressQuery } from '../../../../util/reporthelper';

const DefaultLimit = 30, DefaultPage = 0;

const LoanFilter = () => {

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
                ...(designationIds && { "companyInfo.fkDesignationId": { $in: designationIds.split(',') } })
            }
        }

        const url = `/loanreport?data=${compressQuery(query)}`;
        window.open(url, "_blank", "width=1200,height=800,scrollbars=yes");
    }


    return (
        <>
            <Grid item size={{ xs: 3, md: 3 }}>
                <CommonDropDown flexDirection='column' breakpoints={{ size: { sm: 10, md: 10, lg: 10 } }} showFilters={{
                    area: true,
                    department: true,
                    group: true,
                    employee: true
                }}>


                    <Grid item size={{ xs: 10, md: 10 }} pr={1}>
                        <Controls.Button text="Generate Report" onClick={() => handleViewer()} fullWidth />
                    </Grid>

                </CommonDropDown>
            </Grid>

        </>
    )
}

export default LoanFilter