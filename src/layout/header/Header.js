import {useContext,useEffect} from 'react'
import { AppBar, Toolbar, Grid, InputBase, IconButton, Badge } from '../../deps/ui'
import {NotificationsNone as NotificationsNoneIcon,
    ChatBubbleOutline as ChatBubbleOutlineIcon,
    PowerSettingsNew as PowerSettingsNewIcon,
    Search as SearchIcon,
    Dashboard as SubjectIcon
} 
from '../../deps/ui/icons';
import Auth from '../../services/AuthenticationService';
import { SocketContext } from '../../services/socketService';
import { useNavigate } from 'react-router-dom';
import { API_USER_LOGOUT } from '../../services/UrlService';
import { handleGetActions } from '../../store/actions/httpactions';
import { useDispatch } from "react-redux";
 
const headerStyles = {
    appBar: {
        zIndex: 'zIndex.drawer' + 1,
        backgroundColor: '#fff'
      },
    searchInput: {
        opacity: '0.6',
        padding: `0px 1px`,
        fontSize: '0.8rem',
        '&:hover': {
            backgroundColor: '#f2f2f2'
        },
        '& .MuiSvgIcon-root': {
            marginRight: 1
        }
    }
}


export default function Header() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
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
                Auth.remove("appConfigData");
                socket.emit("leave",info.c_Id);
                localStorage.clear();
                navigate("/");
            }
        })
        
    }


    return (
        <AppBar  sx={headerStyles.appBar} position="static" elevation={2}>
            <Toolbar disableGutters>
                <Grid container
                    alignItems="center">
                    <Grid style={{display:'flex'}} item>
                         <IconButton>
                            <SubjectIcon />
                         </IconButton>
                          
                        <InputBase
                            placeholder="Search topics"
                            sx={headerStyles.searchInput}
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
