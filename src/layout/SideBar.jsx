import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import {
    Box,
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    IconButton,
    Tooltip,
    Popover,
    Divider,
    Avatar,
    useMediaQuery,
    Collapse,
} from '@mui/material';

import {
    ChevronLeft,
    ChevronRight,
    ExpandMore,
    ExpandLess,
} from '@mui/icons-material';

import {
    alpha,
    styled,
    useTheme,
} from '@mui/material/styles';

import {
    NavLink as RouterLink,
    useLocation,
} from 'react-router-dom';

import * as iconMapping from '../assets/icons';

import Logo from "../assets/images/Innovent-logo.png";


// ============================================================
// CONSTANTS
// ============================================================

const DRAWER_WIDTH = 252;
const COLLAPSED_WIDTH = 68;


// ============================================================
// HELPERS
// ============================================================

const capitalize = (value = '') =>
    value.charAt(0).toUpperCase() +
    value.slice(1).toLowerCase();


const getRoutePath = (route) => {

    if (!route?.path)
        return '#';

    const path =
        route.path
            .substring(5)
            .toLowerCase();

    return `${path}/${encodeURIComponent(route.formId)}`;
};


// ============================================================
// SIDEBAR ROOT
// ============================================================

const SidebarRoot = styled(Box)(({ theme }) => ({
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.custom.shell,
    color: theme.palette.sidebar.text,
    borderRight: `1px solid ${theme.palette.custom.shellBrd}`,
    overflow: 'hidden',
    position: 'relative',
    transition:
        theme.transitions.create(
            ['width'],
            {
                duration: 220,
                easing:
                    theme.transitions
                        .easing
                        .easeInOut,
            }
        )

}));


// ============================================================
// HEADER
// ============================================================

const SidebarHeader = styled(Box)(({ theme }) => ({
    height: 64,
    minHeight: 64,
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1.5),
    gap: theme.spacing(1)
}));


// ============================================================
// NAVIGATION
// ============================================================

const NavigationContainer = styled(Box)(({ theme }) => ({
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    scrollbarWidth: 'thin',
    '&::-webkit-scrollbar': { width: 4 },
    '&::-webkit-scrollbar-thumb': {
        backgroundColor: alpha(theme.palette.common.white, 0.12),
        borderRadius: 10
    }
}));


// ============================================================
// SECTION TITLE
// ============================================================

const SectionTitle = styled(Typography)(({ theme }) => ({
    padding: theme.spacing(1.4, 2, 0.6),
    fontSize: '0.61rem',
    fontWeight: 700,
    letterSpacing: '0.10em',
    color: alpha(theme.palette.common.white, 0.38),
    textTransform: 'uppercase'
}));


// ============================================================
// MAIN NAV ITEM
// ============================================================

const MainNavItem = styled(ListItemButton)(
    ({ theme }) => ({
        minHeight: 42,
        margin: theme.spacing(0.25, 0.75),
        padding: theme.spacing(0.65, 1.1),
        borderRadius: 8,
        position: 'relative',
        color: alpha(theme.palette.common.white, 0.72),
        transition:
            theme.transitions.create(
                [
                    'background-color',
                    'color',
                    'transform',
                ],
                {
                    duration: 140,
                }
            ),

        '&:hover': {
            backgroundColor: theme.palette.custom.shellHov,
            color: theme.palette.common.white
        },
        '&.active': {
            backgroundColor: alpha(theme.palette.primary.main, 0.13),
            color: theme.palette.common.white,
            '&::before': {
                content: '""',
                position: 'absolute',
                left: 0,
                top: 7,
                bottom: 7,
                width: 3,
                borderRadius: '0 4px 4px 0',
                backgroundColor: theme.palette.primary.main,
            }
        },
        '&.active .MuiListItemIcon-root': {
            color: theme.palette.primary.light,
        }
    })
);


// ============================================================
// CHILD NAV ITEM
// ============================================================

const ChildNavItem = styled(ListItemButton)(
    ({ theme }) => ({
        minHeight: 36,
        margin: theme.spacing(0.15, 0.75, 0.15, 2.1),
        padding: theme.spacing(0.45, 1),
        borderRadius: 7,
        color: alpha(theme.palette.common.white, 0.58),
        transition:
            theme.transitions.create(
                [
                    'background-color',
                    'color',
                ],
                {
                    duration: 120,
                }
            ),
        '&:hover': {
            backgroundColor: theme.palette.custom.shellHov,
            color: theme.palette.common.white,
        },
        '&.active': {
            backgroundColor: alpha(theme.palette.primary.main, 0.10),
            color: theme.palette.primary.light,
            '& .MuiListItemIcon-root': {
                color: theme.palette.primary.light,
            }
        }
    })
);


// ============================================================
// CHILD CONTAINER
// ============================================================

const ChildrenContainer = styled(Box)(
    ({ theme }) => ({
        position: 'relative',
        marginBottom: 4,
        '&::before': {
            content: '""',
            position: 'absolute',
            left: 28,
            top: 3,
            bottom: 3,
            width: 1,
            backgroundColor: theme.palette.custom.shellBrd,
        }
    })
);


// ============================================================
// PROFILE FOOTER
// ============================================================

const ProfileContainer = styled(Box)(
    ({ theme }) => ({
        padding: theme.spacing(1),
        borderTop: `1px solid ${theme.palette.custom.shellBrd}`
    })
);


const ProfileButton = styled(Box)(
    ({ theme }) => ({
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1),
        minHeight: 48,
        padding: theme.spacing(0.6, 0.75),
        borderRadius: 9,
        cursor: 'pointer',
        transition: 'background-color 120ms ease',
        '&:hover': {
            backgroundColor: theme.palette.custom.shellHov
        }
    })
);


// ============================================================
// COMPONENT
// ============================================================

const HRNovaSidebar = ({
    sideMenuData = [],
    open = true,
    onToggle,
    onNavigate,
    mobileOpen = false,
    onMobileClose,
    user
}) => {

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const location = useLocation();
    const [openModule, setOpenModule] = useState(null);

    const [flyoutAnchor, setFlyoutAnchor] = useState(null);
    const [flyoutModule, setFlyoutModule] = useState(null);


    // ========================================================
    // ACTIVE MODULE
    // ========================================================

    const activeModuleId = useMemo(() => {
        const currentPath = location.pathname.toLowerCase();
        const module =
            sideMenuData.find((module) => module?.children?.some(
                (route) => {
                    const path = getRoutePath(route);
                    return (currentPath === path.toLowerCase());
                }
            ));
        return module?.id ?? null;

    }, [sideMenuData, location.pathname]);


    // ========================================================
    // OPEN ACTIVE MODULE
    // ========================================================

    React.useEffect(() => {

        if (activeModuleId !== null) {

            setOpenModule(
                activeModuleId
            );

        }

    }, [activeModuleId]);


    // ========================================================
    // MODULE CLICK
    // ========================================================

    const handleModuleClick = (event, item) => {
        if (!item.children?.length) {
            onNavigate?.();
            return;
        }

        // Collapsed desktop
        if (!open && !isMobile) {
            setFlyoutModule(item);
            setFlyoutAnchor(event.currentTarget);
            return;
        }

        setOpenModule(
            current =>
                current === item.id
                    ? null
                    : item.id
        );

    };


    // ========================================================
    // FLYOUT CLOSE
    // ========================================================

    const closeFlyout = () => {
        setFlyoutAnchor(null);
        setFlyoutModule(null);
    }


    // ========================================================
    // LOGO
    // ========================================================

    const logo = (

        <Box
            component="img"
            src={Logo}
            alt="HRNova"
            sx={{
                height: 34,

                maxWidth:
                    open
                        ? 145
                        : 38,

                objectFit:
                    'contain',

                transition:
                    'all 200ms ease',

                filter:
                    'brightness(0) invert(1)',
            }}
        />

    );


    // ========================================================
    // SIDEBAR CONTENT
    // ========================================================

    const sidebarContent = (

        <SidebarRoot
            sx={{
                width: isMobile ? DRAWER_WIDTH : open ? DRAWER_WIDTH : COLLAPSED_WIDTH,
            }}
        >
            <SidebarHeader>
                {logo}
                {!isMobile && (

                    <Tooltip title={open ? 'Collapse menu' : 'Expand menu'} placement="right">
                        <IconButton
                            onClick={onToggle}
                            size="small"
                            sx={{
                                ml: 'auto',
                                width: 30,
                                height: 30,
                                color: alpha(theme.palette.common.white, 0.62),
                                '&:hover': {
                                    color: theme.palette.common.white,
                                    backgroundColor: theme.palette.custom.shellHov
                                }
                            }}
                        >

                            {open
                                ? (
                                    <ChevronLeft
                                        sx={{
                                            fontSize: 19,
                                        }}
                                    />
                                )
                                : (
                                    <ChevronRight
                                        sx={{
                                            fontSize: 19,
                                        }}
                                    />
                                )}

                        </IconButton>

                    </Tooltip>

                )}

            </SidebarHeader>


            <Divider
                sx={{
                    borderColor: theme.palette.custom.shellBrd
                }}
            />


            {/* ==================================================
                NAVIGATION
            ================================================== */}

            <NavigationContainer>

                <List disablePadding>

                    <Tooltip
                        title={!open ? 'Dashboard' : ''}
                        placement="right"
                        arrow
                        disableHoverListener={open}
                    >

                        <MainNavItem
                            component={RouterLink}
                            to="/dashboard"
                            className={({ isActive }) => isActive ? 'active' : ''}
                            onClick={() => onNavigate?.()}
                        >

                            <ListItemIcon
                                sx={{
                                    minWidth: open ? 34 : 0,
                                    mr: open ? 0.5 : 0,
                                    color: 'inherit',
                                    justifyContent: 'center'
                                }}
                            >
                                {React.createElement(iconMapping.Dashboard)}
                            </ListItemIcon>

                            {open && (
                                <ListItemText
                                    primary="Dashboard"
                                    primaryTypographyProps={{
                                        fontSize: '0.80rem',
                                        fontWeight: 600,
                                        color: 'custom.t700',
                                        letterSpacing: '-0.01em'
                                    }}
                                />
                            )}

                        </MainNavItem>

                    </Tooltip>


                    {/* ==================================================
                        MODULES
                    ================================================== */}

                    {sideMenuData?.filter(item => item.id !== 1)?.map(item => {

                        const Icon = iconMapping[item.icon];
                        const hasChildren = item?.children?.length > 0;
                        const isExpanded = openModule === item.id;
                        const isActive = activeModuleId === item.id;

                        return (
                            <Box key={item.id}>

                                {open && item.section && (
                                    <SectionTitle>
                                        {item.section}
                                    </SectionTitle>
                                )}


                                {/* MODULE */}

                                <Tooltip
                                    title={!open ? capitalize(item.title) : ''}
                                    placement="right"
                                    arrow
                                    disableHoverListener={open}
                                >
                                    <MainNavItem
                                        onClick={event => handleModuleClick(event, item)}
                                        className={isActive ? 'active' : ''}
                                    >

                                        <ListItemIcon
                                            sx={{
                                                minWidth: open ? 34 : 0,
                                                mr: open ? 0.5 : 0,
                                                color: 'inherit',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            {Icon && (
                                                <Icon sx={{ fontSize: 19 }} />
                                            )}

                                        </ListItemIcon>

                                        {open && (
                                            <>
                                                <ListItemText
                                                    primary={capitalize(item.title)}
                                                    primaryTypographyProps={{
                                                        fontSize: '0.80rem',
                                                        color: 'custom.t700',
                                                        fontWeight: 600,
                                                        letterSpacing: '-0.01em'
                                                    }}
                                                />

                                                {hasChildren && (
                                                    <ExpandMore
                                                        sx={{
                                                            fontSize: 18,
                                                            opacity: 0.55,
                                                            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                                            transition: theme.transitions.create('transform', { duration: 200 }),
                                                        }}
                                                    />

                                                )}

                                            </>

                                        )}

                                    </MainNavItem>

                                </Tooltip>


                                {/* CHILDREN */}

                                {open && hasChildren && (
                                    <Collapse in={isExpanded} timeout={500} unmountOnExit>
                                        <ChildrenContainer>
                                            {item.children.map(route => {
                                                const InsideIcon = iconMapping[route.icon];
                                                const path = getRoutePath(route);

                                                return (
                                                    <ChildNavItem key={route.formId}
                                                        component={RouterLink}
                                                        to={path}
                                                        className={({ isActive }) =>
                                                            isActive
                                                                ? 'active'
                                                                : ''
                                                        }

                                                        onClick={() => onNavigate?.()}
                                                    >

                                                        <ListItemIcon
                                                            sx={{
                                                                minWidth: 29,
                                                                color: 'inherit',
                                                                justifyContent: 'center'
                                                            }}
                                                        >

                                                            {InsideIcon && (
                                                                <InsideIcon sx={{ fontSize: 15 }} />

                                                            )}

                                                        </ListItemIcon>


                                                        <ListItemText
                                                            primary={route.title}
                                                            primaryTypographyProps={{
                                                                fontSize: '0.75rem',
                                                                fontWeight: 500,
                                                                color: 'custom.t700',
                                                                letterSpacing: '-0.005em'
                                                            }}
                                                        />
                                                    </ChildNavItem>
                                                );

                                            }
                                            )}

                                        </ChildrenContainer>
                                    </Collapse>
                                )}

                            </Box>

                        );

                    })}

                </List>

            </NavigationContainer>


            {/* ==================================================
                PROFILE
            ================================================== */}

            <ProfileContainer>

                <Tooltip
                    title={
                        !open
                            ? (
                                user?.name ||
                                'User'
                            )
                            : ''
                    }
                    placement="right"
                    arrow
                    disableHoverListener={open}
                >

                    <ProfileButton>

                        <Avatar
                            sx={{
                                width: 34,

                                height: 34,

                                bgcolor:
                                    theme.palette
                                        .primary.main,

                                color:
                                    theme.palette
                                        .primary
                                        .contrastText,

                                fontSize: 12,

                                fontWeight: 700,

                                boxShadow:
                                    `0 0 0 3px ${alpha(
                                        theme.palette
                                            .primary.main,
                                        0.12
                                    )}`,
                            }}
                        >

                            {user?.initials ||
                                'AM'}

                        </Avatar>


                        {open && (

                            <Box
                                sx={{
                                    minWidth: 0,

                                    flex: 1,
                                }}
                            >

                                <Typography
                                    noWrap
                                    sx={{
                                        fontSize: 12.5,

                                        fontWeight: 600,

                                        color:
                                            theme.palette
                                                .common
                                                .white,
                                    }}
                                >

                                    {user?.name ||
                                        'Ayesha Malik'}

                                </Typography>


                                <Typography
                                    noWrap
                                    sx={{
                                        mt: 0.15,

                                        fontSize: 10.5,

                                        color:
                                            alpha(
                                                theme.palette
                                                    .common
                                                    .white,
                                                0.48
                                            ),
                                    }}
                                >

                                    {user?.designation ||
                                        'Senior QA Engineer'}

                                </Typography>

                            </Box>

                        )}

                    </ProfileButton>

                </Tooltip>

            </ProfileContainer>

        </SidebarRoot>

    );


    // ========================================================
    // MOBILE
    // ========================================================

    if (isMobile) {

        return (

            <Drawer
                anchor="left"

                open={mobileOpen}

                onClose={onMobileClose}

                ModalProps={{
                    keepMounted: true,
                }}

                PaperProps={{
                    sx: {
                        width:
                            DRAWER_WIDTH,

                        backgroundColor:
                            theme.palette
                                .custom
                                .shell,

                        color:
                            theme.palette
                                .sidebar
                                .text,

                        borderRight:
                            `1px solid ${theme.palette
                                .custom
                                .shellBrd
                            }`,
                    },
                }}
            >

                {sidebarContent}

            </Drawer>

        );

    }


    // ========================================================
    // DESKTOP + FLYOUT
    // ========================================================

    return (

        <>

            {sidebarContent}


            {/* ==================================================
                COLLAPSED FLYOUT
            ================================================== */}

            <Popover
                open={Boolean(flyoutAnchor)}
                anchorEl={flyoutAnchor}
                onClose={closeFlyout}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                transitionDuration={{ enter: 480, exit: 120 }}
                slotProps={{
                    paper: {
                        sx: {
                            ml: 1,
                            mt: -0.5,
                            width: 238,
                            borderRadius: 2,
                            overflow: 'hidden',
                            backgroundColor: theme.palette.custom.shell,
                            color: theme.palette.custom.shellText,
                            border: `1px solid ${theme.palette.custom.shellBrd}`,
                            boxShadow: theme.shadows[5]
                        },

                    },
                }}
            >
                {flyoutModule && (
                    <Box>

                        {/* Flyout Header */}

                        <Box
                            sx={{
                                px: 1.75,
                                py: 1.4,
                                borderBottom: `1px solid ${theme.palette.custom.shellBrd}`
                            }}
                        >

                            <Typography
                                sx={{
                                    fontSize: 11,
                                    fontWeight: 700,
                                    letterSpacing: '0.07em',
                                    textTransform: 'uppercase',
                                    color: theme.palette.primary.light
                                }}
                            >
                                {capitalize(flyoutModule.title)}
                            </Typography>
                        </Box>
                        <List
                            disablePadding
                            sx={{
                                py: 0.6,
                            }}
                        >

                            {flyoutModule.children?.map(route => {

                                const InsideIcon = iconMapping[route.icon];

                                const path = getRoutePath(route);

                                return (
                                    <ListItemButton
                                        key={route.formId}
                                        component={RouterLink}
                                        to={path}
                                        onClick={() => {
                                            closeFlyout();
                                            onNavigate?.();
                                        }}
                                        sx={{
                                            minHeight: 38,
                                            mx: 0.65,
                                            borderRadius: 1,
                                            color: alpha(theme.palette.common.white, 0.62),
                                            '&:hover': {
                                                backgroundColor: theme.palette.custom.shellHov,
                                                color: theme.palette.common.white
                                            },
                                            '&.active': {
                                                backgroundColor:
                                                    alpha(
                                                        theme.palette
                                                            .primary
                                                            .main,
                                                        0.11
                                                    ),

                                                color:
                                                    theme.palette
                                                        .primary
                                                        .light,

                                            },

                                        }}
                                    >

                                        <ListItemIcon
                                            sx={{
                                                minWidth: 30,

                                                color:
                                                    'inherit',
                                            }}
                                        >

                                            {InsideIcon && (

                                                <InsideIcon
                                                    sx={{
                                                        fontSize:
                                                            16,
                                                    }}
                                                />

                                            )}

                                        </ListItemIcon>


                                        <ListItemText
                                            primary={
                                                route.title
                                            }

                                            primaryTypographyProps={{
                                                fontSize:
                                                    '0.76rem',
                                                color: 'custom.t700',
                                                fontWeight:
                                                    500,
                                            }}
                                        />

                                    </ListItemButton>

                                );

                            })}

                        </List>

                    </Box>

                )}

            </Popover>

        </>

    );

};


HRNovaSidebar.propTypes = {

    sideMenuData:
        PropTypes.array,

    open:
        PropTypes.bool,

    onToggle:
        PropTypes.func,

    onNavigate:
        PropTypes.func,

    mobileOpen:
        PropTypes.bool,

    onMobileClose:
        PropTypes.func,

    user:
        PropTypes.shape({
            name:
                PropTypes.string,

            designation:
                PropTypes.string,

            initials:
                PropTypes.string,
        }),

};


export default HRNovaSidebar;