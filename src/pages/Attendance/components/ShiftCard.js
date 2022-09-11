import {
    Card, CardActionArea, CardActions, CardContent
    , MenuItem, ListItemIcon, ListItemText, MenuList, Typography
} from '../../../deps/ui'
import SpeedDial from './SpeedDial'
import Controls from '../../../components/controls/Controls'
import { AccessTime, Check } from '../../../deps/ui/icons'

export default ({ data, handleChange, handleCopy, index, shifts }) => {

    return (<Card sx={{ width: 345, maxWidth: "100%" }}>
        <CardActionArea disableTouchRipple={true}>
            <CardContent title="Testing" >
                <Typography gutterBottom variant="h5" component="div">
                    {data.name}
                </Typography>
                <Controls.Select name="fkShiftId" onChange={(e) => handleChange(e, index)} value={data.fkShiftId} label="Shifts" options={shifts} dataId="id" dataName="shiftName" />
                <MenuList>
                    <MenuItem>
                        <ListItemIcon>
                            <AccessTime fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Start Time</ListItemText>
                        <Typography variant="body2" color="text.secondary">
                            {data.startTime}
                        </Typography>
                    </MenuItem>
                    <MenuItem>
                        <ListItemIcon>
                            <AccessTime fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>End Time</ListItemText>
                        <Typography variant="body2" color="text.secondary">
                            {data.endTime}
                        </Typography>
                    </MenuItem>
                    <MenuItem>
                        <ListItemIcon>
                            <Check fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Shift End On Next Day?</ListItemText>
                        <Typography variant="body2" color="text.secondary">
                            {data.isNextDay ? "Yes" : "No"}
                        </Typography>
                    </MenuItem>
                    <MenuItem>
                        <ListItemIcon>
                            <AccessTime fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Grace Start Time</ListItemText>
                        <Typography variant="body2" color="text.secondary">
                            {data.minTime}
                        </Typography>
                    </MenuItem>
                    <MenuItem>
                        <ListItemIcon>
                            <AccessTime fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Grace End Time</ListItemText>
                        <Typography variant="body2" color="text.secondary">
                            {data.maxTime}
                        </Typography>
                    </MenuItem>
                </MenuList>
            </CardContent>
        </CardActionArea>
        <CardActions sx={{ minHeight: 100, transform: 'translateZ(0px)', flexGrow: 1 }}>
            <SpeedDial weekName={data.name} handleCopy={(e) => handleCopy(e, data)} isHidden={!Boolean(data.fkShiftId)} />
            {/* <Controls.Button color="secondary" startIcon={<FileCopy />} text="Copy" /> */}
        </CardActions>
    </Card>)
}
