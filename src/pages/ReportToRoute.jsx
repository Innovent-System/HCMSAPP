import { lazy, Suspense, useState } from "react"
import CircularLoading from "../components/Circularloading";
import Comingsoon from "../components/Comingsoon";
import Controls from "../components/controls/Controls";
import { Grid } from '../deps/ui'
import { useAppSelector } from "../store/storehook";


const reportMap = Object.freeze({
    1: lazy(() => import(`./Attendance/reports/AttendanceReport`)),
    2: lazy(() => import(`./Payroll/reports/PayslipReport`)),
})

const ReportToRoute = ({ reportId, loader, setLoader }) => {
    const Map = reportMap[reportId];
    return <Suspense fallback={<CircularLoading open={true} />}>{Map ? <Map loader={loader} setLoader={setLoader} /> : <Comingsoon />}</Suspense>
}

export const ReportPage = ({ formId, defaultReport }) => {
    const [loader, setLoader] = useState(false);
    const [reportId, setReportId] = useState(defaultReport)

    const reports = useAppSelector(e => e.appdata.routeData.appReports.filter(c => formId === c.formId));

    return (
        <>
            <Grid container spacing={2}>
                <Grid item sm={3} md={3} lg={3} pr={7.5}>
                    <Controls.Select name="reportId" isNone={false} onChange={(e) => setReportId(e.target.value)} value={reportId}
                        label="Reports" options={reports} dataId="reportId" dataName="name" />
                </Grid>
                <ReportToRoute loader={loader} setLoader={setLoader} reportId={reportId} />
            </Grid>
            <CircularLoading open={loader} />
        </>

    )
}