import React from 'react'
import { TextField } from '../../deps/ui';
import PropTypes from 'prop-types';


export default function Input(props) {

    const { name, label,variant = "outlined", value,error=null, onChange,sx={}, ...other } = props;
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
            InputLabelProps={{
                shrink: true,
              }}
            onChange={onChange}
            {...other}
            {...(error && {error:true,helperText:error})}
        />
    )
}

Input.defaultProps = {
    value:null
}

Input.propTypes = {
    name:PropTypes.string,
    label:PropTypes.string,
    value:PropTypes.any,
    color:PropTypes.string,
    variant:PropTypes.string,
    size:PropTypes.string,
    onChange:PropTypes.func,
    sx:PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.func,
      PropTypes.arrayOf(
        PropTypes.func,
        PropTypes.object,
        PropTypes.bool
      )
    ])
  }
