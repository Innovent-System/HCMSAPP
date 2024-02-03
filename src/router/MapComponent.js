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
    //Attendance
    12: lazy(() => import(`../pages/Attendance/Request`)),
    13: lazy(() => import(`../pages/Attendance/Exemption`)),
    21: lazy(() => import(`../pages/Attendance/Amendments`)),
    14: lazy(() => import(`../pages/Attendance/Approval`)),
    15: lazy(() => import(`../pages/Attendance/Schedule`)),
    16: lazy(() => import(`../pages/Attendance/Settings`)),
    //Leave
    17: lazy(() => import(`../pages/Leave/Request`)),
    // 18: lazy(() => import(`../pages/Leave/Request`)),
    19: lazy(() => import(`../pages/Leave/Approval`)),
    20: lazy(() => import(`../pages/Leave/Settings`)),
    //organization
    9: lazy(() => import(`../pages/Organization/SystemLog`)),
    10: lazy(() => import(`../pages/Organization/ManageCompany`)),
    11: lazy(() => import(`../pages/Organization/Settings`)),


})