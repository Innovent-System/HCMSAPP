export const API = {
    Allowance: "payroll/allowance",
    Deduction: "payroll/deduction",
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