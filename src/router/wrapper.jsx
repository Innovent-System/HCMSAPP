import PropTypes from 'prop-types';
import { Route, Navigate,Outlet,useLocation } from 'react-router-dom';
import Auth from '../services/AuthenticationService';



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

// RouterWrapper.propTypes = {
//   isPrivate: PropTypes.bool,
//   component: PropTypes.oneOfType([PropTypes.element, PropTypes.func])
//     .isRequired,
// };

// RouterWrapper.defaultProps = {
//   isPrivate: false,
// };

export default RouterWrapper;
