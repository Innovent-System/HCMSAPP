import React, { useEffect, lazy, Suspense } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import Controls from '../../controls/Controls';
import UseSkeleton from '../../UseSkeleton';

import {
  Avatar,
  Box,
  Divider,
  Drawer,
  Hidden,
  List,
  Typography,
  makeStyles,
  Button
} from '@material-ui/core';

import {
  //   AlertCircle as AlertCircleIcon,
  BarChart as BarChartIcon,
  // Lock as LockIcon,
  Settings as SettingsIcon,
  Person as UserIcon,
  // UserPlus as UserPlusIcon,
  Group as UsersIcon
} from '@material-ui/icons';
import NavItem from './NavItem';
import Skeleton from '@material-ui/lab/Skeleton'
import ApartmentIcon from '@material-ui/icons/Apartment';


const user = {
  avatar: '/static/images/avatars/Profile.jpg',
  jobTitle: 'Senior Developer',
  name: 'Faizan Siddiqui'
};
// const items = [
//   {
//     routeTo: '/dashboard',
//     icon: BarChartIcon,
//     title: 'Dashboard',
//     children:[]
//   },
//   {
//     icon: UsersIcon,
//     title: 'Employee',
//     children:[{routeTo:'/employeelist',title:"Employee List",icon: UsersIcon},
//     {routeTo:'/employeerole',title:"Employee Role",icon: UsersIcon}]
//   },
//   {
//     routeTo: '/attendance',
//     icon: ApartmentIcon,
//     title: 'Attendance',
//     children:[]
//   },
//   {
//     routeTo: '/leave',
//     icon: UserIcon,
//     title: 'Leave',
//     children:[]
//   },
//   {
//     routeTo: '/settings',
//     icon: SettingsIcon,
//     title: 'Settings',
//     children:[]
//   },
  // {
  //   routeTo: '/login',
  //   icon: LockIcon,
  //   title: 'Login'
  // },
  // {
  //   routeTo: '/register',
  //   icon: UserPlusIcon,
  //   title: 'Register'
  // },
  // {
  //   routeTo: '/404',
  //   icon: AlertCircleIcon,
  //   title: 'Error'
  // }
// ];



const NavBar = ({ sideMenuStyles, open, sideMenuData }) => {
  const classes = sideMenuStyles();
  console.log(sideMenuData);
  const content = (
    <Box
      height="100%"
      display="flex"
      flexDirection="column"
      style={{ backgroundColor: "#232329", color: "#c8c8c8" }}
    >

      <Controls.Button

        startIcon={<Avatar
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


      <Box p={2}>
        <Divider />

        <List component="nav" className={classes.appMenu}>
          {sideMenuData.length == 0 ? <UseSkeleton  height={20} width="100%" style={{ marginBottom: 6 }} />
          : sideMenuData.map((item) =>
          (<NavItem
            routeTo={item?.routeTo}
            key={item.title}
            title={item.title}
            icon={() => <DynamicLoader component={item.icon}/>}
            children={item?.children}
          />)
          )}
        </List>
      </Box>
      <Box flexGrow={1} />

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
      </Hidden>
    </>
  );
};

function DynamicLoader(props) {

  const LazyComponent = lazy(() => import(`@material-ui/icons/${props.component}`));
  return (
    <Suspense fallback={<CircularProgress />}>
      <LazyComponent />
    </Suspense>
  );
}

NavBar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

NavBar.defaultProps = {
  onMobileClose: () => { },
  openMobile: false
};

export default NavBar;
