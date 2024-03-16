import React, { useContext, useEffect } from "react";
import { makeStyles } from "@mui/styles";
import {
  AppBar,
  Toolbar,
  Grid,
  InputBase,
  IconButton,
  Badge,
  Box,
  Drawer,
} from "../../deps/ui";
import * as iconMapping from "../../assets/icons";
import NavItem from "./NavItem";

import {
  NotificationsNone as NotificationsNoneIcon,
  ChatBubbleOutline as ChatBubbleOutlineIcon,
  PowerSettingsNew as PowerSettingsNewIcon,
  Search as SearchIcon,
} from "../../deps/ui/icons";
import Auth from "../../services/AuthenticationService";
import { SocketContext } from "../../services/socketService";
import { useNavigate } from "react-router-dom";
import {
  API_USER_LOGOUT,
  GET_REGULAR_DROPDOWN,
  GET_ROUTES,
  GET_EMPLOYEE_DATA,
  GET_PAYROLL_DATA,
} from "../../services/UrlService";
import {
  AppRoutesThunk,
  CommonDropDownThunk,
  EmployeeDataThunk,
  PayrollDataThunk,
  setCommand,
  useLazySingleQuery,
} from "../../store/actions/httpactions";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import Logo from "../../assets/images/Innovent-logo.png";
// Drawer
import { routeCommand } from "./routecommand";
import { useAppDispatch, useAppSelector } from "../../store/storehook";
import DigitalTimer from "../../components/DigitalTimer";

const useStyles = makeStyles((theme) => ({
  Appbar: {
    backgroundColor: theme.palette.gradients.primary,
    "& button, & input": {
      color: theme.palette.primary.contrastText,
      borderColor: theme.palette.primary.contrastText,
    },
    '& img[alt="Logo"]': {
      width: 165,
      height: 64,
      // filter: "brightness(0) invert(1)",
    },
    "& .left": {
      display: "inline-flex",
    },
    "& .right": {
      display: "inline-flex",
      justifyContent: "flex-end",
      "& .btn-grid": {
        display: "flex",
        columnGap: 2,
      },
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
          color: theme.palette.secondary.contrastText,
          backgroundColor: theme.palette.secondary.main,
          "& .MuiAccordionSummary-expandIconWrapper": {
            color: theme.palette.secondary.contrastText,
          },
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
          padding: theme.spacing(0, 0, 0, 3),
          "& .MuiListItemIcon-root": {
            minWidth: "30px",
          },
          '& .MuiListItem-root': {
            '&.active .MuiSvgIcon-root, &.active .MuiTypography-root': {
              color: theme.palette.primary.main,
            }
          }
        },
      },
    },
  },
}));

export default function Header() {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const socket = useContext(SocketContext);
  const sideMenuData = useAppSelector(
    (e) =>
      e.appdata.routeData?.sideMenuData
  );

  const [userSignOut] = useLazySingleQuery();

  useEffect(() => {
    dispatch(AppRoutesThunk({ url: GET_ROUTES }))
      .unwrap()
      .then((res) => {
        const { data } = res;

        Auth.setItem("appConfigData", {
          appRoutes: data.appRoutes,
          sideMenuData: data.sideMenuData,
        });

        const command = routeCommand(data.appRoutes, navigate);

        dispatch(setCommand(command));
        dispatch(EmployeeDataThunk({ url: GET_EMPLOYEE_DATA }));
        dispatch(PayrollDataThunk({ url: GET_PAYROLL_DATA }));
        dispatch(CommonDropDownThunk({ url: GET_REGULAR_DROPDOWN }));
      });
    return () => {
      return socket.off("leave");
    };
  }, []);

  useEffect(() => {
    const handler = () => {
      dispatch(CommonDropDownThunk({ url: GET_REGULAR_DROPDOWN }));
    };
    const employeeHanlder = () => {
      dispatch(EmployeeDataThunk({ url: GET_EMPLOYEE_DATA }));
    };
    const payrollHandle = () => {
      dispatch(PayrollDataThunk({ url: GET_PAYROLL_DATA }));
    }

    socket.on("changeInAllowance", payrollHandle)
    socket.on("changeInDeduction", payrollHandle)

    socket.on("changeInArea", handler);
    socket.on("changeInCompany", handler);
    socket.on("changeInCountry", handler);
    socket.on("changeInDepartment", handler);

    socket.on("changeInGroup", employeeHanlder);
    socket.on("changeInDesignation", employeeHanlder);

    return () => {
      socket.off("changeInGroup", employeeHanlder);
      socket.off("changeInDesignation", employeeHanlder);
      socket.off("changeInArea", handler);
      socket.off("changeInCompany", handler);
      socket.off("changeInCountry", handler);
      socket.off("changeInDepartment", handler);

      socket.off("changeInAllowance")
      socket.off("changeInDeduction")
    };
  }, [socket]);

  const [state, setState] = React.useState({
    left: false,
    right: false,
  });

  const handleLogout = () => {

    userSignOut({ url: API_USER_LOGOUT }).then((res) => {
      if (res.isSuccess) {
        const info = Auth.getitem("userInfo") || {};
        Auth.remove("appConfigData");

        socket.emit("leaveclient", info.clientId);
        socket.emit("leavecompany", info.companyId);
        socket.off("leaveclient");
        socket.off("leavecompany");

        sessionStorage.clear();
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
    <>
      <AppBar
        className={classes.Appbar}
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
                startAdornment={<SearchIcon fontSize="small" color="primary" />}
                fullWidth
                color="inherit"
                variant="outlined"
              />

            </Grid>
            <Grid item xs>
              <DigitalTimer />
            </Grid>
            <Grid item xs className="right">
              <div className="btn-grid">
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
              </div>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.Drawer}
        anchor={"left"}
        open={state.left}
        transitionDuration={{ exit: 800, enter: 500 }}
        onClose={toggleSidebar("left", false)}>
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onKeyDown={toggleSidebar("left", false)}>
          {sideMenuData.map((item) => (
            <NavItem
              key={item.title}
              title={item.title}
              tabClick={toggleSidebar("left", false)}
              icon={iconMapping[item.icon]}
              routes={item?.children}
            />
          ))}
        </Box>
      </Drawer>
    </>
  );
}
