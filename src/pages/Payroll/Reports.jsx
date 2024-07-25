import PageHeader from '../../components/PageHeader'
import { ReportPage } from '../ReportToRoute'
import { PeopleOutline } from '../../deps/ui/icons'

const Reports = () => <>

  <PageHeader
    title="Reports"
    enableFilter={false}
    showQueryFilter={false}
    subTitle="Manage Payroll Reports"
    icon={<PeopleOutline fontSize="large" />}
  />
  <ReportPage formId={35} defaultReport={2} />
</>


export default Reports