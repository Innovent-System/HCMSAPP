import { Navigate,Outlet,useLocation } from 'react-router-dom';



const RouterWrapper = () => {
  //Manage with Globaly
  let location = useLocation();
  const signed = document.cookie === "is_Auth=true" || false;

  if(!signed){
    return <Navigate to="/" state={{ from: location }} />;
  }
  // if (!signed) return <Route element={<Navigate to='/' />}  />;
   return <Outlet />;   
};

export default RouterWrapper;
