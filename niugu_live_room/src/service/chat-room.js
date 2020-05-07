// 聊天室相关接口

import {
  get,
  post,
  postFile,
} from '../utils/request.js';

// const apiHost = 'https://user.niuguwang.com';
const liveHost = 'https://live.niuguwang.com';

// 我的直播间列表
export function myRoomList(args) {
  return post(`${liveHost}/graphic/api_web/GraphicLiveMain/GetAnchorLiveListNew`, args);
}

// 修改直播间名称、主题
export function updateLiveName(args) {
  return get(`${liveHost}/chat/ChatLive/UpdateLiveName`, args);
}

// 获取云信聊天室服务器地址
export function chatRoomAddress(args) {
  return post(`${liveHost}/chat/chatroom/RequestAddr`, args);
}

// 获取聊天记录
export function chatHistory(args) {
  return post(`${liveHost}/chat/chatroom/detail?roomId=${args.roomId}&direction=-1&order=1`, args);
}

// 获取只有主播的聊天记录
export function anchorChatHistory(args) {
  return post(`${liveHost}/chat/chatroom/mastersay?roomId=${args.roomId}&id=${args.id}&direction=-1&order=1`, args);
}

// 发送消息
export function sendMsg(args) {
  return post(`${liveHost}/chat/chatroom/SendMsg`, args);
}
// 发送消息
export function sendFileMsg(args) {
  return postFile(`${liveHost}/chat/chatroom/SendMsg`, args);
}

// 获取直播间状态
export function playLive(args) {
  return post(`${liveHost}/video/Live/PlayLive`, args);
}

// 获取用户用于进入直播间的token
export function userLiveToken(args) {
  return post(`${liveHost}/chat/user/login`, args);
}

// 开启或关闭直播
export function startOrStopLive(args) {
  return post(`${liveHost}/graphic/api_web/GraphicLiveMain/LiveSwitch`, args);
}

// 更新公告
export function saveNotice(args) {
  return post(`${liveHost}/chat/chatroom/UpdateNotice`, args);
}

// 更新欢迎语
export function saveWelcomeTip(args) {
  return post(`${liveHost}/chat/chatroom/Updatewelcome`, args);
}

// 获取量化推荐股票
export function recommendStocks(args) {
  return get(`${liveHost}/graphic/api_web/GraphicLiveDetail/getreclist`, args);
}

// 禁言，解禁用户发言
export function forbidUser(args) {
  return post(`${liveHost}/chat/User/GetGagUserID`, args);
}

// 获取禁言列表
export function selectForbidList(args) {
  return post(`${liveHost}/chat/User/GetGagListByLiveID`, args);
}

// 控制全局禁言
export function forbidAllUser(args) {
  return post(`${liveHost}/chat/Chatroom/MuteRoom`, args);
}

// 更新视频直播状态
export function updateVideoStatus(args) {
  return post(`${liveHost}/video/user/PCResetLiveState`, args);
}

// 设置房间密码
export function setPassword(args) {
  return post(`${liveHost}/chat/ChatroomH5/HaiNengSetPassword`, args);
}

// 设置房间密码状态
export function setPasswordStatus(args) {
  return post(`${liveHost}/chat/ChatroomH5/HaiNengSetStatus`, args);
}

// 获取直播间预告列表
export function getAdvanceList(args) {
  return get(`${liveHost}/chat/WinnerH5/getNoticeList`, args);
}

// 添加修改直播预告
export function setAdvance(args) {
  return post(`${liveHost}/chat/WinnerH5/addNoticeInfo`, args);
}

// 删除预告
export function delAdvance(args) {
  return post(`${liveHost}/chat/WinnerH5/deleteNoticeInfo`, args);
}
