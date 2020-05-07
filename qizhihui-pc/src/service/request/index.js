/**
 * 封装请求
 */

// import Vue from 'vue';
// import crypto from '../crypto/index.js';
// // 期指汇的proxyID
// function getProxyId() {
//   return 33;
// }
// function defaultParam() {
//   return {
//     version: '1.0.0',
//     packtype: '338',
//     contracttypeid: 2,
//     // usertoken: userToken(),
//     proxyid: getProxyId()
//   };
// }

// const getGMToken = () => {
//   // if (!userToken()) {
//   //   location.reload();
//   // }
//   return new Promise(resolve => {
//     resolve({
//       version: '1.0.0',
//       packtype: '783',
//       // usertoken: userToken(),
//       proxyid: 33
//     });
//   });
// };

// const urlEncode = (param, key, encode) => {
//   if (!param) {
//     return '';
//   }
//   let paramStr = '';
//   const t = typeof param;
//   if (t === 'string' || t === 'number' || t === 'boolean') {
//     paramStr += `&${key}=${encode == null || encode
//       ? encodeURIComponent(param)
//       : param}`;
//   } else {
//     for (const i in param) {
//       if ({}.hasOwnProperty.call(param, i)) {
//         const k =
//           key == null ? i : key + (param instanceof Array ? `[${i}]` : `.${i}`);
//         paramStr += urlEncode(param[i], k, encode);
//       }
//     }
//   }
//   return paramStr;
// };

// // x-www-form-urlencoded设置
// // Vue.http.options.emulateJSON = true;

// export default {
//   get(url, query, ops) {
//     return new Promise((resolve, reject) => {
//       let params = query;
//       const setting = Object.assign({}, ops);
//       let result;
//       getGMToken().then(data => {
//         params = Object.assign({}, data, query);

//         setting.params = {
//           param: crypto.encode(urlEncode(params))
//         };

//         Vue.http
//           .get(url, {
//             params
//           })
//           .then(res => {
//             result = crypto.decode(res.data);
//             if (typeof result === 'string') {
//               try {
//                 result = JSON.parse(result);
//               } catch (e) {
//                 reject(e);
//               }
//             }
//             resolve(result);
//           }, reject);
//       });
//     });
//   },
//   post(url, query, ops) {
//     let params;
//     const setting = Object.assign({}, ops);
//     let result;
//     let body;
//     return new Promise((resolve, reject) => {
//       getGMToken().then(data => {
//         params = Object.assign({}, query, data);
//         setting.params = {};
//         console.info('[request]:', url, urlEncode(params));
//         body = {
//           param: crypto.encode(urlEncode(params))
//         };

//         Vue.http
//           .post(url, body, {
//             emulateJSON: true
//           })
//           .then(res => {
//             result = crypto.decode(res.data);
//             if (typeof result === 'string') {
//               try {
//                 result = JSON.parse(result);
//               } catch (e) {
//                 console.log(e);
//                 reject(e);
//               }
//             }
//             console.info('[response]:', url, result);
//             resolve(result);
//           }, reject);
//       });
//     });
//   },

//   simplePost(url, query) {
//     const params = Object.assign({}, query, defaultParam());
//     console.info('[request]:', url, params);
//     return new Promise((resolve, reject) => {
//       Vue.http
//         .post(url, params, {
//           emulateJSON: true
//         })
//         .then(res => {
//           console.info('[response]:', url, res.data);
//           resolve(res.data);
//         }, reject);
//     });
//   },
//   // postFile(url, formdata) {
//   //   return new Promise((resolve, reject) => {
//   //     $.ajax({
//   //       type: 'POST',
//   //       url,
//   //       data: formdata,
//   //       // contentType: 'multipart/form-data',
//   //     })
//   //       .then((res) => {
//   //         console.info('[response]:', url, res);
//   //         resolve(res);
//   //       })
//   //       .fail((err) => {
//   //         reject(err);
//   //       });
//   //   });
//   // },
//   simpleGet(url, query) {
//     return new Promise((resolve, reject) => {
//       const params = Object.assign({}, query, defaultParam());
//       console.info('[request]:', url, params);
//       Vue.http.get(url, { params }, { emulateJSON: true }).then(res => {
//         console.info('[response]:', url, res.data);
//         resolve(res.data);
//       }, reject);
//     });
//   }
// };

import axios from 'axios';
import qs from 'qs';
import {
  encode,
  decode,
} from '../crypto/index.js';

// const defaultParams = {
//   version: '1.0.0',
//   packtype: '338',
//   contracttypeid: 2,
//   proxyid: 33,
// };

/**
 * get请求
 */
export function get(url, payload) {
  let req;
  if (typeof payload !== 'undefined') {
    if (url.indexOf('?') > -1) {
      req = `${url}&${qs.stringify(payload)}`;
    } else {
      req = `${url}?${qs.stringify(payload)}`;
    }
  } else {
    req = url;
  }
  return axios.get(req).then(res => res.data);
}
 /**
  * post请求
  */
export function post(url, payload) {
  const opts = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  };
  return axios.post(url, qs.stringify(payload), opts).then(res => res.data);
}
/**
 * 加密post
 * @param {*请求地址} url 
 * @param {*请求参数} payload 
 */
export function encodePost(url, payload) {
  const param = encode(qs.stringify({
    ...payload,
  }));
  return post(url, { param }).then(res => JSON.parse(decode(res)));
}

/**
 * 加密post
 * @param {*请求地址} url 
 * @param {*请求参数} payload 
 */
export function encodePost2(url, payload) {
  const param = encode(JSON.stringify({
    ...payload,
  }));
  return post(url, { param }).then(res => JSON.parse(decode(res)));
}
