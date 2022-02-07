import React, { useContext, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Grid,
  InputBase,
  IconButton,
  Badge,
} from "../../deps/ui";
import {
  NotificationsNone as NotificationsNoneIcon,
  ChatBubbleOutline as ChatBubbleOutlineIcon,
  PowerSettingsNew as PowerSettingsNewIcon,
  Search as SearchIcon,
  Dashboard as SubjectIcon,
} from "../../deps/ui/icons";
import Auth from "../../services/AuthenticationService";
import { SocketContext } from "../../services/socketService";
import { useNavigate } from "react-router-dom";
import { API_USER_LOGOUT } from "../../services/UrlService";
import { handleGetActions } from "../../store/actions/httpactions";
import { useDispatch } from "react-redux";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import Logo from "../../assests/images/Logo.png";

// Drawer
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import FilterListIcon from "@mui/icons-material/FilterList";

// Accordian
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// Icons
import GridViewIcon from "@mui/icons-material/GridView";

const headerStyles = {
  appBar: {
    zIndex: "zIndex.drawer" + 1,
    backgroundColor: "#fff",
    '& img[alt="Logo"]': {
      maxWidth: 100,
      marginRight: 20,
    },
  },
  searchInput: {
    opacity: "0.6",
    padding: `0px 1px`,
    fontSize: "0.8rem",
    "&:hover": {
      backgroundColor: "#f2f2f2",
    },
    "& .MuiSvgIcon-root": {
      marginRight: 1,
    },
  },

  root: {
    '& .sidebar':{
      opacity: 0.5,
      '& .MuiAccordionDetails-root':{
        padding: 0,
      }
    }
  }
};

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const socket = useContext(SocketContext);
  useEffect(() => {
    return () => {
      socket.off("leave");
    };
  });

  const [state, setState] = React.useState({
    left: false,
    right: false,
  });

  const handleLogout = () => {
    dispatch(handleGetActions(API_USER_LOGOUT)).then((res) => {
      if (res.isSuccess) {
        const info = Auth.getitem("userInfo") || {};
        Auth.remove("appConfigData");
        socket.emit("leave", info.c_Id);
        localStorage.clear();
        navigate("/");
      }
    });
  };

  const toggleSidebar = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  return (
    <div className={headerStyles.root}>
      <AppBar sx={headerStyles.appBar} position="static" elevation={2}>
        <Toolbar disableGutters>
          <Grid container alignItems="center">
            <Grid style={{ display: "flex" }} item>
              <IconButton onClick={toggleSidebar("left", true)}>
                <FormatListBulletedIcon />
              </IconButton>
              <img src={Logo} alt="Logo" />
              <InputBase
                placeholder="Search topics"
                sx={headerStyles.searchInput}
                startAdornment={<SearchIcon fontSize="small" />}
              />
            </Grid>
            <Grid item sm></Grid>
            <Grid item>
              <IconButton>
                <Badge badgeContent={4} color="secondary">
                  <NotificationsNoneIcon fontSize="small" />
                </Badge>
              </IconButton>
              <IconButton>
                <Badge badgeContent={3} color="primary">
                  <ChatBubbleOutlineIcon fontSize="small" />
                </Badge>
              </IconButton>
              <IconButton onClick={handleLogout}>
                <PowerSettingsNewIcon fontSize="small" />
              </IconButton>
              <IconButton onClick={toggleSidebar("right", true)}>
                <FilterListIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <div sx="sidebar">
        <Drawer
          anchor={"left"}
          open={state.left}
          onClose={toggleSidebar("left", false)}>
          <Box
            sx={{ width: 250 }}
            role="presentation"
            //onClick={toggleSidebar("left", false)}
            onKeyDown={toggleSidebar("left", false)}>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header">
                <GridViewIcon style={{ marginRight: 5 }} />
                <Typography> Dashboard</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <InboxIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Option One"} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <InboxIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Option One"} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <InboxIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Option One"} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <InboxIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Option One"} />
                  </ListItem>
                </List>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2a-content"
                id="panel2a-header">
                <Typography>Accordion 2</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
                  eget.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Box>
        </Drawer>
      </div>
      <div className="filterbar">
        <Drawer
          anchor={"right"}
          open={state.right}
          onClose={toggleSidebar("right", false)}>
          <Box
            sx={{ width: 250 }}
            role="presentation"
            //onClick={toggleSidebar("right", false)}
            onKeyDown={toggleSidebar("right", false)}></Box>
        </Drawer>
      </div>
    </div>
  );
}
