import { Box,makeStyles } from '@material-ui/core';



const useStyles = makeStyles((theme) => ({
    root: {
      backgroundColor: "#eee",
      height: '100%'
    }
  }));

function ContainerWrapper(props) {
const classes = useStyles();
    const { children } = props;
    return (
        <Box  className={classes.root}>
            {children}
        </Box>
    )
}

export default ContainerWrapper
