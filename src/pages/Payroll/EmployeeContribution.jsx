import React, { useState, lazy } from 'react';
import PageHeader from '../../components/PageHeader'
import { PeopleOutline } from '../../deps/ui/icons'
import Tabs from '../../components/Tabs'

const EmployeeContributionPolicy = lazy(() => import("./components/contribution/EmployeeContributionPolicy"));
const EmployeeContributionType = lazy(() => import("./components/contribution/EmployeeContributionType"));
const EmployeeContributionOpening = lazy(() => import("./components/contribution/EmployeeContributionOpening"));


const tabs = [
    { title: "Policies", panel: <EmployeeContributionPolicy /> },
    { title: "Scheme Types", panel: <EmployeeContributionType /> },
    { title: "Opening Balances", panel: <EmployeeContributionOpening /> },
]

export default function EmployeeContribution() {
    const [value, setValue] = useState('0')
    return (
        <>
            <PageHeader
                title="Employee Contribution"
                subTitle="Manage policies, scheme types and opening balances"
                icon={<PeopleOutline fontSize="large" />}
            />
            <Tabs orientation='horizontal' value={value} setValue={setValue} TabsConfig={tabs} />
        </>

    );
}


