import React, { useState,useEffect,useRef, useCallback } from "react";
import EmployeeGroupModel from "./ConstantModel/EmployeeGroupModel";
import {
  makeStyles,
  Toolbar,
  Grid,Typography
} from "@material-ui/core";
import * as employeeService from "../../../services/employeeService";
import Controls from "../../../components/controls/Controls";
import AddIcon from "@material-ui/icons/Add";
import Popup from "../../../components/Popup";
import ConfirmDialog from "../../../components/ConfirmDialog";
import GridToolBar from '../../../components/GridToolBar';
import TableGrid  from '../../../components/useXGrid';
import { API_INSERTEMPLOYEE_GROUP,API_GETEMPLOYEE_GROUP,API_UpdateEMPLOYEE_GROUP } from '../../../services/UrlService'; 
import { handleGetActions,handlePostActions,handleUpdateActions } from '../../../store/actions/httpactions';
import { useDispatch } from "react-redux";
import ActionToolKit from '../../../components/ActionToolKit';
import { useSocketIo } from '../../../components/useSocketio';

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
  toggleContainer: {
    margin: theme.spacing(2, 0),
    '& .MuiToggleButton-root':{
      padding:5
    }
  },
}));  


  function GetFullName(params) {
    return (
          <Typography variant="body2" gutterBottom>
            <b>Created On:</b> {params.row['createdOn']}
            <br/>
            <b> Created By:</b> {params.row['createdBy']} 
        </Typography> 
      
    )
  }


const columns = [
  { field: 'id', headerName:'S#',editable:false},
  { field: 'groupName', headerName: 'Group Name',flex: 1 ,editable:true},
  { field: 'createdOn', headerName: 'Created On', width: 200, type: 'dateTime',editable:true },
  { field: 'createdDetail', headerName: 'Created Detail', flex: 1,editable:false,
  renderCell: GetFullName,
  sortComparator: (v1, v2) => new Date(v2) - new Date(v1),
  },
  // { field: 'modifiedBy', headerName: 'Modified By', width: 130 },
  // { field: 'modifiedOn', headerName: 'Modified On', width: 130 , type: 'date'},
  
    {
      field: '',
      headerName: 'Action',
      editable:false,
      flex: 1,
      renderCell: ActionToolKit
    }
  
  
];



export default function EmplpoyeeGroup() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });

  const loader = useRef(false);

  const [records, setRecords] = useState({
    data:[],
    loader:false,
  });

 

  useCallback(useSocketIo(records,setRecords,'employeegroups'),[records])
  

  const fillGrid = (groupName = "") => {
    
    const fillEmployeeGroupData = {
      groupName:groupName, 
    }
    
      setRecords({...records,loader:true});
      
      dispatch(handleGetActions(API_GETEMPLOYEE_GROUP,fillEmployeeGroupData)).then((res)=>{
        if(res){
          setRecords({...records,data:res.EmployeeGroupData,loader:false});
        }
     });
   };

   const resetState = (resetForm = () => {}) => {
    resetForm();
    setRecordForEdit(null);
    setOpenPopup(false);
  }

   const addOrEdit = (values,resetForm) => {
    if(values.id === 0){
      const employeeGroupData = {
        groupName:values.groupName, 
      }
     
      dispatch(handlePostActions(API_INSERTEMPLOYEE_GROUP,employeeGroupData)).then(res => {
         resetState(resetForm)
      });
    }
    else{
      const updateEmployeeGroupModel = {
        id:values.id,
        groupName:values.groupName, 
      }
      
      dispatch(handleUpdateActions(API_UpdateEMPLOYEE_GROUP,updateEmployeeGroupModel)).then(res => {
         resetState(resetForm)
      });
    }
    
  };

  useEffect(fillGrid, []);

  


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
        
        <Toolbar style={{borderBottom:"1px solid #ddd"}}>
        <Controls.Button
            text="Apply"
            variant="outlined"
            className={classes.applyButton}
            onClick={() => fillGrid()}
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
        <TableGrid rows={records.data} columns={columns} loader={records.loader}  pageSize={5} checkboxSelection />
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
