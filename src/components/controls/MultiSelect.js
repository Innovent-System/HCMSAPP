/* eslint-disable no-use-before-define */
import React, { useRef, useState } from 'react';
import { Autocomplete, TextField, Checkbox, FormControlLabel, Popper, ButtonGroup, Button, Box } from '../../deps/ui'
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
      <ButtonGroup color="primary" fullWidth aria-label="outlined primary button group">
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

  const { name, label, value, error = null, onChange, options, dataId = "", dataName = "", isMultiple = false, ...other } = props;
  const autoCompleteRef = useRef(null);
  const convertToDefEventPara = (name, value) => ({
    target: {
      name,
      value
    }
  })


  const getOptionLabel = (option) => {
    if (Array.isArray(options) && options.indexOf(option) !== -1) {
      return option[dataName]
    }
    return ''
  }

  const handleInputeChange = (e, newValue) => {
    if (e === null && !newValue) {
      const close = autoCompleteRef.current.getElementsByClassName(
        "MuiAutocomplete-clearIndicator"
      )[0];
      close?.click();
    }
  }

  return (

    <Autocomplete
      multiple={isMultiple}
      ref={autoCompleteRef}
      // {...(isMultiple && { PopperComponent: MyPopper })}
      limitTags={2}
      // isOptionEqualToValue={(option, value) => option[dataId] === value[dataId]}
      {...other}
      value={value ?? []}
      onChange={(event, value) => onChange(convertToDefEventPara(name, value))}
      id="multiple-limit-tags"
      {...(isMultiple && { disableCloseOnSelect: true })}
      options={options}
      getOptionLabel={getOptionLabel}

      onInputChange={handleInputeChange}
      disableCloseOnSelect={isMultiple}
      disableListWrap
      ListboxComponent={ListboxComponent}
      {...(isMultiple && {
        renderOption: (props, option, { selected }) =>
        (
          <li {...props}>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {option[dataName]}
          </li>
        )

      })}

      renderInput={(params) => (
        <TextField {...params}    {...(error && { error: true, helperText: error })} variant="outlined" size='small' label={label} />
      )}
    />
  );
}

MultiSelect.propTypes = {
  dataName: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  option: PropTypes.array,
  value: PropTypes.any,
  onChange: PropTypes.func,
  isMultiple: PropTypes.bool
}

export default React.memo(MultiSelect);