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
  
  const checkRoutes = useCallback((_routes = []) => {
    const url = window.location.pathname.split("/")[1];
    //all routes shoulb be in array private or non-private
    if(_routes.find(f => f.routeTo.match(url))){
      return true;
    }
    else{
       history.push("/dashboard");
    }

    return true;
  },[routes]);
  
  return (
    <>

      <Routes>
          <Route path="/" index element={<SignIn setRoutes={setRoutes} setSideMenu={setSideMenu} />} />
           <Route element={<PrivateRoute/>}>
               <Route element={<Layout sideMenu={sideMenu}/> }>
                         <Route  path="/dashboard" element={<Dashboard />} />
                          {routes.map((prop, key) => {
                                    return (
                                      <Route  path={`${prop.routeTo}/:id`} key={key} element={<DynamicLoader component={prop.path} />} />
                                    );
                                })
                            }
                       <Route  path="*" element={<Dashboard />} />
              </Route>
              
              
          </Route>
          {/* <Route path="*" element={<Navigate to="/dashboard"/>} /> */}
      </Routes>
     
      
      {/* <Route
                exact
                path="/jobopening"
                component={() => <Emp />}
                
              /> */}
       {/* publick route define before */}
      {/* {(routes?.length && checkRoutes(routes)) ? 
      
        <Layout sideMenuData={sideMenu}>
          <Routes>
          
            {routes.map((prop, key) => {
              return (
                <Route  path={`${prop.routeTo}/:id`} key={key} element={<DynamicLoader component={prop.path} />} />
              );
            })
            }
            
          </Routes>
        </Layout> 
         :  null 
      } */}
      <StatusSnack />
    </>
  );
};

function DynamicLoader(props) {

  const LazyComponent = lazy(() => import(`../${props.component}`));
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
