import React, { useState, lazy } from 'react';
import PageHeader from '../../components/PageHeader'
import { PeopleOutline } from '../../deps/ui/icons'
import Tabs from '../../components/Tabs'

const Location = lazy(() => import("./components/punch/Location"));
const IPAddress = lazy(() => import("./components/punch/IPAddress"));



const tabs = [
    {
        title: "Location",
        panel: <Location />
    },
    // {
    //     title: "IP Address",
    //     panel: <IPAddress />
    // }

]

export default function PunchRestrictions() {
    const [value, setValue] = useState('0')
    return (
        <>
            <PageHeader
                title="Punch Restrictions"
                subTitle="Manage Punch Restrictions"
                icon={<PeopleOutline fontSize="large" />}
            />
            <Tabs orientation='horizontal' value={value} setValue={setValue} TabsConfig={tabs} />
        </>

    );
}


