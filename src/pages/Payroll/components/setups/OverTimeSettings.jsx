import React, { useEffect, useRef, useState } from 'react'
import { Divider, Chip, InputAdornment, Grid, IconButton, ToggleButtonGroup, ToggleButton } from '../../../../deps/ui'
import { DisplaySettings, Percent, SaveTwoTone, RemoveCircleOutline, AddCircleOutline } from '../../../../deps/ui/icons'
import { AutoForm } from '../../../../components/useForm'
import { useAppSelector } from '../../../../store/storehook';
import { useEntitiesQuery, useEntityAction } from '../../../../store/actions/httpactions';
import { API, CalculationType, defaultOverTimeType, OverTimeType, defaultOverTimeRate, OverTimeRate } from '../../_Service';
import Controls from '../../../../components/controls/Controls';

const breakpoints = { size: { md: 3, sm: 6, xs: 6 } }, fullWidthPoints = { size: { md: 12, sm: 12, xs: 12 } };

const DEFAULT_API = API.PayrollSetup;
export const OverTimeSettings = ({ data }) => {
    const formApi = useRef(null);
    const [disableItems, setDisableItems] = useState([defaultOverTimeType]);
    const [mode, setMode] = useState(1);
    const details = useRef([{ overTimeType: defaultOverTimeType, overTimeRateType: defaultOverTimeRate, value: 1 }]).current
    const { addEntity } = useEntityAction();
    const handleSubmit = () => {
        const { getValue, validateFields } = formApi.current;
        const values = getValue();

        if (!validateFields()) return
        var otSettingId = data?.overTimeSetting ? data?.overTimeSetting.id : 0;
        const dataToInsert = {
            id: otSettingId,
            payrollSetupId: data.id,
            ...values
        }

        addEntity({ url: `${DEFAULT_API}/OverTimeSetting`, data: dataToInsert });

    }

    const handleAddItems = () => {
        const { getValue, setFormValue } = formApi.current;

        if (OverTimeType.length === getValue().details.length) return;
        const newId = OverTimeType.find(d => !disableItems.includes(d.id)).id;
        setFormValue({ details: [...getValue().details, { overTimeType: OverTimeType.length ? newId : "", overTimeRateType: defaultOverTimeRate, value: 1 }] })
        disableItems.push(newId);
        setDisableItems([...disableItems]);


    }

    const handleRemoveItems = (_index) => {
        const { getValue, setFormValue } = formApi.current;
        const { details } = getValue();

        if (_index == 0) return;
        disableItems.splice(disableItems.indexOf(details[_index].overTimeType), 1);
        setDisableItems([...disableItems])
        setFormValue({ details: details.toSpliced(_index, 1) })

    }
    useEffect(() => {
        if (formApi.current && data) {
            const { setFormValue } = formApi.current;
            setFormValue(structuredClone(data.overTimeSetting))
            setDisableItems(data.overTimeSetting?.details?.map(c => c.overTimeType) ?? [defaultOverTimeType])
        }
    }, [data, formApi])


    const formData = [
        {
            elementType: "checkbox",
            name: "isAutoOverTime",
            label: "Auto Over Time",
            title: "For Over Time",
            breakpoints: fullWidthPoints,
            defaultValue: false
        },
        {
            elementType: "checkbox",
            name: "includeOTBeforeShift",
            label: "Include OT Before Shift",
            title: "For Over Time",
            breakpoints,
            defaultValue: false
        },
        {
            elementType: "custom",
            breakpoints: fullWidthPoints,
            NodeElement: () => <Divider><Chip label="Over Time Rate" icon={<DisplaySettings />} /></Divider>
        },
        // {
        //     elementType: "custom",
        //     breakpoints: fullWidthPoints,
        //     NodeElement: () => <ToggleButtonGroup exclusive size="small" value={mode} onChange={(_, v) => v && setMode(v)}>
        //         <ToggleButton size='small' value={1}>General</ToggleButton>
        //         <ToggleButton size='small' value={2}>Minute Wise</ToggleButton>
        //     </ToggleButtonGroup>
        // },

        {
            elementType: "arrayForm",
            name: "details",
            // sx: listStyle,
            // arrayFormRef: desgFormApi,
            breakpoints: fullWidthPoints,
            defaultValue: details,
            formData: [
                {
                    elementType: "dropdown",
                    name: "overTimeType",
                    label: "Over Time Type",
                    breakpoints,
                    dataId: "id",
                    onChange: (_deduct, _ind) => {
                        const { getValue } = formApi.current;
                        setDisableItems(getValue().details.map(c => c.overTimeType));
                    },
                    disableitems: disableItems,
                    dataName: "title",
                    isNone: false,
                    defaultValue: defaultOverTimeType,
                    options: OverTimeType,
                },
                {
                    elementType: "dropdown",
                    name: "overTimeRateType",
                    label: "OverTime Rate",
                    breakpoints,
                    dataId: "id",
                    dataName: "title",
                    isNone: false,
                    defaultValue: defaultOverTimeRate,
                    options: OverTimeRate,
                },
                {
                    elementType: "inputfield",
                    name: "value",
                    label: "Value",
                    breakpoints,
                    inputMode: 'numeric',
                    type: "number",
                    validate: {
                        errorMessage: "OverTime Rate is required",
                    },
                    inputProps: {
                        min: 0,
                    },
                    defaultValue: "",
                },
                {
                    elementType: "custom",
                    breakpoints: { size: { xs: 2, lg: 2, md: 2 } },
                    NodeElement: ({ dataindex }) =>
                        <IconButton sx={{ mt: 1 }} onClick={() => handleRemoveItems(dataindex, false)}>
                            <RemoveCircleOutline color='warning' />
                        </IconButton>

                },
            ],
            isValidate: true,
        },
        {
            elementType: "custom",
            breakpoints: fullWidthPoints,
            NodeElement: () => <IconButton title='Add' aria-label="delete" onClick={() => handleAddItems(false)}>
                <AddCircleOutline color='primary' />
            </IconButton>
        },
    ]

    return (
        <AutoForm formData={formData} ref={formApi} isValidate={true} >

            <Grid item size={{ xs: 12, md: 12 }} textAlign="right">
                <Divider variant='fullWidth' sx={{ mb: 1 }} />
                <Controls.Button sx={{ width: 100 }} onClick={handleSubmit} startIcon={<SaveTwoTone />} text="Save" />
            </Grid>
        </AutoForm>
    )
}
