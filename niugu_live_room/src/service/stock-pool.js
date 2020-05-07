import {
  get,
} from '../utils/request.js';

const apiHost = 'https://api.niuguwang.com/subscribe/admin/liveauth.ashx?';

// 量化股票池
export function liveauth(args) {
  return get(`${apiHost}action=getstockstrategy`, args);
}

export const stock = 0;
