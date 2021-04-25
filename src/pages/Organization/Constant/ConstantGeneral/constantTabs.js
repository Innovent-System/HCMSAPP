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
        <Box p={3}>
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
         <Tab label="Manage Employee Group" {...tabsProps(0)} />
          <Tab label="Manage Designation" {...tabsProps(1)} />
          <Tab label="Manage Employee Status" {...tabsProps(2)} />
          <Tab label="Manage Employee Station" {...tabsProps(3)} />
          <Tab label="Manage Country" {...tabsProps(4)} />
          <Tab label="Manage Province" {...tabsProps(5)} />
          <Tab label="Manage City" {...tabsProps(6)} />
          <Tab label="Manage Area" {...tabsProps(7)} />
          <Tab label="Manage Vendor" {...tabsProps(8)} />
      </Tabs>
      <TabPanel className={classes.tabPanelStyle} value={value} index={0}>
      Manage Employee Group
      <EmployeeGroup></EmployeeGroup>
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
