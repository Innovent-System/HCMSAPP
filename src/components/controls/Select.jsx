import React from 'react'
import { FormControl, InputLabel, Select as MuiSelect, MenuItem, FormHelperText, ListItemIcon, ListItemText, Checkbox } from '../../deps/ui';
import { Clear, Check } from '../../deps/ui/icons';
import PropTypes from 'prop-types';

const Styles = {

  firstItem: {

    "& .MuiIconButton-root": {
      fontSize: '0.9rem',
      borderRadius: 'inherit'
    },


  }

};

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


function Select(props) {

  const { name, label, value, error = null, onChange, disableitems, isNone = true, dataId = "", dataName = "", isMultiple = false, options = [], ...others } = props;

  const isAllSelected =
    options?.length > 0 && value?.length === options?.length;

  const renderValue = (selected) => {

    if (selected.length && selected.length > 4) {
      const data = selected.slice(0, 4);
      return options.filter(f => data.includes(f[dataId])).map(f => f[dataName]).join(",");
    }

    return options.filter(f => selected.includes(f[dataId])).map(f => f[dataName]).join(",");
  }


  const handleSelectBtn = (event) => {
    const { target } = event;
    if (isMultiple) {
      if (target.value[target.value.length - 1] === "all") {
        target.value = options.map(o => o[dataId]);
      }
      else if (target.value[target.value.length - 1] === "clear") {
        target.value = [];
      }
    }

    return event;
  }

  return (

    <FormControl fullWidth   {...others} size="small"
      {...(error && { error: true })}>
      <InputLabel id={`demo-multiple-name-${name}`}>{label}</InputLabel>
      {isMultiple ? <MuiSelect
        size='small'
        labelId={`demo-multiple-name-${name}`}
        multiple
        name={name}
        value={value}
        onChange={(e) => onChange(handleSelectBtn(e))}
        renderValue={renderValue}
        MenuProps={MenuProps}
      >

        <MenuItem value='all'>
          <ListItemIcon>
            <Check />
          </ListItemIcon>
          <ListItemText primary='Select All' />
        </MenuItem>
        <MenuItem value='clear'>
          <ListItemIcon>
            <Clear />
          </ListItemIcon>
          <ListItemText primary='Clear All' />
        </MenuItem>

        {options.map((option, index) => (
          <MenuItem key={index} value={option[dataId] || ""}>
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
          size='small'
          value={value}
          onChange={onChange}>
          {isNone && <MenuItem value="">None</MenuItem>}
          {
            options.map(
              item => (<MenuItem  {...(value && { selected: true })} {...(disableitems?.length && { disabled: disableitems.includes(item[dataId]) })} key={item[dataId]} value={item[dataId]}>{item[dataName]}</MenuItem>)
            )
          }
        </MuiSelect>

      }

      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  )
}

Select.propTypes = {
  dataId: PropTypes.string,
  dataName: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
  isMultiple: PropTypes.bool,
  isNone: PropTypes.bool,
  options: PropTypes.array
}



export default React.memo(Select); 
