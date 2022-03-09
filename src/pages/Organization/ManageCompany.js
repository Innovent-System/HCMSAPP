import * as React from 'react';
import PageHeader from '../../components/PageHeader'
import { PeopleOutline } from '../../deps/ui/icons'
import Tabs from '../../components/Tabs'
import Country from './components/Country'
import Area from './components/Area'


const tab = [
  {
    title: "Area",
    panel: <Area/>
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


