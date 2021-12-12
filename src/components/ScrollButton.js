import React, { useRef } from 'react'
import { IconButton, makeStyles,Button } from '@material-ui/core';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles(theme => ({
    root: {
        top: theme.spacing(9)
    },
    button: {
        padding: '10px 8px',
        justifyContent: 'flex-start',
        boxShadow:"0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)",
        '&:hover':{
          backgroundColor: "#37b0577a"
        },
        minWidth:33,
        "& .MuiSvgIcon-root":{
            fontSize:24
        },
        '& .MuiButton-startIcon':{
            margin: 0,
          }
      },
}))

export default function Scroll({direction="right",orientaion="vertical",children,...others}) {

    const classes = useStyles();
    const scrollref = useRef(null);

    const handleButton = (_direction) => {
        if(_direction === "right"){
            scrollref.current && (scrollref.current.scrollLeft += 200)
        }
        else{
            scrollref.current && (scrollref.current.scrollLeft -= 200)
        }
    }

    return (
        <>
        <Button className={classes.button} startIcon={
            <ExpandLessIcon  />
        } onClick={() => handleButton("left")}/>
            <div ref={scrollref} style={{height:500,overflow:'hidden'}}>
               {children}
            </div>
            <Button className={classes.button} startIcon={ <ExpandMoreIcon />} 
            onClick={() => handleButton("right")}  aria-label="down"/>
              
            
        </>
    )
}
