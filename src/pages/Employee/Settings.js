import * as React from 'react';
import PageHeader from '../../components/PageHeader'
import { PeopleOutline } from '../../deps/ui/icons'
import Tabs from '../../components/Tabs'
import Group from './components/settings/Group'
import Designation from './components/settings/Designation'



const tabs = [
    {
        title: "Group",
        panel: <Group />
    },
    {
        title: "Designation",
        panel: <Designation />
    }
]

export default function Manage() {
    return (
        <>
            <PageHeader
                title="Employee Settings"
                subTitle="Manage Employee Settings"
                icon={<PeopleOutline fontSize="large" />}
            />
            <Tabs orientation='horizontal' TabsConfig={tabs} />
        </>

    );
}


