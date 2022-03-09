import { Box, Paper } from '../deps/ui';
import { useEffect, useContext } from 'react';
import { SocketContext } from '../services/socketService';
import { history } from '../config/appconfig'
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../layout/header/Header';

const Layout = () => {

  const socket = useContext(SocketContext);

  useEffect(() => {
    const formId = window.location.pathname.substr(window.location.pathname.lastIndexOf("/") + 1);
    socket.emit("joinSession", formId);

    return () => {
      socket.emit("leaveSession", formId);
      socket.off("leaveSession");
      socket.off("joinSession");
    }
  }, [history.location.pathname]);

  return (
    <>
      <Header />
      <Paper className={"content-area"}>
        <Outlet />
      </Paper>
    </>
  )
}

export default Layout
