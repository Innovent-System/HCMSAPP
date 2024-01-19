import React, { useMemo, useState } from 'react'
import General from './General'
import Tabs from '../../../components/Tabs'
import useMediaQuery from '@mui/material/useMediaQuery'
import CompanyDetail from './CompanyDetail'
import { Fade, Grow, useTheme } from '../../../deps/ui'


const AddEmployee = () => {
    const theme = useTheme();
    
    const matches = useMediaQuery(theme.breakpoints.up('sm'));
    const [tab, setTab] = useState('0');
    const tabs = useMemo(() => [
        {
            title: "General",
            panel: <General setTab={setTab} />
        },
        {
            title: "Company",
            panel: <CompanyDetail setTab={setTab} />,
            disabled: true
        },
        {
            title: "Education",
            panel: <CompanyDetail setTab={setTab} />
        },
        {
            title: "Work & Exp",
            panel: <CompanyDetail setTab={setTab} />
        },
        {
            title: "Salary",
            panel: <CompanyDetail setTab={setTab} />
        }
    ], [])

    return (
        <>


            <Tabs sx={{ display: matches ? 'flex' : 'block' }} value={tab} setValue={setTab} TabsConfig={tabs} />

        </>
    )
}

export default AddEmployee