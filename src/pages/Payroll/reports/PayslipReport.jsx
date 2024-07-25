import React, { useRef, useState } from 'react'
import CommonDropDown from '../../../components/CommonDropDown'
import { Grid, Pagination } from '../../../deps/ui'
import PayslipView from '../components/PayslipView'
import { useLazyFileQuery } from '../../../store/actions/httpactions'
import { API } from '../_Service'
import { useDropDownIds } from '../../../components/useDropDown'
import Controls from '../../../components/controls/Controls'
import { ReportHeader } from '../../../components/ReportViewer'

const pagination = {
  display: 'flex',
  justifyContent: 'center',
}


const PayslipReport = ({ setLoader, loader }) => {

  const [getReport] = useLazyFileQuery();
  const [records, setRecords] = useState([]);
  const currenSlip = useRef();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(1);

  const handleChangePage = (event, value) => {
    currenSlip.current = records[value - 1];
    setPage(value);
  }

  const { countryIds, stateIds, cityIds, areaIds, departmentIds, groupIds, designationIds, employeeIds, yearIds, monthIds } = useDropDownIds();

  const handleReport = (isDownload = false) => {
    setLoader(!loader);
    getReport({
      url: `${API.PayslipReport}/${isDownload ? 'download' : 'view'}`,
      fileName: "PayslipReport",
      data: {
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
      if (!isDownload) {
        setRecords(c.data.result)
        currenSlip.current = c.data.result[0]
        setPage(1);
      }

    })

  }
  return (
    <>
      <Grid item sm={9} md={9} lg={9}>
        <ReportHeader handleReport={handleReport} component={{
          pagination: <Pagination
            showFirstButton
            showLastButton
            sx={pagination}
            count={Math.ceil(records.length / rowsPerPage)}
            // page={page}
            onChange={handleChangePage}
          />
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
          <Grid item sm={10} md={10} lg={10} pr={1}>
            <Controls.Button text="Generate" onClick={() => handleReport()} fullWidth />
          </Grid>
        </CommonDropDown>
      </Grid>
      <Grid item sm={9} md={9} lg={9}>
        <PayslipView {...currenSlip.current} />
      </Grid>
    </>
  )
}

export default PayslipReport