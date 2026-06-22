import React, { lazy, useState } from 'react';
import PageHeader from '../../components/PageHeader'
import { PeopleOutline } from '../../deps/ui/icons'
import Tabs from '../../components/Tabs'

const ApprovalStages = lazy(() => import('../ApprovalStages'));
const PipelineTemplateBuilder = lazy(() => import('./components/PipelineTemplate'));

const tabs = [
    {
        title: "Pipeline Builder",
        panel: <PipelineTemplateBuilder />
    },
    {
        title: "Approval Stages",
        panel: <ApprovalStages moduleName="RECRUITMENT" />
    }
]

export default function Manage() {
    const [value, setValue] = useState('0');
    return (
        <>
            <PageHeader
                title="Recruitment Settings"
                subTitle="Manage Recruitment Settings"
                icon={<PeopleOutline fontSize="large" />}
            />
            <Tabs orientation='horizontal' value={value} setValue={setValue} TabsConfig={tabs} />
        </>

    );
}


