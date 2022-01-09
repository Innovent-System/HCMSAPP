import { Box } from '../deps/ui';



const Styles = {
    root: {
      backgroundColor: "#eee",
      height: '100%'
    }
  };

function ContainerWrapper(props) {

    const { children } = props;
    return (
        <Box  sx={Styles.root}>
            {children}
        </Box>
    )
}

export default ContainerWrapper
