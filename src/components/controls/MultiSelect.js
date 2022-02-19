/* eslint-disable no-use-before-define */
import React from 'react';
import {Autocomplete,TextField,Checkbox,Popper,ButtonGroup,Button,Box} from '../../deps/ui'
import { Check,Clear,CheckBox as CheckBoxIcon,CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon } from '../../deps/ui/icons'
import ListboxComponent from '../ReactWindow';
import PropTypes from 'prop-types'

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const Styles = {
  root: {
    '& > * + *': {
      mt: 3,
    },
    
  }
};

const MyPopper = function (props) {
  const addAllClick = (e) => {
    e.preventDefault();
    console.log('Add All');
  }
  const clearClick = (e) => {
    e.preventDefault();
    console.log('Clear');
  }
  return (
    <Popper {...props}>
      <ButtonGroup color="primary" aria-label="outlined primary button group">
        <Button startIcon={<Check/>} color="primary" onClick={addAllClick}>
          Add All
        </Button>
        <Button startIcon={<Clear/>} color="primary" onClick={clearClick}>
          Clear
        </Button>
      </ButtonGroup>
      {props.children}
    </Popper>
  );
}

function MultiSelect(props) {
  
  const { name, label, value,error=null, onChange,options,dataName = "",isMultiple = false ,...other } = props;

  const convertToDefEventPara = (name, value) => ({
    target: {
        name, value
    }
  })

  return (
    <Box sx={Styles.root}>
      <Autocomplete
        multiple={isMultiple}
        {...(isMultiple && {PopperComponent:MyPopper})}
        limitTags={2}
        isOptionEqualToValue={(option, value) => option[dataName] === value[dataName]}
        {...other}
        value={value}
        onChange={(event, value) => onChange(convertToDefEventPara(name,value))}
        size='small'
        id="multiple-limit-tags"
        options={options}
        getOptionLabel={option => option[dataName] ? option[dataName] : ''}
        ListboxComponent={ListboxComponent}
        {...(isMultiple && {renderOption:(option, state) => {
         
          return (
            <React.Fragment>
              <Checkbox
                icon={icon}
                color='primary'
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={state.selected}
              />
              {option[dataName]}
            </React.Fragment>
          );
        } })}

        renderInput={(params) => (
          <TextField {...params}  {...(error && {error:true,helperText:error})}  variant="standard" label={label} />
        )}
      />
    </Box>
  );
}

MultiSelect.propTypes = {
  dataName: PropTypes.string.isRequired
}

export default React.memo(MultiSelect);