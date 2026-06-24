import { useEffect, useRef, useState } from 'react'
import { intervalToDuration } from '../services/dateTimeService';
import { useEntityAction, useSingleQuery } from '../store/actions/httpactions';
import { Switch, FormControlLabel, Typography } from '../deps/ui'
import { API } from '../pages/Attendance/_Service'

const labelSx = {
    '& .MuiFormControlLabel-label': { fontFamily: 'Calculator', fontSize: "xx-large", pb: 1 }
}

function getTimerDisplay(timer) {
    const duration = intervalToDuration({
        start: timer.start,
        end: timer.end ?? new Date()
    });
    const h = String(duration.hours ?? 0).padStart(2, '0');
    const m = String(duration.minutes ?? 0).padStart(2, '0');
    const s = String(duration.seconds ?? 0).padStart(2, '0');
    return `${h}:${m}:${s}`;
}

// Haversine distance in meters
const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371000;
    const toRad = (deg) => deg * (Math.PI / 180);
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const DEFAULT_API = API.MarkAttendance;

const DigitalTimer = () => {
    const { addEntity } = useEntityAction();
    const [timer, setTimer] = useState({ start: null, end: null });
    const [locationStatus, setLocationStatus] = useState(null); // null | 'fetching' | {distance, isInside} | 'error'
    const spanRef = useRef(null);
    const isCheck = useRef(false);
    const interval = useRef(null);

    const { data } = useSingleQuery(
        { url: DEFAULT_API, params: {} },
        { selectFromResult: ({ data }) => ({ data: data?.result }) }
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
        interval.current = setInterval(() => {
            spanRef.current.lastChild.innerText = getTimerDisplay(timer);
            if (timer.start && timer.end) clearInterval(interval.current);
        }, 1000);
        return () => clearInterval(interval.current);
    }, [timer]);

    useEffect(() => {
        if (data?.start) {
            isCheck.current = !data.end;
            setTimer({ start: new Date(data.start), end: data.end ? new Date(data.end) : null });
        }
    }, [data]);

    const fetchLocation = () => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation not supported'));
                return;
            }
            navigator.geolocation.getCurrentPosition(
                (pos) => resolve({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                    accuracy: pos.coords.accuracy
                }),
                (err) => reject(new Error(err.message)),
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        });
    };

    const handleMarkAttendance = async ({ target }) => {
        let location = null;

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
            Mode: target.checked ? "IN" : "OUT",
            ...(location && {
                latitude: location.lat,
                longitude: location.lng,
                accuracy: location.accuracy
            })
        };

        addEntity({ url: DEFAULT_API, data: payload }).then(({ data }) => {
            if (data) {
                isCheck.current = !data.result.end;
                setTimer({ start: new Date(data.result.start), end: data.result.end ? new Date(data.result.end) : null });
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