import * as React from 'react';
import PropTypes from 'prop-types';
import PageHeader from '../../components/PageHeader'
import { PeopleOutline } from '../../deps/ui/icons'
import Tabs from '../../components/Tabs'
import Country from './components/Country'


const tab = [
  {
    title: "Country",
    panel: <Country />
  },
  {
    title: "City",
    panel: <h1>Country</h1>
  },
  {
    title: "State",
    panel: <h1>Country</h1>
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


