import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import { history } from "../config/appconfig";
import Routes from "../router";
import { createTheme, ThemeProvider } from "../deps/ui";
import GlobalStyles from '../layout/styles/GlobalStyles';
import { Provider } from "react-redux";
import { store } from "../store/reducers/store";
import {SocketContext,appsocket } from '../services/socketService';
import { SnackbarProvider } from 'notistack';


// #fafafa
const theme = createTheme({
  palette: {
    type:"light",
    primary: {
      dark:"#11a036",
      main: "#37b057",
      light: "#3c44b126",
    },
    secondary: {
      main: "#f83245",
      light: "#f8324526",
    },
    background: {
      default: "#f4f5fd",
      light: '#fff',
    },
  },
  overrides: {
    MuiAppBar: {
      root: {
        transform: "translateZ(0)",
      },
    },
  },
  props: {
    MuiIconButton: {
      disableRipple: true,
    },
  },
});




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
        <Router history={history}>
        <Provider store={store}>
          <SocketContext.Provider value={appsocket}>
                <GlobalStyles/>
                <Routes />
          </SocketContext.Provider>
          </Provider >
        </Router>
      </SnackbarProvider>
    </ThemeProvider>
   
  );
}

export default App;
