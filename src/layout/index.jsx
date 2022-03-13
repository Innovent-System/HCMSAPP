import { Paper } from '../deps/ui';
import { useEffect, useContext } from 'react';
import { SocketContext } from '../services/socketService';
import { Outlet,useParams } from 'react-router-dom';
import Header from '../layout/header/Header';

const Layout = () => {

  const socket = useContext(SocketContext);

  const params = useParams();

  useEffect(() => {
    socket.emit("joinSession", params.id);
    
    return () => {
      socket.emit("leaveSession", params.id);
      socket.off("leaveSession");
      socket.off("joinSession");
    }
  }, [params?.id]);

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
