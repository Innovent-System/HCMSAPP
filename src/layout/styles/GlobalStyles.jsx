import { createStyles, makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => createStyles({
  '@global': {
    '*': {
      boxSizing: 'border-box',
      margin: 0,
      padding: 0,
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
    ".content-area": {
      height: "calc(100vh - 64px)",
      overflowY: "auto",
      overflowX: "hidden",
      background:"#f3f4f9!important",
      padding: 15,
      '& .MuiBox-root':{
        borderRadius: 15,
        background: '#fff',
        '& .MuiDataGrid-root':{
          borderRadius: 15,
          border: 'none'
        }
      }
     },
     ".page-heading":{
        padding:8,
        marginBottom: 15,
        borderRadius: 15,
        background: '#fff',
        "& .right":{
          textAlign:"right"
        },
        "& .left":{
          textAlign:"left",
          "& h1":{
            fontSize:24
          }
        }
     }
  }
}));

const GlobalStyles = () => {
  useStyles();

  return null;
};

export default GlobalStyles;
