import Header from './header/Header';
import Sidebar from './sidemenu/SideMenu';
import { Box,makeStyles,Paper } from '@material-ui/core';
import {  useState,useEffect,useContext } from 'react';
import { SocketContext } from '../services/socketService';
import {history} from '../config/appconfig'



const drawerWidth = 220;

const sideMenuStyles = makeStyles((theme) => ({
  mobileDrawer: {
    width: drawerWidth
  },
  desktopDrawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap'
  },
  
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(5) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(7) + 1,
    },
  },
  
}));




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




const Layout = ({sideMenuData,children}) => {
    
    const socket = useContext(SocketContext)
    const [sideMenu, setSideMenu] = useState(null);
    const [header, setHeader] = useState(<Header   headerStyles={headerStyles}/>);

    useEffect(() => {
      setSideMenu(<Sidebar sideMenuData={sideMenuData}   sideMenuStyles={sideMenuStyles} />)
    }, [sideMenuData])

  useEffect(() => {
    const formId = window.location.pathname.substr(window.location.pathname.lastIndexOf("/") + 1);
    socket.emit("joinSession",formId);

    return () => {
      socket.emit("leaveSession",formId);
      socket.off("leaveSession");
      socket.off("joinSession");
      
    }
  },[history.location.pathname]);

    return (
        <Box display='flex' flexWrap='wrap'>
            {header}
            {sideMenu}
            <Box component={Paper} elevate={2} minHeight='100vh' m={1} flexGrow={1} >{children}</Box>
        </Box>
    )
}

export default Layout
