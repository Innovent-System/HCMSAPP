import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { List, ListItem, ListItemIcon, ListItemText, Typography } from '../../deps/ui'
import { NavLink as RouterLink } from 'react-router-dom';
import * as iconMapping from '../../assets/icons';
import PropTypes from 'prop-types';

const styles = {
    capitalize: {
        textTransform: 'lowercase',
        '&::first-letter': {
            textTransform: 'uppercase',
        }
    }
}

const NavItem = ({ title, routes, icon: Icon, tabClick }) => {
    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header">
                <Icon size="small" />
                <Typography sx={styles.capitalize}> {title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <List>
                    {
                        routes.map(route => {
                            const InsideIcon = iconMapping[route.icon];
                            return <ListItem key={route.title}  {...(tabClick && { onClick: tabClick })} component={RouterLink}
                                to={`${route?.path.substring(5).toLowerCase()}/${encodeURIComponent(route._id)}`}
                            >
                                <ListItemIcon>
                                    <InsideIcon size="small" />
                                </ListItemIcon>
                                <ListItemText secondary={route.title} />
                            </ListItem>
                        }

                        )}
                </List>
            </AccordionDetails>
        </Accordion>
    )
}

NavItem.propTypes = {
    routes: PropTypes.array,
    icon: PropTypes.elementType.isRequired,
    title: PropTypes.string.isRequired,
};

export default NavItem;