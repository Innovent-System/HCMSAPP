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

        <TabContext value={value}>
            <TabList sx={{
                paddingTop: 1,
                '& .MuiTab-root': {
                    textDecoration: 'none',
                    backgroundColor: '#f0f0f0',
                    // border: '1px solid #ccc',
                    borderRadius: '4px',
                    padding: '8px 16px',
                    minHeight: 'auto',
                    marginRight: 1,
                    marginBottom: 1,
                    transition: 'ease-out 0.6s',
                    '&:hover': {
                        backgroundColor: '#e0e0e0',
                        boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)'
                    },
                    '&.Mui-selected': {
                        backgroundColor: 'primary.main',
                        boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
                        color: '#fff'
                    },
                },
            }} orientation={orientation} variant="scrollable" scrollButtons="auto" onChange={handleChange} aria-label="lab API tabs example">
                {TabsConfig.map(({ title, panel, value, ...restTabs }, index) => <Tab role='button' centerRipple {...restTabs} aria-orientation={orientation} sx={{ textTransform: 'capitalize' }} key={title} label={title} value={value ?? String(index)} />)}
            </TabList>

            {TabsConfig.map((m, index) => <TabPanel index={index} value={m?.value ?? String(index)} key={index}> {m.panel}</TabPanel>)}

        </TabContext>

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