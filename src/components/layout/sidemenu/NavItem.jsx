import React, { useState } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Button,
  ListItem,
  makeStyles,List,Collapse, Divider,Tooltip
} from '@material-ui/core';
import { ExpandLess as ExpandLessIcon,ExpandMore as ExpandMoreIcon } from '@material-ui/icons';
import * as iconMapping from '../../../assests/icons';

const titleColor = "#7c828d";


const useStyles = makeStyles((theme) => ({
  item: {
    display: 'flex',
    paddingTop: 0,
    paddingBottom: 0
  },
  button: {
    color: titleColor,
    fontWeight: theme.typography.fontWeightRegular,
    justifyContent: 'flex-start',
    letterSpacing: 0,
    padding: '10px 8px',
    textTransform: 'none',
    width: '100%',
    '&:hover':{
      backgroundColor: "#37b0577a"
    },
    
    minWidth:33
  },
  startIcon:{
    marginLeft:0
  },
  icon: {
    marginRight: theme.spacing(1)
  },
  title: {
    marginRight: 'auto',
    fontSize:12
  },
  active: {
    color: "#37b057",
    '& $title': {
      fontWeight: theme.typography.fontWeightMedium
    },
    '& $icon': {
      color: "#37b057"
    }
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  dividerColor:{
    backgroundColor:'#3a3b3c'
  }
}));

const NavItem = ({
  routeTo,
  icon: Icon,
  title,
  children,
  isShowToolTip,
  ...rest
}) => {
  
  const classes = useStyles();
    console.log("nav item");
  const MenuItemRoot = (
    <ListItem {...rest}
    button
    className={classes.item}
    disableGutters
  >
    <Tooltip title={title} disableHoverListener={isShowToolTip} aria-label={title}>
    {routeTo ? <Button
      activeClassName={classes.active}
      className={classes.button}
      classes={{
        startIcon: classes.startIcon,
      }}
      component={RouterLink}
      to={routeTo}
      startIcon={<Icon
        className={classes.icon}
        style={{fontSize:24}}
        fontSize="large"
      />}
      
      
    >
      <span className={classes.title}>
        {title}
      </span>        
    </Button> : <Button 
      
      className={classes.button}
      classes={{
        startIcon: classes.startIcon,
      }}
      startIcon={<Icon
        className={classes.icon}
        style={{fontSize:24}}
        fontSize="large"
      />}
      
      
    >
      <span className={classes.title}>
        {title}
      </span>        
    </Button> }
    
    </Tooltip>
  </ListItem>
  )

  
  return (
    <>
      {MenuItemRoot}
    </>
  )
  
};

NavItem.propTypes = {
  children:PropTypes.array,
  routeTo: PropTypes.string,
  icon: PropTypes.elementType,
  title: PropTypes.string.isRequired,
};
NavItem.defaultProps = {
  isShowToolTip:true
}


export default NavItem;
