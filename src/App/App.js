import React from "react";
import "./App.css";
import { Router } from "react-router-dom";
import history from "../config/history";
import Routes from "../router";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import GlobalStyles from '../components/styles/GlobalStyles';
import { Provider } from "react-redux";
import { store } from "../store/reducers/store"; 


const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#333996",
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
    <ThemeProvider theme={theme}>
      <Router history={history}>
       <Provider store={store}>
          <GlobalStyles/>
          <Routes />
        </Provider >
      </Router>
    </ThemeProvider>
  );
}

export default App;
