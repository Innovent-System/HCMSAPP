import React, { useContext, useEffect } from "react";
import { styled, alpha, useTheme } from "@mui/material/styles";
import { AppBar, Toolbar, Grid, IconButton, Badge, Box, Tooltip, Stack } from "../../deps/ui";
import {
  NotificationsNone as NotificationsNoneIcon,
  ChatBubbleOutline as ChatBubbleOutlineIcon,
  PowerSettingsNew as PowerSettingsNewIcon,
  Menu as MenuIcon,
} from "../../deps/ui/icons";
import Auth from "../../services/AuthenticationService";
import { SocketContext } from "../../services/socketService";
import { useNavigate } from "react-router-dom";
import { API_USER_LOGOUT, GET_REGULAR_DROPDOWN, GET_ROUTES, GET_EMPLOYEE_DATA, GET_PAYROLL_DATA } from "../../services/UrlService";
import {
  AppRoutesThunk,
  CommonDropDownThunk,
  EmployeeDataThunk,
  PayrollDataThunk,
  setCommand,
  useEntityAction,
  useLazySingleQuery,
} from "../../store/actions/httpactions";
import { attendanceCommand, routeCommand } from "./routecommand";
import { useAppDispatch } from "../../store/storehook";
import DigitalTimer from "../../components/DigitalTimer";
import { setMarkDetail } from "@/store/slicer/attendance";


// ============================================================
// APP BAR
// ============================================================

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor:
    theme.palette.custom.shell,        // was gradients.primary ?? primary.main

  borderBottom:
    `1px solid ${theme.palette.custom.shellBrd}`,   // was heavy boxShadow

  boxShadow: 'none',                     // consistent with flat MuiPaper style elsewhere

  zIndex: theme.zIndex.drawer + 1,
}));


// ============================================================
// HEADER BUTTON
// ============================================================

const NavIconBtn = styled(IconButton)(({ theme }) => ({
  width: 34,
  height: 34,

  borderRadius: theme.spacing(1),

  color: alpha(
    theme.palette.primary.contrastText,
    0.85
  ),

  transition:
    "background 0.15s, color 0.15s",

  "&:hover": {
    backgroundColor:
      alpha(
        theme.palette.primary.contrastText,
        0.1
      ),

    color:
      theme.palette.primary.contrastText,
  },
}));


// ============================================================
// HEADER
// ============================================================

export default function Header({
  onMenuClick,
}) {

  const dispatch = useAppDispatch();

  const navigate = useNavigate();
  const theme = useTheme();
  const socket = useContext(SocketContext);

  const [userSignOut] =
    useLazySingleQuery();

  const { addEntity } =
    useEntityAction();


  // ========================================================
  // ATTENDANCE COMMAND
  // ========================================================

  const handleMarkAttendance = (data) => {

    dispatch(
      setMarkDetail({
        start: new Date(data.start),
        end: data.end
          ? new Date(data.end)
          : null,
      })
    );
  };


  // ========================================================
  // INIT
  // ========================================================

  useEffect(() => {

    dispatch(
      AppRoutesThunk({
        url: GET_ROUTES,
      })
    )
      .unwrap()
      .then(({ data }) => {

        Auth.setItem(
          "appConfigData",
          {
            appRoutes:
              data.appRoutes,

            sideMenuData:
              data.sideMenuData,
          }
        );


        const command = [
          ...routeCommand(
            data.appRoutes,
            navigate
          ),

          ...attendanceCommand({
            addEntity,
            onSuccess:
              handleMarkAttendance,
          }),
        ];


        dispatch(
          setCommand(command)
        );


        dispatch(
          EmployeeDataThunk({
            url: GET_EMPLOYEE_DATA,
          })
        );


        dispatch(
          PayrollDataThunk({
            url: GET_PAYROLL_DATA,
          })
        );


        dispatch(
          CommonDropDownThunk({
            url: GET_REGULAR_DROPDOWN,
          })
        );

      });

  }, []);


  // ========================================================
  // DATA REFRESH
  // ========================================================

  const handler = () => {

    dispatch(
      CommonDropDownThunk({
        url: GET_REGULAR_DROPDOWN,
      })
    );

  };


  const employeeHandler = () => {

    dispatch(
      EmployeeDataThunk({
        url: GET_EMPLOYEE_DATA,
      })
    );

  };


  const payrollHandler = () => {

    dispatch(
      PayrollDataThunk({
        url: GET_PAYROLL_DATA,
      })
    );

  };


  // ========================================================
  // SOCKET LISTENERS
  // ========================================================

  useEffect(() => {

    if (!socket) return;


    socket.on(
      "changeInPayrollSetup",
      payrollHandler
    );

    socket.on(
      "changeInAllowance",
      payrollHandler
    );

    socket.on(
      "changeInDeduction",
      payrollHandler
    );

    socket.on(
      "changeInArea",
      handler
    );

    socket.on(
      "changeInCompany",
      handler
    );

    socket.on(
      "changeInCountry",
      handler
    );

    socket.on(
      "changeInDepartment",
      handler
    );

    socket.on(
      "changeInEmployee",
      employeeHandler
    );

    socket.on(
      "changeInGroup",
      employeeHandler
    );

    socket.on(
      "changeInDesignation",
      employeeHandler
    );

    socket.on(
      "changeInSchedule",
      employeeHandler
    );


    return () => {

      socket.off(
        "changeInPayrollSetup",
        payrollHandler
      );

      socket.off(
        "changeInAllowance",
        payrollHandler
      );

      socket.off(
        "changeInDeduction",
        payrollHandler
      );

      socket.off(
        "changeInArea",
        handler
      );

      socket.off(
        "changeInCompany",
        handler
      );

      socket.off(
        "changeInCountry",
        handler
      );

      socket.off(
        "changeInDepartment",
        handler
      );

      socket.off(
        "changeInEmployee",
        employeeHandler
      );

      socket.off(
        "changeInGroup",
        employeeHandler
      );

      socket.off(
        "changeInDesignation",
        employeeHandler
      );

      socket.off(
        "changeInSchedule",
        employeeHandler
      );

    };

  }, [socket]);


  // ========================================================
  // LOGOUT
  // ========================================================

  const handleLogout = () => {

    userSignOut({
      url: API_USER_LOGOUT,
    }).then(({ isSuccess }) => {

      if (isSuccess) {

        Auth.remove(
          "appConfigData"
        );

        socket.stop();

        sessionStorage.clear();

        navigate("/");
      }

    });

  };
  const shellText =
    theme.palette.custom?.shellText ||
    '#FFFFFF';
  const teal =
    theme.palette.primary.main ||
    '#0F9D8A';

  // ========================================================
  // RENDER
  // ========================================================

  return (

    <StyledAppBar
      position="sticky"
      sx={{ border: 0 }}
      elevation={0}
    >

      <Toolbar
        disableGutters
        sx={{
          px: 1.5,
          minHeight:
            "60px !important",
        }}
      >

        <Grid
          container
          width="100%"
          alignItems="center"
          justifyContent="space-between"
          wrap="nowrap"
        >

          {/* ==========================================
                        LEFT
                    ========================================== */}

          <Grid item>

            <Tooltip
              title="Menu"
              placement="bottom"
              arrow
            >

              <NavIconBtn
                onClick={onMenuClick}
                size="small"
              >

                <MenuIcon
                  fontSize="small"
                />

              </NavIconBtn>

            </Tooltip>

          </Grid>


          {/* ==========================================
                        CENTER
                    ========================================== */}

          {/* <Grid
            item
            sx={{
              display: {
                xs: "none",
                sm: "flex",
              },

              alignItems:
                "center",

              position:
                "absolute",

              left: "50%",

              transform:
                "translateX(-50%)",
            }}
          >

            <DigitalTimer />

          </Grid> */}
          <Box
            sx={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',

              display: {
                xs: 'none',
                sm: 'flex',
              },

              alignItems: 'center',
              gap: 1,

              height: 40,

              px: 1.5,

              borderRadius: 2,

              backgroundColor:
                alpha('#FFFFFF', 0.045),

              border:
                `1px solid ${alpha(
                  '#FFFFFF',
                  0.06
                )}`,
            }}
          >

            {/* Live indicator */}

            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',

                backgroundColor:
                  teal,

                boxShadow:
                  `0 0 0 4px ${alpha(
                    teal,
                    0.12
                  )}`,
              }}
            />

            {/*

                        IMPORTANT:
                        Yahan tumhara existing
                        <DigitalTimer />
                        component rahega.

                    */}

            <Box
              sx={{
                color: shellText,
                display: 'flex',
                alignItems: 'center',

                '& > *': {
                  fontSize: {
                    sm: 20,
                    md: 23,
                  },
                },
              }}
            >
              <DigitalTimer />
            </Box>

          </Box>


          {/* ==========================================
                        RIGHT
                    ========================================== */}

          <Grid item>

            <Stack
              direction="row"
              alignItems="center"
              gap={0.25}
            >

              {/* Notifications */}

              <Tooltip
                title="Notifications"
                placement="bottom"
                arrow
              >

                <NavIconBtn
                  size="small"
                >

                  <Badge
                    badgeContent={4}
                    color="error"
                    sx={{
                      "& .MuiBadge-badge":
                      {
                        fontSize:
                          "0.6rem",

                        height: 15,

                        minWidth: 15,

                        padding:
                          "0 3px",
                      },
                    }}
                  >

                    <NotificationsNoneIcon
                      fontSize="small"
                    />

                  </Badge>

                </NavIconBtn>

              </Tooltip>


              {/* Messages */}

              <Box
                sx={{
                  width: 1,
                  height: 20,
                  bgcolor:
                    alpha(
                      "#fff",
                      0.2
                    ),
                  mx: 0.5,
                }}
              />


              {/* Logout */}

              <Tooltip
                title="Sign Out"
                placement="bottom"
                arrow
              >

                <NavIconBtn
                  size="small"
                  onClick={
                    handleLogout
                  }
                >

                  <PowerSettingsNewIcon
                    fontSize="small"
                  />

                </NavIconBtn>

              </Tooltip>

            </Stack>

          </Grid>

        </Grid>

      </Toolbar>

    </StyledAppBar >
  );
}