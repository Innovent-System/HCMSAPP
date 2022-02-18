import React, { useContext, useEffect } from "react";
import {
    AppBar,
    Toolbar,
    Grid,
    InputBase,
    IconButton,
    Badge,
    TextField,
    Box,
    Drawer, List, ListItem, ListItemIcon, ListItemText, Typography
} from "../../deps/ui";
import { NavLink as RouterLink } from 'react-router-dom';
import * as iconMapping from '../../assests/icons';
import NavItem from './NavItem';

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
import FilterListIcon from "@mui/icons-material/FilterList";
import { useSelector } from 'react-redux'

// Accordian
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// Icons
import GridViewIcon from "@mui/icons-material/GridView";

const headerStyles = {
    Appbar: {
        "& button, & input": {
            color: "#fff",
            borderColor: "#fff",
        },
        '& img[alt="Logo"]': {
            width: 130,
            height: 45,
            filter: "grayscale(1) invert(1)",
        },
        "& .left": {
            display: "inline-flex",
        },
        "& .right": {
            display: "inline-flex",
            justifyContent: "flex-end",
        },
    },
    Drawer: {
        "& .MuiAccordion-root": {
            boxShadow: "none",
            "&.Mui-expanded": {
                margin: 0,
            },
            "& .MuiAccordionSummary-root": {
                "&.Mui-expanded": {
                    minHeight: 0,
                    backgroundColor: "#eee",
                },
                "& .MuiAccordionSummary-content": {
                    "&.Mui-expanded": {
                        margin: "15px 0",
                    },
                    "& svg": {
                        marginRight: "5px",
                    },
                },
            },
            "& .MuiAccordionDetails-root": {
                padding: 0,
                "& .MuiList-root": {
                    padding: 0,
                    "& .MuiListItemIcon-root": {
                        minWidth: "30px",
                    },
                },
            },
        },
    },
};


export default function Header() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const socket = useContext(SocketContext);
    const sideMenuData = useSelector(e => {
        return e.auth.routeData?.sideMenuData ||
            (Auth.getitem("appConfigData")?.sideMenuData || [])
    });
    useEffect(() => {
        dispatch(handleGetCommonDropDown(GET_REGULAR_DROPDOWN));
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
        <div sx={headerStyles.root}>
            <AppBar
                sx={headerStyles.Appbar}
                position="static"
                elevation={2}
                color="primary">
                <Toolbar disableGutters>
                    <Grid container alignItems="center">
                        <Grid item xs className="left">
                            <IconButton
                                onClick={toggleSidebar("left", true)}
                                color="secondary">
                                <FormatListBulletedIcon />
                            </IconButton>
                            <img src={Logo} alt="Logo" />
                        </Grid>
                        <Grid item xs className="center">
                            <InputBase
                                placeholder="Search"
                                startAdornment={
                                    <SearchIcon fontSize="small" color="secondary" />
                                }
                                fullWidth
                                color="inherit"
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs className="right">
                            <IconButton>
                                <Badge badgeContent={4}>
                                    <NotificationsNoneIcon fontSize="small" />
                                </Badge>
                            </IconButton>
                            <IconButton>
                                <Badge badgeContent={3}>
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
            <div className="sidebar">
                <Drawer
                    sx={headerStyles.Drawer}
                    anchor={"left"}
                    open={state.left}
                    onClose={toggleSidebar("left", false)}>
                    <Box
                        sx={{ width: 250 }}
                        role="presentation"
                        //onClick={toggleSidebar("left", false)}
                        onKeyDown={toggleSidebar("left", false)}>
                        {sideMenuData.map(item => <NavItem
                            key={item.title}
                            title={item.title}
                            icon={iconMapping[item.icon]}
                            routes={item?.children}
                        />)}
                    </Box>
                </Drawer>
            </div>
            <div className="filterbar">
                <Drawer
                    sx={headerStyles.Drawer}
                    anchor={"right"}
                    open={state.right}
                    onClose={toggleSidebar("right", false)}>
                    <Box
                        sx={{ width: 250 }}
                        role="presentation"
                        //onClick={toggleSidebar("right", false)}
                        onKeyDown={toggleSidebar("right", false)}>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel11a-content"
                                id="panel1a-header">
                                <GridViewIcon />
                                <Typography> Dates:</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <div style={{ padding: 15 }}>
                                    <TextField
                                        label="From"
                                        id="outlined-size-small"
                                        defaultValue="Enter Date"
                                        size="small"
                                        style={{ marginBottom: 15 }}
                                    />
                                    <TextField
                                        label="To"
                                        id="outlined-size-small"
                                        defaultValue="Enter Date"
                                        size="small"
                                    />
                                </div>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel12a-content"
                                id="panel2a-header">
                                <GridViewIcon />
                                <Typography> Amount</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <div style={{ padding: 15 }}>
                                    <TextField
                                        label="From"
                                        id="outlined-size-small"
                                        defaultValue="4200"
                                        size="small"
                                        style={{ marginBottom: 15 }}
                                    />
                                    <TextField
                                        label="To"
                                        id="outlined-size-small"
                                        defaultValue="4600"
                                        size="small"
                                    />
                                </div>
                            </AccordionDetails>
                        </Accordion>
                    </Box>
                </Drawer>
            </div>
        </div>
    );
}
