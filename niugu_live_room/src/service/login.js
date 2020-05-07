import {
  get,
  post,
} from '../utils/request.js';

import * as API from '../utils/API.js';

const apiHost = 'https://user.niuguwang.com';

// 登陆
export function login(args) {
  return post(`${apiHost}/api_web/login.ashx`, args);
}

export function resetPwd(args) {
  return get(API.test, args);
}
