import { useEffect, useRef, useState } from 'react'
import { AutoForm } from '../../../../components/useForm'
import { DisplaySettings, Percent, AttachMoney, RemoveCircleOutline, AddCircleOutline, SaveTwoTone } from '../../../../deps/ui/icons'
import { Divider, Chip, InputAdornment, IconButton, Fab, Grid } from '../../../../deps/ui'
import {
    API, basicSalaryTypeList, PercentageBased, dayRange, defaultCaluation, payScheduleType,
    perDayCalulationsList, CalculationType, PercentageOfBasicSalary, FixedAmount
} from '../../_Service'
import { useAppDispatch, useAppSelector } from '../../../../store/storehook'
import { PayrollDataThunk, useEntityAction, useLazyEntityByIdQuery } from '../../../../store/actions/httpactions'
import Controls from '../../../../components/controls/Controls'


const breakpoints = { size: { md: 2, sm: 6, xs: 6 } }, fullWidthPoints = { size: { md: 12, sm: 12, xs: 12 } };
/**
 * @type {import('@mui/material').SxProps}
 */
const listStyle = {
    padding: 0,
    color: 'ActiveBorder'
}
const DEFAULT_API = API.PayrollSetup, DEFAULT_NAME = "Setup";
const PaySettings = ({ data }) => {
    const formApi = useRef(null);

    const allowanceApi = useRef(null);
    const dispatch = useAppDispatch();

    const isEdit = useRef(true);
    const { AllowancesTitle, DeductionsTitle, PayrollSetups } = useAppSelector(c => c.appdata.payrollData)
    const allowances = useRef([{ fkAllowanceId: AllowancesTitle.length ? AllowancesTitle[0]._id : "", type: PercentageOfBasicSalary, amount: 0, percentage: 0 }]).current
    const deductions = useRef([{ fkDeductionId: DeductionsTitle.length ? DeductionsTitle[0]._id : "", type: PercentageOfBasicSalary, amount: 0, percentage: 0 }]).current
    const [disabledAllowance, setDisabledAllowance] = useState(AllowancesTitle?.length ? [AllowancesTitle[0]._id] : []);
    const [disabledDeduction, setDisabledDeduct] = useState(DeductionsTitle?.length ? [DeductionsTitle[0]._id] : [])
    const { addEntity } = useEntityAction();

    const [getPayrollSetup] = useLazyEntityByIdQuery();

    const handleAddItems = (isAllowance = true) => {
        const { getValue, setFormValue } = formApi.current;
        if (isAllowance) {
            if (AllowancesTitle.length === getValue().allowances.length) return;
            const newId = AllowancesTitle.find(c => !disabledAllowance.includes(c._id))._id;
            setFormValue({ allowances: [...getValue().allowances, { fkAllowanceId: AllowancesTitle.length ? newId : "", type: PercentageOfBasicSalary, amount: 0, percentage: 0 }] })
            disabledAllowance.push(newId);
            setDisabledAllowance([...disabledAllowance])
        }
        else {
            if (DeductionsTitle.length === getValue().deductions.length) return;
            const newId = DeductionsTitle.find(d => !disabledDeduction.includes(d._id))._id;
            setFormValue({ deductions: [...getValue().deductions, { fkDeductionId: DeductionsTitle.length ? newId : "", type: PercentageOfBasicSalary, amount: 0, percentage: 0 }] })
            disabledDeduction.push(newId);
            setDisabledDeduct([...disabledDeduction]);
        }

    }

    // const handleSetup = () => {
    //     if (isEdit.current) return;
    //     dispatch(PayrollDataThunk({ url: GET_PAYROLL_DATA })).unwrap().then(({ data }) => {
    //         if (data?.PayrollSetups?.length) {
    //             const id = data.PayrollSetups[data.PayrollSetups.length - 1]._id;
    //             handleSetupChange(id);
    //         }
    //     });
    // }
    useEffect(() => {
        if (formApi.current && data) {
            handleSetupChange(data);
        }
    }, [data, formApi])
    // const { socketData } = useSocketIo(`changeInPayroll${DEFAULT_NAME}`, handleSetup);

    const handleRemoveItems = (_index, isAllowance = true) => {
        const { getValue, setFormValue } = formApi.current;
        const { allowances, deductions } = getValue();

        if (isAllowance && allowances.length !== 1) {
            disabledAllowance.splice(disabledAllowance.indexOf(allowances[_index].fkAllowanceId), 1);
            setDisabledAllowance([...disabledAllowance]);
            setFormValue({ allowances: allowances.toSpliced(_index, 1) })
        }
        else if (!isAllowance && deductions.length !== 1) {
            disabledDeduction.splice(disabledDeduction.indexOf(deductions[_index].fkDeductionId), 1);
            setDisabledDeduct([...disabledDeduction])
            setFormValue({ deductions: deductions.toSpliced(_index, 1) })
        }

    }

    const handleSubmit = () => {
        const { getValue, validateFields } = formApi.current;
        const { deletePayrollAfterDays, basicSalaryType, allowances, startDay, deductions, calculationMethod, amount, percentage } = getValue();
        const dataToInsert = {
            startDay: startDay === 0 ? 0 : startDay,
            endDay: startDay === 0 ? 0 : startDay - 1,
            deletePayrollAfterDays,
            calculationMethod,
            basicSalaryType,
            percentage_or_amount: basicSalaryType === PercentageBased ? percentage : amount,
            allowances: allowances.map(c => ({ fkAllowanceId: c.fkAllowanceId, type: c.type, percentage_or_amount: c.type !== FixedAmount ? c.percentage : c.amount })),
            deductions: deductions.map(c => ({ fkDeductionId: c.fkDeductionId, type: c.type, percentage_or_amount: c.type !== FixedAmount ? c.percentage : c.amount }))
        };
        if (isEdit.current) {
            // const { validateFields: allValidateFields } = allowanceApi.current;
            if (!validateFields()) return;
            dataToInsert._id = data._id;
            dataToInsert.name = PayrollSetups.find(c => c._id === data._id).name;
        }
        // else {
        //     const { getValue, validateFields } = titleFormApi.current
        //     if (!validateFields()) return;
        //     dataToInsert.name = getValue().name;
        // }

        addEntity({ url: DEFAULT_API, data: [dataToInsert] });
    }

    const formData = [
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
            onChange: (day) => {
                const { setFormValue } = formApi.current;
                setFormValue({ endDay: day === 0 ? "Last Day of Month" : day - 1 });

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
            required: (values) => values.basicSalaryType === PercentageBased,
            validate: {
                errorMessage: "Perentage is required",
            },
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
            required: (values) => values.basicSalaryType !== PercentageBased,
            validate: {
                errorMessage: "Amount is required",
            },
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
            arrayFormRef: allowanceApi,
            breakpoints: fullWidthPoints,
            defaultValue: allowances,
            formData: [
                {
                    elementType: "dropdown",
                    name: "fkAllowanceId",
                    label: "Title",
                    breakpoints,
                    onChange: (_allowanc, _ind) => {
                        const { getValue } = formApi.current;
                        setDisabledAllowance(getValue().allowances.map(c => c.fkAllowanceId))
                    },
                    disableitems: disabledAllowance,
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
                    defaultValue: PercentageOfBasicSalary,
                    options: CalculationType,
                },
                {
                    elementType: "inputfield",
                    name: "percentage",
                    isShow: (values) => values.type !== FixedAmount,
                    label: "Percentage",
                    inputMode: 'numeric',
                    // required: (values) => values.type === PercentageOfBasicSalary,
                    validate: {
                        errorMessage: "Percentage is required",
                    },
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
                    isShow: (values) => values.type === FixedAmount,
                    label: "Amount",
                    inputMode: 'numeric',
                    type: "number",
                    required: (values) => values.type === FixedAmount,
                    validate: {
                        errorMessage: "Amount is required",
                    },
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
                    breakpoints: { size: { xs: 6, lg: 6, md: 6 } },
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
                    onChange: (_deduct, _ind) => {
                        const { getValue } = formApi.current;
                        setDisabledDeduct(getValue().deductions.map(c => c.fkDeductionId));
                    },
                    disableitems: disabledDeduction,
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
                    defaultValue: PercentageOfBasicSalary,
                    options: CalculationType,
                },
                {
                    elementType: "inputfield",
                    name: "percentage",
                    isShow: (values) => values.type !== FixedAmount,
                    label: "Percentage",
                    inputMode: 'numeric',
                    type: "number",
                    // required: (values) => values.type === PercentageOfBasicSalary,
                    validate: {
                        errorMessage: "Percentage is required",
                    },
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
                    isShow: (values) => values.type === FixedAmount,
                    label: "Amount",
                    inputMode: 'numeric',
                    type: "number",
                    required: (values) => values.type === FixedAmount,
                    validate: {
                        errorMessage: "Amount is required",
                    },
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
                    breakpoints: { size: { xs: 6, lg: 6, md: 6 } },
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



    const handleSetupChange = (result) => {
        // getPayrollSetup({ url: DEFAULT_API, id: id }).then(p => {
        if (result) {
            const { startDay, endDay, deletePayrollAfterDays, calculationMethod,
                basicSalaryType,
                percentage_or_amount,
                allowances: _allowances, deductions: _deductions
            } = result;
            const { setFormValue } = formApi.current;

            setDisabledAllowance(_allowances.map(a => a.fkAllowanceId));
            setDisabledDeduct(_deductions.map(d => d.fkDeductionId));
            setFormValue({
                startDay,
                endDay: startDay === 0 ? "Last Day of Month" : endDay,
                deletePayrollAfterDays,
                calculationMethod,
                basicSalaryType,
                percentage: basicSalaryType === PercentageBased ? percentage_or_amount : 0,
                amount: basicSalaryType !== PercentageBased ? percentage_or_amount : 0,
                allowances: _allowances.map(c => ({ fkAllowanceId: c.fkAllowanceId, type: c.type, percentage: c.type !== FixedAmount ? c.percentage_or_amount : 0, amount: c.type === FixedAmount ? c.percentage_or_amount : 0 })),
                deductions: _deductions.map(c => ({ fkDeductionId: c.fkDeductionId, type: c.type, percentage: c.type !== FixedAmount ? c.percentage_or_amount : 0, amount: c.type === FixedAmount ? c.percentage_or_amount : 0 }))
            })
        }

        // })
    }
    return (
        <>
            <AutoForm formData={formData} ref={formApi} isValidate={true} >
                <Grid item size={{ xs: 12, md: 12 }} textAlign="right">
                    <Divider variant='fullWidth' sx={{ mb: 1 }} />
                    <Controls.Button sx={{ width: 100 }} onClick={() => { { isEdit.current = true; handleSubmit() } }} startIcon={<SaveTwoTone />} text="Save" />
                </Grid>
            </AutoForm>

            {/* <Fab  onClick={() => { isEdit.current = true; handleSubmit() }} color='success' title='Save' ><SaveTwoTone fontSize='large' /></Fab> */}
        </>
    )
}

export default PaySettings