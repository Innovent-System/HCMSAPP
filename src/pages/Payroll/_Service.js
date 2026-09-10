export const API = {
    Allowance: "payroll/head",
    Deduction: "payroll/head",
    PayrollSetup: "payroll/setup",
    Salary: 'payroll/salarysetup',
    Process: 'payroll/processpayroll',
    PayrollDetail: 'payroll/processpayroll',
    AdvanceSalary: 'payroll/advancesalary',
    SalaryChange: 'payroll/salarychange',
    CancelAdvanceSalary: 'payroll/advancesalary/cancel',
    Bonus: 'payroll/bonus',
    OverTime: 'payroll/overtime',
    LoanRequest: 'payroll/loan',
    LoanDetail: 'payroll/loan/detail',
    LoanAdjustment: 'payroll/loanadjustment',
    Approval: "payroll/approval",
    ApprovalAction: "payroll/approval/action",
    LeaveType: "leave/type",
    Insurance: 'payroll/insurance',
    TaxIncome: 'payroll/taxincome',
    PFOpening: 'payroll/pfopening',
    ExtraAllowc: 'payroll/extraallowance',
    PayslipReport: "payroll/report/payslip",
    SalarySheetReport: 'payroll/report/salarysheet',
    PayrollSummaryReport: 'payroll/report/payrollsummary',
    LoanReport: 'payroll/report/loandetail',
    FiscalYear: 'payroll/fiscalyear',
    TaxAdjustment: 'payroll/taxadjustment',
    TaxAdjustmentType: 'payroll/taxadjustmenttype',
    TaxOpening: 'payroll/taxopening'

}

export const payScheduleType = [{ id: "Monthly", title: "Monthly" },
{ id: "Weekly", title: "Weekly" }
]
export const salaryChangeType = [{ id: "Increment", title: "Increment" },
{ id: "Decrement", title: "Decrement" }
]

export const dayRange = Array.from(Array(31)).map((e, i) => ({ id: i, title: `${i === 0 ? 'First Day of Month' : i}` }));
export const perDayCalulationsList = [
    { id: "MonthlyGross_DivideBy_NumberOfDays_InMonth", title: "Monthly Gross Salary / No. of Days In Month" },
    { id: "MonthlyGross_DivideBy_FixedDays", title: "Monthly Gross Salary / Fixed Days" }
], defaultCaluation = "MonthlyGross_DivideBy_NumberOfDays_InMonth";

export const basicSalaryTypeList = [
    { id: "PercentageOfGross", title: "Percentage Based" },
    { id: "FixedAmount", title: "Fix Amount" }
], PercentageBased = "PercentageOfGross";

export const CalculationType = [
    { id: "PercentageOfBasicSalary", title: "Percentage of Basic Salary" },
    { id: "PercentageOfGrossSalary", title: "Percentage of Gross Salary" },
    { id: "FixedAmount", title: "Fix Amount" }
], PercentageOfBasicSalary = "PercentageOfBasicSalary", FixedAmount = "FixedAmount";
export const OverTimeType = [
    { id: "WeekDay", title: "WeekDay" },
    { id: "Holiday", title: "Holiday" },
    { id: "Gazetted", title: "Gazetted" }
], defaultOverTimeType = "WeekDay"

export const OverTimeCalculation = [
    { id: "FixedAmount", title: "Fix Amount" },
    { id: "TimePerHourSalary", title: "Time Per Hour Salary" },

], defaultOverTimeCalculation = "FixedAmount"

export const YESNOLIST = [
    { id: "yes", title: "Yes" },
    { id: "no", title: "No" }
]
