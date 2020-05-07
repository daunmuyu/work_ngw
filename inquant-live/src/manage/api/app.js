import {
  // get,
  post,
  encodePost,
} from 'request';
import host from 'lib/host.js';

// const liveHost = `${host}api/`; // 'https://live.fxtrade888.com/api/'; // 'https://shlive.niuguwang.com/api/';
const liveHost = 'https://live.inquant.cn';
/**
 * 用户登录接口
 */
// export const login = payload => {
//   const url = `${liveHost}LiveBaseDataApi.ashx?action=login`;
//   return post(url, payload);
// };
export function login(payload) {
  const url = `${liveHost}/manager/agent/agentlogin.ashx`;
  return encodePost(url, payload);
}

export const aa = '';
