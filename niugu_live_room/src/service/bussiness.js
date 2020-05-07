import {
  // get,
  post,
} from '../utils/request.js';

const liveHost = 'https://live.niuguwang.com';

// 保存封面消息
export function saveSelectedMsg(args) {
  return post(`${liveHost}/chat/ChatroomH5/ReceiveMessage`, args);
}

export const a = 123;
