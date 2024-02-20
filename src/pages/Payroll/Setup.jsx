import { useRef } from 'react'
import { AutoForm } from '../../components/useForm'
import { DisplaySettings, Percent, AttachMoney } from '../../deps/ui/icons'
import { Divider, Chip, InputAdornment } from '../../deps/ui'

const payScheduleType = [{ id: "Monthly", title: "Monthly" },
{ id: "Weekly", title: "Weekly" }
]
const dayRange = Array.from(Array(31)).map((e, i) => ({ id: i, title: `${i === 0 ? 'First Day of Month' : i}` }));
const perDayCalulations = [
    { id: "MonthlyGross_DivideBy_NumberOfDays_InMonth", title: "Monthly Gross Salary / No. of Days In Month" },
    { id: "MonthlyGross_DivideBy_FixedDays", title: "Monthly Gross Salary / Fixed Days" }
], defaultCaluation = "MonthlyGross_DivideBy_NumberOfDays_InMonth";

const basicSalaryType = [
    { id: "PercentageBased", title: "Percentage Based" },
    { id: "FixedAmount", title: "Fix Amount" }
], defaultBasicSalary = "PercentageBased";

const breakpoints = { md: 3, sm: 6, xs: 6 }, fullWidthPoints = { md: 12, sm: 12, xs: 12 }

const Setup = () => {
    const formApi = useRef(null);

    const formData = [
        {
            elementType: "custom",
            breakpoints: fullWidthPoints,
            NodeElement: () => <Divider><Chip label="Payroll Option" icon={<DisplaySettings />} /></Divider>
        },
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
        {
            elementType: "clearfix"
        },
        {
            elementType: "dropdown",
            name: "calculationMethod",
            label: "Employee's Per Day Calculation",
            breakpoints,
            dataId: "id",
            dataName: "title",
            isNone: false,
            defaultValue: defaultCaluation,
            options: perDayCalulations,
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
            defaultValue: defaultBasicSalary,
            options: basicSalaryType,
        },
        {
            elementType: "inputfield",
            name: "percentage",
            isShow: (values) => values.basicSalaryType === defaultBasicSalary,
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
            isShow: (values) => values.basicSalaryType !== defaultBasicSalary,
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

    ]

    return (
        <AutoForm formData={formData} ref={formApi} isValidate={true} />
    )
}

export default Setup