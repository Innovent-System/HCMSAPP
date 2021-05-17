import PropTypes from 'prop-types';
import { Route, Redirect, } from 'react-router-dom';
import Auth from '../services/AuthenticationService';


const RouterWrapper = ({ component: Component, isPrivate, ...rest }) => {
  //Manage with Globaly

  const signed = Auth.getitem('employeeInfo')?.signIn || false;
  
  

  if (isPrivate && !signed) return <Redirect to='/' />;

  if (!isPrivate && signed) return <Redirect to='/dashboard' />;

                  
  return  <Route {...rest} component={Component} />;
};

RouterWrapper.propTypes = {
  isPrivate: PropTypes.bool,
  component: PropTypes.oneOfType([PropTypes.element, PropTypes.func])
    .isRequired,
};

RouterWrapper.defaultProps = {
  isPrivate: false,
};

export default RouterWrapper;
