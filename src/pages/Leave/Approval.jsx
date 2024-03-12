import ApprovalRoute from '../ApprovalRoute'
import { API } from './_Service'

const LeaveApproval = () => {
    return (
        <ApprovalRoute DEFAULT_API={API.Approval} DEFAULT_NAME="LeaveApproval" DISPLAY_TITLE="Leave Approval" />
    )
}

export default LeaveApproval