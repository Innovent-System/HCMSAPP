
import clsx from 'clsx';
import PropTypes from 'prop-types';
import Controls from '../../components/controls/Controls';
import UseSkeleton from '../../components/UseSkeleton';
import * as iconMapping from '../../assests/icons';
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  Hidden,
  List,
  Typography,Paper
} from '@material-ui/core';
import avatar from '../../assests/images/avatar_6.png';
import NavItem from './NavItem';
import { useEffect, useState } from 'react';


const user = {
  avatar: avatar,
  jobTitle: 'Senior Developer',
  name: 'Faizan Siddiqui'
};


const SideBar = ({ sideMenuStyles, open, sideMenuData }) => {
  
  const classes = sideMenuStyles();
  const [subMenu,setSubMenu] = useState([]);
  
  const handleSubMenu = (subMenuList = [],title = "") => {
    if(!subMenuList && !subMenuList.length > 0) return null;
    const list = (
      <List subheader={<Typography  color='textSecondary' style={{paddingLeft:'3%'}} variant="h5" gutterBottom>
        {title}
      </Typography>} component="div" disablePadding>
        {subMenuList.map((item,index) => (
          <div  key={item.title}>
            <NavItem
              routeTo={`${item?.routeTo}/${encodeURIComponent(item._id)}`}
              title={item.title}
              icon={iconMapping[item.icon]}
              children={item?.children}
            />
            <Divider className={classes.dividerColor}  />
        </div>
        ))}
        
      </List>
    );

    setSubMenu(list);
  }

  useEffect(() => {
     const url = window.location.pathname.split("/")[1];
     if(url.toLowerCase() === "dashboard") return;
     
    for (let index = 0; index < sideMenuData.length; index++) {
        const element = sideMenuData[index];
        if(element.children && element.children.length && element.children.find(f => f.routeTo.match(url)))
        {
          handleSubMenu(element.children,element.title);
          break;
        }
    }
    
  }, [])

  const content = (
    <Box
      height="100%"
      display="flex"
      flexDirection="column"
      style={{ backgroundColor: "#232329", color: "#c8c8c8" }}
    >
      
      <Controls.Button
        size="small" style={{ minWidth: 49 }}
        startIcon={<Avatar style={{ marginLeft: open ? 0 : 9 }}
          src={user.avatar}
        />} color="default" text={
          (open ?
            <Typography
              className={classes.name}
              color="initial"
              variant="h6"
            >
              {user.name}
              <Typography
                color="initial"
                variant="body2"
              >
                {user.jobTitle}
              </Typography>
            </Typography> : null)
        } />


      <Box padding="0 7px">
        <Divider />

        <List  component="nav" >
          {sideMenuData.length == 0 ? <UseSkeleton count={6} s_height={20} width="100%" style={{ marginBottom: 6 }} />
            : sideMenuData.map((item,index) =>
            (<NavItem
              routeTo={(item?.children && item?.children.length) ? `${item?.routeTo}/${encodeURIComponent(item.children[0]._id)}` : item?.routeTo}
              key={item.title}
              title={item.title}
              icon={iconMapping[item.icon]}
              children={item?.children}
              isShowToolTip={false}
              onClick={() => handleSubMenu(item?.children,item.title)}
            />)
            )}
        </List>
      </Box>
     
            
      </Box>
  );


  

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          classes={{ paper: classes.mobileDrawer }}
          variant="temporary"
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden xsDown>
        <Drawer
          anchor="left"
          open
          variant="persistent"
          className={clsx(classes.desktopDrawer, {
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          })}
          classes={{
            paper: clsx({
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open,
            }),
          }}
        >
          {content}
        </Drawer>
        {subMenu && window.location.pathname !== "/dashboard" &&  <Box component={Paper} minWidth={220} height='max-content' elevate={2} margin="8px 0 8px 8px" padding="12px">        
          {subMenu}
        </Box> } 
      </Hidden>
    </>
  );
};

SideBar.propTypes = {
  sideMenuData: PropTypes.array.isRequired
};

SideBar.defaultProps = {
  sideMenuData:[]
};

export default SideBar;
