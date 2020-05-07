import {
  post,
  get,
  encodePost,
} from 'request';

const liveHost = '//live.inquant.cn';
const userHost = 'https://user.inquant.cn';
/**
 * 获取直播间列表
 */
export function getLiveList(payload) {
  const url = `${liveHost}/video/videolist/GetListByProxyId`;
  return get(url, payload);
}
/**
 * 获取直播间老师，助理
 * Id: 代理ID
 * roomid: 房间id
 */
export function getInsideUserProxy(payload) {
  const url = `${liveHost}/video/videolist/GetInsideUserProxy`;
  return get(url, payload);
}
/**
 * 获取直播间数据
 */
export function getLiveBaseData(payload) {
  const url = `${liveHost}/api/LiveBaseDataApi.ashx?action=GetLiveBaseData`;
  // return fetch(url).then(response => response.json());
  // payload = { ...payload, roomid };
  return get(url, payload);
}
/**
 * 编辑直播间数据
 */
export function updateLiveBaseTopBanner(payload) {
  const url = `${liveHost}/api/LiveBaseDataApi.ashx?action=UpdateLiveBaseTopBanner`;
  return post(url, payload);
}
/**
 * 保存直播间老师助理绑定关系
 * @param {*
 * userIds: 用户ID，逗号隔开
 * } payload 
 */
export function saveInsideUserProxy(payload) {
  const url = `${liveHost}/video/VideoList/SaveInsideUserProxy`;
  return post(url, payload);
}
/**
 * 初始化代理直播
 * @param {*
 * proxyId: 代理id
 * } payload 
 */
export function createChatroom(payload) {
  const url = `${liveHost}/chatroom/chartroom/CreateChatroom`;
  return post(url, payload);
}
/**
 * 添加编辑策略
 * @param {*
 * userToken: 用户令牌
 * roomID: 直播间编号
 * strategyName: 策略名称
 * desc: 策略描述
 * strategyImg: 策略图片（Base64编码格式）。如果图片未修改，则传原图的Url地址
 * } payload 
 */
export function addstrategy(payload) {
  const url = `${liveHost}/manager/liveStrategy/addstrategy.ashx`;
  return encodePost(url, payload);
}

export function qrystrategy(payload) {
  const url = `${liveHost}/manager/liveStrategy/qrystrategy.ashx`;
  return encodePost(url, payload);
}
