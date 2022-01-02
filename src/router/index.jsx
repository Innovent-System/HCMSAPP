import React, { lazy, Suspense, useState,useCallback } from 'react';
import { Navigate, Routes,Route } from 'react-router-dom';
import PrivateRoute from './wrapper';
import SignIn from "../pages/General/SignIn";
import Layout from '../layout';
import CircularLoading from '../components/Circularloading'
import Auth from '../services/AuthenticationService';
import StatusSnack from './StatusHandler';
import { history } from '../config/appconfig';
import Dashboard from '../pages/General/Dashboard'




const Routers = () => {
  
  const [routes, setRoutes] = useState(Auth.getitem("appConfigData")?.appRoutes || []);
  const [sideMenu, setSideMenu] = useState(Auth.getitem("appConfigData")?.sideMenuData || []);
  
  return (
    <>

      <Routes>
          <Route path="/" index element={<SignIn setRoutes={setRoutes} setSideMenu={setSideMenu} />} />
           <Route element={<PrivateRoute/>}>
               <Route element={<Layout sideMenu={sideMenu}/> }>
                         <Route  path="/dashboard" element={<Dashboard />} />
                          {routes.map((prop, key) => {
                                    return (
                                      <Route  path={`${prop.path.substring(5).toLowerCase()}/:id`} key={key} element={<DynamicLoader component={prop.path} />} />
                                    );
                                })
                            }
                       <Route  path="*" element={<Dashboard />} />
              </Route>
          </Route>
          {/* <Route path="*" element={<Navigate to="/dashboard"/>} /> */}
      </Routes>
      <StatusSnack />
    </>
  );
};

function DynamicLoader(props) {

  const LazyComponent = lazy(() => import(`../${props.component}`)
  .catch(() => ({ default: () => <div>Not found</div> })));
  return (
    <Suspense fallback={<CircularLoading />}>
      <LazyComponent />
    </Suspense>
  );
}

// function DynamicLoader(props) {
//   const [LazyComponent, setLazyComponent] = useState(() => () => 
//   <div/>);

//    useEffect(() => {
//         const Lzy = lazy(() => import(`${props.component}`));
//         setLazyComponent(Lzy);
//    }, [props.component]);


//   return (

//     <Suspense fallback={<div>Loading...</div>}>
//       <div>
//        <LazyComponent/>
//       </div>
//     </Suspense>
//   );
// }

export default Routers;
