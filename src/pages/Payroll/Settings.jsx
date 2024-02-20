import React, { useState } from 'react';
import PageHeader from '../../components/PageHeader'
import { PeopleOutline } from '../../deps/ui/icons'
import Tabs from '../../components/Tabs'
import ApprovalStages from '../ApprovalStages';



const tabs = [
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


