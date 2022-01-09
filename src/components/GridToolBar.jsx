import { useRef,useState } from 'react';
import {Tooltip,Grid,IconButton,Drawer, Box,Typography,Zoom } from '../deps/ui';
import  Controls from '../components/controls/Controls'; 
import { Search,FilterList,CloudUpload} from '../deps/ui/icons';
import * as employeeService from "../services/employeeService";


const Styles = {
    root: {
        '& .MuiFormControl-root': {
            w: '80%',
            m: 1
        }
    }
}


const  GridToolBar = (props)  =>{
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
        <Tooltip placement="top" TransitionComponent={Zoom} title="search">
            <IconButton color="primary" aria-label="search" component="span">
                <Search />
            </IconButton>
        </Tooltip>
        <Tooltip placement="top" TransitionComponent={Zoom} title="Upload File">
            <IconButton color="primary" aria-label="upload" component="span">
            <CloudUpload />
            </IconButton>
        </Tooltip>
        <Tooltip placement="top" TransitionComponent={Zoom} title="Filter">
            <IconButton color="primary" aria-label="filter" onClick={() => setState(true)} component="span">
            <FilterList />
            </IconButton>
        </Tooltip>
        
             
            <Drawer style={{margin:'auto 0',width:300}} anchor="top"  open={state}  onClose={toggleDrawer(false)}>
                <Box   minWidth={300} p={2}>
                <Typography
                        variant="h6"
                        component="div">
                        Filters</Typography>
                                <Grid sx={Styles.root} container spacing={1}>

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

export default GridToolBar

