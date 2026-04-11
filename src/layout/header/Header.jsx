import React, { useContext, useEffect } from "react";
import { styled, alpha } from "@mui/material/styles";
import {
  AppBar, Toolbar, Grid, IconButton,
  Badge, Box, Drawer, Link, Tooltip,
  Stack, Divider, Typography,
} from "../../deps/ui";
import * as iconMapping from "../../assets/icons";
import NavItem from "./NavItem";
import {
  NotificationsNone as NotificationsNoneIcon,
  ChatBubbleOutline as ChatBubbleOutlineIcon,
  PowerSettingsNew as PowerSettingsNewIcon,
  Menu as MenuIcon,
} from "../../deps/ui/icons";
import Auth from "../../services/AuthenticationService";
import { SocketContext } from "../../services/socketService";
import { useNavigate } from "react-router-dom";
import {
  API_USER_LOGOUT, GET_REGULAR_DROPDOWN, GET_ROUTES,
  GET_EMPLOYEE_DATA, GET_PAYROLL_DATA,
} from "../../services/UrlService";
import {
  AppRoutesThunk, CommonDropDownThunk, EmployeeDataThunk,
  PayrollDataThunk, setCommand, useLazySingleQuery,
} from "../../store/actions/httpactions";
import Logo from "../../assets/images/Innovent-logo.png";
import { routeCommand } from "./routecommand";
import { useAppDispatch, useAppSelector } from "../../store/storehook";
import DigitalTimer from "../../components/DigitalTimer";

// ─── Styled AppBar ────────────────────────────────────────────────────────────

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.gradients?.primary ?? theme.palette.primary.main,
  boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
  backdropFilter: 'blur(8px)',
}));

// ─── Nav Icon Button ──────────────────────────────────────────────────────────

const NavIconBtn = styled(IconButton)(({ theme }) => ({
  width: 34,
  height: 34,
  borderRadius: theme.spacing(1),
  color: alpha(theme.palette.primary.contrastText, 0.85),
  transition: 'background 0.15s, color 0.15s',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.contrastText, 0.1),
    color: theme.palette.primary.contrastText,
  },
}));

// ─── Sidebar Drawer ───────────────────────────────────────────────────────────

const SideDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: 248,
    boxShadow: '4px 0 24px rgba(0,0,0,0.12)',
    border: 'none',
    background: theme.palette.background.paper,
  },
  '& .MuiAccordion-root': {
    boxShadow: 'none',
    '&.Mui-expanded': { margin: 0 },
    '& .MuiAccordionSummary-root': {
      '&.Mui-expanded': {
        minHeight: 0,
        color: theme.palette.secondary.contrastText,
        backgroundColor: theme.palette.secondary.main,
        '& .MuiAccordionSummary-expandIconWrapper': {
          color: theme.palette.secondary.contrastText,
        },
      },
      '& .MuiAccordionSummary-content': {
        '&.Mui-expanded': { margin: '12px 0' },
        '& svg': { marginRight: '5px' },
      },
    },
    '& .MuiAccordionDetails-root': {
      padding: 0,
      '& .MuiList-root': {
        padding: theme.spacing(0, 0, 0, 3),
        '& .MuiListItemIcon-root': { minWidth: '30px' },
        '& .MuiListItem-root': {
          '&.active .MuiSvgIcon-root, &.active .MuiTypography-root': {
            color: theme.palette.primary.main,
          },
        },
      },
    },
  },
}));

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Header() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const socket = useContext(SocketContext);

  const sideMenuData = useAppSelector((e) => e.appdata.routeData?.sideMenuData);
  const [userSignOut] = useLazySingleQuery();
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  // ── Init ──
  useEffect(() => {
    dispatch(AppRoutesThunk({ url: GET_ROUTES }))
      .unwrap()
      .then(({ data }) => {
        Auth.setItem("appConfigData", {
          appRoutes: data.appRoutes,
          sideMenuData: data.sideMenuData,
        });
        dispatch(setCommand(routeCommand(data.appRoutes, navigate)));
        dispatch(EmployeeDataThunk({ url: GET_EMPLOYEE_DATA }));
        dispatch(PayrollDataThunk({ url: GET_PAYROLL_DATA }));
        dispatch(CommonDropDownThunk({ url: GET_REGULAR_DROPDOWN }));
      });
    return () => socket.off("leave");
  }, []);

  // ── Socket listeners ──
  useEffect(() => {
    const handler = () => dispatch(CommonDropDownThunk({ url: GET_REGULAR_DROPDOWN }));
    const employeeHandler = () => dispatch(EmployeeDataThunk({ url: GET_EMPLOYEE_DATA }));
    const payrollHandler = () => dispatch(PayrollDataThunk({ url: GET_PAYROLL_DATA }));

    socket.on("changeInAllowance", payrollHandler);
    socket.on("changeInDeduction", payrollHandler);
    socket.on("changeInArea", handler);
    socket.on("changeInCompany", handler);
    socket.on("changeInCountry", handler);
    socket.on("changeInDepartment", handler);
    socket.on("changeInEmployee", employeeHandler);
    socket.on("changeInGroup", employeeHandler);
    socket.on("changeInDesignation", employeeHandler);
    socket.on("changeInSchedule", employeeHandler);

    return () => {
      socket.off("changeInAllowance", payrollHandler);
      socket.off("changeInDeduction", payrollHandler);
      socket.off("changeInArea", handler);
      socket.off("changeInCompany", handler);
      socket.off("changeInCountry", handler);
      socket.off("changeInDepartment", handler);
      socket.off("changeInEmployee", employeeHandler);
      socket.off("changeInGroup", employeeHandler);
      socket.off("changeInDesignation", employeeHandler);
      socket.off("changeInSchedule", employeeHandler);
    };
  }, [socket]);

  // ── Logout ──
  const handleLogout = () => {
    userSignOut({ url: API_USER_LOGOUT }).then(({ isSuccess }) => {
      if (isSuccess) {
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

  return (
    <>
      <StyledAppBar position="static" elevation={0}>
        <Toolbar disableGutters sx={{ px: 1.5, minHeight: '52px !important' }}>
          <Grid container width="100%" alignItems="center" justifyContent="space-between" wrap="nowrap">

            {/* ── Left: Menu + Logo ── */}
            <Grid item>
              <Stack direction="row" alignItems="center" gap={0.5}>
                <Tooltip title="Menu" placement="bottom" arrow>
                  <NavIconBtn onClick={() => setDrawerOpen(true)} size="small">
                    <MenuIcon fontSize="small" />
                  </NavIconBtn>
                </Tooltip>

                <Link
                  onClick={() => navigate("/dashboard")}
                  sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', ml: 0.5 }}
                  underline="none"
                >
                  <Box
                    component="img"
                    src={Logo}
                    alt="Logo"
                    sx={{ height: 36, width: 'auto', objectFit: 'contain' }}
                  />
                </Link>
              </Stack>
            </Grid>

            {/* ── Center: Digital Timer ── */}
            <Grid item sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center' }}>
              <DigitalTimer />
            </Grid>

            {/* ── Right: Action Icons ── */}
            <Grid item>
              <Stack direction="row" alignItems="center" gap={0.25}>

                <Tooltip title="Notifications" placement="bottom" arrow>
                  <NavIconBtn size="small">
                    <Badge
                      badgeContent={4}
                      color="error"
                      sx={{
                        '& .MuiBadge-badge': {
                          fontSize: '0.6rem',
                          height: 15,
                          minWidth: 15,
                          padding: '0 3px',
                        }
                      }}
                    >
                      <NotificationsNoneIcon fontSize="small" />
                    </Badge>
                  </NavIconBtn>
                </Tooltip>

                <Tooltip title="Messages" placement="bottom" arrow>
                  <NavIconBtn size="small">
                    <Badge
                      badgeContent={3}
                      color="error"
                      sx={{
                        '& .MuiBadge-badge': {
                          fontSize: '0.6rem',
                          height: 15,
                          minWidth: 15,
                          padding: '0 3px',
                        }
                      }}
                    >
                      <ChatBubbleOutlineIcon fontSize="small" />
                    </Badge>
                  </NavIconBtn>
                </Tooltip>

                <Box sx={{ width: 1, height: 20, bgcolor: alpha('#fff', 0.2), mx: 0.5 }} />

                <Tooltip title="Sign Out" placement="bottom" arrow>
                  <NavIconBtn size="small" onClick={handleLogout}>
                    <PowerSettingsNewIcon fontSize="small" />
                  </NavIconBtn>
                </Tooltip>

              </Stack>
            </Grid>

          </Grid>
        </Toolbar>
      </StyledAppBar>

      {/* ── Sidebar Drawer ── */}
      <SideDrawer
        anchor="left"
        open={drawerOpen}
        transitionDuration={{ exit: 300, enter: 250 }}
        onClose={() => setDrawerOpen(false)}
      >
        {/* Drawer Header */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1,
          bgcolor: 'secondary.main',
          minHeight: 52,
        }}>
          <Box
            component="img"
            src={Logo}
            alt="Logo"
            sx={{ height: 32, width: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
          />
          <IconButton
            size="small"
            onClick={() => setDrawerOpen(false)}
            sx={{ color: alpha('#fff', 0.8), '&:hover': { color: '#fff' } }}
          >
            <MenuIcon fontSize="small" />
          </IconButton>
        </Box>

        <Divider />

        {/* Nav Items */}
        <Box
          role="presentation"
          onKeyDown={() => setDrawerOpen(false)}
          sx={{ overflowY: 'auto', flex: 1 }}
        >
          {sideMenuData?.map((item) => (
            <NavItem
              key={item.title}
              title={item.title}
              tabClick={() => setDrawerOpen(false)}
              icon={iconMapping[item.icon]}
              routeTo={item.routeTo}
              isChildren={item?.children?.length > 0}
              routes={item?.children}
            />
          ))}
        </Box>
      </SideDrawer>
    </>
  );
}