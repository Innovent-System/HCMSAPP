export const API = {
    Employee: "employee",
    EmployeeListReport: "employee/report/listreport",
    Approval: "employee/approval",
    ProfileRequest: "employee/profile",
    Group: "employee/group",
    Designation: "employee/designation",
    EmployeeStatus: "employee/status",
    RoleTemplate: "employee/roletemplate"
}


const alpha = Array.from(Array(26)).map((e, i) => i + 65);
export const alphabets = alpha.map((x) => String.fromCharCode(x));