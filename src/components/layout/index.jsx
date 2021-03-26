import Header from './header/Header';
import Sidebar from './sidemenu/SideMenu';
import { Box,makeStyles } from '@material-ui/core';
import {  useState } from 'react';

const drawerWidth = 256;

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
        marginLeft:theme.spacing(7.5),
        width: `calc(100% - ${theme.spacing(7.5)}px)`,
        backgroundColor: '#fff',
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,

        }),
      },
      appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
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
    return (
        <Box display='flex' flexWrap='wrap'>
            <Header  isOpen={open} setOpen={setOpen} headerStyles={headerStyles}/>
            <Sidebar open={open} sideMenuData={sideMenuData}   sideMenuStyles={sideMenuStyles} />
            <Box component='main'  flexGrow={1} >{children}</Box>
        </Box>
    )
}

export default Layout
