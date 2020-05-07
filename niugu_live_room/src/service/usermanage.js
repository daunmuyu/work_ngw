import { post} from '../utils/request.js';

const apiHost = 'https://live.niuguwang.com/chat/ChatroomH5/';

// 付费用户
export function getBuy(args) {
  return post(`${apiHost}GetBuyCourse`, args);
}

// 到期用户
export function getSoon(args) {
  return post(`${apiHost}GetSoonUser`, args);
}

// 新增用户
export function getNew(args) {
  return post(`${apiHost}GetTodayNewUser`, args);
}
