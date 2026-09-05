import React from 'react'
import AlertStatCard from './AlertStatCard'
import { essColors } from './theme'
import { useAppSelector } from '@/store/storehook'
import { useNavigate } from 'react-router-dom';
import { useSingleQuery } from '@/store/actions/httpactions';
import { API } from '@/pages/Leave/_Service';
import Auth from '@/services/AuthenticationService';


const MODULE_ROUTES = {
    17: "/leave/request/17",
};

const LeaveBalanceCard = () => {
    const navigate = useNavigate();

    const { data } = useSingleQuery(
        { url: API.GetLeaveDetail, params: { employeeId: Auth.getitem("userInfo").employeeId } },
        {
            selectFromResult: ({ data }) => ({
                data: data?.result?.map(e => ({
                    title: e.title,
                    subtitle: `${e.totalEntitled} out of ${e.remaining}`,
                    module: "Leave",
                    formId: 17
                })) ?? []
            })
        }
    );

    const handleAction = (req) => {
        const route = MODULE_ROUTES[req.formId] ?? "/";
        navigate(route, { state: { requestId: req.id } });
    };
    return (
        <AlertStatCard handleAction={handleAction} showModule={false} requests={data} accentColor={essColors.teal} label='LEAVE BALANCE' />
    )
}

export default LeaveBalanceCard
