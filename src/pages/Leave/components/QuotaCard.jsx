import {
  Card, CardActionArea, CardActions, CardContent
  , MenuItem, ListItemIcon, ListItemText, MenuList, Typography, Stack, Paper, Grid
} from '../../../deps/ui'
import Controls from '../../../components/controls/Controls'
import { AccessTime, Check } from '../../../deps/ui/icons'
import PropTypes from 'prop-types'
import DataGrid from '../../../components/useDataGrid'


export function DetailPanelContent({ row: rowProp }) {
  return (
    <Stack
      sx={{ py: 2, height: '100%', boxSizing: 'border-box' }}
      direction="column"
    >
      <Paper sx={{ flex: 1, mx: 'auto', width: '90%', p: 1 }}>
        <Stack direction="column" spacing={1} sx={{ height: 1 }}>
          <Typography variant="h6">{`Order #${rowProp.id}`}</Typography>
          <Grid container>
            <Grid item size={{ md: 6 }} >
              <Typography variant="body2" color="textSecondary">
                Customer information
              </Typography>
              <Typography variant="body1">{rowProp.customer}</Typography>
              <Typography variant="body1">{rowProp.email}</Typography>
            </Grid>
            <Grid item size={{ md: 6 }}>
              <Typography variant="body2" align="right" color="textSecondary">
                Shipping address
              </Typography>
              <Typography variant="body1" align="right">
                {rowProp.address}
              </Typography>
              <Typography variant="body1" align="right">
                {`${rowProp.city}, ${rowProp.country.label}`}
              </Typography>
            </Grid>
          </Grid>
          <DataGrid
            density="compact"
            columns={[
              { field: 'name', headerName: 'Product', flex: 1 },
              {
                field: 'quantity',
                headerName: 'Quantity',
                align: 'center',
                type: 'number',
              },
              { field: 'unitPrice', headerName: 'Unit Price', type: 'number' },
              {
                field: 'total',
                headerName: 'Total',
                type: 'number',
                valueGetter: ({ row }) => row.quantity * row.unitPrice,
              },
            ]}
            rows={rowProp.products}
            sx={{ flex: 1 }}
            hideFooter
          />
        </Stack>
      </Paper>
    </Stack>
  );
}

DetailPanelContent.propTypes = {
  row: PropTypes.object.isRequired,
};

export default ({ data, index }) => {

  return (<Card sx={{ width: 345, maxWidth: "100%" }}>
    <CardActionArea disableTouchRipple={true}>
      <CardContent title="Testing" >
        <Typography gutterBottom variant="h5" component="div">
          Test
        </Typography>
        <MenuList>
          <MenuItem>
            <ListItemIcon>
              <AccessTime fontSize="small" />
            </ListItemIcon>
            <ListItemText>Start Time</ListItemText>
            <Typography variant="body2" color="text.secondary">
              Test Time
            </Typography>
          </MenuItem>
          <MenuItem>
            <ListItemIcon>
              <AccessTime fontSize="small" />
            </ListItemIcon>
            <ListItemText>End Time</ListItemText>
            <Typography variant="body2" color="text.secondary">
              Test End Time
            </Typography>
          </MenuItem>
          <MenuItem>
            <ListItemIcon>
              <Check fontSize="small" />
            </ListItemIcon>
            <ListItemText>Shift End On Next Day?</ListItemText>
            <Typography variant="body2" color="text.secondary">
              Next Day
            </Typography>
          </MenuItem>
          <MenuItem>
            <ListItemIcon>
              <AccessTime fontSize="small" />
            </ListItemIcon>
            <ListItemText>Grace Start Time</ListItemText>
            <Typography variant="body2" color="text.secondary">
              Min Time
            </Typography>
          </MenuItem>
          <MenuItem>
            <ListItemIcon>
              <AccessTime fontSize="small" />
            </ListItemIcon>
            <ListItemText>Grace End Time</ListItemText>
            <Typography variant="body2" color="text.secondary">
              Max TIme
            </Typography>
          </MenuItem>
        </MenuList>
      </CardContent>
    </CardActionArea>
    <CardActions sx={{ minHeight: 100, transform: 'translateZ(0px)', flexGrow: 1 }}>

      {/* <Controls.Button color="secondary" startIcon={<FileCopy />} text="Copy" /> */}
    </CardActions>
  </Card>)
}
