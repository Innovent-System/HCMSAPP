import React, { lazy, useState } from 'react';
import PageHeader from '../../components/PageHeader'
import { PeopleOutline } from '../../deps/ui/icons'
import Tabs from '../../components/Tabs'

const ApprovalStages = lazy(() => import('../ApprovalStages'));

const tabs = [
    {
        title: "Approval Stages",
        panel: <ApprovalStages moduleName="EMPLOYEE SEPARATION" />
    }
]

export default function Manage() {
    const [value, setValue] = useState('0');
    return (
        <>
            <PageHeader
                title="Separation Settings"
                subTitle="Manage Separation Settings"
                icon={<PeopleOutline fontSize="large" />}
            />
            <Tabs orientation='horizontal' value={value} setValue={setValue} TabsConfig={tabs} />
        </>

    );
}


