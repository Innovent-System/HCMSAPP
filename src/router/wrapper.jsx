import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Auth from '../services/AuthenticationService';

const RouterWrapper = () => {
  const location = useLocation();
  const isAuthenticated = document.cookie.includes("is_Auth=true") || Auth.getitem('userInfo');
  console.log("Auth Status:", document.cookie);
  if (!isAuthenticated) return <Navigate to="/" state={{ from: location }} />;

  return <Outlet />;
};

export default RouterWrapper;
