import Header from './header/Header';
import Sidebar from './sidemenu/SideMenu';
import { Box,makeStyles,Paper } from '@material-ui/core';
import {  useState,useEffect } from 'react';


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
    const [open, setOpen] = useState(false);
    const [stuff,setStuff] = useState([]);
  useEffect(() => {
    setStuff([<Header  isOpen={open} setOpen={setOpen} headerStyles={headerStyles}/>,
      <Sidebar open={open} sideMenuData={sideMenuData}   sideMenuStyles={sideMenuStyles} />])
  }, []);

    return (
        <Box display='flex' flexWrap='wrap'>
            {stuff[0]}
            {stuff[1]}
            <Box component={Paper} elevate={2} minHeight='100vh' m={1} flexGrow={1} >{children}</Box>
        </Box>
    )
}

export default Layout
