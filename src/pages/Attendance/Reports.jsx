import React, { useState } from 'react'
import { Grid } from '../../deps/ui'
import { PeopleOutline } from '../../deps/ui/icons'
import Controls from '../../components/controls/Controls'
import { formateISODateTime, getMonthStartEnd } from '../../services/dateTimeService'
import { useLazyFileQuery } from '../../store/actions/httpactions'
import { API } from './_Service'
import useTable from '../../components/useTable'
import { AttendanceflagMap } from '../../util/common'
import { useDropDownIds } from '../../components/useDropDown'
import PageHeader from '../../components/PageHeader'
import ReportViewer from '../../components/ReportViewer'
import { ReportPage } from '../ReportToRoute'

const TableHead = [
  { id: 'employeeCode', disableSorting: false, label: 'Code' },
  { id: 'fullName', disableSorting: false, label: 'Employee' },
  { id: 'scheduleStartDt', disableSorting: false, label: 'Schedule Start', valueGetter: ({ row }) => formateISODateTime(row.scheduleStartDt) },
  { id: 'scheduleEndDt', disableSorting: false, label: 'Schedule End', valueGetter: ({ row }) => formateISODateTime(row.scheduleEndDt) },
  { id: 'startDateTime', disableSorting: false, label: 'Actual In', valueGetter: ({ row }) => formateISODateTime(row.startDateTime) },
  { id: 'endDateTime', disableSorting: false, label: 'Actual Out', valueGetter: ({ row }) => formateISODateTime(row.endDateTime) },
  { id: 'status', disableSorting: false, label: 'Remarks', valueGetter: ({ row }) => AttendanceflagMap[row.status].tag }
];


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
      <ReportPage formId={23} defaultReport={1} />
    </>


  )
}

export default Reports