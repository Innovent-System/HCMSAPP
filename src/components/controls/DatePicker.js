import React from 'react'
import { LocalizationProvider, TextField, MobileDateTimePicker, DesktopDateTimePicker, DesktopDatePicker, MobileDatePicker, DesktopTimePicker, MobileTimePicker } from "../../deps/ui";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import DateAdapter from '@mui/lab/AdapterDateFns';
import PropTypes from 'prop-types';



export default function DatePicker(props) {

    const { name, label, value, onChange, size = "small", error = null, variant = "outlined", category = "date", ...others } = props
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));


    const convertToDefEventPara = (name, value) => ({
        target: {
            name, value
        }
    })

    const renderDateTime = () => {
        if (category === "datetime") {
            return <>
                {isDesktop ?
                    <DesktopDateTimePicker
                        label={label}
                        {...others}
                        name={name}
                        value={value}
                        onChange={date => onChange(convertToDefEventPara(name, date))}
                        renderInput={(params) => <TextField fullWidth={true} {...(error && { error: true, helperText: error })} size={size} variant={variant}  {...params} />}

                    />
                    :
                    <MobileDateTimePicker
                        label={label}
                        {...others}
                        name={name}
                        value={value}
                        onChange={date => onChange(convertToDefEventPara(name, date))}
                        renderInput={(params) => <TextField size={size} {...(error && { error: true, helperText: error })} fullWidth={true} variant={variant}  {...params} />}

                    />
                }
            </>
        }
        else if (category === "time") {
            return <>
                {isDesktop ?
                    <DesktopTimePicker
                        label={label}
                        {...others}
                        name={name}
                        value={value}
                        onChange={date => onChange(convertToDefEventPara(name, date))}
                        renderInput={(params) => <TextField size={size} {...(error && { error: true, helperText: error })} fullWidth={true} variant={variant}  {...params} />}
                    />
                    :
                    <MobileTimePicker
                        label={label}
                        {...others}
                        name={name}
                        value={value}
                        onChange={date => onChange(convertToDefEventPara(name, date))}
                        renderInput={(params) => <TextField size={size} {...(error && { error: true, helperText: error })} fullWidth={true} variant={variant}  {...params} />}

                    />
                }
            </>
        } else {
            return <>
                {isDesktop ?
                    <DesktopDatePicker
                        label={label}
                        {...others}
                        name={name}
                        value={value}
                        onChange={date => onChange(convertToDefEventPara(name, date))}
                        renderInput={(params) => <TextField size={size} {...(error && { error: true, helperText: error })} fullWidth={true} variant={variant}  {...params} />}
                    />
                    :
                    <MobileDatePicker
                        label={label}
                        {...others}
                        name={name}
                        value={value}
                        onChange={date => onChange(convertToDefEventPara(name, date))}
                        renderInput={(params) => <TextField {...(error && { error: true, helperText: error })} size={size} fullWidth={true} variant={variant}  {...params} />}

                    />
                }
            </>
        }
    }

    return (
        <LocalizationProvider dateAdapter={DateAdapter}>
            {renderDateTime()}
        </LocalizationProvider>
    )
}

DatePicker.defaultProps = {
    value: null
}

DatePicker.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.any,
    size: PropTypes.string,
    onChange: PropTypes.func,
    sx: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.func,
        PropTypes.arrayOf(
            PropTypes.func,
            PropTypes.object,
            PropTypes.bool
        )
    ])
}
