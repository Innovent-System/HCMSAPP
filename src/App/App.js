import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "../router";
import { createTheme, ThemeProvider } from "../deps/ui";
import GlobalStyles from '../layout/styles/GlobalStyles';
import { Provider } from "react-redux";
import { store } from "../store/reducers/store";
import { SocketContext, appsocket } from '../services/socketService';
import { SnackbarProvider } from 'notistack';
// #fafafa
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      light: "#0077b6",
      main: "#023e8a",
      dark: "#03045e",
      contrastText: "#ffffff",
    },
    secondary: {
      light: "#0077b6",
      main: "#000",
      dark: "#03045e",
      contrastText: "#ffffff",
    },
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          '&.MuiTypography-h1':{
            fontSize: 28,
            margin: '10px 5px',
          },
          '&.anchor-link': {
            cursor: 'pointer',
            textDecoration: 'underline',
            '&:hover': {
              textDecoration: 'none'
            }
          }
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          '&[data-round="true"]': {
            minWidth: 150,
            borderRadius: 25
          }
        },
      },
    },
    MuiFilledInput: {
      defaultProps: {
        margin: 'dense',
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#FFF'
          }
        },
      },
      defaultProps: {
        margin: 'dense',
      },
    },
    MuiFormHelperText: {
      defaultProps: {
        margin: 'dense',
      },
    },
    MuiIconButton: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiInputBase: {
      defaultProps: {
        margin: 'dense',
      },
    },
    MuiInputLabel: {
      defaultProps: {
        margin: 'dense',
      },
    },
    MuiListItem: {
      defaultProps: {
        dense: true,
      },
    },
    MuiOutlinedInput: {
      defaultProps: {
        margin: 'dense',
      },
    },
    MuiFab: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiTable: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiTextField: {
      defaultProps: {
        margin: 'dense',
      },
    },
    MuiToolbar: {
      defaultProps: {
        variant: 'dense',
      },
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