import React, { useState, lazy } from 'react';
import PageHeader from '../../components/PageHeader'
import { PeopleOutline } from '../../deps/ui/icons'
import Tabs from '../../components/Tabs'
// import ApprovalStages from '../ApprovalStages';
// import Allowance from './components/Allowance';
// import Deduction from './components/Deduction';

const ApprovalStages = lazy(() => import("../ApprovalStages"));
const Allowance = lazy(() => import("./components/Allowance"));
const Deduction = lazy(() => import("./components/Deduction"));

const tabs = [
    {
        title: "Allowances",
        panel: <Allowance />
    },
    {
        title: "Deductions",
        panel: <Deduction />
    },
    {
        title: "Approval Stages",
        panel: <ApprovalStages moduleName="PAYROLL" />
    }
]

export default function Manage() {
    const [value, setValue] = useState('0')
    return (
        <>
            <PageHeader
                title="Payroll Settings"
                subTitle="Manage Payroll Settings"
                icon={<PeopleOutline fontSize="large" />}
            />
            <Tabs orientation='horizontal' value={value} setValue={setValue} TabsConfig={tabs} />
        </>

    );
}


