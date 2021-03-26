
import { FETCH_ROUTES,FETCH_ROUTES_SUCCESS,FETCH_ROUTES_FAILED } from '../actions/types';
import { httpService } from '../../services/HttpServies';



export const fetchRoutes = () => dispatch => {
  dispatch({
    type: FETCH_ROUTES,
    payload: null
  });

  httpService("GET",'app/getRoutes').then(response => {
      if(response.status){
        dispatch({
            type: FETCH_ROUTES_SUCCESS,
            payload: response.data
          });
      }
      else{
        dispatch({
            type: FETCH_ROUTES_FAILED,
            payload: response.data
          });
      }
  }).catch(err =>  dispatch({
    type: FETCH_ROUTES_FAILED,
    payload: err
  }));
  
};