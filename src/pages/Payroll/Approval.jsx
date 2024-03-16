import ApprovalRoute from '../ApprovalRoute'
import { API } from './_Service'
       

const PayrollApproval = () => {
    return (
        <>
            <ApprovalRoute DEFAULT_API={API.Approval} DEFAULT_NAME="PayrollApproval" DISPLAY_TITLE="Payoll Approval" />
        </>

    )
}

export default PayrollApproval