import PageHeader from '../../components/PageHeader'
import { ReportPage } from '../ReportToRoute'
import { PeopleOutline } from '../../deps/ui/icons'

const Reports = () => <>

  <PageHeader
    title="Reports"
    enableFilter={false}
    showQueryFilter={false}
    subTitle="Manage Employee Reports"
    icon={<PeopleOutline fontSize="large" />}
  />
  <ReportPage formId={22} defaultReport={8} />
</>


export default Reports