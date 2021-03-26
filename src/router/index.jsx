import React,{lazy, Suspense,useEffect,useState } from 'react';
import { Redirect, Switch } from 'react-router-dom';
import Route from './wrapper';

import SignIn from "../pages/General/SignIn";
import Layout from '../components/layout';
import CircularLoading from '../components/Circularloading'
import Notification from "../components/Notification";
import { useSelector } from "react-redux";
import Auth from '../services/AuthenticationService';
// const routes = [
//   { path: "/employeelist", component: "pages/Employee/Employeelist/Employeeslist" }
// ];



const Routes = () => {
  const selector = useSelector(state => state[Object.keys(state)[0]]);
  const [routes,setRoutes] = useState(Auth.getitem("appConfigData")?.appRoutes || []);
  const [sideMenu,setSideMenu] = useState(Auth.getitem("appConfigData")?.sideMenuData || []);
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

    
  useEffect(() => {
      setNotify({
        isOpen: (selector.error.flag || selector.status),
        message:  selector.error.flag ? selector.error.msg : selector.message,
        type:  selector.error.flag ? "error" : "success"
      });
  }, [selector]);

  

  return (
    <>
     
         <Switch>
            <Route path='/' exact  component={() => <SignIn setRoutes={setRoutes} setSideMenu={setSideMenu}/>} />
                 { Auth.getitem('appConfigData')?.appRoutes || routes.length ? 
                    <Layout sideMenuData={sideMenu}>
                          {routes.map((prop, key) => {
                            
                            return (
                              <Route
                                exact
                                path={prop.routeTo}
                                component={() => <DynamicLoader component={prop.path} />}
                                isPrivate
                                key={key}
                              />
                            );
                          })}
                          
                      </Layout>
                  : <Redirect to='/' />
                 } 
            </Switch>
            <Notification notify={notify} setNotify={setNotify} />
    </>
  );
};

function DynamicLoader(props) {
  
  const LazyComponent = lazy(() => import(`../${props.component}`));
  return (
    <Suspense fallback={<CircularLoading/>}>
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

export default Routes;
