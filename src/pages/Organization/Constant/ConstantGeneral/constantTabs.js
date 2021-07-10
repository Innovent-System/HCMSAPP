import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles,Tabs,Tab,Box } from '@material-ui/core';
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
          {children}
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

  const TabsConfig = [{name: "Manage Employee Group",panel:<EmployeeGroup/>},
    {name:"Manage Designation",panel:null},
    {name:"Manage Employee Status",panel:null},
    {name:"Manage Employee Station",panel:null},
    {name:"Manage Company",panel:null},
    {name:"Manage Country",panel:null},
    {name:"Manage City",panel:null},
    {name:"Manage Area",panel:null},
    {name:"Manage Vendor",panel:null}
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
        {TabsConfig.map((m,index )=> <Tab key={index} label={m.name} {...tabsProps(index)} /> )  }
      </Tabs>

       {TabsConfig.map((m,index )=> <TabPanel key={m.name} className={classes.tabPanelStyle} value={value} index={index}>
         {m.panel}
      </TabPanel> )  }
      
    </div>
  );
}
