import axios from 'axios';

const domain = 'http://localhost:5000/api/';

const headerOption = {
    token: document.cookie || '',
    'Accept': 'application/json',
    'Content-Type': 'application/json;charset=UTF-8'
  };

export const httpService = async (method = "GET",url = "",data = {}) =>{

    const options = {
        url: `${domain.concat(url)}`,
        method: method.toUpperCase(),
        headers: headerOption
      };

      if(["POST","PUT"].includes(method)){
        options.data = data
      }
      else{
        options.params = data
      }

      return axios(options);
    //  const responseData = {};

    //  const response = await axios(options);
    
    // if(response.status){
    //     Object.assign(responseData,{...responseData,success:response.data,statusText:response.statusText});
    // }
    // else{
    //     Object.assign(responseData,{...responseData,success:response.data,statusText:response.statusText});
    // }
     
    // return response;

}



