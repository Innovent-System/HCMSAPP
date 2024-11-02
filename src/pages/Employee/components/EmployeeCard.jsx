import { useState } from 'react';
import {
    Card, CardHeader, CardContent, CardMedia, CardActions, Avatar, IconButton, Typography, Menu, MenuItem,
    List,
    ListItem,
    ListItemIcon,
    ListItemText, ListItemButton,
    Divider
} from '../../../deps/ui'
import { MoreVert, EmailOutlined, LocationOnOutlined, DomainOutlined } from '../../../deps/ui/icons'
import { formateISODate } from '../../../services/dateTimeService';
import { lightBlue } from '@mui/material/colors'

const getInitials = (fullName) => {
    const [firstName, lastName] = fullName.split(" ");
    return `${firstName.charAt(0)}${lastName?.charAt(0) ?? ""}`
}
const MenuOption = ({ menuId, options }) => {
    const { handleEdit } = options
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return <>
        <IconButton aria-label="settings" onClick={handleClick}>
            <MoreVert
                id={`more-button-${menuId}`}
                aria-controls={open ? menuId : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}

            />
        </IconButton>
        <Menu
            id={menuId}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
                'aria-labelledby': `more-button-${menuId}`,
            }}
        >
            <MenuItem onClick={() => { handleClose(); handleEdit(menuId); }}>Edit</MenuItem>

        </Menu>
    </>
}
//linear-gradient(135deg, rgba(25, 118, 210, 0.7), rgba(25, 118, 210, 0.3))
//linear-gradient(135deg, #009688, #1976d2)
export default function EmployeeCard({ employeeInfo, handleEdit }) {

    const { _id, fullName, designation, city, tenure, generalInfo, employementstatus, companyInfo } = employeeInfo;

    return (
        <Card sx={{
            // background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.7), rgba(25, 118, 210, 0.3))',
            minWidth: 445,
            borderRadius: 2
        }} elevation={5} >
            <CardHeader
                avatar={
                    <Avatar aria-label="recipe">
                        {getInitials(fullName)}
                    </Avatar>
                }
                sx={{ pb: 0 }}
                action={
                    <MenuOption menuId={_id} options={{
                        handleEdit
                    }} />
                }
                title={fullName}
                subheader={designation?.name}
            />
            {/* <CardMedia
                component="img"
                height="194"
                image="/static/images/cards/paella.jpg"
                alt="Paella dish"
            /> */}
            <CardContent sx={{ pt: 0, pl: 8 }}>
                <List>
                    <ListItem disablePadding>
                        <ListItemIcon sx={{ minWidth: 30 }}>
                            <EmailOutlined fontSize='small' />
                        </ListItemIcon>
                        <ListItemText primary={generalInfo?.email ? generalInfo?.email : "--"} />
                    </ListItem>

                    <ListItem disablePadding>
                        <ListItemIcon sx={{ minWidth: 30 }}>
                            <LocationOnOutlined fontSize='small' />
                        </ListItemIcon>
                        <ListItemText primary={city.name} />
                    </ListItem>
                    <Divider />
                    <ListItem disablePadding>
                        <ListItemText primary="Tenure" secondary={`${tenure.years}${tenure.months == 0 ? "" : "." + tenure.months} Yrs`} />
                        <ListItemText primary="Status" secondary={employementstatus?.name} />
                        <ListItemText primary="Joining Date" secondary={formateISODate(companyInfo?.joiningDate)} />
                    </ListItem>
                </List>
                {/* <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    This impressive paella is a perfect party dish and a fun meal to cook
                    together with your guests. Add 1 cup of frozen peas along with the mussels,
                    if you like.
                </Typography> */}
            </CardContent>

        </Card>
    );
}
