// import { authRef,singleUserRef, FIREBASE_AUTH_PERSIST} from "../config/firebase";


import { 
  FETCH_USER,
  FETCH_USER_SUCCESS,
  FETCH_USER_FAILED,
  USER_SIGN_IN,
  USER_SIGN_IN_FAILED,
  USER_SIGN_OUT,
  USER_SIGN_IN_SUCCESS,
  CLEAR_LOGIN_ERROR,

  POST_DATA,
  POST_DATA_SUCCESS,
  POST_DATA_FAILED,

  GET_DATA,
  GET_DATA_SUCCESS,
  GET_DATA_FAILED,

  DELETE_DATA,
  DELETE_DATA_SUCCESS,
  DELETE_DATA_FAILED,

  UPDATE_DATA,
  UPDATE_DATA_SUCCESS,
  UPDATE_DATA_FAILED

} from "./types";

import { httpService } from '../../services/HttpServies';


// export const fetchUser = () => dispatch => {
//   dispatch({
//     type: FETCH_USER,
//     payload: null
//   });
//   authRef.onAuthStateChanged(user => {
//     if (user) {
//         singleUserRef(user.uid).once("value", snapshot => {
//           if(snapshot.val() && snapshot.val().isAdmin){
//             dispatch({
//               type: FETCH_USER_SUCCESS,
//               payload: user
//             });
//           }else{
//             authRef
//             .signOut()
//             .then(() => {
//               dispatch({
//                 type: USER_SIGN_IN_FAILED,
//                 payload: "This login is a valid user but not Admin"
//               });     
//             })
//             .catch(error => {
//               dispatch({
//                 type: USER_SIGN_IN_FAILED,
//                 payload: error
//               });
//             });
//           }
//         });
//     }else{
//       dispatch({
//         type: FETCH_USER_FAILED,
//         payload: null
//       });
//     }
//   });
// };

export const handlePostActions = (url, data = {}) => dispatch => {

  dispatch({
        type: POST_DATA,
        payload: null
      });

  httpService("POST",url,data).then(response => {
    if(response.status){
      const { result,message } = response.data;
      
        dispatch({
          type: POST_DATA_SUCCESS,
          payload: result,
          message
        });
    }
   
  }).catch(err => dispatch({
          type: POST_DATA_FAILED,
          payload: err.message
        }));

  
//   authRef.setPersistence(FIREBASE_AUTH_PERSIST)
//   .then(function() {
//     authRef
//     .signInWithEmailAndPassword(username,password)
//     .then(user=>{
//       dispatch({
//         type: USER_SIGN_IN,
//         payload: null
//       });      
//     })
//     .catch(error => {
//       dispatch({
//         type: USER_SIGN_IN_FAILED,
//         payload: error
//       });
//     });
//   })
//   .catch(function(error) {
//     dispatch({
//       type: USER_SIGN_IN_FAILED,
//       payload: "Auth Error"
//     });
//   });
};

// export const signOut = () => dispatch => {
//   authRef
//     .signOut()
//     .then(() => {
//       dispatch({
//         type: USER_SIGN_OUT,
//         payload: null
//       });       
//     })
//     .catch(error => {
//       //console.log(error);
//     });
// };

export const clearLoginError = () => dispatch => {
  dispatch({
    type: CLEAR_LOGIN_ERROR,
    payload: null
  });  
};