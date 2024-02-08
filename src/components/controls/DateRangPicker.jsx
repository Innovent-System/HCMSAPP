import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import {  LocalizationProvider } from '@mui/x-date-pickers-pro';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { AdapterDateFns } from '@mui/x-date-pickers-pro/AdapterDateFns';


// LicenseInfo.setLicenseKey(
//     'x0jTPl0USVkVZV0SsMjM1kDNyADM5cjM2ETPZJVSQhVRsIDN0YTM6IVREJ1T0b9586ef25c9853decfa7709eee27a1e'
//   );

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
            dateAdapter={AdapterDateFns}
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