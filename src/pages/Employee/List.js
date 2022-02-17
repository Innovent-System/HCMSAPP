import React from 'react';
import {Grid,Paper,Typography,Button} from '../../deps/ui';
import PageHeader from '../../components/PageHeader';
import { PeopleOutline } from '../../deps/ui/icons';
import DataGrid from '../../components/useDataGrid';
import Controls from '../../components/controls/Controls';


const List = () => {
  return <>
  
  <Grid component={Paper} evaluation={5} container justifyContent="space-between" alignItems="center" className='page-heading'>
    <Grid item className='left' ><Typography variant="h1"> Employee List </Typography></Grid> 
    <Grid item className='right'><Controls.Button  text="+ Add" /></Grid> 
  </Grid>  
     {/* <PageHeader
      title="Employee List"
      subTitle="Manage Employees"
      icon={<PeopleOutline fontSize="large" />}
    /> */}
    <DataGrid/> 
  </>;
};

export default List;
