import ApprovalRoute from '../ApprovalRoute'
import { API } from './_Service'

const EmployeeApproval = () => {
    return (
        <ApprovalRoute DEFAULT_API={API.Approval} DEFAULT_NAME="EmployeeApproval" DISPLAY_TITLE="Employee Approval" />
    )
}

export default EmployeeApproval