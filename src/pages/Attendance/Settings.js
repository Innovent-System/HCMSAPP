import * as React from 'react';
import PageHeader from '../../components/PageHeader'
import { PeopleOutline } from '../../deps/ui/icons'
import Tabs from '../../components/Tabs'
import Shift from './components/Shift';
import ApprovalStages from '../ApprovalStages';

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
    
    return (
        <>
            <PageHeader
                title="Settings"
                subTitle="Manage Attendance Settings"
                icon={<PeopleOutline fontSize="large" />}
            />
            <Tabs orientation='horizontal' TabsConfig={tabs} />
        </>

    );
}


