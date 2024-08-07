import React from 'react'
import { TextField } from '../../deps/ui';
import PropTypes from 'prop-types';

/**
 * @param {import("@mui/material").TextFieldProps} props 
 * @returns 
 */
export default function Input(props) {

  const { name, label, variant = "outlined", value = null, error = null, onChange, sx = {}, ...other } = props;
  return (
    <TextField
      variant={variant}
      label={label}
      name={name}
      fullWidth={true}
      value={value}
      sx={sx}
      size="small"
      // onBlur={onChange}
      // InputLabelProps={{
      //     shrink: true,
      //   }}
      onChange={onChange}
      {...other}
      {...(error && { error: true, helperText: error })}
    />
  )
}


Input.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.any,
  color: PropTypes.string,
  variant: PropTypes.string,
  size: PropTypes.string,
  onChange: PropTypes.func,
  sx: PropTypes.any
}
