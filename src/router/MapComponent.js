import { lazy } from 'react'


export default Object.freeze({
    // 1: lazy(() => import(`../pages/Employee/Dashboard`)),
    2: lazy(() => import(`../pages/Employee/List`)),
    // 3: lazy(() => import(`../pages/Employee/Transfer`)),
    // 5: lazy(() => import(`../pages/Employee/Role`)),
    // 6: lazy(() => import(`../pages/Employee/InfoRequest`)),
    7: lazy(() => import(`../pages/Employee/Approval`)),
    4: lazy(() => import(`../pages/Employee/ProfileRequest`)),
    8: lazy(() => import(`../pages/Employee/Settings`)),
    22: lazy(() => import(`../pages/Employee/Reports`)),
    //Attendance
    12: lazy(() => import(`../pages/Attendance/Request`)),
    13: lazy(() => import(`../pages/Attendance/Exemption`)),
    21: lazy(() => import(`../pages/Attendance/Amendments`)),
    14: lazy(() => import(`../pages/Attendance/Approval`)),
    15: lazy(() => import(`../pages/Attendance/Schedule`)),
    16: lazy(() => import(`../pages/Attendance/Settings`)),
    23: lazy(() => import(`../pages/Attendance/Reports`)),
    34: lazy(() => import(`../pages/Attendance/AmendRoster`)),
    //Leave
    17: lazy(() => import(`../pages/Leave/Request`)),
    // 18: lazy(() => import(`../pages/Leave/Request`)),
    19: lazy(() => import(`../pages/Leave/Approval`)),
    20: lazy(() => import(`../pages/Leave/Settings`)),
    //organization
    9: lazy(() => import(`../pages/Organization/SystemLog`)),
    10: lazy(() => import(`../pages/Organization/ManageCompany`)),
    33: lazy(() => import(`../pages/Organization/GazettedHoliday`)),
    11: lazy(() => import(`../pages/Organization/Settings`)),
    //Payroll
    24: lazy(() => import("../pages/Payroll/Setup")),
    25: lazy(() => import("../pages/Payroll/SalarySetup")),
    26: lazy(() => import("../pages/Payroll/Payroll")),
    27: lazy(() => import("../pages/Payroll/Approval")),
    28: lazy(() => import("../pages/Payroll/OverTime")),
    30: lazy(() => import("../pages/Payroll/AdvanceSalary")),
    31: lazy(() => import("../pages/Payroll/Loan")),
    35: lazy(() => import("../pages/Payroll/Reports")),
    32: lazy(() => import("../pages/Payroll/Settings")),
    29: lazy(() => import("../pages/Payroll/Bonus")),
    37: lazy(() => import("../pages/Payroll/LoanAdjustment")),
    38: lazy(() => import("../pages/Payroll/HealthInsurance")),

    //Recruitment
    36: lazy(() => import("../pages/Recruitment/JobPost"))
})
