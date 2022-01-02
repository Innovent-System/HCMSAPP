import React, { useRef,useState } from 'react'
import Avatar from './Avatar';
import { Badge,Input,IconButton} from '@material-ui/core'
import {PhotoCamera,Delete} from '@material-ui/icons'


const AvatarUpload = (props) => {

    const { name, value, onChange,...others } = props;
    const inputFileRef = useRef(null);

    const clear = () => {
      inputFileRef.current.firstElementChild.value = null;
      var event = new Event('change',{ bubbles: true});
      inputFileRef.current.firstElementChild.dispatchEvent(event);
    }

    const onImageChange = async (event) => {
      if (event.target.files && event.target.files[0]) { 
         return await new Promise((resolve) => {
      
      
          let fileReader = new FileReader();
          fileReader.onload = (e) => resolve({target: {
            name:name,
            value: fileReader.result
          }});
          fileReader.readAsDataURL(event.target.files[0]); 
      
       });
     }
     else{
      return {target: {
        name:name,
        value: null
      }}
     }
    }

    return (
        <Badge
        overlap="circular"
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        badgeContent={
          <>
            <label style={{display: value && 'none'}} htmlFor="icon-button-file">
              <Input style={{display:'none'}}  name={name} innerRef={inputFileRef}  onChange={async (e) => onChange(await onImageChange(e))} accept="image/*"  id="icon-button-file" type="file" />
                <IconButton size='medium' color="primary" aria-label="upload picture" component="span">
                <PhotoCamera />
              </IconButton> 
           </label> 
           <IconButton style={{display: !value && 'none'}} size='medium' onClick={clear} color="primary" aria-label="upload picture" component="span">
             <Delete />
          </IconButton>
          
        </>

        }
      >
        <Avatar {...others} size="large" alt="Travis Howard" src={value} />
      </Badge>
    )
}

export default AvatarUpload
