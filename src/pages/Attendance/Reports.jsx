import React from 'react'
import { PeopleOutline } from '../../deps/ui/icons'
import { ReportPage } from '../ReportToRoute'
import PageHeader from '../../components/PageHeader'

const Reports = () => {
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