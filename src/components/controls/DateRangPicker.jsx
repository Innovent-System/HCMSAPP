import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { AdapterDateFns } from '@mui/x-date-pickers-pro/AdapterDateFnsV3';

export default function BasicDateRangePicker({ 
    name, 
    fromLabel = "From", // ✅ Updated: Properly named fromLabel
    toLabel = "To", // ✅ Updated: Properly named toLabel
    value, 
    onChange, 
    size = "small", 
    error = null,
    variant = "outlined", 
    category = "date", 
    ...others 
}) {

    const convertToDefEventPara = (name, value) => ({
        target: { name, value }
    });

    const removeExpire = () => {
        setTimeout(() => {
            document.getElementsByClassName('MuiDateRangePickerToolbar-root')[0]?.parentElement?.firstChild?.remove();
        }, 100);
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateRangePicker
                value={value}
                onOpen={removeExpire}
                {...others}
                onChange={(dates) => onChange(convertToDefEventPara(name, dates))}
                localeText={{ start: fromLabel, end: toLabel }} // ✅ Correctly setting the labels
                slots={{ textField: TextField }} // ✅ Updated for MUI v6
                slotProps={{
                    textField: ({ position }) => ({
                        label: position === "start" ? fromLabel : toLabel, // ✅ Dynamically setting labels
                        variant,
                        size,
                        fullWidth: true,
                        error: !!error,
                        helperText: error,
                        ...(position === "start" ? others : {}) // Apply additional props
                    }),
                }}
                renderSeparator={() => <Box sx={{ display: 'none' }} />}
            />
        </LocalizationProvider>
    );
}
