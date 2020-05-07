import {
  get,
  post,
} from '../request';

const IMHost = 'https://imapi.stockhn.com/';

// 登录接口 username=小晨007&password=xiaochen007
export const IMlogin = (arg) => {
  return post(`${IMHost}api/Login.ashx`, arg);
};

// 获取云信云信token
export const IMUToken = (arg) => {
  return get(`${IMHost}appapi/gettoken.ashx`, arg);
};
