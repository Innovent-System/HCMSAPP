import { useRef, useState } from 'react'
import { AutoForm } from '../../components/useForm'
import { DisplaySettings, Percent, AttachMoney, RemoveCircleOutline, AddCircleOutline } from '../../deps/ui/icons'
import { Divider, Chip, InputAdornment, IconButton } from '../../deps/ui'
import { API, basicSalaryTypeList, PercentageBased, dayRange, defaultCaluation, payScheduleType, perDayCalulationsList } from './_Service'
import { useAppSelector } from '../../store/storehook'

const breakpoints = { md: 2, sm: 6, xs: 6 }, fullWidthPoints = { md: 12, sm: 12, xs: 12 };
/**
 * @type {import('@mui/material').SxProps}
 */
const listStyle = {
    padding: 0,
    color: 'ActiveBorder'
}
const Setup = () => {
    const formApi = useRef(null);
    const { AllowancesTitle, DeductionsTitle } = useAppSelector(c => c.appdata.payrollData)
    const [allowances, setAllowances] = useState([{ fkAllowanceId: AllowancesTitle.length ? AllowancesTitle[0]._id : "", type: PercentageBased, amount: 0, percentage: 0 }])
    const [deductions, setDeductions] = useState([{ fkDeductionId: DeductionsTitle.length ? DeductionsTitle[0]._id : "", type: PercentageBased, amount: 0, percentage: 0 }])
    const handleAddItems = (isAllowance = true) => {
        const { getValue, setFormValue } = formApi.current;
        if (isAllowance)
            setFormValue({ allowances: [...getValue().allowances, { fkAllowanceId: AllowancesTitle.length ? AllowancesTitle[0]._id : "", type: PercentageBased, amount: 0, percentage: 0 }] })
        else
            setFormValue({ deductions: [...getValue().deductions, { fkDeductionId: DeductionsTitle.length ? DeductionsTitle[0]._id : "", type: PercentageBased, amount: 0, percentage: 0 }] })

    }

    const handleRemoveItems = (_index, isAllowance = true) => {
        const { getValue, setFormValue } = formApi.current;
        const { allowances, deductions } = getValue();
        
        if (isAllowance && allowances.length !== 1)
            setFormValue({ allowances: allowances.toSpliced(_index, 1) })
        else if(!isAllowance && deductions.length !== 1)
            setFormValue({ deductions: deductions.toSpliced(_index, 1) })


    }
    const formData = [
        // {
        //     elementType: "custom",
        //     breakpoints: fullWidthPoints,
        //     NodeElement: () => <Divider><Chip label="Payroll Option" icon={<DisplaySettings />} /></Divider>
        // },
        {
            elementType: "radiogroup",
            name: "paySchedule",
            label: "Pay Schedule",
            defaultValue: "Monthly",
            breakpoints: fullWidthPoints,
            items: payScheduleType
        },
        {
            elementType: "dropdown",
            name: "startDay",
            label: "Start Day",
            breakpoints,
            dataId: "id",
            dataName: "title",
            onChange: (data) => {
                const { setFormValue } = formApi.current;
                setFormValue({ endDay: data === 0 ? "Last Day of Month" : data - 1 });

            },
            isNone: false,
            defaultValue: 0,
            options: dayRange
        },
        {
            elementType: "inputfield",
            name: "endDay",
            label: "End Day",
            disabled: true,
            breakpoints,
            InputProps: {
                readOnly: true,
            },
            defaultValue: "Last Day of Month",
        },
        // {
        //     elementType: "clearfix"
        // },
        {
            elementType: "dropdown",
            name: "calculationMethod",
            label: "Employee's Per Day Calculation",
            breakpoints,
            dataId: "id",
            dataName: "title",
            isNone: false,
            defaultValue: defaultCaluation,
            options: perDayCalulationsList,
        },
        {
            elementType: "inputfield",
            name: "deletePayrollAfterDays",
            label: "Delete Payroll After Days",
            type: "number",
            inputMode: 'numeric',
            inputProps: {
                min: 0,
                max: 50,
            },
            breakpoints,
            defaultValue: 3,
        },
        {
            elementType: "custom",
            breakpoints: fullWidthPoints,
            NodeElement: () => <Divider><Chip label="Payslip Items" icon={<DisplaySettings />} /></Divider>
        },
        {
            elementType: "dropdown",
            name: "basicSalaryType",
            label: "Basic Salary Type",
            breakpoints,
            dataId: "id",
            dataName: "title",
            isNone: false,
            defaultValue: PercentageBased,
            options: basicSalaryTypeList,
        },
        {
            elementType: "inputfield",
            name: "percentage",
            isShow: (values) => values.basicSalaryType === PercentageBased,
            label: "Percentage",
            inputMode: 'numeric',
            type: "number",
            inputProps: {
                min: 0,
                max: 100
            },
            breakpoints,
            InputProps: {
                endAdornment: (
                    <InputAdornment position="end">
                        <Percent />
                    </InputAdornment>
                )
            },
            defaultValue: "",
        },
        {
            elementType: "inputfield",
            name: "amount",
            isShow: (values) => values.basicSalaryType !== PercentageBased,
            label: "Amount",
            inputMode: 'numeric',
            type: "number",
            inputProps: {
                min: 0,
            },
            breakpoints,
            InputProps: {
                endAdornment: (
                    <InputAdornment position="end">
                        <AttachMoney />
                    </InputAdornment>
                )
            },
            defaultValue: "",
        },
        {
            elementType: "custom",
            breakpoints: fullWidthPoints,
            NodeElement: () => <Divider><Chip label="Allowances" icon={<DisplaySettings />} /></Divider>
        },
        {
            elementType: "arrayForm",
            name: "allowances",
            // sx: listStyle,
            // arrayFormRef: desgFormApi,
            breakpoints: fullWidthPoints,
            defaultValue: allowances,
            formData: [
                {
                    elementType: "dropdown",
                    name: "fkAllowanceId",
                    label: "Title",
                    breakpoints,
                    dataId: "_id",
                    dataName: "name",
                    isNone: false,
                    // defaultValue: AllowancesTitle.length ? AllowancesTitle[0]._id : "",
                    options: AllowancesTitle,
                },
                {
                    elementType: "dropdown",
                    name: "type",
                    label: "Type",
                    breakpoints,
                    dataId: "id",
                    dataName: "title",
                    isNone: false,
                    defaultValue: PercentageBased,
                    options: basicSalaryTypeList,
                },
                {
                    elementType: "inputfield",
                    name: "percentage",
                    isShow: (values) => values.type === PercentageBased,
                    label: "Percentage",
                    inputMode: 'numeric',
                    type: "number",
                    inputProps: {
                        min: 0,
                        max: 100
                    },
                    breakpoints,
                    InputProps: {
                        endAdornment: (
                            <InputAdornment position="end">
                                <Percent />
                            </InputAdornment>
                        )
                    },
                    defaultValue: "",
                },
                {
                    elementType: "inputfield",
                    name: "amount",
                    isShow: (values) => values.type !== PercentageBased,
                    label: "Amount",
                    inputMode: 'numeric',
                    type: "number",
                    inputProps: {
                        min: 0,
                    },
                    breakpoints,
                    InputProps: {
                        endAdornment: (
                            <InputAdornment position="end">
                                <AttachMoney />
                            </InputAdornment>
                        )
                    },
                    defaultValue: "",
                },
                {
                    elementType: "custom",
                    breakpoints: { xs: 6, lg: 6, md: 6 },
                    NodeElement: ({ dataindex }) => <>
                        <IconButton onClick={() => handleRemoveItems(dataindex)}>
                            <RemoveCircleOutline color='warning' />
                        </IconButton>
                    </>
                },
            ],
            isValidate: true,
        },
        {
            elementType: "custom",
            breakpoints: fullWidthPoints,
            NodeElement: () => <IconButton title='Add Allowance' size='small' aria-label="delete" onClick={handleAddItems}>
                <AddCircleOutline color='primary' />
            </IconButton>
        },
        {
            elementType: "custom",
            breakpoints: fullWidthPoints,
            NodeElement: () => <Divider><Chip label="Deductions" icon={<DisplaySettings />} /></Divider>
        },
        {
            elementType: "arrayForm",
            name: "deductions",
            // sx: listStyle,
            // arrayFormRef: desgFormApi,
            breakpoints: fullWidthPoints,
            defaultValue: deductions,
            formData: [
                {
                    elementType: "dropdown",
                    name: "fkDeductionId",
                    label: "Title",
                    breakpoints,
                    dataId: "_id",
                    dataName: "name",
                    isNone: false,
                    // defaultValue: DeductionsTitle.length ? DeductionsTitle[0]._id : "",
                    options: DeductionsTitle,
                },
                {
                    elementType: "dropdown",
                    name: "type",
                    label: "Type",
                    breakpoints,
                    dataId: "id",
                    dataName: "title",
                    isNone: false,
                    defaultValue: PercentageBased,
                    options: basicSalaryTypeList,
                },
                {
                    elementType: "inputfield",
                    name: "percentage",
                    isShow: (values) => values.type === PercentageBased,
                    label: "Percentage",
                    inputMode: 'numeric',
                    type: "number",
                    inputProps: {
                        min: 0,
                        max: 100
                    },
                    breakpoints,
                    InputProps: {
                        endAdornment: (
                            <InputAdornment position="end">
                                <Percent />
                            </InputAdornment>
                        )
                    },
                    defaultValue: "",
                },
                {
                    elementType: "inputfield",
                    name: "amount",
                    isShow: (values) => values.type !== PercentageBased,
                    label: "Amount",
                    inputMode: 'numeric',
                    type: "number",
                    inputProps: {
                        min: 0,
                    },
                    breakpoints,
                    InputProps: {
                        endAdornment: (
                            <InputAdornment position="end">
                                <AttachMoney />
                            </InputAdornment>
                        )
                    },
                    defaultValue: "",
                },
                {
                    elementType: "custom",
                    breakpoints: { xs: 6, lg: 6, md: 6 },
                    NodeElement: ({ dataindex }) =>
                        <IconButton onClick={() => handleRemoveItems(dataindex, false)}>
                            <RemoveCircleOutline color='warning' />
                        </IconButton>

                },
            ],
            isValidate: true,
        },
        {
            elementType: "custom",
            breakpoints: fullWidthPoints,
            NodeElement: () => <IconButton title='Add Deduction' aria-label="delete" onClick={() => handleAddItems(false)}>
                <AddCircleOutline color='primary' />
            </IconButton>
        },
    ]

    return (
        <AutoForm formData={formData} ref={formApi} isValidate={true} />
    )
}

export default Setup