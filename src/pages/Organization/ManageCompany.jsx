import React, { lazy, useState } from 'react';
import PageHeader from '../../components/PageHeader'
import { PeopleOutline } from '../../deps/ui/icons'
import Tabs from '../../components/Tabs'

const Country = lazy(()=> import('./components/Country')); 
const Area = lazy(()=> import('./components/Area')) 
import Company from './components/Company';
const Department = lazy(()=> import('./components/Department'));


const tabs = [
  // {
  //   title: "Company",
  //   panel: <Company />
  // },
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
  const [value, setValue] = useState('0');
  return (
    <>
      <PageHeader
        title="Company Setup"
        subTitle="Manage Company"
        icon={<PeopleOutline fontSize="large" />}
      />
      <Tabs orientation='horizontal' value={value} setValue={setValue} TabsConfig={tabs} />
    </>

  );
}


