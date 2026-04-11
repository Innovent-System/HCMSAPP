import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { List, ListItem, ListItemIcon, ListItemText, Typography, Box } from '../../deps/ui'
import { styled, alpha } from '@mui/material/styles';
import { NavLink as RouterLink } from 'react-router-dom';
import * as iconMapping from '../../assets/icons';
import PropTypes from 'prop-types';

// ─── Styled Accordion ─────────────────────────────────────────────────────────

const StyledAccordion = styled(Accordion)(({ theme }) => ({
    boxShadow: 'none',
    borderRadius: '0 !important',
    border: 'none',
    '&::before': { display: 'none' },   // MUI accordion top divider hatao
    '&.Mui-expanded': {
        margin: 0,
    },
}));

// ─── Styled Summary ───────────────────────────────────────────────────────────

const StyledSummary = styled(AccordionSummary)(({ theme }) => ({
    minHeight: '40px !important',
    padding: theme.spacing(0, 1.5),
    borderRadius: 0,
    transition: 'background 0.15s',

    '& .MuiAccordionSummary-content': {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1),
        margin: '8px 0 !important',
    },

    '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.06),
    },

    '&.Mui-expanded': {
        minHeight: '40px !important',
        color: theme.palette.secondary.contrastText,
        backgroundColor: theme.palette.secondary.main,
        '& .MuiAccordionSummary-expandIconWrapper': {
            color: theme.palette.secondary.contrastText,
        },
        // Left accent bar when expanded
        borderLeft: `3px solid ${theme.palette.primary.main}`,
    },

    // Expanded icon size
    '& .MuiAccordionSummary-expandIconWrapper svg': {
        fontSize: '1rem',
    },
}));

// ─── Styled List Item ─────────────────────────────────────────────────────────

const StyledListItem = styled(ListItem)(({ theme }) => ({
    padding: theme.spacing(0.5, 1.5, 0.5, 2),
    borderRadius: 0,
    transition: 'background 0.15s',
    textDecoration: 'none',
    color: theme.palette.text.secondary,

    '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.06),
        color: theme.palette.text.primary,
    },

    // Active route highlight
    '&.active': {
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
        borderLeft: `3px solid ${theme.palette.primary.main}`,
        '& .MuiListItemIcon-root svg, & .MuiTypography-root': {
            color: theme.palette.primary.main,
        },
    },
}));

// ─── Capitalize helper ────────────────────────────────────────────────────────

const capitalize = (str = '') =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

// ─── NavItem ──────────────────────────────────────────────────────────────────

const NavItem = ({ title, routes, routeTo, icon: Icon, tabClick, isChildren = true }) => {
    return (
        <StyledAccordion disableGutters>
            <StyledSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`${title}-content`}
                id={`${title}-header`}
            >
                {/* Module icon */}
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    color: 'inherit',
                    opacity: 0.85,
                    flexShrink: 0,
                }}>
                    <Icon fontSize="small" />
                </Box>

                {/* Module title */}
                <Typography sx={{
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: 'inherit',
                    lineHeight: 1.2,
                }}>
                    {capitalize(title)}
                </Typography>
            </StyledSummary>

            <AccordionDetails sx={{ p: 0, bgcolor: 'grey.50' }}>
                <List disablePadding>
                    {routes?.map((route) => {
                        const InsideIcon = iconMapping[route.icon];
                        const path = `${route?.path.substring(5).toLowerCase()}/${encodeURIComponent(route._id)}`;

                        return (
                            <StyledListItem
                                key={route.title}
                                component={RouterLink}
                                to={path}
                                {...(tabClick && { onClick: tabClick })}
                            >
                                <ListItemIcon sx={{ minWidth: 28 }}>
                                    {InsideIcon && (
                                        <InsideIcon sx={{ fontSize: '0.9rem', color: 'text.secondary' }} />
                                    )}
                                </ListItemIcon>
                                <ListItemText
                                    secondary={route.title}
                                    secondaryTypographyProps={{
                                        fontSize: '0.78rem',
                                        fontWeight: 500,
                                        color: 'inherit',
                                    }}
                                />
                            </StyledListItem>
                        );
                    })}
                </List>
            </AccordionDetails>
        </StyledAccordion>
    );
};

NavItem.propTypes = {
    routes: PropTypes.array,
    icon: PropTypes.elementType.isRequired,
    title: PropTypes.string.isRequired,
    routeTo: PropTypes.string,
    tabClick: PropTypes.func,
    isChildren: PropTypes.bool,
};

export default NavItem;