export const API = {
    Allowance: "payroll/allowance",
    Deduction: "payroll/deduction",
    PayrollSetup: "payroll/setup",
    Salary: 'payroll/salary',
    Process: 'payroll/process',
    PayrollDetail: 'payroll/process',
    AdvanceSalary: 'payroll/advancesalary',
    Bonus: 'payroll/bonus',
    OverTime: 'payroll/overtime',
    LoanRequest: 'payroll/loan',
    LoanDetail: 'payroll/loan/detail',
    CancelAdvanceSalary: 'payroll/advancesalary/cancel',
    Approval: "payroll/approval",
    ApprovalAction: "payroll/approval/action",
    LeaveType: "leave/type",
    Insurance: 'payroll/insurance',
    PF: 'payroll/providentfund',
    ExtraAllowc: 'payroll/extraallowance',
    PayslipReport: "payroll/report/payslip",
    SalarySheetReport: 'payroll/report/salarysheet',
    LoanReport: 'payroll/report/loandetail',

}

export const payScheduleType = [{ id: "Monthly", title: "Monthly" },
{ id: "Weekly", title: "Weekly" }
]
export const dayRange = Array.from(Array(31)).map((e, i) => ({ id: i, title: `${i === 0 ? 'First Day of Month' : i}` }));
export const perDayCalulationsList = [
    { id: "MonthlyGross_DivideBy_NumberOfDays_InMonth", title: "Monthly Gross Salary / No. of Days In Month" },
    { id: "MonthlyGross_DivideBy_FixedDays", title: "Monthly Gross Salary / Fixed Days" }
], defaultCaluation = "MonthlyGross_DivideBy_NumberOfDays_InMonth";

export const basicSalaryTypeList = [
    { id: "PercentageBased", title: "Percentage Based" },
    { id: "FixedAmount", title: "Fix Amount" }
], PercentageBased = "PercentageBased";

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


