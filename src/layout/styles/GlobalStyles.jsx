import { createStyles, makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => createStyles({
  '@global': {
    '*': {
      boxSizing: 'border-box',
      margin: 0,
      padding: 0,
    },

    "*::-webkit-scrollbar": {
      width: "0.4em"
    },
    "*::-webkit-scrollbar-track": {
      boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
      webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)"
    },
    "*::-webkit-scrollbar-thumb": {
      backgroundColor: "rgba(0,0,0,.2)",
      outline: "1px solid slategrey",
      borderRadius: 7
    },

    html: {
      '-webkit-font-smoothing': 'antialiased',
      '-moz-osx-font-smoothing': 'grayscale',
      height: '100%',
      width: '100%'
    },
    body: {
      backgroundColor: '#f4f6f8',
      height: '100%',
      width: '100%'
    },
    a: {
      textDecoration: 'none'
    },
    '#root': {
     height: '100%',
      width: '100%'
    },
    '.clearfix': {
      '&::after':{
        content: '""',
        clear: 'both',
        display: 'table'
      }
    },
    '.main-content':{
      height: 'calc(100vh - 64px)',
      overflow: 'hidden',
      display: 'flex',
      '& .sidebar-area':{
        flex: '0 0 45px',
        maxWidth: 45,
        overflowX: 'hidden',
      },
      '& .content-area':{
        flex: '0 0 calc(100% - 45px)',
        maxWidth: 'calc(100% - 45px)',
      }
    }
  }
}));

const GlobalStyles = () => {
  useStyles();

  return null;
};

export default GlobalStyles;
