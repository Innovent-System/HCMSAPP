import {useContext,useEffect} from 'react'
import { AppBar, Toolbar, Grid, InputBase, IconButton, Badge,makeStyles } from '@material-ui/core'
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import SearchIcon from '@material-ui/icons/Search';
import SubjectIcon from '@material-ui/icons/Dashboard';
import Auth from '../../services/AuthenticationService';
import { SocketContext } from '../../services/socketService';
import { history } from '../../config/appconfig';
import { API_USER_LOGOUT } from '../../services/UrlService';
import { handleGetActions } from '../../store/actions/httpactions';
import { useDispatch } from "react-redux";
 
const headerStyles = makeStyles(theme => ({
    
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        backgroundColor: '#fff'
      },
    searchInput: {
        opacity: '0.6',
        padding: `0px ${theme.spacing(1)}px`,
        fontSize: '0.8rem',
        '&:hover': {
            backgroundColor: '#f2f2f2'
        },
        '& .MuiSvgIcon-root': {
            marginRight: theme.spacing(1)
        }
    }
}))


export default function Header({isOpen,setOpen }) {

    const classes = headerStyles();
    const dispatch = useDispatch();
    const socket = useContext(SocketContext);
    useEffect(() => {
        return () => {
            socket.off("leave");
        }
    })

    
    const handleLogout = () => {
        
        dispatch(handleGetActions(API_USER_LOGOUT)).then(res => {
            if(res.isSuccess){
                const info = Auth.getitem('userInfo') || {};
                Auth.remove("employeeInfo");
                Auth.remove("appConfigData");
               

                socket.emit("leave",info.c_Id);
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
