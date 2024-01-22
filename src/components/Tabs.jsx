import React from 'react';
import PropTypes from 'prop-types'
import { Tab, Box, TabList, TabContext, TabPanel } from '../deps/ui'


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

/**
 * 
 * @param {import('@mui/material').BoxProps} other 
 * 
 */
function TabsComponent({ TabsConfig, orientation = "vertical", value = '0', setValue, ...other }) {
    // const [value, setValue] = React.useState('0');
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%', typography: 'body1' }} {...other}>
            <TabContext value={value}>
                <TabList  sx={{ minWidth: 180 }} orientation={orientation} variant="scrollable" scrollButtons="auto" onChange={handleChange} aria-label="lab API tabs example">
                    {TabsConfig.map(({ title, panel, ...restTabs }, index) => <Tab   {...restTabs} aria-orientation={orientation} sx={{ textTransform: 'capitalize' }}  key={title} label={title} value={String(index)} />)}
                </TabList>

                {TabsConfig.map((m, index) => <TabPanel  index={index} value={String(index)} key={index}> {m.panel}</TabPanel>)}

            </TabContext>
        </Box>
    );
}

TabsComponent.propTypes = {
    TabsConfig: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.string,
        Panel: PropTypes.node
    })),
    orientation: PropTypes.oneOf(["horizontal", "vertical"])
}

export default TabsComponent;