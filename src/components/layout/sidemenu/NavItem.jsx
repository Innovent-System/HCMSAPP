import React, { useState } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Button,
  ListItem,
  makeStyles,List,Collapse, Divider
} from '@material-ui/core';
import { ExpandLess as ExpandLessIcon,ExpandMore as ExpandMoreIcon } from '@material-ui/icons';

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
    }
  },
  icon: {
    marginRight: theme.spacing(1),
    fontSize:35
  },
  title: {
    marginRight: 'auto'
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
    background:theme.palette.primary.light
  }
}));

const NavItem = ({
  routeTo,
  icon: Icon,
  title,
  children,
  ...rest
}) => {
  
  const classes = useStyles();
  const [isExpand,setExpand] = useState(false);
  const isExpandable = children && children.length > 0
  const handleMenuList = () => {
    setExpand(!isExpand)
  }

    
  const MenuItemRoot = (
    <ListItem
    button
    className={classes.item}
    disableGutters
    
  >
    {routeTo ? <Button
      activeClassName={classes.active}
      className={classes.button}
      component={RouterLink}
      to={routeTo}
      startIcon={<Icon
        className={classes.icon}
        
      />}
      onClick={handleMenuList}
      endIcon={isExpandable ?  isExpand ?  <ExpandLessIcon  fontSize="large"/> : <ExpandMoreIcon  fontSize="large"/> : null }
    >
      <span className={classes.title}>
        {title}
      </span>        
    </Button> : <Button 
      
      className={classes.button}
      startIcon={<Icon
        className={classes.icon}
        
      />}
      onClick={handleMenuList}
      endIcon={isExpandable ?  isExpand ?  <ExpandLessIcon  fontSize="large"/> : <ExpandMoreIcon  fontSize="large"/> : null }
    >
      <span className={classes.title}>
        {title}
      </span>        
    </Button> }
    
               
  </ListItem>
  )

  const MenuItemChildren = isExpandable ? (
    <Collapse in={isExpand} timeout="auto" unmountOnExit>
      <Divider  className={classes.dividerColor} />
      <List component="div" disablePadding>
        {children.map((item, index) => (
          <NavItem {...item} key={index} />
        ))}
      </List>
      <Divider className={classes.dividerColor}  />
    </Collapse>
  ) : null

  return (
    <>
      {MenuItemRoot}
      {MenuItemChildren}
    </>
  )
  
};

NavItem.propTypes = {
  children:PropTypes.array,
  routeTo: PropTypes.string,
  icon: PropTypes.elementType,
  title: PropTypes.string.isRequired
};

export default NavItem;
