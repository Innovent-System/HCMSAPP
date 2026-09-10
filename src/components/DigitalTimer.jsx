import { useEffect, useRef, useState } from 'react'
import { intervalToDuration } from '../services/dateTimeService';
import { useEntityAction, useSingleQuery } from '../store/actions/httpactions';
import { Switch, FormControlLabel, Typography } from '../deps/ui'
import { API, getTimerDisplay, getDistance, fetchLocation } from '../pages/Attendance/_Service'
import { useAppDispatch, useAppSelector } from '@/store/storehook';
import { setMarkDetail } from '@/store/slicer/attendance';

const labelSx = {
    '& .MuiFormControlLabel-label': { fontFamily: 'Calculator', color: "#fff", fontSize: "xx-large", pb: 1 }
}


const DEFAULT_API = API.MarkAttendance;

const DigitalTimer = () => {
    const { addEntity } = useEntityAction();
    // const [timer, setTimer] = useState({ start: null, end: null });
    const [locationStatus, setLocationStatus] = useState(null); // null | 'fetching' | {distance, isInside} | 'error'
    const spanRef = useRef(null);
    const isCheck = useRef(false);
    const interval = useRef(null);
    const timer = useAppSelector(e => e.attendance.markDetail);
    const dispatch = useAppDispatch();
    const { data, isAbleToMark } = useSingleQuery(
        { url: DEFAULT_API, params: {} },
        { selectFromResult: ({ data }) => ({ data: data?.result?.attendanceDetail, isAbleToMark: Boolean(data?.result?.isAbleToMark) }) }
    );

    // GPS settings from company (assumes you have this endpoint or include in mark response)
    const { data: settingsData } = useSingleQuery(
        { url: '/company/attendance-settings' },
        { selectFromResult: ({ data }) => ({ data: data?.result }) }
    );

    const settings = settingsData || {
        gpsEnabled: true, allowedRadius: 200, officeLocation: {
            latitude: 24.8907,
            longitude: 67.1991
        }
    };

    useEffect(() => {
        if (!timer.start) return;
        isCheck.current = !!timer.end;
        interval.current = setInterval(() => {
            spanRef.current.lastChild.innerText = getTimerDisplay(timer);
            if (timer.start && timer.end) clearInterval(interval.current);
        }, 1000);
        return () => clearInterval(interval.current);
    }, [timer]);

    useEffect(() => {
        if (data?.startDateTime) {
            isCheck.current = !data.end;
            dispatch(setMarkDetail({ start: new Date(data.startDateTime), end: data.endDateTime ? new Date(data.endDateTime) : null, isAbleToMark: isAbleToMark, ...data }))
        }
    }, [data]);


    useEffect(() => {
        if (isAbleToMark && !data?.startDateTime) {
            dispatch(setMarkDetail({ isAbleToMark: isAbleToMark }))
        }
    }, [isAbleToMark]);



    const handleMarkAttendance = async ({ target }) => {
        let location = null;
        const mode = target.checked ? "IN" : "OUT";
        // GPS enabled hai toh location lo
        if (settings.gpsEnabled) {
            setLocationStatus('fetching');
            try {
                location = await fetchLocation();
            } catch (err) {
                setLocationStatus({ error: err.message });
                // GPS mandatory hai toh return
                if (settings.gpsMandatory !== false) return;
            }

            // Radius check
            // if (location && settings.officeLocation) {
            //     const distance = getDistance(
            //         location.lat, location.lng,
            //         settings.officeLocation.latitude,
            //         settings.officeLocation.longitude
            //     );
            //     const isInside = distance <= settings.allowedRadius;

            //     setLocationStatus({ distance: Math.round(distance), isInside, allowedRadius: settings.allowedRadius });

            //     if (!isInside) {
            //         alert(`You are ${Math.round(distance)}m away from office. Allowed radius: ${settings.allowedRadius}m`);
            //         return;
            //     }
            // }
        }

        // API call
        const payload = {
            Mode: mode,
            ...(location && {
                latitude: location.lat,
                longitude: location.lng,
                accuracy: location.accuracy
            })
        };

        addEntity({ url: DEFAULT_API, data: payload }).then(({ data }) => {
            if (data) {
                isCheck.current = !data.result.endDateTime;
                dispatch(setMarkDetail({ start: new Date(data.result.startDateTime), end: data.result.endDateTime ? new Date(data.result.endDateTime) : null }))
            }
        });
    };

    return (
        <>
            <FormControlLabel
                ref={spanRef}
                sx={labelSx}
                control={
                    <Switch
                        checked={isCheck.current}
                        onClick={handleMarkAttendance}
                        name="mark"
                        color='warning'
                    />
                }
                title='Mark Attendance'
                label="00:00:00"
            />

            {/* Location Status */}
            {locationStatus === 'fetching' && (
                <Typography variant="caption" color="text.secondary">📍 Getting location...</Typography>
            )}
            {locationStatus?.error && (
                <Typography variant="caption" color="error">⚠️ {locationStatus.error}</Typography>
            )}
            {locationStatus?.distance !== undefined && (
                <Typography variant="caption" color={locationStatus.isInside ? 'success' : 'error'}>
                    📍 {locationStatus.distance}m / {locationStatus.allowedRadius}m
                </Typography>
            )}
        </>
    );
}

export default DigitalTimer;