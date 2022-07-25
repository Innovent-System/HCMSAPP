import * as React from 'react';
import PageHeader from '../../components/PageHeader'
import { PeopleOutline } from '../../deps/ui/icons'
import Tabs from '../../components/Tabs'
import Country from './components/Country'
import Area from './components/Area'
import Company from './components/Company';
import Department from './components/Department';


const tabs = [
  {
    title: "Company",
    panel: <Company />
  },
  {
    title: "Country",
    panel: <Country />
  },
  {
    title: "Area",
    panel: <Area />
  },
  {
    title: "Department",
    panel: <Department />
  }
]

export default function ManageCompany() {
  return (
    <>
      <PageHeader
        title="Constant"
        subTitle="Manage Comapny"
        icon={<PeopleOutline fontSize="large" />}
      />
      <Tabs orientation='horizontal' TabsConfig={tabs} />
    </>

  );
}


