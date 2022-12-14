import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { LicenseInfo, LocalizationProvider } from '@mui/x-date-pickers-pro';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import DateAdapter from '@mui/lab/AdapterDateFns';
import { useRef, useEffect } from 'react';

// const Key = '0f94d8b65161817ca5d7f7af8ac2f042T1JERVI6TVVJLVN0b3J5Ym9vayxFWFBJUlk9MTY1NDg1ODc1MzU1MCxLRVlWRVJTSU9OPTE=';
// LicenseInfo.setLicenseKey(Key);

export default function BasicDateRangePicker({ name, fromlabel = "From", toLable = "To", value, onChange, size = "small", error = null,
    variant = "outlined", category = "date", ...others }) {

    const convertToDefEventPara = (name, value) => ({
        target: {
            name, value
        }
    })

    const removeExpire = () => {
        setTimeout(() => {
            document.getElementsByClassName('MuiDateRangePickerToolbar-root')[0].parentElement.firstChild.remove();
        }, [100])
    }

    return (
        <LocalizationProvider
            dateAdapter={DateAdapter}
            localeText={{ start: fromlabel, end: toLable }}
        >
            <DateRangePicker
                value={value}
                onOpen={removeExpire}
                {...others}
                onChange={dates => onChange(convertToDefEventPara(name, dates))}
                renderInput={(startProps, endProps) => (
                    <>
                        <TextField variant={variant} size={size} fullWidth {...(error && { error: true, helperText: error })} {...startProps} />
                        <Box sx={{ mx: 1 }}></Box>
                        <TextField variant={variant} size={size} fullWidth {...(error && { error: true, helperText: error })} {...endProps} />
                    </>
                )}
            />
        </LocalizationProvider>
    );
}