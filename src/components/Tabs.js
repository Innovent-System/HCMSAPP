import React from 'react';
import PropTypes from 'prop-types'
import { Tabs as MuiTabs, Tab, Typography, Box } from '../deps/ui'

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            style={{ flex: 1 }}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function changeTabs(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

const Styles = {
    root: {
        flexGrow: 1,
        bgcolor: 'background.paper',
        display: 'flex',
        height: "80%",
        width: '100%',
    },
    tabStyle: {
        borderRight: 1,
        borderColor: 'divider'
    },
}


function Tabs({ TabsConfig, orientation = "vertical" }) {
    const [value, setValue] = React.useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={Styles.root} >
            <MuiTabs
                orientation={orientation}
                variant="scrollable"
                value={value}
                onChange={handleChange}
                aria-label="Vertical tabs example"
                sx={Styles.tabStyle}
            >
                {TabsConfig.map((m, index) => <Tab label={m.title} key={index} index={index} {...changeTabs(index)} />)}
            </MuiTabs>
            {
                TabsConfig.map((m, index) => <TabPanel value={value} key={index} index={index}> {m.panel}</TabPanel>)
            }
        </Box>
    );
}

Tabs.propTypes = {
    TabsConfig: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.string.isRequired,
        panel: PropTypes.node.isRequired
    })).isRequired,
    orientation: PropTypes.oneOf(["horizontal", "vertical"])
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};
export default Tabs;
