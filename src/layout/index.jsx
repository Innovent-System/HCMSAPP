import { Paper } from '../deps/ui';
import { useEffect, useContext } from 'react';
import { SocketContext } from '../services/socketService';
import { Outlet, useParams } from 'react-router-dom';
import Header from '../layout/header/Header';
import Speech from '../components/speech/SpeechRecognition';
import Auth from '../services/AuthenticationService'

const Layout = () => {

  const socket = useContext(SocketContext);

  const params = useParams();

  useEffect(() => {
    const info = Auth.getitem('userInfo') || {};

    socket.emit("joinclient", info.clientId);
    socket.emit("joincompany", info.companyId);

    return () => {
      socket.emit("leavecompany", info.companyId);
      socket.emit("leaveclient", info.clientId);

      socket.off("leaveclient");
      socket.off("joinclient");

      socket.off("leavecompany");
      socket.off("joincompany");
    }
  }, [])

  useEffect(() => {
    if (params?.id) socket.emit("joinSession", params.id);

    return () => {
      if (params?.id) socket.emit("leaveSession", params.id);
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
      {/* <Speech mode='obey'/> */}
    </>
  )
}

export default Layout
