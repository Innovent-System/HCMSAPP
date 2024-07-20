import React from 'react'
import PayslipView from './components/PayslipView'
import { Grid, Box } from '../../deps/ui'
import CommonDropDown from '../../components/CommonDropDown'

const Reports = () => {
  return (
    <Grid container spacing={3}>
      <Grid item sm={3} md={3} lg={3}>
        <CommonDropDown flexDirection='column' breakpoints={{ sm: 10, md: 10, lg: 10 }} showFilters={{
          country: true,
          state: true,
          city: true,
          area: true,
          department: true,
          group: true,
          employee: true,
          month: true,
          year: true
        }}>

        </CommonDropDown>
      </Grid>
      <Grid item sm={9} md={9} lg={9}>


        <PayslipView />

      </Grid>
    </Grid>
  )
}

export default Reports