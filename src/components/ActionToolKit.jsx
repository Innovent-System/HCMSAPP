import React,{useState,useRef} from 'react'
import PropTypes from 'prop-types'
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveTwoToneIcon from '@material-ui/icons/SaveTwoTone';
import EditTwoToneIcon from '@material-ui/icons/EditTwoTone';
import {makeStyles} from "@material-ui/core";
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

function ActionToolKit ({isShowEditBtn = true,isShowActiveBtn = true,isShowDownloadBtn = true,apiName,...props}) {
    const classes = useStyles();
    const { row,api } = props;
    const [formats, setFormats] = React.useState('');
    const [mode,setCellMode] = useState('view');
    const columnToBeEdit = useRef({});
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
            columnToBeEdit.current = {
              ...columnToBeEdit.current,[r]:row[r]
            }
            index == 0 && api.setCellFocus(row.id, r);
          }
        })
        setCellMode('edit');
       }
       else{
        let isValid = false;
        Object.keys(columnToBeEdit.current).forEach((r,index) => {

          const editedCellProps = api.getEditCellPropsParams(row.id, r);
          if(!editedCellProps.props.value){
            api.setEditCellProps({ id: row.id, field: r , props: { ...editedCellProps.props, error: true } });
            isValid = false;
            return false;
          }
          else{
            isValid = true;
            api.commitCellChange(editedCellProps);
            columnToBeEdit.current[r] = editedCellProps.props.value;
            api.setCellMode(row.id, r, "view");
            index == 0 && api.setCellFocus(row.id, r);
          }
      });

      setCellMode('view');
      if(isValid){
        const updateModel = {
          id:row._id,
          ...columnToBeEdit.current, 
        }
        dispatch(handlePostActions(apiName,updateModel));
      }
        
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
    isShowDownloadBtn: PropTypes.bool,
    apiName:PropTypes.string.isRequired
}

// ActionToolKit.defaultProps = {
//     isShowEditBtn: true,
//     isShowActiveBtn: true,
//     isShowDownloadBtn: false
// }


export default ActionToolKit;

