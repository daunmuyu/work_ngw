import axios from 'axios';
import qs from 'qs';

const apiHost = 'https://api.niuguwang.com/subscribe/otherset.ashx';
const liveHost = 'https://live.niuguwang.com/chat/course/';

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

export const getQuestions = (arg) => {
  return get(`${apiHost}?action=getriskquestion`, arg);
};

export const getResult = (arg) => {
  return get(`${apiHost}?action=risktest`, arg);
};

export const addRisk = (arg) => {
  return post(`${liveHost}adduserriskprofile`, arg);
};

export const riskResult = (arg) => {
  return post(`${liveHost}RiskTestResult`, arg);
};
