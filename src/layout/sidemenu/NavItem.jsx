import { NavLink as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Button,
  ListItem,
  Tooltip,
  Box
} from '../../deps/ui';

const titleColor = "#7c828d";

const useStyles = {
  item: {
    display: 'flex',
    paddingTop: 0,
    paddingBottom: 0
  },
  button: {
    color: titleColor,
    justifyContent: 'flex-start',
    padding: '10px 8px',
    '&:hover':{
      backgroundColor: "#37b0577a"
    },
    minWidth:33
  },
  startIcon:{
    marginLeft:0
  },
  icon: {
    marginRight: 1
  },
  title: {
    marginRight: 'auto',
    fontSize:12
  },
  active: {
    color: "#37b057",
    '& $title': {
      fontWeight: 'typography.fontWeightMedium'
    },
    '& $icon': {
      color: "#37b057"
    }
  },
  nested: {
    paddingLeft: 4,
  },
  dividerColor:{
    backgroundColor:'#3a3b3c'
  }
}

const NavItem = ({
  routeTo,
  icon: Icon,
  title,
  children,
  isShowToolTip,
  ...rest
}) => {
  
  const classes = useStyles;
    
  const MenuItemRoot = (
    <ListItem {...rest}
    button
    sx={classes.item}
    disableGutters
  >
    <Tooltip placement="right" title={title} disableHoverListener={isShowToolTip} aria-label={title}>
    {routeTo ? <Button
      sx={{...classes.button,startIcon:classes.startIcon}}
      component={RouterLink}
      to={routeTo}
      startIcon={<Icon
        sx={classes.icon}
        style={{fontSize:24}}
        fontSize="large"
      />}
      
      
    >
      {isShowToolTip &&
      <Box component="span" sx={classes.title}>
      {title}
       </Box> 
      }       
    </Button> : <Button 
      sx={{...classes.button,startIcon:classes.startIcon}}
      startIcon={<Icon
        sx={classes.icon}
        style={{fontSize:24}}
        fontSize="large"
      />}
      
    >
       {isShowToolTip &&
      <Box component="span"  sx={classes.title}>
      {title}
       </Box> 
      }        
    </Button> }
    
    </Tooltip>
  </ListItem>
  )

  
  return MenuItemRoot
  
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
