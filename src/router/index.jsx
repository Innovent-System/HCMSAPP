import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './wrapper';
import Layout from '../layout';
import CircularLoading from '../components/Circularloading'
import Auth from '../services/AuthenticationService';
import StatusSnack from './StatusHandler';
import componentsToMap from './MapComponent';
import { useAppSelector } from '../store/storehook';
import ComingSoon from '../components/Comingsoon'
import ReportTable from '../components/ReportTable';
import AttendanceReportViewer from '../pages/Attendance/reports/viewer/AttendanceViewer';
import { API as AttendanceAPI } from '../pages/Attendance/_Service';
import { API as PayrollAPI } from '../pages/Payroll/_Service';
import PaySlipViewer from '../pages/Payroll/reports/viewer/PayslipViewer';
import SalarySheetViewer from '../pages/Payroll/reports/viewer/SalarySheetViewer';
import LoanViewer from '../pages/Payroll/reports/viewer/LoanViewer';

const LazySignIn = lazy(() => import(`../pages/General/SignIn`));
const LazyDashboard = lazy(() => import(`../pages/General/Dashboard`));

// const LazyCus = lazy(() => new Promise((resolve) => {    
//   setTimeout(() => {      
//     resolve(import('../components/Comingsoon'));    
//   }, 80000);  
// }));


const MapToRoute = ({ formId }) => {
  const Map = componentsToMap[formId];
  return Map ? <Map /> : <ComingSoon />

}


const Routers = () => {

  const routes = useAppSelector(e => e.appdata.routeData.appRoutes || Auth.getitem("appConfigData")?.appRoutes);

  return (
    <>
      <Suspense fallback={<CircularLoading open={true} />}>
        <Routes>
          <Route path="/" index element={<LazySignIn />} />
          <Route element={<PrivateRoute />}>
            <Route path="/attendancereport" element={<AttendanceReportViewer fileName="AttendanceReport" API_NAME={AttendanceAPI.AttendanceReport} />} />
            <Route path="/payslipreport" element={<PaySlipViewer fileName="PayslipReport" API_NAME={PayrollAPI.PayslipReport} />} />
            <Route path="/salarysheetreport" element={<SalarySheetViewer fileName="SalarySheetReport" API_NAME={PayrollAPI.SalarySheetReport} />} />
            <Route path="/loanreport" element={<LoanViewer fileName="LoanReport" API_NAME={PayrollAPI.LoanReport} />} />
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<LazyDashboard />} />

              {routes?.map((prop, key) => {
                return (
                  <Route path={`${prop.path.substring(5).toLowerCase()}/:id`} key={prop.path} element={<MapToRoute formId={prop.formId} />} />
                );
              })}
              <Route path="*" element={<LazyDashboard />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
      <StatusSnack />
    </>
  );
};

function importModule(path) {
  // who knows what will be imported here?
  return import(/* @vite-ignore */ path);
}

function DynamicLoader(props) {

  const LazyComponent = lazy(() => import(`../${props.component}.jsx`)
    .catch(() => ({ default: () => <div>Not found</div> })));
  return (
    <Suspense fallback={<CircularLoading />}>
      <LazyComponent />
    </Suspense>
  );
}

// function DynamicLoader(props) {
//   const [LazyComponent, setLazyComponent] = useState(() => () =>
//     <div />);

//   useEffect(() => {
//     const Lzy = lazy(() => import(`../${props.component}`));
//     setLazyComponent(Lzy);
//   }, [props.component]);


//   return (

//     <Suspense fallback={<div>Loading...</div>}>
//       <div>
//         <LazyComponent />
//       </div>
//     </Suspense>
//   );
// }

export default Routers;
