import React from 'react'
import { Box, Stack, Typography, Paper, Toolbar, AppBar, Grid, IconButton } from '../../deps/ui'
import { LocalPrintshop, PictureAsPdf, Description, OpenInNew } from '../../deps/ui/icons'
import CommonDropDown from '../../components/CommonDropDown'

const Reports = () => {
  return (
    <Stack flexDirection="row" gap={2} >

      {/* filter */}
      <Box flex={1}>
        <CommonDropDown isMultiple={true} flexDirection='column' showFilters={{
          company: true,
          country: true,
          city: true,
          area: true,
        }} />
      </Box>
      {/* Viewer */}
      <Box display="flex" flex={2} flexDirection="column">
        <AppBar color='transparent' sx={{ borderRadius: 1 }} position='static'><Toolbar>
          <Grid container alignItems="center">
            <Grid item>
              <IconButton title='Print'>
                <LocalPrintshop />
              </IconButton>
              <IconButton title='Download Pdf'>
                <PictureAsPdf />
              </IconButton>
              <IconButton title='Download Excel'>
                <Description />
              </IconButton>
              <IconButton title='New Tab'>
                <OpenInNew />
              </IconButton>
            </Grid>

          </Grid>
        </Toolbar>
        </AppBar>
        <Box sx={{ boxShadow: 2, borderRadius: 1, mt: 1 }}>
          <Typography>Viewer</Typography>
        </Box>
      </Box>

    </Stack>
  )
}

export default Reports