import * as React from 'react';
import {
    LocalizationProvider,
    DateCalendar,
    PickersDay
} from '@mui/x-date-pickers-pro';
import { AdapterDateFns } from '@mui/x-date-pickers-pro/AdapterDateFnsV3';
import { Badge } from '@mui/material';
import { format } from 'date-fns';

export default function MultiDatePicker({ name, value = [], onChange }) {
    // const [selectedDates, setSelectedDates] = React.useState([]);

    const handleDateClick = (date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        onChange({
            target: {
                name, value: value.includes(dateStr)
                    ? value.filter((d) => d !== dateStr)
                    : [...value, dateStr]
            }
        })
        // setSelectedDates((prev) =>
        //     prev.includes(dateStr)
        //         ? prev.filter((d) => d !== dateStr)
        //         : [...prev, dateStr]
        // );
    };

    const CustomPickersDay = (
        props
    ) => {
        const { day, selectedDates = [], ...other } = props;
        const dateStr = format(day, 'yyyy-MM-dd');
        const isSelected = selectedDates.includes(dateStr);

        return (
            <Badge
                overlap="circular"
            // badgeContent={isSelected ? '✔️' : undefined}
            >
                <PickersDay
                    {...other}
                    day={day}
                    selected={isSelected}
                    onClick={() => handleDateClick(day)}
                    sx={{
                        backgroundColor: isSelected ? '#1976d2' : undefined,
                        color: isSelected ? '#fff' : undefined,
                        '&:hover': { backgroundColor: '#1565c0' },
                    }}
                />
            </Badge>
        );
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateCalendar

                showDaysOutsideCurrentMonth
                slots={{
                    day: (dayProps) => (
                        <CustomPickersDay {...dayProps} selectedDates={value} />
                    ),
                }}
            />
        </LocalizationProvider>
    );
}
