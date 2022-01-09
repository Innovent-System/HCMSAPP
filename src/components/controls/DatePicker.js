import React from 'react'
import { LocalizationProvider,TextField ,DesktopDatePicker,MobileDatePicker} from "../../deps/ui";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import  DateAdapter from '@mui/lab/AdapterDateFns';


export default function DatePicker(props) {

    const { name, label, value, onChange } = props
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));


    const convertToDefEventPara = (name, value) => ({
        target: {
            name, value
        }
    })
    
    return (
        <LocalizationProvider dateAdapter={DateAdapter}>
            {isDesktop ? 
            <DesktopDatePicker  
            label={label}
            inputFormat="MM/dd/yyyy"
            mask='__/__/____'
            name={name}
            value={value} 
            onChange={date => onChange(convertToDefEventPara(name,date))}
            renderInput={(params) => <TextField variant="standard"  {...params} />}

        />
            :
            <MobileDatePicker  
                label={label}
                inputFormat="MMM/dd/yyyy"
                name={name}
                value={value} 
                onChange={date => onChange(convertToDefEventPara(name,date))}
                renderInput={(params) => <TextField variant="standard"  {...params} />}

            />
    }
        </LocalizationProvider>
    )
}
