import React from 'react'
import AlertStatCard from './AlertStatCard'
import { essColors } from './theme'
import { useAppSelector } from '@/store/storehook'
import { useSingleQuery } from '@/store/actions/httpactions'

const PayslipCard = () => {

    const { data } = useSingleQuery(
        { url: "ESSDashboard/payslip", params: {} },
        { selectFromResult: ({ data }) => ({ data: data?.result ?? [] }) }
    );
    return (
        <AlertStatCard showModule={false} requests={data} accentColor={essColors.navy} label='PAYSLIP' />
    )
}

export default PayslipCard
