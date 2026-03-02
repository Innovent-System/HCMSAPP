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
  Link,
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
import { routeCommand } from "./routecommand";
import { useAppDispatch, useAppSelector } from "../../store/storehook";
import DigitalTimer from "../../components/DigitalTimer";

const useStyles = makeStyles((theme) => ({
  Appbar: {
    /*
     * ✅ FIX 1 — was: theme.palette.gradients.primary  →  old green gradient
     * Now: frosted white using theme tokens directly
     */
    backgroundColor: `${theme.palette.background.paper} !important`,
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderBottom: `1px solid ${theme.palette.divider} !important`,
    boxShadow: `0 1px 0 ${theme.palette.divider}, 0 2px 8px rgba(0,0,0,0.04) !important`,
    color: `${theme.palette.text.primary} !important`,

    "& button, & input": {
      // ✅ FIX 2 — was: contrastText (white on white = invisible)
      // Now: secondary text from theme
      color: theme.palette.text.secondary,
      borderColor: theme.palette.divider,
    },

    '& img[alt="Logo"]': {
      width: 120,
      height: 48,
      objectFit: "cover",
    },

    "& .left": {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
    },

    "& .right": {
      display: "inline-flex",
      justifyContent: "flex-end",
      "& .btn-grid": {
        display: "flex",
        alignItems: "center",
        columnGap: 6,
      },
    },

    // ✅ FIX 3 — Icon buttons: themed hover state
    "& .MuiIconButton-root": {
      borderRadius: 8,
      border: `1px solid ${theme.palette.divider}`,
      transition: "all 0.15s",
      "&:hover": {
        backgroundColor: theme.palette.custom.p100,
        borderColor: "rgba(26,86,219,0.2)",
        color: `${theme.palette.primary.main} !important`,
      },
    },
  },

  Drawer: {
    /*
     * ✅ FIX 4 — was: no paper override → MUI default white with yellow border bleed
     * Now: explicit theme background + hairline border + elevation shadow
     */
    "& .MuiDrawer-paper": {
      background: theme.palette.background.paper,
      borderRight: `1px solid ${theme.palette.divider}`,
      boxShadow: theme.shadows[8],
    },

    "& .MuiAccordion-root": {
      boxShadow: "none",
      background: "transparent",
      margin: "1px 8px !important",
      borderRadius: "9px !important",
      "&::before": { display: "none" },
      "&.Mui-expanded": {
        margin: "2px 8px !important",
      },

      "& .MuiAccordionSummary-root": {
        borderRadius: 9,
        minHeight: "44px !important",
        padding: "0 10px",
        border: "1px solid transparent",
        transition: "all 0.14s",

        "&:hover": {
          backgroundColor: theme.palette.custom.bg2,
          borderColor: theme.palette.divider,
        },

        /*
         * ✅ FIX 5 — was: theme.palette.secondary.main → dark grey/yellow bg
         *            was: theme.palette.secondary.contrastText → white text on grey
         * Now: primary blue tint from theme.palette.custom.p100
         */
        "&.Mui-expanded": {
          minHeight: "44px !important",
          backgroundColor: `${theme.palette.custom.p100} !important`,
          color: `${theme.palette.primary.main} !important`,
          borderColor: "rgba(26,86,219,0.18) !important",

          "& .MuiAccordionSummary-expandIconWrapper": {
            color: `${theme.palette.primary.main} !important`,
          },
        },

        "& .MuiAccordionSummary-content": {
          margin: "0 !important",
          "&.Mui-expanded": {
            margin: "0 !important",
          },
          "& svg": {
            marginRight: "5px",
          },
        },

        "& .MuiAccordionSummary-expandIconWrapper": {
          color: theme.palette.text.secondary,
        },
      },

      "& .MuiAccordionDetails-root": {
        padding: 0,
        /*
         * ✅ FIX 6 — was: plain white → no separation from parent
         * Now: subtle bg2 fill + left accent border to show hierarchy
         */
        background: theme.palette.custom.bg2,
        borderLeft: `1px solid rgba(26,86,219,0.12)`,
        borderRight: `1px solid rgba(26,86,219,0.12)`,
        borderBottom: `1px solid rgba(26,86,219,0.12)`,
        borderRadius: "0 0 9px 9px",
        overflow: "hidden",

        "& .MuiList-root": {
          padding: theme.spacing(0, 0, 0.5, 0),

          "& .MuiListItemIcon-root": {
            minWidth: "30px",
          },

          "& .MuiListItem-root": {
            margin: "1px 6px",
            borderRadius: 7,
            border: "1px solid transparent",
            transition: "all 0.13s",

            "&:hover": {
              backgroundColor: theme.palette.background.paper,
              borderColor: theme.palette.divider,
            },

            /*
             * ✅ FIX 7 — active item: was only color change on icon/text
             * Now: full blue background pill, matches rest of theme
             */
            "&.active": {
              backgroundColor: theme.palette.custom.p100,
              borderColor: "rgba(26,86,219,0.18)",

              "& .MuiSvgIcon-root": {
                color: `${theme.palette.primary.main} !important`,
              },
              "& .MuiTypography-root": {
                color: `${theme.palette.primary.main} !important`,
                fontWeight: 600,
              },
            },
          },
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
    (e) => e.appdata.routeData?.sideMenuData
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
    };

    socket.on("changeInAllowance", payrollHandle);
    socket.on("changeInDeduction", payrollHandle);
    socket.on("changeInArea", handler);
    socket.on("changeInCompany", handler);
    socket.on("changeInCountry", handler);
    socket.on("changeInDepartment", handler);
    socket.on("changeInEmployee", employeeHanlder);
    socket.on("changeInGroup", employeeHanlder);
    socket.on("changeInDesignation", employeeHanlder);
    socket.on("changeInSchedule", employeeHanlder);

    return () => {
      socket.off("changeInGroup", employeeHanlder);
      socket.off("changeInDesignation", employeeHanlder);
      socket.off("changeInEmployee", employeeHanlder);
      socket.off("changeInSchedule", employeeHanlder);
      socket.off("changeInArea", handler);
      socket.off("changeInCompany", handler);
      socket.off("changeInCountry", handler);
      socket.off("changeInDepartment", handler);
      socket.off("changeInAllowance");
      socket.off("changeInDeduction");
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
        position="sticky"
        elevation={2}       
        color="primary"     
      >
        <Toolbar disableGutters>
          <Grid
            container
            width="100%"
            justifyContent="space-between"
            alignItems="center"
          >
            <Grid item className="left">
              <IconButton
                onClick={toggleSidebar("left", true)}
                size="small"
              >
                <FormatListBulletedIcon fontSize="small" />
              </IconButton>
              <Link onClick={() => navigate("/dashboard")}>
                <img src={Logo} alt="Logo" />
              </Link>
            </Grid>

            <Grid item display={{ xs: "none", sm: "block" }}>
              <DigitalTimer />
            </Grid>

            <Grid item className="right">
              <div className="btn-grid">
                <IconButton size="small">
                  <Badge badgeContent={4} color="error">
                    <NotificationsNoneIcon fontSize="small" />
                  </Badge>
                </IconButton>
                <IconButton size="small">
                  <Badge badgeContent={3} color="error">
                    <ChatBubbleOutlineIcon fontSize="small" />
                  </Badge>
                </IconButton>
                <IconButton size="small" onClick={handleLogout}>
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
        onClose={toggleSidebar("left", false)}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onKeyDown={toggleSidebar("left", false)}
        >
          {sideMenuData.map((item) => (
            <NavItem
              key={item.title}
              title={item.title}
              tabClick={toggleSidebar("left", false)}
              icon={iconMapping[item.icon]}
              routeTo={item.routeTo}
              isChildren={item?.children?.length > 0}
              routes={item?.children}
            />
          ))}
        </Box>
      </Drawer>
    </>
  );
}