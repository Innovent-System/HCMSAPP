/* eslint-disable no-use-before-define */
import React, { useEffect, useId, useRef, useState } from 'react';
import { Autocomplete, TextField, Checkbox, FormControlLabel, Popper, ButtonGroup, Button, Box, Chip } from '../../deps/ui'
import { Check, Clear, CheckBox as CheckBoxIcon, CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon } from '../../deps/ui/icons'
import ListboxComponent from '../ReactWindow';
import PropTypes from 'prop-types'

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

//Multiple ki default value array hai

function MultiSelect(props) {
  const { name, label, value, error = null, onChange, options = [], dataId = "", dataName = "", isMultiple = false, ...other } = props;
  const autoCompleteRef = useRef(null);
  const inputId = useId();

  const convertToDefEventPara = (name, value) => ({
    target: {
      name,
      value
    }
  })

  useEffect(() => {
    if (isMultiple && autoCompleteRef.current && !options.length && value.length) {
      const close = autoCompleteRef.current.getElementsByClassName(
        "MuiAutocomplete-clearIndicator"
      )[0];
      close?.click();
    }
  }, [options])

  const getOptionLabel = (option) => {
    // Handle "Select All" option
    if (option.isSelectAll) return 'Select All';
    return option[dataName] ?? '';
  };

  const handleInputeChange = (e, newValue) => {
    if (e === null && !newValue) {
      const close = autoCompleteRef.current.getElementsByClassName(
        "MuiAutocomplete-clearIndicator"
      )[0];
      close?.click();
    }
  }

  const handleSelectAll = () => {
    onChange(convertToDefEventPara(name, options));
  };

  const handleClearAll = () => {
    onChange(convertToDefEventPara(name, []));
  };

  const allSelected = isMultiple && value.length === options.length && options.length > 0;
  const someSelected = isMultiple && value.length > 0 && value.length < options.length;

  // Add "Select All" option to the beginning of options list
  const optionsWithSelectAll = isMultiple
    ? [{ isSelectAll: true, [dataName]: 'Select All' }, ...options]
    : options;

  return (
    <Autocomplete
      multiple={isMultiple}
      ref={autoCompleteRef}
      limitTags={1}
      isOptionEqualToValue={(option, value) => {
        if (option.isSelectAll) return false;
        return option[dataName] === value[dataName];
      }}
      {...other}
      value={value}
      onChange={(event, newValue, reason) => {
        // Check if "Select All" was clicked
        const selectAllClicked = isMultiple && newValue?.some(item => item.isSelectAll);

        if (selectAllClicked) {
          if (allSelected) {
            handleClearAll();
          } else {
            handleSelectAll();
          }
        } else {
          onChange(convertToDefEventPara(name, newValue));
        }
      }}
      id={inputId}
      size="small"
      options={optionsWithSelectAll}
      getOptionLabel={getOptionLabel}
      onInputChange={handleInputeChange}
      disableCloseOnSelect={isMultiple}
      disableListWrap
      slotProps={{
        listbox: { component: ListboxComponent },
        popper: {
          sx: {
            minWidth: 250
          }
        }
      }}
      {...(isMultiple && {
        renderOption: ({ key, ..._prop }, option, { selected }) => {
          // Render "Select All" option
          if (option.isSelectAll) {
            return (
              <li
                key={key}
                {..._prop}
                style={{
                  borderBottom: '1px solid #e0e0e0',
                  fontWeight: 'bold'
                }}
              >
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  indeterminate={someSelected}
                  checked={allSelected}
                />
                All
              </li>
            );
          }

          // Render regular options
          return (
            <li key={key} {..._prop}>
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                checked={selected}
              />
              {option[dataName]}
            </li>
          );
        },

        renderTags: (value, getTagProps, _prop) => {
          return value.slice(0, _prop.limitTags).map((option, index) => {
            const { key, ...chipProp } = getTagProps({ index });
            return (
              <Chip
                key={key}
                label={option[dataName]}
                size="small"
                {...chipProp}
              />
            )
          })
        }
      })}

      renderInput={(params) => (
        <TextField
          {...params}
          {...(error && { error: true, helperText: error })}
          variant="outlined"
          size='small'
          label={label}
        />
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