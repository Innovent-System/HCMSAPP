import { Paper } from '../deps/ui';
import { useEffect, useContext } from 'react';
import { SocketContext } from '../services/socketService';
import { Outlet, useParams } from 'react-router-dom';
import Header from '../layout/header/Header';
import Speech from '../components/speech/SpeechRecognition';
import Auth from '../services/AuthenticationService'
import BreadCrumbs from '../components/BreadCrumbs';
import LinearLoader from '../components/LinearLoader';

const Layout = () => {

  const socket = useContext(SocketContext);

  const params = useParams();

  // useEffect(() => {
  //   const info = Auth.getitem('userInfo') || {};

  //   socket.emit("joinclient", info.clientId);
  //   socket.emit("joincompany", info.companyId);

  //   return () => {
  //     socket.emit("leavecompany", info.companyId);
  //     socket.emit("leaveclient", info.clientId);

  //     socket.off("leaveclient");
  //     socket.off("joinclient");

  //     socket.off("leavecompany");
  //     socket.off("joincompany");
  //   }
  // }, [])

  useEffect(() => {
    const joinForm = async () => {
      if (!params?.id) return;

      if (socket.state === 'Connected')
        await socket.invoke("JoinForm", params.id);
      else
        socket.onreconnected(() => socket.invoke("JoinForm", params.id));
    };

    joinForm();

    return () => {
      if (params?.id && socket.state === 'Connected')
        socket.invoke("LeaveForm", params.id);
    };
  }, [params?.id]);

  return (
    <>
      <Header />
      <LinearLoader />
      <Paper className={"content-area"}>
        {/* <BreadCrumbs /> */}
        <Outlet />
      </Paper>
      <Speech mode='command' />
    </>
  )
}

export default Layout
