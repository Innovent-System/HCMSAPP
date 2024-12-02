import React, { lazy, useState } from 'react';
import PageHeader from '../../components/PageHeader'
import { PeopleOutline } from '../../deps/ui/icons'
import Tabs from '../../components/Tabs'

const Group = lazy(() => import('./components/settings/Group'));
const Designation = lazy(() => import('./components/settings/Designation'));
const EmployeeStatus = lazy(() => import('./components/settings/EmployeeStatus'))
const ApprovalStages = lazy(()=> import('../ApprovalStages'));

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
        title: "Employee Status",
        panel: <EmployeeStatus />
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


