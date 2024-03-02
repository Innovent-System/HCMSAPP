import React, { useState } from 'react';
import PageHeader from '../../components/PageHeader'
import { PeopleOutline } from '../../deps/ui/icons'
import Tabs from '../../components/Tabs'
import PaySettings from './components/setups/PaySettings';


const tabs = [
    {
        title: "Pay Setting",
        panel: <PaySettings />
    }
]

export default function Manage() {
    const [value, setValue] = useState('0')
    return (
            <Tabs orientation='horizontal' value={value} setValue={setValue} TabsConfig={tabs} />
    );
}


