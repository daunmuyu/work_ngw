import fetch from 'dva/fetch';
import qs from 'qs';
import {
  openNotification,
} from 'utils/tool.js';
// import CryptoJS from 'crypto-js';

// const key = 'niugu123niugu456niugu123';
// const iv = '12312300';

const requestListeners = [];

function listenersHandler(data) {
  requestListeners.forEach((listener) => {
    listener(data);
  });
}
// /**
//  * 加密
//  */
// function encode(msg) {
//   const msgHex = CryptoJS.enc.Utf8.parse(msg);
//   const keyHex = CryptoJS.enc.Utf8.parse(key);
//   const ivHex = CryptoJS.enc.Utf8.parse(iv);
//   const encrypted = CryptoJS.TripleDES.encrypt(msgHex, keyHex, {
//     mode: CryptoJS.mode.CBC,
//     padding: CryptoJS.pad.Pkcs7,
//     iv: ivHex,
//   });
//   const res = CryptoJS.enc.Hex.stringify(encrypted.ciphertext);
//   return res.toUpperCase();
// }
// /**
//  * 解密
//  */
// function decode(msg) {
//   const msgHex = CryptoJS.enc.Hex.parse(msg);
//   const keyHex = CryptoJS.enc.Utf8.parse(key);
//   const ivHex = CryptoJS.enc.Utf8.parse(iv);
//   const decrypted = CryptoJS.TripleDES.decrypt({
//     ciphertext: msgHex,
//   }, keyHex, {
//     mode: CryptoJS.mode.CBC,
//     padding: CryptoJS.pad.Pkcs7,
//     iv: ivHex,
//   });
//   return CryptoJS.enc.Utf8.stringify(decrypted);
// }
// window.Security = {
//   decode,
//   encode,
// };

/**
 * get获取
 */
export function get(url, data) {
  let path = url;
  if (url.indexOf('?') >= 0) {
    path += `&${qs.stringify(data)}`;
  } else {
    path += `?${qs.stringify(data)}`;
  }
  return new Promise((resolve, reject) => {
    fetch(path)
      .then(response => resolve(response.json()))
      .catch(msg => reject(msg));
  });
}

/**
 * post数据
 */
export function post(url, data) {
  const param = qs.stringify(data);
  const opts = {
    method: 'POST',
    mode: 'cors',
    // credentials: 'include',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: param,
  };
  return new Promise((resolve) => {
    fetch(url, opts)
      .then((response) => {
        if (response.ok) {
          response.text()
            .then((res) => {
              if (typeof res === 'string') {
                try {
                  resolve(JSON.parse(res));
                } catch (e) {
                  openNotification({
                    title: '服务错误',
                    description: '服务器消息格式错误',
                  });
                  resolve({
                    error_no: -9998,
                    error_info: '服务器消息格式错误',
                    response,
                  });
                }
              } else {
                resolve(res);
              }
              listenersHandler(res);
            });
        } else {
          resolve({
            error_no: -9999,
            error_info: '网络异常',
            response,
          });
        }
      })
      .catch(msg => resolve({
        error_no: -9999,
        error_info: '网络异常',
        msg,
      }));
  });
}

export function postFile(url, body) {
  const opt = {
    method: 'POST',
    mode: 'cors',
    body,
  };
  return new Promise((resolve) => {
    fetch(url, opt).then((res) => {
      if (res.ok) {
        res.text().then((data) => {
          if (typeof data === 'string') {
            resolve(JSON.parse(data));
          } else {
            resolve(data);
          }
        });
      } else {
        resolve({
          result: false
        });
      }
    });
  });
}

export function newPost(url, params) {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    Object.keys(params).forEach((key) => {
      if (params[key]) formData.append(key, params[key]);
    });
    fetch(url, {
      method: 'POST',
      body: formData,
    }).then(response => response.json())
        .then((responseData) => {
          resolve(responseData);
        })
        .catch((err) => {
          reject(err);
        });
  });
}

export function addResponseListener(listener) {
  if (typeof listener === 'function') {
    requestListeners.push(listener);
  }
}
