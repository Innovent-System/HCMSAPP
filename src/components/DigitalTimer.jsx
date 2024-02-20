import { useEffect, useRef, useState } from 'react'
import { intervalToDuration } from '../services/dateTimeService';
import { useEntityAction, useSingleQuery } from '../store/actions/httpactions';
import { Box, Switch, InputAdornment, IconButton, FormControlLabel } from '../deps/ui'
import Controls from './controls/Controls';
import { API } from '../pages/Attendance/_Service'

const label = { inputProps: { 'aria-label': 'Switch demo' } };
const isGreaterNine = (_value) => {
    return _value > 9 ? _value : '0' + _value
}

const labelSx = {
    '& .MuiFormControlLabel-label': { fontFamily: 'Calculator', fontSize: "xx-large", pb: 1 }
}
const DEFAULT_API = API.MarkAttendance;
const DigitalTimer = () => {
    const { addEntity } = useEntityAction();
    const [timer, setTimer] = useState({ start: null, end: null });
    const spanRef = useRef(null);
    const isCheck = useRef(false);
    const interval = useRef(null);
    const { data } = useSingleQuery({ url: DEFAULT_API, params: {} }, { selectFromResult: ({ data }) => ({ data: data?.result }) });
    useEffect(() => {
        if (!timer.start) return
        interval.current = setInterval(() => {
            const { hours, minutes, seconds } = intervalToDuration({ start: timer.start, end: timer.end ?? new Date() });
            spanRef.current.lastChild.innerText = `${isGreaterNine(hours)}:${isGreaterNine(minutes)}:${isGreaterNine(seconds)}`;
            if (timer.start && timer.end) clearInterval(interval.current);
        }, 1000);

        return () => {
            clearInterval(interval.current);
        };

    }, [timer])
    useEffect(() => {
        if (data?.start) {
            isCheck.current = !data.end;
            setTimer({ start: new Date(data.start), end: data.end ? new Date(data.end) : null });
        }
    }, [data])

    const handleMarkAttendance = ({ target }) => {

        addEntity({ url: DEFAULT_API, data: { Mode: target.checked ? "IN" : "OUT" } }).then(({ data }) => {
            if (data){
                isCheck.current = !data.result.end;
                setTimer({ start: new Date(data.result.start), end: data.result.end ? new Date(data.result.end) : null });
            }
        });
    }

    return <>

        <FormControlLabel
            ref={spanRef}
            sx={labelSx}
            control={
                <Switch checked={isCheck.current} onClick={handleMarkAttendance} name="mark" color='warning' />
            }
            title='Mark Attendance'
            // inputRef={spanRef}
            label="00:00:00"
        />
        {/* <Box ref={spanRef} component="span" sx={{ fontFamily: 'Calculator', fontSize: "xx-large" }}></Box> */}

    </>
}

export default DigitalTimer;
