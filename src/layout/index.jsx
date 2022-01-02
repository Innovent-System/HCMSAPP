import { Box } from '../deps/ui';
import { useEffect,useContext } from 'react';
import { SocketContext } from '../services/socketService';
import { history } from '../config/appconfig'
import { Outlet,useLocation } from 'react-router-dom';
import SideMenu from '../layout/sidemenu/SideMenu';
import Header  from '../layout/header/Header';

const Layout = ({sideMenu}) => {
    
    const socket = useContext(SocketContext);
    const location = useLocation();
   
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
      <>
            <Header/>
            <Box className={"main-content"}>        
               <SideMenu sideMenuData={sideMenu}/>
               <Box className={"content-area"}>
                  <Outlet/>
               </Box>
            </Box>
       </>
    )
}

export default Layout
