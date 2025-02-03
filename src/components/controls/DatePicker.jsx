import React, { useCallback } from 'react';
import { LocalizationProvider, TextField, MobileDateTimePicker, DesktopDateTimePicker, DesktopDatePicker, MobileDatePicker, DesktopTimePicker, MobileTimePicker } from "../../deps/ui";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { AdapterDateFns } from '@mui/x-date-pickers-pro/AdapterDateFnsV3';
import PropTypes from 'prop-types';

export default function DatePicker(props) {
    const { name, label, value = null, onChange, size = "small", error = null, variant = "outlined", category = "date", ...others } = props;
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

    const convertToDefEventPara = (name, value) => ({
        target: { name, value }
    });

    const renderDateTime = useCallback(() => {
        const commonProps = {
            label,
            name,
            value,
            onChange: (date) => onChange(convertToDefEventPara(name, date)),
            slotProps: { textField: { size, error: !!error, helperText: error, fullWidth: true, variant } } // ✅ Updated here
        };

        if (category === "datetime") {
            return isDesktop ? <DesktopDateTimePicker {...commonProps} {...others} /> : <MobileDateTimePicker {...commonProps} {...others} />;
        } 
        else if (category === "time") {
            return isDesktop ? <DesktopTimePicker {...commonProps} {...others} /> : <MobileTimePicker {...commonProps} {...others} />;
        } 
        else {
            return isDesktop ? <DesktopDatePicker {...commonProps} {...others} /> : <MobileDatePicker {...commonProps} {...others} />;
        }
    }, [onChange]);

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            {renderDateTime()}
        </LocalizationProvider>
    );
}

DatePicker.propTypes = {
    name: PropTypes.string,
    label: PropTypes.string,
    value: PropTypes.any,
    error: PropTypes.string,
    size: PropTypes.string,
    onChange: PropTypes.func,
    category: PropTypes.oneOf(["datetime", 'date', 'time']),
    sx: PropTypes.any
};
