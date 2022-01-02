import React from 'react';
import {CircularProgress,Grid} from '../deps/ui';


function CircularLoading() {

  return (
    <Grid
      container
      spacing={0}
      alignItems="center"
      justify="center"
      style={{ minHeight: '100vh' }}
    >
      <CircularProgress/>
    </Grid>
  )
}

export default CircularLoading;