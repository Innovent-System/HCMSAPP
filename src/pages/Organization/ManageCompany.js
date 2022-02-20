import * as React from 'react';
import PageHeader from '../../components/PageHeader'
import { PeopleOutline } from '../../deps/ui/icons'
import Tabs from '../../components/Tabs'
import Country from './components/Country'
import Area from './components/Area'


const tab = [
  {
    title: "Company",
    panel: <Country />
  },
  {
    title: "Country",
    panel: <Country />
  },
  {
    title: "Area",
    panel: <Area/>
  },
  {
    title: "Vendor",
    panel: <h1>Vendor</h1>
  },
  {
    title: "Department",
    panel: <h1>Vendor</h1>
  },
  {
    title: "Employee Group",
    panel: <h1>Vendor</h1>
  },
  {
    title: "Designation",
    panel: <h1>Vendor</h1>
  },

]

export default function ManageCompany() {
  return (
    <>
      <PageHeader
        title="Contant"
        subTitle="Manage Comapny"
        icon={<PeopleOutline fontSize="large" />}
      />
      <Tabs TabsConfig={tab} />
    </>

  );
}


