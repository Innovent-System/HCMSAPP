import React from 'react'
import AlertStatCard from './AlertStatCard'
import { essColors } from './theme'
import { useAppSelector } from '@/store/storehook'
import { useSingleQuery } from '@/store/actions/httpactions'
import Auth from '@/services/AuthenticationService'
import { compressQuery } from '@/util/reporthelper'

const PayslipCard = () => {

    const { data } = useSingleQuery(
        { url: "ESSDashboard/payslip", params: {} },
        { selectFromResult: ({ data }) => ({ data: data?.result ?? [] }) }
    );
    const handlePayslip = (req) => {
        
        const query = {
            searchParams: {
                "id": { value: [Auth.getitem("userInfo").employeeId], operator: "In" },
            },
            month: new Date(req.requestDate).getMonth() + 1,
            year: new Date(req.requestDate).getFullYear()
        }

        const url = `/payslipreport?data=${compressQuery(query)}`;
        window.open(url, "_blank", "width=1200,height=800,scrollbars=yes");
    }

    return (
        <AlertStatCard handleAction={handlePayslip} showModule={false} requests={data} accentColor={essColors.navy} label='PAYSLIP' />
    )
}

export default PayslipCard
