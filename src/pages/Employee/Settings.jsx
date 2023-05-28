import React, { useState } from 'react';
import PageHeader from '../../components/PageHeader'
import { PeopleOutline } from '../../deps/ui/icons'
import Tabs from '../../components/Tabs'
import Group from './components/settings/Group'
import Designation from './components/settings/Designation'
import ApprovalStages from '../ApprovalStages';



const tabs = [
    {
        title: "Group",
        panel: <Group />
    },
    {
        title: "Designation",
        panel: <Designation />
    },
    {
        title: "Approval Stages",
        panel: <ApprovalStages moduleName="EMPLOYEE" />
    }
]

export default function Manage() {
    const [value, setValue] = useState('0')
    return (
        <>
            <PageHeader
                title="Employee Settings"
                subTitle="Manage Employee Settings"
                icon={<PeopleOutline fontSize="large" />}
            />
            <Tabs orientation='horizontal' value={value} setValue={setValue} TabsConfig={tabs} />
        </>

    );
}


