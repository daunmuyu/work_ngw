import { get, post} from '../utils/request.js';

const apiHost = 'https://live.niuguwang.com/chat/Chatroom/';

// 获取列表
export function getWelcomeList(args) {
  return get(`${apiHost}WelcomeList`, args);
}

// 设置用户语
export function setWelcome(args) {
  return post(`${apiHost}setWelcome`, args);
}
