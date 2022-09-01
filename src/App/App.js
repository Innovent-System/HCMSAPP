import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "../router";
import { ThemeProvider } from "../deps/ui";
import GlobalStyles from '../layout/styles/GlobalStyles';
import { Provider } from "react-redux";
import { store } from "../store/reducers/store";
import { SocketContext, appsocket } from '../services/socketService';
import { SnackbarProvider } from 'notistack';
import { theme } from '../config/theme';



function App() {
  useEffect(() => {
    appsocket.connect();

    return () => {
      appsocket.disconnect();
    }
  }, [])
  return (

    <ThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={3}>
        <Router>
          <Provider store={store}>
            <SocketContext.Provider value={appsocket}>
              <GlobalStyles />
              <Routes />
            </SocketContext.Provider>
          </Provider >
        </Router>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;