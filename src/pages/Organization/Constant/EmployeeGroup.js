import React, { useState,useEffect } from "react";
import EmployeeGroupModel from "./ConstantModel/EmployeeGroupModel";
import {
  makeStyles,
  Toolbar,
  Grid,
} from "@material-ui/core";
import useTable from "../../../components/useTable";
import * as employeeService from "../../../services/employeeService";
import Controls from "../../../components/controls/Controls";
import AddIcon from "@material-ui/icons/Add";
import Popup from "../../../components/Popup";
import Notification from "../../../components/Notification";
import ConfirmDialog from "../../../components/ConfirmDialog";
import GridToolBar from '../../../components/GridToolBar';
import TableGrid  from '../../../components/useXGrid';
import { API_CONSTANT_GETEMPLOYEEGROUP } from '../../../services/UrlService'; 
import { handleGetActions } from '../../../store/actions/httpactions';
import { useSelector, useDispatch } from "react-redux";


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
  { field: 'createdOn', headerName: 'Creted On', width: 200 },
  { field: 'createdBy', headerName: 'Created By', width: 130 },
  { field: 'modifiedBy', headerName: 'Modified By', width: 130 },
  { field: 'modifiedOn', headerName: 'ModifiedOn On', width: 130 },
  
];

export default function Employees() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const selector = useSelector(state => state[Object.keys(state)[0]]);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [records, setRecords] = useState([]);

  const [filterFn, setFilterFn] = useState({
    fn: (items) => {
      return items;
    },
  });
  const [openPopup, setOpenPopup] = useState(false);
  
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });

  const {
    TblContainer,
    TblHead,
    TblPagination,
    recordsAfterPagingAndSorting,
  } = useTable(records, headCells, filterFn);



  const handleSearch = (e) => {
    let target = e.target;
    setFilterFn({
      fn: (items) => {
        if (target.value == "") return items;
        else
          return items.filter((x) =>
            x.fullName.toLowerCase().includes(target.value)
          );
      },
    });
  };

  const addOrEdit = (employee, resetForm) => {
    if (employee.id == 0) employeeService.insertEmployee(employee);
    else employeeService.updateEmployee(employee);
    resetForm();
    setRecordForEdit(null);
    setOpenPopup(false);
    setRecords(employeeService.getAllEmployees());
    setNotify({
      isOpen: true,
      message: "Submitted Successfully",
      type: "success",
    });
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
    setRecords(employeeService.getAllEmployees());
    setNotify({
      isOpen: true,
      message: "Deleted Successfully",
      type: "error",
    });
  };


  useEffect(() => {
    const { info,status } = selector;
    console.log(status);
    if(status && info){
      const setValue = [];
      if(Array.isArray(info.EmployeeGroupData)){
        setValue.push(...info.EmployeeGroupData);
      }else{
        records.push(info);
        setValue.push(...records);
      } 

      setRecords(setValue);
    }
  }, [selector]);

  const  fillGrid = (e) => {
    e.preventDefault();
      const fillEmployeeGroupData = {
        groupName:"", 
      }
       dispatch(handleGetActions(API_CONSTANT_GETEMPLOYEEGROUP,fillEmployeeGroupData));
  };


  return (
    <>


      <Grid className={classes.pageContent}>
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
         <TableGrid rows={records} columns={columns} pageSize={5} checkboxSelection />
      </Grid>
      <Popup  
        title="Employee Group"
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <EmployeeGroupModel recordForEdit={recordForEdit} addOrEdit={addOrEdit} />
      </Popup>
      <Notification notify={notify} setNotify={setNotify} />
      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
    </>
  );
}
