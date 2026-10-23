import PageHeader from '../../components/PageHeader'
import { ReportPage } from '../ReportToRoute'
import { PeopleOutline } from '../../deps/ui/icons'

const Reports = () => <>

  <PageHeader
    title="Reports"
    enableFilter={false}
    showQueryFilter={false}
    subTitle="Manage Full & Final Reports"
    icon={<PeopleOutline fontSize="large" />}
  />
  <ReportPage formId={54} defaultReport={9} />
</>


export default Reports