import { useEffect } from "react";

import { BrowserRouter as Router } from "react-router-dom";
import Routes from "./router";
import { ThemeProvider } from "./deps/ui";
import GlobalStyles from './layout/styles/GlobalStyles';
import { Provider } from "react-redux";
import { store } from "./store/store";
import { SocketContext, appsocket } from './services/socketService';
import { SnackbarProvider } from 'notistack';
import { theme1 } from './config/theme';
import { WorkerContext, excelWorker } from './services/workerService'
import Auth from './services/AuthenticationService'



function App() {
  useEffect(() => {
    const initConnection = async () => {
      const info = Auth.getitem('userInfo') || {};

      if (info?.token && appsocket.state === 'Disconnected')
        await appsocket.start();
    };

    initConnection();
    // return () => {
    //   if (appsocket.state !== "Disconnected") {
    //     appsocket.stop();
    //   }
    // };
  }, []);
  return (

    <ThemeProvider theme={theme1}>
      <SnackbarProvider maxSnack={3}>
        <Router>
          <Provider store={store}>
            <WorkerContext.Provider value={{ excelWorker }}>
              <SocketContext.Provider value={appsocket}>
                <GlobalStyles />
                <Routes />
              </SocketContext.Provider>
            </WorkerContext.Provider>
          </Provider >
        </Router>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;