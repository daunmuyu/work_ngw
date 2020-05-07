import axios from 'axios';
import qs from 'qs';

const fetch = (options) => {
  const { method = 'get', data, url } = options;
  data.date = new Date().getTime();
  switch (method.toLowerCase()) {
    case 'get':
      return axios.get(url, {
        params: data,
      });
    case 'post':
      return axios.post(url, qs.stringify(data));
    case 'delete':
      return axios.delete(url, {
        data,
      });
    case 'put':
      return axios.put(url, data);
    case 'patch':
      return axios.patch(url, data);
    default:
      return axios(options);
  }
};

export default function request(options) {
  return fetch(options)
    .then((response) => {
      const data = response.data;
      return Promise.resolve(data);
    })
    .catch((error) => {
      return Promise.reject({ message: '网络错误！', ...error });
    });
}

module.exports = {
  // 验证码
  getCode(arg) {
    return request({
      url: 'https://user.niuguwang.com/api_wap/ngw/getVerifyCode.ashx?packtype=1101',
      method: 'post',
      data: arg,
    });
  },
  // 手机验证码登录
  getPhone(arg) {
    return request({
      url: 'https://user.niuguwang.com/api_wap/ngw/mobileLogin.ashx?packtype=1101',
      method: 'post',
      data: arg,
    });
  },
  // 用户登录
  getUser(arg) {
    return request({
      url: 'https://user.niuguwang.com/api_wap/ngw/login.ashx?packtype=1101',
      method: 'post',
      data: arg,
    });
  },
  // 登录方式验证
  getLogin(arg) {
    return request({
      url: 'https://user.niuguwang.com/api_wap/ngw/logincheck.ashx?packtype=1101',
      method: 'post',
      data: arg,
    });
  },
  hnShare(arg) {
    return request({
      url: 'https://user.niuguwang.com/api_wap/wechathn/weixinShare.ashx?packtype=1101',
      method: 'post',
      data: arg,
    });
  },
  // 检查用户的登录状态
  loginStatus(arg) {
    return request({
      url: 'https://lh.niuguwang.com/longshort/stock/KDJblank',
      method: 'post',
      data: arg,
    });
  },
  // 1.检查用户是否是三方登录
  // 2.领取试用
  userStatus(arg) {
    return request({
      url: 'https://api.niuguwang.com/subscribe/dkbao.ashx',
      method: 'post',
      data: arg,
    });
  },
  // 权限控制
  controls(data) {
    return request({
      url: 'https://openaccount.niuguwang.com/UserRealLogApi.ashx?action=getsecuritycontrol',
      method: 'post',
      data,
    });
  },
};
