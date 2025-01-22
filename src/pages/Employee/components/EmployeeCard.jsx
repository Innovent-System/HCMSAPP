import { useState } from 'react';
import {
    Card, CardHeader, CardContent, CardMedia, CardActions, Avatar, IconButton, Typography, Menu, MenuItem,
    List,
    ListItem,
    ListItemIcon,
    ListItemText, ListItemButton,
    Divider, Switch
} from '../../../deps/ui'
import { MoreVert, EmailOutlined, LocationOnOutlined, DomainOutlined } from '../../../deps/ui/icons'
import { formateISODate } from '../../../services/dateTimeService';
import { green } from '@mui/material/colors';

const getInitials = (fullName) => {
    const nameList = fullName.split(" ");
    return `${nameList[0].charAt(0)}${nameList[nameList.length - 1]?.charAt(0) ?? ""}`
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
const style = {
    card: {
        //background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.7), rgba(25, 118, 210, 0.3))',
        minWidth: 300,
        m: 0.5,
        borderRadius: 2
    },
    cardContent: {
        pt: 0, pl: 8,
        '&:last-child': {
            pb: 0
        }
    }
}
const label = { inputProps: { 'aria-label': 'Color switch demo' } };

//linear-gradient(135deg, rgba(25, 118, 210, 0.7), rgba(25, 118, 210, 0.3))
//linear-gradient(135deg, #009688, #1976d2)
export default function EmployeeCard({ employeeInfo, handleEdit, handleActive }) {

    const { _id, fullName, designation, city, tenure, generalInfo, department, employementstatus, companyInfo, isActive } = employeeInfo;

    return (
        <Card sx={style.card} elevation={5} >
            <CardHeader
                avatar={
                    <Avatar aria-label="recipe">
                        {getInitials(fullName)}
                    </Avatar>
                }
                sx={{ pb: 0 }}
                action={
                    <>

                        <Switch {...label} size='small' onClick={() => handleActive(_id)} color='success' defaultChecked={isActive} />
                        <MenuOption menuId={_id} options={{
                            handleEdit
                        }} />
                    </>

                }

                titleTypographyProps={{ maxWidth: 195, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                title={fullName}
                subheader={designation?.name}

            />
            {/* <CardMedia
                component="img"
                height="194"
                image="/static/images/cards/paella.jpg"
                alt="Paella dish"
            /> */}
            <CardContent sx={style.cardContent}>
                <List>
                    <ListItem disablePadding>
                        <ListItemIcon sx={{ minWidth: 30 }}>
                            <EmailOutlined fontSize='small' />
                        </ListItemIcon>
                        <ListItemText sx={{ '&::first-letter': { textTransform: "capitalize" } }} primary={generalInfo?.email ? generalInfo?.email : "--"} />
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemIcon sx={{ minWidth: 30 }}>
                            <DomainOutlined fontSize='small' />
                        </ListItemIcon>
                        <ListItemText primary={department.departmentName} />
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