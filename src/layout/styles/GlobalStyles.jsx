import { createStyles, makeStyles } from '@mui/styles';
import BodyBG from '../../assets/images/bg-0.jpg';
import calcTTF from '../../fonts/calculator.ttf'
const useStyles = makeStyles(() => createStyles({
  '@global': {
    '*': {
      boxSizing: 'border-box',
      margin: 0,
      padding: 0,
    },
    '@font-face': {
      fontFamily: "Calculator",  /*Can be any text*/
      src: `url(${calcTTF}) format("truetype")`
    },
    html: {
      '-webkit-font-smoothing': 'antialiased',
      '-moz-osx-font-smoothing': 'grayscale',
      height: '100%',
      width: '100%'
    },
    body: {
      height: '100%',
      width: '100%',
      '& button:focus, & button:focus-visible': {
        outline: 'none'
      },
      "&::-webkit-scrollbar-track, & div::-webkit-scrollbar-track": {
        "webkitBoxShadow": "inset 0 0 6px rgba(0,0,0,0.3)",
        "backgroundColor": "#F5F5F5",
        "width": "5px",
        "borderRadius": "5px"
      },
      "&::-webkit-scrollbar, & div::-webkit-scrollbar": {
        "width": "5px",
        "backgroundColor": "#F5F5F5"
      },
      "&::-webkit-scrollbar-thumb, & div::-webkit-scrollbar-thumb": {
        "borderRadius": "5px",
        "background": "#FFC107",
        "maxHeight": "100px",
      },
      '& .MuiTabPanel-root': {
        padding: 0,
      }
    },
    a: {
      textDecoration: 'none'
    },
    '#root': {
      height: '100%',
      width: '100%',
      overflow: "hidden"
    },
    '.clearfix': {
      '&::after': {
        content: '""',
        clear: 'both',
        display: 'table'
      }
    },

    ".content-area": {
      background: `url(${BodyBG})`,
      minHeight: "calc(100vh - 48px)",
      overflowY: "auto",
      overflowX: "hidden",
      padding: 15,
      // '& .MuiTabs-root': {
      //   background: 'linear-gradient(to bottom, #ffffff 0%,#e5e5e5 100%)',
      // },
      '& .MuiTabPanel-root': {
        padding: 0,
      },
      '& .MuiDataGrid-root': {
        background: '#fff',
        '& .MuiDataGrid-toolbarContainer': {
          padding: '4px 8px',
          borderBottom: '1px solid #e0e0e0',
        }
      }
      // '& .MuiBox-root': {

      // }
    },
  }
}));

const GlobalStyles = () => {
  useStyles();

  return null;
};

export default GlobalStyles;
