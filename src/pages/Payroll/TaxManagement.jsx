import React, { useState, lazy } from 'react';
import PageHeader from '../../components/PageHeader'
import { PeopleOutline } from '../../deps/ui/icons'
import Tabs from '../../components/Tabs'

const TaxAdjustment = lazy(() => import("./components/tax/TaxAdjustment"));
const TaxOpening = lazy(() => import("./components/tax/TaxOpening"));
const TaxAdjustmentType = lazy(() => import("./components/tax/TaxAdjustmentType"));


const tabs = [
    {
        title: "Tax Adjustment",
        panel: <TaxAdjustment />
    },
    {
        title: "Tax Opening",
        panel: <TaxOpening />
    },
    {
        title: "Tax Adjustment Type",
        panel: <TaxAdjustmentType />
    },

]

export default function TaxManage() {
    const [value, setValue] = useState('0')
    return (
        <>
            <PageHeader
                title="Tax Management"
                subTitle="Manage Tax"
                icon={<PeopleOutline fontSize="large" />}
            />
            <Tabs orientation='horizontal' value={value} setValue={setValue} TabsConfig={tabs} />
        </>

    );
}


