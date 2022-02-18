import React, { useState } from 'react';
import {Grid,Paper,Typography,Button} from '../../deps/ui';
import PageHeader from '../../components/PageHeader';
import { PeopleOutline } from '../../deps/ui/icons';
import DataGrid from '../../components/useDataGrid';
import Controls from '../../components/controls/Controls';
import Popup from '../../components/Popup';
import EmpoyeeModal from './components/AddEditEmployee'


const List = () => {
  const [openPopup,setOpenPopup] = useState(false);
  return <>
     <PageHeader
      title="Employee List"
      subTitle="Manage Employees"
      handleAdd={()=> setOpenPopup(true)}
    />
    <Popup title='Add Employee' maxWidth='xl' openPopup={openPopup} setOpenPopup={setOpenPopup} >
      <EmpoyeeModal />
    </Popup>
    <DataGrid/> 
  </>;
};

export default List;
