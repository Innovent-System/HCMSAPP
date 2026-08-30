import { Paper, Box } from '../deps/ui';
import { useEffect, useContext, useState } from 'react';
import { SocketContext } from '../services/socketService';
import { Outlet, useParams } from 'react-router-dom';
import Header from '../layout/header/Header';
import VHeader from '../layout/header/VHeader';
import Speech from '../components/speech/SpeechRecognition';
import Auth from '../services/AuthenticationService'
import BreadCrumbs from '../components/BreadCrumbs';
import LinearLoader from '../components/LinearLoader';
import { useTheme, useMediaQuery } from '@mui/material';
import HRNovaSidebar from './SideBar';
import { useAppSelector } from '@/store/storehook';

const Layout = () => {

  const socket = useContext(SocketContext);
  const params = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    if (isMobile) {
      setMobileSidebarOpen(true);
      return;
    }
    setSidebarOpen(previous => !previous);
  }

  const user = {
    name: 'Ayesha Malik',
    designation: 'Senior QA Engineer',
    initials: 'AM',
  }


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

  // const sideMenuData = [];
  const sideMenuData = useAppSelector((e) => e.appdata.routeData?.sideMenuData);

  return (
    // <>
    //   <Header />
    //   <LinearLoader />
    //   <Paper className={"content-area"}>
    //     {/* <BreadCrumbs /> */}
    //     <Outlet />
    //   </Paper>
    //   <Speech mode='command' />
    // </>

    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        bgcolor: '#F7F9FC',
      }}
    >
      <LinearLoader />


      <HRNovaSidebar
        sideMenuData={sideMenuData}
        open={sidebarOpen}
        onToggle={() =>
          setSidebarOpen(
            previous => !previous
          )
        }

        mobileOpen={mobileSidebarOpen}
        onMobileClose={() =>
          setMobileSidebarOpen(false)
        }
        onNavigate={() => {
          if (isMobile) {
            setMobileSidebarOpen(false);
          }
        }}
        user={user}
      />


      <Box
        component="main"
        sx={{
          flex: 1,
          minWidth: 0,
          minHeight: '100vh',
        }}
      >

        {/* Your Header */}

        <VHeader
          onMenuClick={() =>
            isMobile
              ? setMobileSidebarOpen(true)
              : setSidebarOpen(
                (prev) => !prev
              )
          }
        />


        {/* Page */}

        {/* <Box
          sx={{
            p: {
              xs: 2,
              md: 3,
            },
          }}
        > */}
        <Paper className={"content-area"}>
          {/* <BreadCrumbs /> */}
          <Outlet />
        </Paper>
        <Outlet />
        {/* </Box> */}

      </Box>

    </Box>
  )
}

export default Layout
