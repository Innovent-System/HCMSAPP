import React, { useState } from 'react';
import PageHeader from '../../components/PageHeader'
import { PeopleOutline } from '../../deps/ui/icons'
import Tabs from '../../components/Tabs'
import ApprovalStages from '../ApprovalStages';
import LeaveType from './components/LeaveType';
import LeaveQuota from './components/LeaveQuota';



const tabs = [
    {
        title: "Leave Type",
        panel: <LeaveType />
    },
    {
        title: "Leave Quota",
        panel: <LeaveQuota />
    },
    {
        title: "Approval Stages",
        panel: <ApprovalStages moduleName="LEAVE" />
    }
]

export default function Manage() {
    const [value, setValue] = useState('0');
    return (
        <>
            <PageHeader
                title="Leave Settings"
                subTitle="Manage Leave Settings"
                icon={<PeopleOutline fontSize="large" />}
            />
            <Tabs orientation='horizontal' value={value} setValue={setValue} TabsConfig={tabs} />
        </>

    );
}


