import React from 'react'
import { FormControl, FormControlLabel, Checkbox as MuiCheckbox } from '../../deps/ui';
import PropTypes from 'prop-types';

export default function Checkbox(props) {

    const { name, label, value, onChange, ...others } = props;


    const convertToDefEventPara = (name, value) => ({
        target: {
            name, value
        }
    })

    return (
        <FormControl  {...others}>
            <FormControlLabel
                control={<MuiCheckbox
                    name={name}
                    color="primary"
                    checked={value}
                    onChange={e => onChange(convertToDefEventPara(name, e.target.checked))}
                />}
                label={label}
            />
        </FormControl>
    )
}

Checkbox.propTypes = {
    name: PropTypes.string,
    label: PropTypes.string,
    value: PropTypes.any,
    color: PropTypes.string,
    variant: PropTypes.string,
    size: PropTypes.string,
    onChange: PropTypes.func,
    sx: PropTypes.any
}