import React, { useState,useEffect,useRef, useCallback, useContext } from "react";
import CountryModel from "./ConstantModel/CountryModel";
import {
  makeStyles,
  Toolbar,
  Typography
} from "@material-ui/core";
import * as employeeService from "../../../services/employeeService";
import Controls from "../../../components/controls/Controls";
import AddIcon from "@material-ui/icons/Add";
import Popup from "../../../components/Popup";
import ConfirmDialog from "../../../components/ConfirmDialog";
import TableGrid  from '../../../components/useXGrid';
import { API_GETCOUNTRY,API_INSERT_UPDATE_COUNTRY } from '../../../services/UrlService'; 
import { handleGetActions,handlePostActions } from '../../../store/actions/httpactions';
import { useDispatch } from "react-redux";
import ActionToolKit from '../../../components/ActionToolKit';
import { useSocketIo } from '../../../components/useSocketio';


const columns = [
    { field: 'id', headerName:'S#',editable:false,filterable:false},
    { field: 'countryName', headerName: 'Country Name',flex: 1 ,editable:true},
    { field: 'createdDetail', headerName: 'Created Detail', flex: 1,editable:false,
    renderCell: GetFullName,
    sortComparator: (v1, v2) => new Date(v2) - new Date(v1),
    },
  
    { field: 'modifiedDetail', headerName: 'Modified Detail', flex: 1,editable:false,
    renderCell: GetFullModifiedName,
    sortComparator: (v1, v2) => new Date(v2) - new Date(v1),
    },
      {
        field: 'Action',
        headerName: 'Action',
        editable:false,
        flex: 1,
        renderCell:(row) =>  (<ActionToolKit apiName={API_INSERT_UPDATE_COUNTRY} {...row}/>),
        align :'center',
        sortable: false,
        filterable:false
      }
  ];
  
  

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

  
  function GetFullModifiedName(params) {
    return (
          <Typography variant="body2" gutterBottom>
            <b>Modified On:</b> {params.row['modifiedOn']}
            <br/>
            <b> Modified By:</b> {params.row['modifiedBy']} 
        </Typography> 
      
    )
  }


  export default function Country() {
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

  const fillGrid = (countryName = "") => {
    const fillCountryData = {
      countryName:countryName, 
    }
      setRecords({...records,loader:true});
      dispatch(handleGetActions(API_GETCOUNTRY,fillCountryData)).then((res)=>{
        if(res){
          const { data } = res;
          setRecords({...records,data:data.CountryData,loader:false});
        }
     });
   };


   useCallback(useSocketIo(fillGrid),[])

   
   const resetState = (resetForm = () => {}) => {
    resetForm();
    setRecordForEdit(null);
    setOpenPopup(false);
  }

  const addOrEdit = (values,resetForm) => {
    if(values.id === 0){
     for (let index = 0; index < 10000; index++) {
      const CountryData = {
        id:0,
        countryName:values.countryName + "-" + index, 
      }
      dispatch(handlePostActions(API_INSERT_UPDATE_COUNTRY,CountryData)).then(res => {
         resetState(resetForm)
      });
       
     }
    }
    else{
      const updateCountryModel = {
        id:values.id,
        countryName:values.countryName, 
      }
      dispatch(handlePostActions(API_INSERT_UPDATE_COUNTRY,updateCountryModel)).then(res => {
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
    
      <div className={classes.pageContent}>
        
        
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
        <TableGrid rows={records.data} paging={[10,20,30,50,100]} columns={columns} loader={records.loader}  pageSize={5} isCheckBox={false} />
      
     
      <Popup  
        title="Country"
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <CountryModel recordForEdit={recordForEdit} addOrEdit={addOrEdit} />
      </Popup>
      
      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
    </div>
  );


  }