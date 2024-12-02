import React, { lazy, useState } from 'react';
import PageHeader from '../../components/PageHeader'
import { PeopleOutline } from '../../deps/ui/icons'
import Tabs from '../../components/Tabs'

const Shift = lazy(() => import('./components/Shift'));
const ApprovalStages = lazy(() => import('../ApprovalStages'));

const tabs = [
    {
        title: "Shift",
        panel: <Shift />
    },
    {
        title: "Approval Stages",
        panel: <ApprovalStages moduleName="ATTENDANCE" />
    }
]

export default function Manage() {
    const [value, setValue] = useState('0');
    return (
        <>
            <PageHeader
                title="Settings"
                subTitle="Manage Attendance Settings"
                icon={<PeopleOutline fontSize="large" />}
            />
            <Tabs orientation='horizontal' value={value} setValue={setValue} TabsConfig={tabs} />
        </>

    );
}


