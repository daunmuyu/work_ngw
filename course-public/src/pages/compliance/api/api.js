import axios from 'axios';
import qs from 'qs';

const liveHost = 'https://live.niuguwang.com/chat/';

// get请求
export const get = (url, payload) => {
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
  return axios.get(req).then((res) => {
    return res.data;
  });
};

// post请求
export const post = (url, payload) => {
  const opts = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };
  return axios.post(url, qs.stringify(payload), opts).then(res => res.data);
};

// 添加用户信息认证
// wiki => http://wiki.niuguwang.com:8090/pages/viewpage.action?pageId=10355664
export const addUserInfo = (arg) => {
  return post(`${liveHost}course/adduseridentity`, arg);
};

// 检查身份认证、风险评测和协议签署确认
// wiki => http://wiki.niuguwang.com:8090/pages/viewpage.action?pageId=10355707
export const checkConfirm = (arg) => {
  return post(`${liveHost}course/checkidentityandprotocolconfirm`, arg);
};

// 添加用户风险评测记录
// wiki => http://wiki.niuguwang.com:8090/pages/viewpage.action?pageId=10355667
export const addUserRisk = (arg) => {
  return post(`${liveHost}course/adduserriskprofile`, arg);
};

// 添加用户风险评测记录
// wiki => http://wiki.niuguwang.com:8090/pages/viewpage.action?pageId=10355718
export const riskProtocol = (arg) => {
  return post(`${liveHost}course/confirmriskprotocol`, arg);
};

// 协议判断
export const denver = (arg) => {
  return post('https://api.niuguwang.com/subscribe/Denver.ashx?action=isbuy', arg);
};

