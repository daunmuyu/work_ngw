import { post } from '../utils/request.js';

const apiHost = 'https://live.niuguwang.com/chat/Chatroom/';

// 添加盘中播报接口
export function setIntraday(args) {
  return post(`${apiHost}SendIntradayBroadcast`, args);
}

// 获取盘中播报列表
export function getIntradayList(args) {
  return post(`${apiHost}GetIntradayBroadcast`, args);
}
