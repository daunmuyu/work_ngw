 let ready = false;
 let _bridge;
 let readyCallbacks = [];

 function initCallback(b) {
   ready = true;
   _bridge = b;
   if (_bridge && _bridge.init) {
     _bridge.init(function (message, responseCallback) {
       alet(6666);
     });
   }

   readyCallbacks.forEach(function (callback) {
     callback();
   });
 };

 function init() {
   return new Promise((resolve, reject) => {
    if (window.WebViewJavascriptBridge) {
      initCallback(window.WebViewJavascriptBridge);
      resolve();
    } else {
      document.addEventListener('WebViewJavascriptBridgeReady', function () {
        initCallback(window.WebViewJavascriptBridge);
        resolve();
      }, false);
    }
   });
 }
 /**
  * 调用app函数
  * @param { 函数名 } key 
  * @param { ios参数 } ios_params
  * @param { 安卓参数 } android_params
  */
 async function call(key, params, ios_params, android_params) {
   if (!ready) {
     await init();
   }
  //  const getUserToken = android['getUserToken'];
  //  func(android['getUserToken']());
   return new Promise((resolve, reject) => {
     if (typeof android != 'undefined') {
       if (android[key]) {
         resolve(android[key](android_params || params));
       } else {
         reject({
           code: -1,
           message: `不存在${key}函数`,
         });
       }
     } else if (_bridge && _bridge.send) {
       var msg = JSON.stringify({
         method: key,
         methodtype: key,
         ...(ios_params || params),
       });
       _bridge.send(msg, function (responseData) {
         const res = JSON.parse(responseData);
         resolve(res);
       });
     } else {
       reject({
         code: -2,
         message: '找不到bridge对象或bridge对象的send函数',
       });
     }
   });
 }

 export async function Bridge() {
   await init();
   this.call = call;
 }

 Bridge.call = call;
 Bridge.init = init;

 module.exports = {
  Bridge,
 }
