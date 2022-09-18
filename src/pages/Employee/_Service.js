export const API = {
    Employee: "employee/list",
    Group: "employee/group",
    Designation: "employee/designation",
}


const alpha = Array.from(Array(26)).map((e, i) => i + 65);
export const alphabets = alpha.map((x) => String.fromCharCode(x));