import React,{useState} from 'react'
import PropTypes from 'prop-types'
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import SaveTwoToneIcon from '@material-ui/icons/SaveTwoTone';
import EditTwoToneIcon from '@material-ui/icons/EditTwoTone';
import SaveIcon from '@material-ui/icons/Save';
import PhoneAndroidIcon from '@material-ui/icons/PhoneAndroid';
import {makeStyles} from "@material-ui/core";
import { API_INSERT_UPDATE_EMPLOYEE_GROUP } from '../services/UrlService'; 
import { handlePostActions } from '../store/actions/httpactions';
import { useDispatch } from "react-redux";


const useStyles = makeStyles((theme) => ({
    toggleContainer: {
      margin: theme.spacing(2, 0),
      '& .MuiToggleButton-root':{
        padding:5,
        color:"pitch"
      }
    },
  }));

function ActionToolKit ({isShowEditBtn = true,isShowActiveBtn = true,isShowDownloadBtn = true,...props}) {
    const classes = useStyles();
    const { row,api } = props;
    const [formats, setFormats] = React.useState('');
    const [mode,setCellMode] = useState('view');
    const dispatch = useDispatch();
    
    const handleFormat = React.useCallback(
      (event, newFormats) => {
          setFormats(newFormats);
      },
      [formats]
    );

   
      
    const handleButtonEdit = React.useCallback(() => {
      if(mode === 'view'){
        Object.keys(row).forEach((r,index) => {
          
          if(api.getColumn(r)?.editable){
            api.setCellMode(row.id, r, "edit");
            index == 0 && api.setCellFocus(row.id, r);
          }
        })
        setCellMode('edit');
       }
       else{
        const editedCellProps = api.getEditCellPropsParams(row.id, 'groupName');
        
        if(!editedCellProps.props.value){
          api.setEditCellProps({ id: row.id, field:'groupName', props: { ...editedCellProps.props, error: true } });
        }
        else{
          api.commitCellChange(editedCellProps);

          Object.keys(row).forEach((r,index) => {
            if(api.getColumn(r)?.editable){
              api.setCellMode(row.id, r, "view");
              index == 0 && api.setCellFocus(row.id, r);
            }
          })
          setCellMode('view');
          if(mode === "edit" && editedCellProps.props.value != row.groupName){
            const updateEmployeeGroupModel = {
              id:row._id,
              groupName:editedCellProps.props.value, 
            }
            dispatch(handlePostActions(API_INSERT_UPDATE_EMPLOYEE_GROUP,updateEmployeeGroupModel)).then(res => {
              
           });
          
          }
        }
        console.log(editedCellProps);
        
       }
    },[mode])

    
  
    return (
     
        <ToggleButtonGroup exclusive className={classes.toggleContainer} value={formats} onChange={handleFormat} aria-label="device">
             {isShowActiveBtn && 
                <ToggleButton value="isActive" aria-label="isActive">
                 <DeleteIcon />
               </ToggleButton>
              }

              {isShowEditBtn && 
                <ToggleButton value="isEdit" onClick={handleButtonEdit} aria-label="isEdit">
                {mode === 'view'? <EditTwoToneIcon color='action' /> : <SaveTwoToneIcon />}
                </ToggleButton>
              } 
              {/* {
                  isShowDownloadBtn && 
                  <ToggleButton value="isDownload" aria-label="isDownload">
                   <PhoneAndroidIcon />
                  </ToggleButton>
              } */}
              
              
       </ToggleButtonGroup>
      
    );
  };

ActionToolKit.propTypes = {
    isShowEditBtn: PropTypes.bool,
    isShowActiveBtn: PropTypes.bool,
    isShowDownloadBtn: PropTypes.bool
}

// ActionToolKit.defaultProps = {
//     isShowEditBtn: true,
//     isShowActiveBtn: true,
//     isShowDownloadBtn: false
// }


export default ActionToolKit;

