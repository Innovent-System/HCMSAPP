import React, { lazy, Suspense, useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './wrapper';
import Layout from '../layout';
import CircularLoading from '../components/Circularloading'
import Auth from '../services/AuthenticationService';
import StatusSnack from './StatusHandler';
import { useSelector } from 'react-redux';
import componentsToMap from './MapComponent';

const LazySignIn = lazy(() => import(`../pages/General/SignIn`));
const LazyDashboard = lazy(() => import(`../pages/General/Dashboard`));

const MapToRoute = ({ formId }) => {
  const Map = componentsToMap[formId];
  return <Suspense fallback={<CircularLoading />}>{Map ? <Map /> : <div>Not Found</div>}</Suspense>

}


const Routers = () => {

  const routes = useSelector(e => e.appdata.routeData.appRoutes || Auth.getitem("appConfigData")?.appRoutes);

  return (
    <>
      <Suspense fallback={<CircularLoading />}>
        <Routes>
          <Route path="/" index element={<LazySignIn />} />
          <Route element={<PrivateRoute />}>
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
          {/* <Route path="*" element={<Navigate to="/dashboard"/>} /> */}
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
