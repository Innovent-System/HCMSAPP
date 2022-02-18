import React from 'react'
import { Paper, Typography,Grid, } from '../deps/ui';
import PropTypes from 'prop-types';
import Controls from './controls/Controls';


export default function PageHeader(props) {
    const { title, subTitle, icon,handleAdd } = props;
    return (
        <Grid component={Paper} evaluation={5} container justifyContent="space-between" alignItems="center" className='page-heading'>
    <Grid item className='left' ><Typography variant="h1"> {title} </Typography></Grid> 
    {typeof handleAdd === "function" && <Grid item className='right'><Controls.Button onClick={handleAdd} text="+ Add" /></Grid> } 
  </Grid>     )
}


PageHeader.propTypes = {
    title: PropTypes.string.isRequired,
    subTitle:PropTypes.string,
    icon:PropTypes.node,
    handleAdd:PropTypes.func
  };
