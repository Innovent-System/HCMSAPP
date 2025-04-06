import { lazy, Suspense, useMemo, useState } from "react"
import CircularLoading from "../components/Circularloading";
import Comingsoon from "../components/Comingsoon";
import Controls from "../components/controls/Controls";
import { Grid } from '../deps/ui'
import { useAppSelector } from "../store/storehook";


const reportMap = Object.freeze({
    1: lazy(() => import(`./Attendance/reports/filter/AttendanceFilter`)),
    2: lazy(() => import(`./Payroll/reports/filter/PayslipFilter`)),
    3: lazy(() => import(`./Payroll/reports/filter/SalarySheetFilter`)),
    4: lazy(() => import(`./Payroll/reports/filter/LoanFilter`)),
    5: lazy(() => import(`./Payroll/reports/filter/PayrollSummaryFilter`))
})

const ReportToRoute = ({ reportId, loader, setLoader }) => {
    const Map = reportMap[reportId];
    return <Suspense key={reportId} fallback={<CircularLoading open={true} />}>{Map ? <Map loader={loader} setLoader={setLoader} /> : <Comingsoon />}</Suspense>
}

export const ReportPage = ({ formId, defaultReport }) => {
    const [loader, setLoader] = useState(false);
    const [reportId, setReportId] = useState(defaultReport)

    const reportsData = useAppSelector(e => e.appdata.routeData.appReports);
    const reports = useMemo(() => reportsData.filter(c => formId === c.formId), [formId])

    return (
        <>
            <Grid container flexDirection="column" spacing={1}>
                <Grid item size={{ xs: 2.5, md: 2.5 }} >
                    <Controls.Select name="reportId" isNone={false} onChange={(e) => setReportId(e.target.value)} value={reportId}
                        label="Reports" options={reports} dataId="reportId" dataName="name" />
                </Grid>
                <ReportToRoute loader={loader} setLoader={setLoader} reportId={reportId} />
            </Grid>
            <CircularLoading open={loader} />
        </>

    )
}