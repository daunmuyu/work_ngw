/**
 * 数据接口
 */
import {
  get,
  post,
  encodePost
} from 'request';
import liveHost from 'lib/host.js';
// import request from './request/index.js';
// import Cookie from 'js-cookie';
// import { search } from '../api/interaction.js';
const shliveHost = `${liveHost}api/BeforeApi.ashx`; // 'https://live.fxtrade888.com/api/BeforeApi.ashx';
const livepcHost = liveHost; // 'https://live.fxtrade888.com';
// const roomid = Cookie.getJSON('roomId') || 1;

// const shliveHost = 'https://shlive.niuguwang.com/api/BeforeApi.ashx';
// const livepcHost = 'https://livepc.niuguwang.com';
const yingKuanHost = 'https://user.inquant.cn/userfut/client';
const userHost = 'https://user.inquant.cn/'

// const get = (url, arg) => {
//   return new Promise((resolve, reject) => {
//     Vue.http
//       .get(url, {
//         params: arg
//       })
//       .then(res => {
//         resolve(res.data);
//       }, reject);
//   });
// };

// const post = (url, arg) => {
//   return new Promise((resolve, reject) => {
//     Vue.http
//       .post(url, arg, {
//         emulateJSON: true
//       })
//       .then(res => {
//         resolve(res.data);
//       }, reject);
//   });
// };


/**
 * 匿名用户注册(独立直播)
 */
export function register(arg) {
  return get(`${livepcHost}/user/api/userAnonymous/register`, arg);
}

// 根据token获取游客信息

export function getYkInfo(arg) {
  return get(`${livepcHost}/user/api/userAnonymous/getUserInfo`, arg);
}

// 获得直播间名字
export function roomName(arg) {
  return get('https://live.inquant.cn/video/videolist/RoomDetails', arg);
}

/**
 * 用户注册(独立直播)
 */
export function userregister(arg) {
  return get(`${livepcHost}/user/api/user/register`, arg);
}
/**
 * 用户登录(独立直播)
 */
export function login(arg) {
  return encodePost(`${yingKuanHost}/login.ashx`, arg);
}
/**
 * 获取登录用户信息token
 */
export function getUserInfo(arg) {
  return get(`${livepcHost}/chatroom/chartroom/getuserinfo`, arg);
}
/**
 * 获取验证码
 */
export function getVCode(arg) {
  return get(`${livepcHost}/user/api/sms/getverifycode`, arg);
}
/**
 * 重置密码找回密码(独立直播)
 */
export function restpwd(arg) {
  return get(`${livepcHost}/user/api/user/resetPassword`, arg);
}
/**
 * 获取聊天室地址
 */
export function RequestAddr(arg) {
  return post(`${livepcHost}/chatroom/chartroom/RequestAddr`, {
    ...arg,
    // roomid
  });
}
export function GetLiveMainData(arg) {
  return get(`${shliveHost}`, {
    ...arg,
    // roomid
  });
}
export function GetLiveVideoType(arg) {
  return post(`${shliveHost}`, {
    ...arg,
    // roomid
  });
}
/**
 * 获取精品视频下某一tabs下的列表数据
 */
export function GetLiveVideo(arg) {
  return post(`${shliveHost}`, {
    ...arg,
    // roomid
  });
}
/**
 * 获取vip老师列表
 * 添加video老师介绍视频
 */
export function GetLiveTeacherList(arg) {
  let data = {
    action: 'GetLiveTeacherList',
  };
  if (typeof arg === 'object') {
    data = {
      ...arg,
      ...data,
    };
  }
  return post(`${shliveHost}`, data);
}
/**
 * 获取直播日数据列表
 */
export function GetLiveNoticeDay(arg) {
  return post(`${shliveHost}`, {
    ...arg,
    // roomid
  });
}
/**
 * 发送消息
 */
export function sendMsg(arg) {
  return post(`${livepcHost}/chatroom/chartroom/sendmsg`, {
    ...arg,
    // roomid,
    // livetoken: search('livetoken')
  });
}

/**
 * 审核通过
 */
export function audit(arg) {
  console.log(88778, arg);
  return post(`${livepcHost}/chatroom/chartroom/Audit`, {
    ...arg,
    // roomid
  });
}

/**
 * 将用户禁言
 */
export function del(arg) {
  return post(`${livepcHost}/chatroom/chartroom/del`, {
    ...arg,
    // roomid
  });
}

/**
 * 添加用户到黑名单
 */
export function blockUser(arg) {
  return post(`${livepcHost}/chatroom/chartroom/BlockUser`, {
    ...arg,
    // roomid
  });
}

/**
 * 移除黑名单
 */
export function removeBlockUser(arg) {
  return post(`${livepcHost}/chatroom/chartroom/RemoveBlockUser`, {
    ...arg,
    // livetoken: search('livetoken'),
    // roomid
  });
}

/**
 * 取当前房间所有黑名单用户
 */
export function getRoomBlockUser(arg) {
  return post(`${livepcHost}/chatroom/chartroom/GetRoomBlockUser`, {
    ...arg,
    // roomid
  });
}

/**
 * 获取历史消息
 */
export function getChatHistoryMsg(arg) {
  return post(`${livepcHost}/chatroom/chartroom/detail`, {
    ...arg,
    // roomid,
    // livetoken: search('livetoken')
  });
}

/**
 * 获取视频直播链接
 */
export function getPlayLive(arg) {
  return get(`${livepcHost}/video/VideoList/PlayLive`, {
    ...arg,
    // roomid,
    // livetoken: search('livetoken')
  });
}

export function GetLiveNoticePic(arg) {
  return get(`${shliveHost}`, {
    ...arg,
    // roomid
  });
}

export function getRobot(arg) {
  return get(`${livepcHost}/chatroom/chartroom/RobotList`, arg);
}
export function addRobot(arg) {
  return post(`${livepcHost}/chatroom/chartroom/addrobot`, arg);
}
export function delRobot(arg) {
  return post(`${livepcHost}/chatroom/chartroom/DelRobot`, arg);
}
/* 
 * @param {livetoken:string} arg 
 * @returns 
 */
export function getRooms(arg) {
  return get(`${livepcHost}/chatroom/chartroom/GetRoomsList`, arg);
}
/* 
 * 获取黑名单列表
 * @param {livetoken:string} arg 
 * @returns 
 */
export function getBlackList(arg) {
  return get(`${livepcHost}/chatroom/chartroom/GetRoomBlockUser`, {
    ...arg,
    // roomid
  });
}
/* 
 * 获取禁言列表
 * @param {livetoken:string} arg 
 * @returns 
 */
export function MuteUserList(arg) {
  return get(`${livepcHost}/chatroom/chartroom/MuteUserList`, {
    ...arg,
    // roomid
  });
}
/**
 * 删除禁言
 * 
 * @param {roomId:int,targetId:int} arg 
 * @returns 
 */
export function RemoveMuteUser(arg) {
  return post(`${livepcHost}/chatroom/chartroom/RemoveMuteUser`, {
    ...arg,
    // roomid
  });
}

/**
 * 直播间列表
 * 
 * @param {any} arg
 * @returns 
 */
export function getLiveList(arg) {
  return get(`${livepcHost}video/VideoList/LiveList`, arg);
}
/**
 * 老师、助理登录
 * @param {*
 * loginType: '1'
 * identify: 手机号,
 * verifyInfo: 密码
 * } arg 
 */
export function adminLogin(arg) {
  return encodePost('https://user.inquant.cn/userfut/system/adminlogin.ashx', arg);
}
/**
 * 判断是否公共token
 * @param {*
 * token
 * } arg 
 */
export function checkPulic(arg) {
  return get(`${livepcHost}/video/videolist/checkPublic`, arg);
}
/**
 * 获取老师列表
 * @param {*
 * id: 代理id,直播端传0
 * roomId: 房间id
 * } arg 
 */
export function getTeacherList(arg) {
  return get(`${liveHost}/video/VideoList/GetListTeacherList`, arg);
}

/**
 * 获取直播间列表
 * Id: 直播间Id
 */
export function getVideoList(payload) {
  const url = `${liveHost}/video/VideoManager/List`;
  return get(url, payload);
}

/**
 * 获取精彩视频列表
 * roomId: 直播间id
 */
export function getGreatVideo(payload) {
  const url = `${liveHost}/video/videolist/RecommendedVideo`;
  return get(url, payload);
}

/**
 * 获取直播间预告图片
 * id: 直播间id
 */
export function getNotice(payload) {
  const url = `${liveHost}/video/VideoManager/RoomGetNotic`;
  return get(url, payload);
}
/**
 * 统计用户信息
 * @param {*
 * sid: 用户id
 * } payload 
 */
export function statistics(payload) {
  // debugger;
  console.log('888')
  const url = 'https://api.niuguwang.com/subscribe/Statistics20180108.ashx?action=qflivestatics';
  return get(url, payload);
}
/**
 * 获取直播间在线人数
 * @param {*
 * roomid: 聊天室id
 * }
 */
export function onlineCount(payload) {
  // debugger;
  console.log('888')
  const url = 'https://live.inquant.cn/chatroom/chartRoom/OnlineCount';
  return get(url, payload);
}


/**
 * 获取直播间直播人员
 */
export function getactiveMan(arg) {
  return get(`${liveHost}/chatroom/roominfo/getactiveMan`, arg);
}

/**
 * 获取直播间信息
 */
export function getRoomInfo(arg) {
  return get(`${liveHost}/chatroom/roominfo/getroominfo`, arg);
}

/**
 *  获取策略列表
 *  liveToken string直播室令牌
 *  roomID string直播室编号
 *  userToken string 用户令牌
 */
export function strategySignalList(arg) {
  return encodePost(`${userHost}strategy/livetrade/qrystrategylist.ashx`, arg)
}

/**
 * 获取策略信号
 */
export function strategySignal(arg) {
  return encodePost(`${userHost}strategy/livetrade/qrystrategysignal.ashx`, arg)
}

/**
 * 获得学习日志列表
 */
export function learnlist(arg) {
  return get('https://live.inquant.cn/chatroom/LearningLog/list', arg)
}

/**
 * 获得直播权限
 */
export function liveList(arg) {
  return get('https: //live.inquant.cn/video/VideoList/LiveList', arg)
}

/**
 * 监听用户观看时长
 */
export function Heartbeat(arg) {
  return get('https://live.inquant.cn/chatroom/LiveData/Heartbeat', arg);
}
