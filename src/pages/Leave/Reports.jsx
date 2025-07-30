import PageHeader from '../../components/PageHeader'
import { ReportPage } from '../ReportToRoute'
import { PeopleOutline } from '../../deps/ui/icons'

const Reports = () => <>

  <PageHeader
    title="Reports"
    enableFilter={false}
    showQueryFilter={false}
    subTitle="Manage Leave Reports"
    icon={<PeopleOutline fontSize="large" />}
  />
  <ReportPage formId={42} defaultReport={7} />
</>


export default Reports