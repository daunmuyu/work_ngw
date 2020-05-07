import axios from 'axios';
import qs from 'qs';

const luckHost = 'https://luck.niuguwang.com/risk/';
const apiHost = 'https://api.niuguwang.com/subscribe/ht365.ashx';
const userHost = 'https://user.niuguwang.com/';
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

export const COURSE_ID = '4427';

// 查询问卷列表 getquestions.ashx  questions QuestionItem 问题列表
export const getQues = (arg) => {
  return get(`${luckHost}getquestions.ashx`, { courseID: COURSE_ID, ...arg });
};

// 获取测评结果 usertoken 用户token courseID int 课程ID
export const getRiskRes = (arg) => {
  return get(`${luckHost}getriskresult.ashx`, { courseID: COURSE_ID, ...arg });
};

// 获取答案 usertoken 用户token courseID int 课程ID
export const getAnswer = (arg) => {
  return get(`${luckHost}answerget.ashx`, { courseID: COURSE_ID, ...arg });
};

// 是否进行了风评
export const isRisk = (arg) => {
  return get(`${luckHost}isRisk.ashx`, { courseID: COURSE_ID, ...arg });
};

// 是否购买365课程
export const isBuy = (arg) => {
  return get(`${luckHost}isbuy.ashx`, { courseID: COURSE_ID, ...arg });
};

// 保存答案 qID string 问题ID answers string 答案
export const addAnswer = (arg) => {
  return get(`${luckHost}answeradd.ashx`, { courseID: COURSE_ID, ...arg });
};

// 获取课程信息 参数：courseid：课程ID   servuid：投资客服ID
export const getCourse = (arg) => {
  return post(`${apiHost}?action=getcourseinfo`, { courseID: COURSE_ID, ...arg });
};

// 根据手机号和验证码获取用户usertoken，第二步调用h5微信支付，调用方式与现有课程调用一致。
export const getValid = (arg) => {
  return post(`${apiHost}?action=getvalidinfo`, { courseID: COURSE_ID, ...arg });
};

// 获取手机验证码
export const getCode = (arg) => {
  return post(`${userHost}api_wap/ngw/getVerifyCode.ashx`, { courseID: COURSE_ID, ...arg });
};

// 手机验证码登录
export const getPhone = (arg) => {
  return post(`${userHost}api_wap/ngw/mobileLogin.ashx`, { courseID: COURSE_ID, ...arg });
};

// 获取微信支付接口
export const getWXPay = (arg) => {
  return post(`${userHost}wxpay/h5pay.ashx`, { courseid: COURSE_ID, ...arg });
};

// 风险测试弹框
export function ckConfirm(arg) {
  return post(`${liveHost}checkidentityandprotocolconfirm?courseid=${COURSE_ID}`, arg);
}
