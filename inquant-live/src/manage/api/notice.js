import {
  post,
  get,
  encodePost,
  jsonPost
} from 'request';

const liveHost = '//live.inquant.cn';
/**
 * 获取预告列表列表
 * Id: 代理Id
 */
export function getNoticeList(payload) {
  const url = `${liveHost}/video/VideoManager/GetNoticList`;
  return get(url, payload);
}
/**
 * 修改直播间预告图片
 * @param {*
 * Id: 直播间id,
 * img: 预告图片
 * } payload 
 */
export function updateNotice(payload) {
  const url = `${liveHost}/video/VideoManager/UpdateNotice`;
  return post(url, payload);
}

// 设置直播间预告信息

export function setPreviewInfo(payload) {
  const url = `${liveHost}/video/VideoManager/SetPreviewInfo`;
  return jsonPost(url, payload);
}
