import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import { history } from "../config/appconfig";
import Routes from "../router";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import GlobalStyles from '../layout/styles/GlobalStyles';
import { Provider } from "react-redux";
import { store } from "../store/reducers/store";
import {SocketContext,appsocket } from '../services/socketService';
import { SnackbarProvider } from 'notistack';
<<<<<<< HEAD


=======
>>>>>>> c37140075721b87a33d59c4399b5a56d5c631f5f
// #fafafa
const theme = createMuiTheme({
  palette: {
    type:"light",
    primary: {
      dark:"#11a036",
      main: "rgb(0, 171, 85)",
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
