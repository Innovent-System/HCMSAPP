import React, { useState,useEffect, useCallback,useRef,forwardRef, useImperativeHandle,useContext } from "react";
import EmployeeGroupModel from "./ConstantModel/EmployeeGroupModel";
import {
  makeStyles,
  Toolbar,
  Grid,
} from "@material-ui/core";
import * as employeeService from "../../../services/employeeService";
import Controls from "../../../components/controls/Controls";
import AddIcon from "@material-ui/icons/Add";
import Popup from "../../../components/Popup";
import ConfirmDialog from "../../../components/ConfirmDialog";
import GridToolBar from '../../../components/GridToolBar';
import TableGrid  from '../../../components/useXGrid';
import { API_CONSTANT_GETEMPLOYEEGROUP } from '../../../services/UrlService'; 
import { handleGetActions } from '../../../store/actions/httpactions';
import { useDispatch } from "react-redux";
import { SocketContext } from '../../../services/socketService';




const useStyles = makeStyles((theme) => ({
  pageContent: {
    
    padding: theme.spacing(2),
    width: "100%",
  },
  searchInput: {
    width: "100%",
  },
  newButton: {
    position: "absolute",
    right: "10px",
  },
}));

const headCells = [
  { id: "fullName", label: "Employee Name" },
  { id: "email", label: "Email Address (Personal)" },
  { id: "mobile", label: "Mobile Number" },
  { id: "department", label: "Department" },
  { id: "actions", label: "Actions", disableSorting: true },
];



const columns = [
  { field: 'id', hide: true},
  { field: 'groupName', headerName: 'Group Name', width: 200 },
  { field: 'createdOn', headerName: 'Creted On', width: 200, type: 'date' },
  { field: 'createdBy', headerName: 'Created By', width: 130, },
  { field: 'modifiedBy', headerName: 'Modified By', width: 130 },
  { field: 'modifiedOn', headerName: 'ModifiedOn On', width: 130 , type: 'date'},
  
];


const EmployeeGroupGrid = forwardRef((props,ref) => {
   const dispatch = useDispatch();
   const [records, setRecords] = useState({
    data:[],
    loader:false,
  });

  
  const fillGrid = () => {
    
    const fillEmployeeGroupData = {
      groupName:"", 
    }
      setRecords({...records,loader:true});
      dispatch(handleGetActions(API_CONSTANT_GETEMPLOYEEGROUP,fillEmployeeGroupData)).then((res)=>{
        if(res){
          setRecords({...records,data:res.EmployeeGroupData,loader:false});
        }
     });
};

    useImperativeHandle(ref,()=>({
       fillGrid
    }))

   useEffect(fillGrid, []);

  return <TableGrid rows={records.data} columns={columns} loader={records.loader}  pageSize={5} checkboxSelection />
})



export default function Employees() {
  const classes = useStyles();
  const socket = useContext(SocketContext);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);

  const child = useRef();
  
  const fillGrid = () => child.current.fillGrid();


  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });

 
  useEffect(() => {
    
    socket.on("CHANGE_REQUEST_ACCEPTED", fillGrid);

  
  }, [socket])

  const addOrEdit = (employee, resetForm) => {
    if (employee.id == 0) employeeService.insertEmployee(employee);
    else employeeService.updateEmployee(employee);
    resetForm();
    setRecordForEdit(null);
    setOpenPopup(false);
    // setRecords(employeeService.getAllEmployees());
    
  };

  const openInPopup = (item) => {
    setRecordForEdit(item);
    setOpenPopup(true);
  };

  const onDelete = (id) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    employeeService.deleteEmployee(id);
    // setRecords(employeeService.getAllEmployees());
    
  };


  return (
    <>
      <Grid className={classes.pageContent}>
        {console.log("html")}
        <GridToolBar/>
        <Toolbar style={{borderBottom:"1px solid #ddd"}}>
        <Controls.Button
            text="Apply"
            variant="outlined"
            className={classes.applyButton}
            onClick={fillGrid}
          />

          <Controls.Button
            text="Add New"
            variant="outlined"
            startIcon={<AddIcon />}
            className={classes.newButton}
            onClick={() => {
              setOpenPopup(true);
              setRecordForEdit(null);
            }}
          />
        </Toolbar>
        <EmployeeGroupGrid ref={child}/>
      </Grid>
      <Popup  
        title="Employee Group"
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <EmployeeGroupModel recordForEdit={recordForEdit} addOrEdit={addOrEdit} />
      </Popup>
      
      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
    </>
  );
}
