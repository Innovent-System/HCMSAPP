import { Navigate, Outlet, useLocation } from 'react-router-dom';



const RouterWrapper = () => {
  const location = useLocation();
  const isAuthenticated = document.cookie.includes("is_Auth=true");
  console.log("Auth Status:", document.cookie);
  if (!isAuthenticated) return <Navigate to="/" state={{ from: location }} />;

  return <Outlet />;
};

export default RouterWrapper;
