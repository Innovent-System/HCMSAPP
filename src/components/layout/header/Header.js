import {useContext} from 'react'
import { AppBar, Toolbar, Grid, InputBase, IconButton, Badge } from '@material-ui/core'
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import SearchIcon from '@material-ui/icons/Search';
import SubjectIcon from '@material-ui/icons/Dashboard';
import Auth from '../../../services/AuthenticationService';
import { SocketContext } from '../../../services/socketService';
import { useHistory }  from 'react-router-dom';
import { API_USER_LOGOUT } from '../../../services/UrlService';
import { handleGetActions } from '../../../store/actions/httpactions';
import { useDispatch } from "react-redux";
 



export default function Header({headerStyles,isOpen,setOpen }) {
    const history = useHistory();
    const classes = headerStyles();
    const dispatch = useDispatch();
    const socket = useContext(SocketContext);
    const handleLogout = () => {
        
        dispatch(handleGetActions(API_USER_LOGOUT)).then(res => {
            if(res.isSuccess){
                Auth.remove("employeeInfo");
                Auth.remove("appConfigData");
                socket.emit("leave",1);
                localStorage.clear();
                history.replace({pathname:"/"})
            }
        })
        
    }


    return (
        <AppBar  className={classes.appBar} position="static" elevation={2}>
            <Toolbar disableGutters>
                <Grid container
                    alignItems="center">
                    <Grid style={{display:'flex'}} item>
                         <IconButton>
                            <SubjectIcon />
                         </IconButton>
                          
                        <InputBase
                            placeholder="Search topics"
                            className={classes.searchInput}
                            startAdornment={<SearchIcon fontSize="small" />}
                        />
                    </Grid>
                    <Grid item sm></Grid>
                    <Grid item>
                        <IconButton>
                            <Badge badgeContent={4} color="secondary">
                                <NotificationsNoneIcon fontSize="small" />
                            </Badge>
                        </IconButton>
                        <IconButton>
                            <Badge badgeContent={3} color="primary">
                                <ChatBubbleOutlineIcon fontSize="small" />
                            </Badge>
                        </IconButton>
                        <IconButton onClick={handleLogout}>
                            <PowerSettingsNewIcon fontSize="small" />
                        </IconButton>
                    </Grid>
                </Grid>
            </Toolbar>
        </AppBar>
    )
}
