import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import {  Platform } from 'react-native';

const TIMEOUT = 1 * 60 * 1000;
axios.defaults.timeout = TIMEOUT;

const setupAxiosInterceptors = async (onUnauthenticated:any) => {
  let token:any;

  
 const onRequestSuccess = async (config:any) => {
      if(Platform.OS!='web'){
        token = await SecureStore.getItemAsync('token');
    }else{
        token = await localStorage.getItem('token');
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  };
  const onResponseSuccess = (response:any) => response;
  const onResponseError = (err:any) => {
    const status = err.status || (err.response ? err.response.status : 0);
    if (status === 403 || status === 401) {
      onUnauthenticated();
    }
    return Promise.reject(err);
  };
  axios.interceptors.request.use(onRequestSuccess);
  axios.interceptors.response.use(onResponseSuccess, onResponseError);
};

export default setupAxiosInterceptors;
