import React, { lazy, Suspense, useState } from 'react';
import { Redirect, Switch,Route } from 'react-router-dom';
import PrivateRoute from './wrapper';
import SignIn from "../pages/General/SignIn";
import Layout from '../components/layout';
import CircularLoading from '../components/Circularloading'
import Auth from '../services/AuthenticationService';
import StatusSnack from './StatusHandler';
import {useHistory} from 'react-router-dom';



const Routes = () => {
  
  const history =  useHistory();
  const [routes, setRoutes] = useState(Auth.getitem("appConfigData")?.appRoutes || []);
  const [sideMenu, setSideMenu] = useState(Auth.getitem("appConfigData")?.sideMenuData || []);

  const checkRoutes = (routes = []) => {
    const url = window.location.pathname.split("/")[1];
    //all routes shoulb be in array private or non-private
    if(routes.find(f => f.routeTo.match(url))){
      return true;
    }
    else{
       history.push("/dashboard");
    }

    return true;
  } 
  
  return (
    <>
      <Switch>
      
      <PrivateRoute path='/' exact component={() => <SignIn setRoutes={setRoutes} setSideMenu={setSideMenu} />} />
      {/* <Route
                exact
                path="/jobopening"
                component={() => <Emp />}
                
              /> */}
       {/* publick route define before */}
      {(routes?.length && checkRoutes(routes)) ? 
        <Layout sideMenuData={sideMenu}>
          
          {routes.map((prop, key) => {
            return (
              <PrivateRoute
                exact
                path={`${prop.routeTo}/:id`}
                component={() => <DynamicLoader component={prop.path} />}
                isPrivate
                key={key}
              />
            );
          })
          
          }
        </Layout> 
         : <Redirect  to="/" />
      }
      <Route render={() => <Redirect to="/" />} />
    </Switch>
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

export default Routes;
