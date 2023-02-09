import React from 'react'
import { FormControl, FormLabel, RadioGroup as MuiRadioGroup, FormControlLabel, Radio } from '../../deps/ui';
import PropTypes from 'prop-types';

export default function RadioGroup(props) {

    const { name, label, value, onChange, items } = props;

    return (
        <FormControl>
            <FormLabel>{label}</FormLabel>
            <MuiRadioGroup row
                name={name}
                value={value}
                onChange={onChange}>
                {
                    items.map(
                        item => (
                            <FormControlLabel key={item.id} value={item.id} control={<Radio />} label={item.title} />
                        )
                    )
                }
            </MuiRadioGroup>
        </FormControl>
    )
}


RadioGroup.defaultProps = {
    value:null
}

RadioGroup.propTypes = {
    name:PropTypes.string.isRequired,
    label:PropTypes.string.isRequired,
    value:PropTypes.any,
    onChange:PropTypes.func,
    items:PropTypes.array,
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