import * as React from 'react';
import PageHeader from '../../components/PageHeader'
import { PeopleOutline } from '../../deps/ui/icons'
import Tabs from '../../components/Tabs'
import Shift from './components/Shift';


const tabs = [
    {
        title: "Shift",
        panel: <Shift />
    },
    {
        title: "Designation",
        panel: <></>
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


