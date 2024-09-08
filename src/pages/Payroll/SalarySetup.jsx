import React, { useRef, useState } from 'react'
import { AutoForm } from '../../components/useForm'
import { useDropDown } from '../../components/useDropDown'
import { useAppSelector } from '../../store/storehook';
import { Divider, Chip, InputAdornment, Grid, Typography, FormHelperText } from '../../deps/ui'
import { DisplaySettings, AttachMoney } from '../../deps/ui/icons'
import { useEntityAction, useEntityByIdQuery, useLazyEntityByIdQuery } from '../../store/actions/httpactions';
import { API, defaultOverTimeCalculation, OverTimeCalculation, PercentageBased, PercentageOfBasicSalary } from './_Service';
import CircularLoading from '../../components/Circularloading';
import Controls from '../../components/controls/Controls'
const _salaryType = [{ id: "Monthly", title: "Monthly" },
{ id: "Hourly", title: "Hourly" },
{ id: "Daily", title: "Daily" }
]

const calculateOn = (salary, isPercent, isAllowance, amount) => {

    const _amount = (isPercent ? (+salary / 100) * amount : +amount);
    return isAllowance ? _amount : -1 * _amount;
}
/**
 * @type {import('@mui/material').SxProps}
 */
const itemStyle = {
    '& .MuiGrid-item': {
        boxShadow: 2,
        borderRadius: 1,
        p: 1
    }
}
const breakpoints = { xs: 12, sm: 3, md: 3, lg: 3 }, fullWidthPoints = { sm: 12, md: 12, lg: 12 }
const DEFAULT_API = API.PayrollSetup;
const selectFromResult = ({ data, isLoading }) => {
    if (!data?.result) return { basicSalaryType: "", percentage_or_amount: 0, allowances: [], deductions: [] };
    const { basicSalaryType, percentage_or_amount, allowances, deductions } = data?.result;
    return ({ basicSalaryType, percentage_or_amount, allowances, deductions, isLoading })
}
const intFormat = new Intl.NumberFormat();
const SalarySetup = () => {
    const formApi = useRef(null);
    const { employees } = useDropDown();
    const payrollSetups = useAppSelector(e => e.appdata.payrollData.PayrollSetups);
    const [salaryError, setSalaryError] = useState(false)
    const estimateSalary = useRef("");
    const { updateEntity, addEntity } = useEntityAction();
    const [salaryItems, setSalaryItems] = useState([]);
    const [getPayroll] = useLazyEntityByIdQuery();

    const handleSalarySetup = (payrollId) => {
        getPayroll({ url: DEFAULT_API, id: payrollId }).then(d => {
            const { basicSalaryType,
                percentage_or_amount,
                allowances, deductions
            } = d.data.result;
            const { getValue } = formApi.current;
            const { monthlySalary = 0 } = getValue();
            const currentItems = [];
            estimateSalary.current = calculateOn(monthlySalary, basicSalaryType === PercentageBased, true, percentage_or_amount);
            currentItems.push({ item: `Basic Salary ${basicSalaryType === PercentageBased ? `(${percentage_or_amount}%)` : ''}`, amount: calculateOn(monthlySalary, basicSalaryType === PercentageBased, true, percentage_or_amount), isPercent: basicSalaryType === PercentageBased, isAllowance: true, percentage_or_amount });
            currentItems.push(...allowances.map(c => {
                const _amount = calculateOn(monthlySalary, c.type === PercentageOfBasicSalary, true, c.percentage_or_amount);
                estimateSalary.current += _amount;
                return {
                    item: `${c.titles.name} ${c.type === PercentageOfBasicSalary ? `(${c.percentage_or_amount}%)` : ''}`,
                    amount: intFormat.format(_amount),
                    isPercent: c.type === PercentageOfBasicSalary, isAllowance: true,
                    percentage_or_amount: c.percentage_or_amount
                }
            }));
            currentItems.push(...deductions.map(d => ({ item: `${d.titles.name} ${d.type === PercentageOfBasicSalary ? `(${d.percentage_or_amount}%)` : ''}`, amount: intFormat.format(calculateOn(monthlySalary, d.type === PercentageOfBasicSalary, false, d.percentage_or_amount)), isPercent: d.type === PercentageOfBasicSalary, isAllowance: false, percentage_or_amount: d.percentage_or_amount })));
            estimateSalary.current = intFormat.format(estimateSalary.current);
            setSalaryError(false);
            setSalaryItems(currentItems);

        })
    }
    const handleSalaryChange = (monthlySalary) => {
        estimateSalary.current = 0;
        const { setFormValue } = formApi.current;

        const curItems = salaryItems.map(c => {
            const currAmount = calculateOn(monthlySalary, c.isPercent, c.isAllowance, c.percentage_or_amount);
            estimateSalary.current += c.isAllowance ? currAmount : 0;
            return { ...c, amount: intFormat.format(currAmount) }
        })
        estimateSalary.current = intFormat.format(estimateSalary.current);
        setSalaryItems(curItems);
        setSalaryError(false);
        setFormValue({ annualSalary: intFormat.format(+monthlySalary * 12) });

    }
    const getSalarInfo = (employee) => {
        if (!employee) return;
        getPayroll({ url: API.Salary, id: employee?._id }).then(info => {
            if (info?.data?.result) {
                const { setFormValue } = formApi.current;
                const { monthlySalary = 0, annualSalary = 0, salaryType = _salaryType[0].id, fkPayrollSetupId = payrollSetups[0]._id } = info.data.result?.salaryInfo;
                setFormValue({ monthlySalary, annualSalary, salaryType, fkPayrollSetupId });
                handleSalarySetup(fkPayrollSetupId)
            }
        })
    }
    const updateSalary = () => {
        const { getValue, validateFields } = formApi.current
        const { monthlySalary, fkEmployeeId, salaryType, fkPayrollSetupId, ...overTime } = getValue();
        if (!validateFields()) return;
        if (+monthlySalary !== +(estimateSalary.current.replaceAll(",", ""))) return setSalaryError(true);

        updateEntity({
            url: `${API.Salary}/${fkEmployeeId._id}`, data: {
                monthlySalary,
                annualSalary: monthlySalary * 12,
                salaryType, fkPayrollSetupId,
                overTime
            }
        }).then(console.log);
    }

    /**
     * @type {import('../../types/fromstype').FormType}
     */
    const formData = [{
        elementType: "ad_dropdown",
        name: "fkEmployeeId",
        label: "Employee",
        onChange: getSalarInfo,
        required: true,
        validate: {
            errorMessage: "Employee is required",
        },
        breakpoints,
        dataName: 'fullName',
        dataId: '_id',
        options: employees,
        defaultValue: null,
    },
    {
        elementType: "dropdown",
        label: "Payroll Setup",
        name: "fkPayrollSetupId",
        required: true,
        validate: {
            errorMessage: "Payroll Setup is required",
        },
        breakpoints,
        onChange: handleSalarySetup,
        options: payrollSetups,
        dataId: "_id",
        dataName: "name",
        isNone: false,
        defaultValue: payrollSetups?.length ? payrollSetups[0]._id : ""
    },
    {
        elementType: "dropdown",
        name: "salaryType",
        label: "Salary Type",
        breakpoints,
        options: _salaryType,
        isNone: false,
        dataId: "id",
        dataName: "title",
        defaultValue: _salaryType[0].id
    },
    {
        elementType: "custom",
        breakpoints: fullWidthPoints,
        NodeElement: () => <Divider><Chip label="Details" icon={<DisplaySettings />} /></Divider>
    },
    {
        elementType: "checkbox",
        name: "enable",
        label: "Enable Over Time",
        breakpoints: { xs: 12, sm: 12, md: 12 },
        defaultValue: false
    },
    {
        elementType: "dropdown",
        name: "wdType",
        label: "Working Day Rate",
        breakpoints: { xs: 6, sm: 6, md: 2 },
        isShow: (value) => value.enable,
        dataId: "id",
        dataName: "title",
        isNone: false,
        defaultValue: defaultOverTimeCalculation,
        options: OverTimeCalculation,
    },
    {
        elementType: "inputfield",
        name: "wdAmount",
        breakpoints: { xs: 6, sm: 6, md: 2 },
        isShow: (value) => value.enable && value.wdType === defaultOverTimeCalculation,
        label: "Amount",
        inputMode: 'numeric',
        type: "number",
        inputProps: {
            min: 0,
        },
        InputProps: {
            endAdornment: (
                <InputAdornment position="end">
                    <AttachMoney />
                </InputAdornment>
            )
        },
        defaultValue: 0,
    },
    {
        elementType: "clearfix",
        breakpoints: { md: 12, sm: 12, xs: 12 }
    },
    {
        elementType: "dropdown",
        name: "hdType",
        label: "Holiday Rate",
        breakpoints: { xs: 6, sm: 6, md: 2 },
        isShow: (value) => value.enable,
        dataId: "id",
        dataName: "title",
        isNone: false,
        defaultValue: defaultOverTimeCalculation,
        options: OverTimeCalculation,
    },
    {
        elementType: "inputfield",
        name: "hdAmount",
        breakpoints: { xs: 6, sm: 6, md: 2 },
        isShow: (value) => value.enable && value.hdType === defaultOverTimeCalculation,
        label: "Amount",
        inputMode: 'numeric',
        type: "number",
        inputProps: {
            min: 0,
        },
        InputProps: {
            endAdornment: (
                <InputAdornment position="end">
                    <AttachMoney />
                </InputAdornment>
            )
        },
        defaultValue: 0,
    },
    {
        elementType: "clearfix",
        breakpoints: { md: 12, sm: 12, xs: 12 }
    },
    {
        elementType: "dropdown",
        name: "ghType",
        label: "Gazetted Holiday Rate",
        breakpoints: { xs: 6, sm: 6, md: 2 },
        isShow: (value) => value.enable,
        dataId: "id",
        dataName: "title",
        isNone: false,
        defaultValue: defaultOverTimeCalculation,
        options: OverTimeCalculation,
    },
    {
        elementType: "inputfield",
        name: "ghAmount",
        breakpoints: { xs: 6, sm: 6, md: 2 },
        isShow: (value) => value.enable && value.ghType === defaultOverTimeCalculation,
        label: "Amount",
        inputMode: 'numeric',
        type: "number",
        inputProps: {
            min: 0,
        },
        InputProps: {
            endAdornment: (
                <InputAdornment position="end">
                    <AttachMoney />
                </InputAdornment>
            )
        },
        defaultValue: 0,
    },
    {
        elementType: "clearfix",
        breakpoints: { md: 12, sm: 12, xs: 12 }
    },
    {
        elementType: "inputfield",
        name: "monthlySalary",
        required: true,
        validate: {
            errorMessage: "Monthly Salary is required",
        },
        onChange: handleSalaryChange,
        label: "Monthly Salary",
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
        defaultValue: 0,
    },
    {
        elementType: "inputfield",
        name: "annualSalary",
        label: "Annual Salary",
        disabled: true,
        breakpoints,
        InputProps: {
            endAdornment: (
                <InputAdornment position="end">
                    <AttachMoney />
                </InputAdornment>
            )
        },
        defaultValue: 0,
    }
    ]

    return (<>
        {/* <CircularLoading open={isLoading} /> */}
        <AutoForm ref={formApi} formData={formData} />
        <Grid container flexDirection="column" spacing={2} pt={5}>
            <Grid item>
                {salaryItems.map((c, i) => (
                    <Grid container key={c.item + i} sx={itemStyle} gap={2}  >
                        <Grid item sm={0.5} md={0.5} lg={0.5} textAlign='center' >{i + 1}</Grid>
                        <Grid item xs={6} sm={4} md={4} lg={4}> <Typography>{c.item}</Typography> </Grid>
                        <Grid item xs={3} sm={2} md={2} lg={2}><Typography>{c.amount}</Typography> </Grid>
                    </Grid>
                ))}
            </Grid>
            <Grid item>
                <FormHelperText
                    error={salaryError}
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "0 10px"
                    }}
                >
                    {salaryError && <Typography>Estimated salary should be equal to Monthly salary</Typography>}
                </FormHelperText>
                <Typography variant='h4'>
                    Estimated Salary : {estimateSalary.current}
                </Typography>
            </Grid>
            <Grid item sx={3} md={3}>
                <Controls.Button size='medium' onClick={updateSalary} fullWidth text='Save' />
            </Grid>

        </Grid>
    </>)
}

export default SalarySetup