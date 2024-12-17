/* eslint-disable no-use-before-define */
import React from 'react';
import { Autocomplete, TextField, Chip } from '../../deps/ui'
import PropTypes from 'prop-types'
import { makeStyles } from '@mui/styles';


function TagInput(props) {

    const { name, label, value, error = null, onChange, options = [], isMultiple = false, ...other } = props;

    const convertToDefEventPara = (name, value) => ({
        target: {
            name,
            value
        }
    })


    return (
        <Autocomplete
            onChange={(event, value) => onChange(convertToDefEventPara(name, value))}
            options={options}
            value={value}
            freeSolo
            multiple
            renderTags={(value, props) =>
                value.map((option, index) => (
                    <Chip size='small' label={option} {...props({ index })} />
                ))
            }

            renderInput={(params) => (
                <TextField {...params} {...(error && { error: true, helperText: error })}
                    variant="outlined" size='small' label={label} />
            )}
        />
    );
}

TagInput.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    option: PropTypes.array,
    value: PropTypes.any,
    onChange: PropTypes.func,
    isMultiple: PropTypes.bool
}

export default TagInput;


const useStyles = makeStyles(() => ({
    inputRoot: {
        height: 56, // Set a fixed height for the input box
    },
    popper: {
        maxHeight: 300, // Set a fixed maximum height for the dropdown list
        overflowY: 'auto', // Allow scrolling if the options exceed the maximum height
    },
    tag: {
        maxHeight: '30px', // Set the height of the selected tags
        overflow: 'hidden', // Prevent text overflow
        display: 'flex',
        alignItems: 'center',
    },
}));