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


function TabsComponent({ TabsConfig, orientation = "vertical" }) {
    const [value, setValue] = React.useState('0');
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList orientation={orientation} variant="scrollable" scrollButtons="auto" onChange={handleChange} aria-label="lab API tabs example">
                        {TabsConfig.map((tab, index) => <Tab key={tab.title} label={tab.title} value={String(index)} />)}
                    </TabList>
                </Box>
                <div>
                    {TabsConfig.map((m, index) => <TabPanel  index={index} value={String(index)} key={index}> {m.panel}</TabPanel>)}
                </div>
            </TabContext>
        </Box>
        // <Box sx={Styles.root} >
        //     <MuiTabs
        //         orientation={orientation}
        //         variant="scrollable"
        //         value={value}
        //         onChange={handleChange}
        //         aria-label="Vertical tabs example"
        //         sx={Styles.tabStyle}
        //     >
        //         {TabsConfig.map((m, index) => <Tab label={m.title} key={index} index={index} {...changeTabs(index)} />)}
        //     </MuiTabs>
        //     {
        //         TabsConfig.map((m, index) => <TabPanel value={value} key={index} index={index}> {m.panel}</TabPanel>)
        //     }
        // </Box>
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