import PropTypes from 'prop-types';
import { useRef,useState } from 'react';
import {Toolbar,Grid,IconButton,InputAdornment,Drawer, Box,makeStyles,Typography } from '@material-ui/core';
import  Controls from '../components/controls/Controls'; 
import { Search,FilterList,CloudUpload} from '@material-ui/icons';
import * as employeeService from "../services/employeeService";

const useStyles = makeStyles(theme => ({
    root: {
        '& .MuiFormControl-root': {
            width: '80%',
            margin: theme.spacing(1)
        }
    }
}))


const  GridToolBar = (props)  =>{
    const classes = useStyles();
    let departmentId = useRef("");
    const [state, setState] = useState(false);
    
      const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
          return;
        }
    
        setState(open);
      };

    return (
        <>
             <Toolbar style={{borderBottom:"1px solid #ddd"}} disableGutters>
                <Grid container
                    alignItems="center">
                    <Grid style={{display:'flex'}} item>
                    <Controls.Input
                        label="Search Employees"
                        InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                              <Search />
                            </InputAdornment>
                        ),
                        }}
                    />
                          
                    </Grid>
                    <Grid item sm></Grid>
                    <Grid item>
                         <IconButton>
                            <CloudUpload />
                         </IconButton>
                         <IconButton onClick={() => setState(true)}>
                            <FilterList />
                         </IconButton>
                    </Grid>
                </Grid>
            </Toolbar>
            <Drawer  anchor="top"  open={state}  onClose={toggleDrawer(false)}>
                <Box  minWidth={300} p={2}>
                <Typography
                        variant="h6"
                        component="div">
                        Filters</Typography>
                                <Grid className={classes.root} container spacing={1}>

                        <Grid item lg={6} sm={6}>
                                <Controls.Select ref={departmentId}
                                name="departmentId"
                                label="Department"
                                options={employeeService.getDepartmentCollection()}
                            />
                        </Grid>
                        <Grid item lg={6} sm={6}>
                                <Controls.Select ref={departmentId}
                                name="departmentId"
                                label="Department"
                                options={employeeService.getDepartmentCollection()}
                            />
                        </Grid>
                        <Grid item lg={6} sm={6}>
                                <Controls.Select ref={departmentId}
                                name="departmentId"
                                label="Department"
                                options={employeeService.getDepartmentCollection()}
                            />
                        </Grid>
                        <Grid item lg={6} sm={6}>
                                <Controls.Select ref={departmentId}
                                name="departmentId"
                                label="Department"
                                options={employeeService.getDepartmentCollection()}
                            />
                        </Grid>
                </Grid>
                </Box>
                
                
                
            </Drawer>
            </>
    )
}

GridToolBar.propTypes = {

}

export default GridToolBar

