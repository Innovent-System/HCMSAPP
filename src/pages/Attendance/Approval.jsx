import ApprovalRoute from '../ApprovalRoute'
import { API } from './_Service'

const AttendanceApproval = () => {
    return (
        <ApprovalRoute DEFAULT_API={API.Approval} DEFAULT_NAME="AttendanceApproval" DISPLAY_TITLE="Attendance Approval" />
    )
}

export default AttendanceApproval