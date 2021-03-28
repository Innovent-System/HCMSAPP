
import clsx from 'clsx';
import PropTypes from 'prop-types';
import Controls from '../../controls/Controls';
import UseSkeleton from '../../UseSkeleton';
import * as iconMapping from '../../../assests/icons';
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  Hidden,
  List,
  Typography
} from '@material-ui/core';

import avatar from '../../../assests/images/avatar_6.png';


import NavItem from './NavItem';

const user = {
  avatar: avatar,
  jobTitle: 'Senior Developer',
  name: 'Faizan Siddiqui'
};

const NavBar = ({ sideMenuStyles, open, sideMenuData }) => {
  const classes = sideMenuStyles();

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


      <Box p={1.5}>
        <Divider />

        <List component="nav" >
          {sideMenuData.length == 0 ? <UseSkeleton count={6} height={20} width="100%" style={{ marginBottom: 6 }} />
            : sideMenuData.map((item) =>
            (<NavItem
              routeTo={item?.routeTo}
              key={item.title}
              title={item.title}
              icon={iconMapping[item.icon]}
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

NavBar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

NavBar.defaultProps = {
  onMobileClose: () => { },
  openMobile: false
};

export default NavBar;
