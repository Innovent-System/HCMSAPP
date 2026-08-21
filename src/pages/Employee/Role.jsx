import React, { useState } from 'react'
import UserFormRights from './components/RoleTemplate';
import PageHeader from '@/components/PageHeader';
import { PeopleOutline } from '@/deps/ui/icons';
import Tabs from '../../components/Tabs'
import RoleRights from './components/RoleRights';


const tabs = [
    {
        title: "Role Template",
        panel: <RoleRights />
    },
    {
        title: "User Role",
        panel: <RoleRights isUserRole={true} />
    }
]
const Role = () => {

    const [value, setValue] = useState('0')
    return (
        <>
            <PageHeader
                title="Roles"
                subTitle="Manage Role & Rights"
                icon={<PeopleOutline fontSize="large" />}
            />
            <Tabs orientation='horizontal' value={value} setValue={setValue} TabsConfig={tabs} />
        </>

    );
}

export default Role
