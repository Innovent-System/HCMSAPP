import React from 'react'
import { TextField } from '@material-ui/core';

export default function Input(props) {

    const { name, label, value,error=null, onChange, ...other } = props;
    return (
        <TextField
            variant="standard"
            label={label}
            name={name}
            value={value}
            InputLabelProps={{
                shrink: true,
              }}
            onChange={onChange}
            {...other}
            {...(error && {error:true,helperText:error})}
        />
    )
}
