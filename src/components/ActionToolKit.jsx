import React,{useState,useRef} from 'react'
import PropTypes from 'prop-types'
import {ToggleButton,ToggleButtonGroup} from '../deps/ui'
import {Delete as DeleteIcon,SaveTwoTone as SaveTwoToneIcon,EditTwoTone as EditTwoToneIcon} from '../deps/ui/icons'
import { handlePostActions } from '../store/actions/httpactions';
import { useDispatch } from "react-redux";


const Styles = {
    toggleContainer: {
      m: '2 0',
      '& .MuiToggleButton-root':{
        p:5,
        color:"pitch"
      }
    },
  };

function ActionToolKit ({isShowEditBtn = true,isShowActiveBtn = true,isShowDownloadBtn = true,apiName,...props}) {
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
     
        <ToggleButtonGroup exclusive sx={Styles.toggleContainer} value={formats} onChange={handleFormat} aria-label="device">
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

