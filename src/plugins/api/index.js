import axios from 'axios';
import config from './config'
import router from '@/router';
import { KJUR } from 'jsrsasign';

const api = axios.create({
  baseURL: config.url,
  headers: config.headers
});

//
// // Add a request interceptor
// api.interceptors.request.use(async function (config) {
//   // Do something before request is sent
//
//   if (config.skipAuth) {
//     console.log('skipped auth');
//     return config;
//   }
//
//   // иначе запрашиваем валидный accessToken
//   let accessToken = localStorage.getItem('token');
//
//   const {
//     payloadObj: { orig_iat },
//   } = KJUR.jws.JWS.parse(accessToken);
//
//   const now = Math.floor(Date.now() * 0.001);
//
//   if( now >= orig_iat) {
//     await api.post('/users/refresh_token/', {'token': accessToken},  {headers: {
//         'Authorization': `JWT ${accessToken}`,
//       },} ).then(res => {
//       if(res.status === 201) {
//         accessToken = res.data.token
//       }
//     })
//   }
//   return {
//     ...config,
//     headers: {
//       'Authorization': `JWT ${accessToken}`,
//     },
//   };
// }, function (error) {
//   // Do something with request error
//   return Promise.reject(error);
// });


export default api;