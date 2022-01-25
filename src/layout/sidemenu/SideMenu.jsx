
import PropTypes from 'prop-types';
import Controls from '../../components/controls/Controls';
import UseSkeleton from '../../components/UseSkeleton';
import * as iconMapping from '../../assests/icons';
import ScrollBar from '../../components/ScrollButton'
import {
  Avatar,
  Box,
  Divider,
  ClickAwayListener,
  List,
  Typography,Fade
} from '../../deps/ui';
import avatar from '../../assests/images/avatar_6.png';
import NavItem from './NavItem';
import {  useState } from 'react';


const user = {
  avatar: avatar,
  jobTitle: 'Senior Developer',
  name: 'Faizan Siddiqui'
};

const drawerWidth = 220;

const sideMenuStyles = {
  SubMenu:{
    position: 'fixed',
    width: 200,
    left: 45,
    top: 70,
    height: 'calc(100vh - 70px)',
    overflowY: 'auto',
    background: 'background.light',
    zIndex: 99,
    [`theme.breakpoints.down('sm')`]:{
      top: 58,
      height: 'calc(100vh - 58px)',
    }
  },
  profile:{
    padding: 0,
    margin: 0,
    borderRadius: 0,
    background: 'none',
    minWidth: 45,
    boxShadow: 'none',
    '& .MuiButton-label':{
      padding: 0,
    },
    '& .MuiButton-startIcon':{
      marginRight: 0,
    }
  }
  
};

const SubMenu = ({subMenuList,title}) => {
  const classes = sideMenuStyles;
  const [checked,setChecked] =  useState(true);

return (
  
  <>
  {title !== "DASHBOARD" && 
  <Fade in={checked} timeout={500}>
  <List sx={classes.SubMenu} subheader={<Typography  color='textSecondary' style={{paddingLeft:'3%'}} variant="h5" gutterBottom>
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
        <Divider sx={classes.dividerColor}  />
    </div>
    ))}
    
  </List>
  </Fade>}
  </> )
}


const SideBar = ({ open, sideMenuData }) => {
  
  const classes = sideMenuStyles;
  const [subMenu,setSubMenu] = useState([]);
  
  const handleCloseMenu = ()=>{
    setSubMenu(null);
  }
   
  const handleSubMenu = (subMenuList = [],title = "") => {
    if(title === "DASHBOARD") return setSubMenu(null);
    const list = (
     
      <Fade in={true} timeout={500}>
      <List sx={classes.SubMenu} subheader={<Typography  color='textSecondary' style={{paddingLeft:'3%'}} variant="h5" gutterBottom>
        {title}
      </Typography>} component="div" disablePadding>
        {subMenuList.map((item,index) => (
          <div  key={item.title}>
            <NavItem
              routeTo={`${item?.path.substring(5).toLowerCase()}/${encodeURIComponent(item._id)}`}
              title={item.title}
              icon={iconMapping[item.icon]}
              children={item?.children}
              onClick={handleCloseMenu}
            />
            <Divider sx={classes.dividerColor}  />
        </div>
        ))}
        
      </List>
      </Fade>
      
    );

    setSubMenu(list);
  }

  const content = (
    <ClickAwayListener onClickAway={handleCloseMenu}>
    <Box className="sidebar-area">
       
      <Controls.Button
        size="small" sx={classes.profile}
        startIcon={<Avatar
          src={user.avatar}
        />} color="inherit" text={
          (open ?
            <Typography
              sx={classes.name}
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


      <Box>

        <List  component="nav" >
          <ScrollBar>
          {sideMenuData.length == 0 ? <UseSkeleton count={6} s_height={20} width="100%" style={{ marginBottom: 6 }} />
            : sideMenuData.map((item,index) =>
            (<NavItem
              routeTo={""}
              key={item.title}
              title={item.title}
              icon={iconMapping[item.icon]}
              children={item?.children}
              isShowToolTip={false}
              onClick={() => handleSubMenu(item?.children,item.title)}
            />)
            )}
            </ScrollBar>
        </List>
      </Box>
      {subMenu}
      
      </Box>
      </ClickAwayListener>
  );


  

  return (
    <>
      {content}
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
