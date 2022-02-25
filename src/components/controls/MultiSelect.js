/* eslint-disable no-use-before-define */
import React, { useRef } from 'react';
import { Autocomplete, TextField, Checkbox, Popper, ButtonGroup, Button, Box } from '../../deps/ui'
import { Check, Clear, CheckBox as CheckBoxIcon, CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon } from '../../deps/ui/icons'
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
        <Button startIcon={<Check />} color="primary" onClick={addAllClick}>
          Add All
        </Button>
        <Button startIcon={<Clear />} color="primary" onClick={clearClick}>
          Clear
        </Button>
      </ButtonGroup>
      {props.children}
    </Popper>
  );
}

function MultiSelect(props) {

  const { name, label, value, error = null, onChange, options, dataName = "", isMultiple = false, ...other } = props;
  const autoCompleteRef = useRef(null);
  const convertToDefEventPara = (name, value) => ({
    target: {
      name, value
    }
  })


  const getOptionLabel = (option) => {
    if(Array.isArray(options) && options.indexOf(option) !== -1){
      return option[dataName]
    }
    return emptyString
  }

  const handleInputeChange = (e,newValue) => {
    if(e === null && !newValue){
      const close = autoCompleteRef.current.getElementsByClassName(
        "MuiAutocomplete-clearIndicator"
      )[0];
      close.click();
      // const event = new Event('change',{ bubbles: true});
      // autoCompleteRef.current.querySelector("input").dispatchEvent(event);
    }
  }
  

  return (
    <Box sx={Styles.root}>
      <Autocomplete
        multiple={isMultiple}
        ref={autoCompleteRef}
        {...(isMultiple && { PopperComponent: MyPopper })}
        limitTags={2}
        isOptionEqualToValue={(option, value) => option[dataName] === value[dataName]}
        {...other}
        value={value}
        onChange={(event, value) => onChange(convertToDefEventPara(name, value))}
        size='small'
        id="multiple-limit-tags"
        options={options}
        getOptionLabel={getOptionLabel}
        onInputChange={handleInputeChange}
        ListboxComponent={ListboxComponent}
        {...(isMultiple && {
          renderOption: (option, state) => {

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
          }
        })}

        renderInput={(params) => (
          <TextField {...params}  {...(error && { error: true, helperText: error })} variant="standard" label={label} />
        )}
      />
    </Box>
  );
}

MultiSelect.propTypes = {
  dataName: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.any,
  onChange: PropTypes.func,
  isMultiple:PropTypes.bool,
  option:PropTypes.array.isRequired
}

export default React.memo(MultiSelect);