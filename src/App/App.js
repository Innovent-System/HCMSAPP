import React from "react";
import "./App.css";
import { Router } from "react-router-dom";
import history from "../config/history";
import Routes from "../router";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import GlobalStyles from '../components/styles/GlobalStyles';
import { Provider } from "react-redux";
import { store } from "../store/reducers/store"; 

// #fafafa
const theme = createMuiTheme({
  palette: {
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
  return (
    <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Router history={history}>
       <Provider store={store}>
          <GlobalStyles/>
          <Routes />
        </Provider >
      </Router>
    </ThemeProvider>
    </React.StrictMode>
  );
}

export default App;
