import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Auth from '../services/AuthenticationService';

// const RouterWrapper = () => {
//   const location = useLocation();
//   const isAuthenticated = document.cookie.includes("is_Auth=true") || Auth.getitem('userInfo');
  
//   if (!isAuthenticated) return <Navigate to="/" state={{ from: location }} />;

//   return <Outlet />;
// };

// export default RouterWrapper;

const isLoggedIn = () =>
  document.cookie.includes("is_Auth=true") || Boolean(Auth.getitem('userInfo'));

// Bina login ke koi private URL kholay to login par, aur yaad rakho wo kahan jana chahta tha
export const PrivateRoute = () => {
  const location = useLocation();
  return isLoggedIn()
    ? <Outlet />
    : <Navigate to="/" state={{ from: location }} replace />;
};

// Login page: pehle se logged in ho to dashboard
export const PublicOnlyRoute = () =>
  isLoggedIn() ? <Navigate to="/dashboard" replace /> : <Outlet />;
