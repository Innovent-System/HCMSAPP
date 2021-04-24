import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Grid } from '@material-ui/core';


{/* <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                zIndex: 10000,
                backgroundColor: "#FFF",
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                justifyContent: "center",
                marginTop: "auto",
                marginBottom: "auto",
            }}
        >
            <CircularProgress
                size="6rem"
                style={{
                    color: "#e8eaef",
                    margin: 0,
                    padding: 0,
                }}
            />
        </div> */}
function CircularLoading() {

  return (
    <Grid
      container
      spacing={0}
      alignItems="center"
      justify="center"
      style={{ minHeight: '100vh' }}
    >
      <CircularProgress/>
    </Grid>
  )
}

export default CircularLoading;