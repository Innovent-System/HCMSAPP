import React from "react";

import { TextField } from "../deps/ui";

const InputComponent = ({ inputRef, ...other }) => <div {...other} />;
const OutlinedDiv = ({ children, label }) => {
    return (
        <TextField
            variant="outlined"
            label={label}
            fullWidth
            multiline
            InputLabelProps={{ shrink: true }}
            InputProps={{
                inputComponent: InputComponent
            }}
            inputProps={{ children: children }}
        />
    );
};
export default OutlinedDiv;
