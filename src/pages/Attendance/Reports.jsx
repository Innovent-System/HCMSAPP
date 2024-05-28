import React, { useState } from 'react'
import { Box, Stack, Typography, Paper, Toolbar, AppBar, Grid, IconButton, Chip } from '../../deps/ui'
import { LocalPrintshop, PictureAsPdf, Description, OpenInNew, PeopleOutline } from '../../deps/ui/icons'
import CommonDropDown from '../../components/CommonDropDown'
import Controls from '../../components/controls/Controls'
import DataGrid from '../../components/useDataGrid';
import { formateISODateTime, formateISOTime, getMonthStartEnd } from '../../services/dateTimeService'
import { useLazyFileQuery } from '../../store/actions/httpactions'
import { API } from './_Service'
import useTable from '../../components/useTable'
import { AttendanceflagMap } from '../../util/common'
import { useDropDownIds } from '../../components/useDropDown'
import CircularLoading from '../../components/Circularloading'
import PageHeader from '../../components/PageHeader'

const BREAK_POINTS = { xs: 10, sm: 10, md: 10 };


const TableHead = [
  { id: 'employeeCode', disableSorting: false, label: 'Code' },
  { id: 'fullName', disableSorting: false, label: 'Employee' },
  { id: 'scheduleStartDt', disableSorting: false, label: 'Schedule Start', valueGetter: ({ row }) => formateISODateTime(row.scheduleStartDt) },
  { id: 'scheduleEndDt', disableSorting: false, label: 'Schedule End', valueGetter: ({ row }) => formateISODateTime(row.scheduleEndDt) },
  { id: 'startDateTime', disableSorting: false, label: 'Actual In', valueGetter: ({ row }) => formateISODateTime(row.startDateTime) },
  { id: 'endDateTime', disableSorting: false, label: 'Actual Out', valueGetter: ({ row }) => formateISODateTime(row.endDateTime) },
  { id: 'status', disableSorting: false, label: 'Remarks', valueGetter: ({ row }) => AttendanceflagMap[row.status].tag }

];

const DetailPanelContent = ({ row }) => {

  const { TblContainer, TblHead, TblBody, TblPagination } = useTable(row, TableHead)
  return (
    <>
      <TblContainer>
        <TblHead />
        <TblBody />
      </TblContainer>
      <TblPagination />
    </>

  )
}

const { monthStart, monthEnd } = getMonthStartEnd();
const Reports = () => {
  const [records, setRecords] = useState([]);
  const [loader, setLoader] = useState(false);
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
      <PageHeader
        title="Reports"
        enableFilter={false}
        showQueryFilter={false}
        subTitle="Manage Attendance Reports"
        icon={<PeopleOutline fontSize="large" />}
      />
      <Grid container spacing={3}>
        <Grid item sm={3} md={3} lg={3}>
          <CommonDropDown isMultiple={true} breakpoints={BREAK_POINTS} flexDirection='column' showFilters={{
            company: true,
            country: true,
            state: true,
            city: true,
            area: true,
            department: true,
            designation: true,
            group: true,
            employee: true
          }} />

          <Grid item sm={10} marginTop={2} md={10} lg={10}>
            <Controls.DateRangePicker onChange={({ target }) => { setDateRange(target.value) }} value={dateRange} />
          </Grid>
          <Grid item sm={10} md={10} lg={10} pr={1}>
            <Controls.Button text="Generate" onClick={() => handleReport()} fullWidth />
          </Grid>
        </Grid>

        <Grid item sm={9} md={9} lg={9}>
          <AppBar color='transparent' sx={{ borderRadius: 1, mb: 1 }} position='static'><Toolbar variant='dense'>
            <Grid container alignItems="center">
              <Grid item>
                <IconButton title='Print'>
                  <LocalPrintshop />
                </IconButton>
                <IconButton title='Download Pdf' onClick={() => handleReport(true)}>
                  <PictureAsPdf />
                </IconButton>
                <IconButton title='Download Excel'>
                  <Description />
                </IconButton>
                <IconButton title='New Tab'>
                  <OpenInNew />
                </IconButton>
              </Grid>

            </Grid>
          </Toolbar>
          </AppBar>
          <CircularLoading open={loader} />
          <DetailPanelContent row={records} />
        </Grid>

      </Grid>
    </>


  )
}

export default Reports