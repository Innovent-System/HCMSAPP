import React, { useState, useRef, useMemo, useEffect } from 'react';
import PageHeader from '../../components/PageHeader'
import { PeopleOutline, Add } from '../../deps/ui/icons'
import { Stack, IconButton, Divider, Grid } from '../../deps/ui'
import Tabs from '../../components/Tabs'
import PaySettings from './components/setups/PaySettings';
import Popup from '../../components/Popup';
import Controls from '../../components/controls/Controls'
import { useAppSelector } from '../../store/storehook';
import { AutoForm } from '../../components/useForm'
import { useEntityAction, useLazyEntityByIdQuery } from '../../store/actions/httpactions';
import { API } from './_Service';
import { AutoDeduction } from './components/setups/AutoDeduction';



const DEFAULT_API = API.PayrollSetup;
export default function Manage() {
    const [openPopup, setOpenPopup] = useState(false);
    const titleFormApi = useRef(null);
    const { PayrollSetups } = useAppSelector(c => c.appdata.payrollData);
    const { addEntity } = useEntityAction();
    const [getPayrollSetup] = useLazyEntityByIdQuery();
    const [setup, setSetup] = useState(null);
    const [value, setValue] = useState('0');
    const [setupId, setSetupId] = useState(() => PayrollSetups?.length ? PayrollSetups[0]._id : "");
    const handleSetup = (id) => getPayrollSetup({ url: DEFAULT_API, id }).then(p => {
        setSetupId(id);
        setSetup(p.data.result);
    });

    useEffect(() => {
        if (PayrollSetups?.length) handleSetup(PayrollSetups[0]._id);
    }, [PayrollSetups])

    const handleSubmit = () => {
        const { getValue, validateFields } = titleFormApi.current
        if (!validateFields()) return;
        addEntity({ url: DEFAULT_API, data: [getValue()] });
    }

    const tabs = useMemo(() =>
        [
            {
                title: "Pay Setting",
                panel: <PaySettings key="PaySettings" data={setup} />
            },
            {
                title: "Auto Dedcution",
                panel: <AutoDeduction key="AutoDeduction" data={setup} />
            }
        ]
        , [setup])

    const tileFormData = [
        {
            elementType: "inputfield",
            name: "name",
            label: `Setup Title`,
            required: true,
            onKeyDown: (e) => e.keyCode == 13 && handleSubmit(),
            validate: {
                errorMessage: `Setup Title is required`
            },
            defaultValue: ""
        }
    ];

    const handleShow = () => {
        const { resetForm } = titleFormApi.current
        // isEdit.current = false;
        resetForm()
        setOpenPopup(true);
    }

    return (
        <>
            <Popup
                title="Add Payroll Setup"
                openPopup={openPopup}
                maxWidth="sm"
                keepMounted={true}
                isEdit={false}
                addOrEditFunc={handleSubmit}
                setOpenPopup={setOpenPopup}>
                <AutoForm formData={tileFormData} ref={titleFormApi} isValidate={true} />
            </Popup>
            <Grid container justifyContent={{ sm: "flex-start", md: "flex-end" }}>
                <Grid item size={{ sm: 12, md: 3, lg: 2 }} >
                    <Controls.Select
                        options={PayrollSetups}
                        label='Payroll Setup'
                        value={setupId}
                        onChange={(e) => handleSetup(e.target.value)}
                        name='setup'
                        dataId='_id'
                        dataName="name"
                        isNone={false}
                    />
                </Grid>

                <IconButton onClick={handleShow}><Add /></IconButton>
            </Grid>

            <Tabs orientation='horizontal' value={value} setValue={setValue} TabsConfig={tabs} />
        </>
    );
}


