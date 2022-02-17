import * as React from 'react';
import PageHeader from '../../components/PageHeader'
import { PeopleOutline } from '../../deps/ui/icons'
import Tabs from '../../components/Tabs'
import Country from './components/Country'
import Area from './components/Area'
import State from './components/State'


const tab = [
  {
    title: "Country",
    panel: <Country />
  },
  {
    title: "State",
    panel: <State />
  },
  {
    title: "City",
    panel: <h1>City</h1>
  },
  {
    title: "Area",
    panel: <Area />
  },
  {
    title: "Vendor",
    panel: <h1>Vendor</h1>
  },{
    title: "AddCity",
    panel: <h1>Add City</h1>
  }
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


