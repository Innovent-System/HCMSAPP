import ApprovalRoute from '../ApprovalRoute'
import { API } from './_Service'
import ReportDesigner from '../../components/ReportDesigner'

       

const PayrollApproval = () => {
    return (
        <>
            <ReportDesigner />
            {/* <ApprovalRoute DEFAULT_API={API.Approval} DEFAULT_NAME="PayrollApproval" DISPLAY_TITLE="Payoll Approval" /> */}
        </>

    )
}

export default PayrollApproval