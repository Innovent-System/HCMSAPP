import React, { useState } from 'react'
import { Box, Stack, Typography, Paper, Toolbar, AppBar, Grid, IconButton, Chip } from '../../deps/ui'
import { LocalPrintshop, PictureAsPdf, Description, OpenInNew } from '../../deps/ui/icons'
import CommonDropDown from '../../components/CommonDropDown'
import Controls from '../../components/controls/Controls'
import DataGrid from '../../components/useDataGrid';
import { formateISODateTime, formateISOTime } from '../../services/dateTimeService'
import { useLazyPostQuery } from '../../store/actions/httpactions'
import { API } from './_Service'
import useTable from '../../components/useTable'

const BREAK_POINTS = { xs: 12, sm: 12, md: 12 };
// const flagMap = {
//   0: { tag: "H", color: "info" },
//   1: { tag: "L", color: "warning" },
//   7: { tag: "A", color: "error" },
//   8: { tag: "FL", color: "secondary" },
//   9: { tag: "HL", color: "secondary" },
//   10: { tag: "GH", color: "info" },
//   null: { tag: "P", color: "success" }
// }

const flagMap = {
  0: { tag: "Holidy", color: "green" },
  1: { tag: "Late", color: "yellow" },
  7: { tag: "Absent", color: "black" },
  8: { tag: "Full Leave", color: "#ddd" },
  9: { tag: "Half Leave", color: "#ddd" },
  10: { tag: "Gazetted Holiday", color: "ddd" },
  null: { tag: "Present", color: "blue" }
}
/**
 * @type {import("@mui/x-data-grid-pro").GridColumns}
 */
const columns = [
  { field: '_id', headerName: 'Id', hide: true, hideable: false },
  { field: "employeeCode", headerName: "Code", filterable: false, sortable: false },
  { field: "fullName", headerName: "Employee", filterable: false, sortable: false },
  { field: 'scheduleStartDt', headerName: 'Schedule Start', width: 200, hideable: false, valueGetter: ({ value }) => formateISODateTime(value) },
  { field: 'scheduleEndDt', headerName: 'Schedule End', width: 200, hideable: false, valueGetter: ({ value }) => formateISODateTime(value) },
  { field: 'startDateTime', headerName: 'Actual In', width: 200, hideable: false, valueGetter: ({ value }) => value ? formateISODateTime(value) : "--:--:--" },
  { field: 'endDateTime', headerName: 'Actual Out', width: 200, hideable: false, valueGetter: ({ value }) => value ? formateISODateTime(value) : "--:--:--" },
  {
    field: 'status', headerName: 'Status', width: 180, hideable: false, renderCell: ({ row }) => <Chip color={flagMap[row.status].color} label={flagMap[row.status].tag} />
  }
]
const TableHead = [
  { id: 'employeeCode', disableSorting: false, label: 'Code' },
  { id: 'fullName', disableSorting: false, label: 'Employee' },
  { id: 'scheduleStartDt', disableSorting: false, label: 'Schedule Start', valueGetter: ({ row }) => formateISODateTime(row.scheduleStartDt) },
  { id: 'scheduleEndDt', disableSorting: false, label: 'Schedule End', valueGetter: ({ row }) => formateISODateTime(row.scheduleEndDt) },
  { id: 'startDateTime', disableSorting: false, label: 'Actual In', valueGetter: ({ row }) => formateISOTime(row.startDateTime) },
  { id: 'endDateTime', disableSorting: false, label: 'Actual Out', valueGetter: ({ row }) => formateISOTime(row.endDateTime) },
  { id: 'status', disableSorting: false, label: 'Remarks', valueGetter: ({ row }) => flagMap[row.status].tag }

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

const Reports = () => {
  const [records, setRecords] = useState([]);
  const [gridFilter, setGridFilter] = useState({
    lastKey: null,
    limit: 30,
    page: 0,
    totalRecord: 0
  })
  const [getAttendanceReport] = useLazyPostQuery();
  const handleReport = () => {
    getAttendanceReport({
      url: `${API.AttendanceReport}/view`, data: {
        page: gridFilter.page,
        limit: gridFilter.limit,
        searchParams: {}
      }
    }).then(c => {
      console.log(c);
      if (c.data)
        setRecords(c.data)

    })

  }

  return (
    <Grid container spacing={5}>
      <Grid item sm={3} md={3} lg={3}>
        <CommonDropDown isMultiple={true} breakpoints={BREAK_POINTS} flexDirection='column' showFilters={{
          company: true,
          country: true,
          city: true,
          area: true,
        }} />
        <Controls.Button text="Generate" onClick={handleReport} fullWidth />
      </Grid>
      <Grid item sm={9} md={9} lg={9}>
        <AppBar color='transparent' sx={{ borderRadius: 1, mb: 1 }} position='static'><Toolbar>
          <Grid container alignItems="center">
            <Grid item>
              <IconButton title='Print'>
                <LocalPrintshop />
              </IconButton>
              <IconButton title='Download Pdf'>
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
        <DetailPanelContent row={records} />
        {/* <DataGrid
          columns={columns} rows={records}
          loading={false}
          checkboxSelection={false}
          autoHeight={true}
          totalCount={records?.length}
          disableSelectionOnClick
          page={gridFilter.page}
          pageSize={gridFilter.limit}
          editMode='row'
          paginationMode='client'
          setFilter={setGridFilter}

        /> */}
      </Grid>
    </Grid>

  )
}

export default Reports