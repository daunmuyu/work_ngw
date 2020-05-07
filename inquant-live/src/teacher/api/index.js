import {
  post,
  get,
  jsonPost
} from 'request';
import liveHost from 'lib/host.js';
// const liveHost = 'https://192.168.11.129:9901/'
/**
 * 每个马甲单发言
 * livetoken: ''
 * speakConent: '用户发言json数据'
 * intervalTime: '发言间隔时间(单位：分钟)'
 * roomId： 直播室id
 */
// console.log(liveHost)
export function speak(arg) {
  return post(`${liveHost}chatroom/sockpuppet/speak`, arg);
}

/**
 * 统一发言
 */

export function unifidespeak(arg) {
  return post(`${liveHost}chatroom/sockpuppet/UnifiedSpeak`, arg);
}

/**
 * 获取折线图数据
 */
export function timeSegment(arg) {
  return get(`${liveHost}chatroom/livedata/timesegment`, arg);
}

/**
 * 直播进入人数扇形图
 */
export function enterNum(arg) {
  return get(`${liveHost}chatroom/livedata/enternum`, arg);
}

/**
 * 导出直播间人数表格
 */
export function exportData(arg) {
  return get(`${liveHost}chatroom/livedata/export`, arg);
}

/**
 * 获取直播间信息
 */
export function getRoomInfo(arg) {
  return get(`${liveHost}chatroom/roominfo/getroominfo`, arg);
}

/**
 * 设置直播间信息
 */
export function setRoomInfo(arg) {
  return post(`${liveHost}chatroom/roominfo/setroominfo`, arg);
}

/**
 * 修改盈宽财经官网直播人员
 */

export function setPersonnel(arg) {
  return post(`${liveHost}chatroom/roominfo/setpersonnel`, arg);
}

/**
 * 获取直播间直播人员
 */
export function getRoomPersonnels(arg) {
  return get(`${liveHost}chatroom/roominfo/getroompersonnels`, arg);
}

/**
 * 设置直播间在线人员
 */
export function activate(arg) {
  return post(`${liveHost}chatroom/roominfo/activate`, arg);
}

/**
 * 链接浏览记录
 */
export function browseRecords(arg) {
  return post(`${liveHost}chatroom/livdata/browseRecords`, arg);
}

/**
 * 添加销售用户链接
 * wiki:http://live.inquant.cn/chatroom/livedata/setsaleslink
 */
export function SetSalesLinkRecord(arg) {
  return post(`${liveHost}chatroom/livedata/setsaleslink`, arg);
}

/**
 * 销售链接统计报表
 * wiki: http://wiki.niuguwang.com:8090/pages/viewpage.action?pageId=8454154
 */
export function GetSalesLinkRecord(arg) {
  return get(`${liveHost}chatroom/livedata/GetSalesLinkRecord`, arg);
}

// /**
//  * 导出销售链接统计报表
//  * wiki: http://wiki.niuguwang.com:8090/pages/viewpage.action?pageId=8454154
//  */
// export function ExportSalesLinkRecord(arg) {
//   return get(`${liveHost}chatroom/livedata/ExportSalesLinkRecord`, arg);
// }

/**
 * 删除销售链接
 */
export function deleteLink(arg) {
  return post(`${liveHost}chatroom/livedata/delsaleslink`, arg);
}

/**
 * 设置直播加密信息
 * https://live.inquant.cn/chatroom/livedata/setliveEncryptInfo
 * wiki：http://121.196.212.216:8090/pages/viewpage.action?pageId=1573228
 */

export function setliveEncryptInfo(arg) {
  return jsonPost(`${liveHost}chatroom/livedata/setliveEncryptInfo`, arg);
  // return post('https://192.168.1.109:36736/chatroom/livedata/setliveEncryptInfo', arg);
}

/**
 * 获取直播间信息
 */

export function getliveEncryptInfo(arg) {
  return get(`${liveHost}chatroom/livedata/getliveEncryptInfo`, arg);
}

/**
 * 添加学习日志
 */

export function addLog(arg) {
  return post('https://live.inquant.cn/chatroom/LearningLog/AddLog', arg);
}

/**
 * 日志列表
 */

export function logList(arg) {
  return get('https://live.inquant.cn/chatroom/LearningLog/pagelist', arg);
}

/**
 * 删除日志
 */

export function deletelog(arg) {
  return post('https://live.inquant.cn/chatroom/LearningLog/del', arg);
}

// 用户直播时长列表
export function QueryOnlineInfo(arg) {
  return get('https://live.inquant.cn/chatroom/LiveData/QueryOnlineInfo', arg);
}

// 获得销售团队
export function getallsalesteam(arg) {
  return get('https://live.inquant.cn/chatroom/livedata/getallsalesteam', arg);
}


// 用户直播时长
export function setSalesTeamMap(arg) {
  return post('https://live.inquant.cn/chatroom/livedata/setSalesTeamMap', arg);
}

// 导出
export function ExportQueryOnlineInfo(arg) {
  return get('https://live.inquant.cn/chatroom/LiveData/ExportQueryOnlineInfo', arg);
}

