import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles,Tabs,Tab,Typography,Box } from '@material-ui/core';
import EmployeeGroup from '../EmployeeGroup';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function tabsProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: '90%',
    width: '100%',
    
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
    padding:0
  },
  tabPanelStyle:{
    width: '80%',
  }
}));

export default function VerticalTabs() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const TabsName = [
    "Manage Employee Group",
    "Manage Designation",
    "Manage Employee Status",
    "Manage Employee Station",
    "Manage Company",
    "Manage Country",
    "Manage Province",
    "Manage City",
    "Manage Area",
    "Manage Vendor"
  ];

  return (
    <div className={classes.root}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        className={classes.tabs}
      >
        {TabsName.map((m,index )=> <Tab key={index} label={m} {...tabsProps(index)} /> )  }
      </Tabs>
      <TabPanel className={classes.tabPanelStyle} value={value} index={0}>
         <EmployeeGroup/>
      </TabPanel>
      <TabPanel value={value} index={1}>
      Manage Designation
      </TabPanel>
      <TabPanel value={value} index={2}>
      Manage Employee Status
      </TabPanel>
      <TabPanel value={value} index={3}>
      Manage Employee Station
      </TabPanel>
      <TabPanel value={value} index={4}>
      Manage Country
      </TabPanel>
      <TabPanel value={value} index={5}>
      Manage Province
      </TabPanel>
      <TabPanel value={value} index={6}>
      Manage City
      </TabPanel>
      <TabPanel value={value} index={7}>
      Manage Area
      </TabPanel>
      <TabPanel value={value} index={8}>
      Manage Vendor
      </TabPanel>
    </div>
  );
}
