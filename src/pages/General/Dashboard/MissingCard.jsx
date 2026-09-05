import React from 'react'
import AlertStatCard from './AlertStatCard'
import { essColors } from './theme'
import { useAppSelector } from '@/store/storehook'
import { useNavigate } from 'react-router-dom';


const MODULE_ROUTES = {
    12: "/attendance/request/12"
};

const MissingCard = () => {
    const navigate = useNavigate();
    const data = useAppSelector(e => e.attendance.missingAttendaceList);

    const handleAction = (req) => {
        const route = MODULE_ROUTES[req.formId] ?? "/";
        navigate(route, { state: { requestId: req.id } });
    };
    return (
        <AlertStatCard handleAction={handleAction} showModule={false} requests={data} accentColor={essColors.red} label='MISSING ATTENDANCE' />
    )
}

export default MissingCard
