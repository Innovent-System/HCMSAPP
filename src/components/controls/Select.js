import React, { useRef } from 'react'
import { FormControl,makeStyles, InputLabel, Select as MuiSelect,ListItem,IconButton, MenuItem, FormHelperText,ListItemIcon,ListItemText,Checkbox } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {Clear,Check} from '@material-ui/icons'

const useStyles = makeStyles((theme) => ({

    firstItem: {
      
      "& .MuiIconButton-root":{
          fontSize:'0.9rem',
          borderRadius:'inherit'
      },
      

    }
    
  }));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const IgnoreDisabledListItem = React.forwardRef(function IgnoreDisabledListItem(
  { disabled, ...other },
  ref
) {
  return <ListItem  divider {...other} ref={ref} />;
});

export default function Select(props) {

    const { name, label, value,error=null, onChange,dataId = "",dataName = "",isMultiple = false, options,...others } = props;
    const classes = useStyles();
    const isAllSelected =
    options.length > 0 && value?.length === options.length;
    
    const renderValue = (selected) => {
       
        if(selected.length && selected.length > 4){
            const data = selected.slice(0,4);
            return options.filter(f => data.includes(f[dataId])).map(f => f[dataName]).join(",");
        }

        return options.filter(f => selected.includes(f[dataId])).map(f => f[dataName]).join(",");
    }
    

    const handleSelectBtn = (event) => {
        const { target } = event;
        if(isMultiple){
            if(target.value[target.value.length -1] === "all"){
                target.value = options.map(o => o[dataId]);
            } 
            else if(target.value[target.value.length -1] === "clear"){
                target.value = [];
            }
        }

        return event;
    }

    return (
    
        <FormControl {...others} fullWidth {...others} variant="standard"
        {...(error && {error:true})}>
            <InputLabel>{label}</InputLabel>
        {isMultiple ? <MuiSelect
        labelId="mutiple-select-label"
        multiple
        name={name}
        value={value}
        onChange={(e) => onChange(handleSelectBtn(e))}
        renderValue={renderValue}
        MenuProps={MenuProps}
      >
          
            <MenuItem value='all'>
                <ListItemIcon>
                   <Check/>
                </ListItemIcon>
                <ListItemText primary='Select All' />
            </MenuItem>
            <MenuItem value='clear'>
                <ListItemIcon>
                     <Clear/>
                </ListItemIcon>
                <ListItemText primary='Clear All' />
            </MenuItem>
          
          
          
        
        
        {options.map((option,index) => (
          <MenuItem key={index} value={option[dataId]}>
            <ListItemIcon>
              <Checkbox color="primary" checked={value.findIndex(f => f === option[dataId]) > -1} />
            </ListItemIcon>
            <ListItemText primary={option[dataName]} />
          </MenuItem>
        ))}
      </MuiSelect> :
                <MuiSelect
                label={label}
                name={name}
                value={value}
                onChange={onChange}>
                <MenuItem value="">None</MenuItem>
                {
                    options.map(
                        item => (<MenuItem {...(value && { selected: value })} key={item.id} value={item.id}>{item.title}</MenuItem>)
                    )
                }
            </MuiSelect>
      
      }
            

            
            {error && <FormHelperText>{error}</FormHelperText>}
        </FormControl>
    )
}
