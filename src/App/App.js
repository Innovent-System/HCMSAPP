import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
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
    mode:"light",
    primary: {
      light: "#9162e4",
      main: "#5e35b1",
      dark: "#280680",
      contrastText: "#ffffff",
    },
    secondary: {
      light: "#e7b9ff",
      main: "#b388ff",
      dark: "#805acb",
      contrastText: "#000000",
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
        <Router>
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