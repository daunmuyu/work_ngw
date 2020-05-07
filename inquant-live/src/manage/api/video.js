import {
  post,
  get,
  encodePost,
} from 'request';

const liveHost = '//live.inquant.cn';
/**
 * 获取直播间列表
 * Id: 直播间Id
 */
export function getVideoList(payload) {
  // const url = `${liveHost}/video/VideoManager/List`; // 未添加分页的接口
  const url = `${liveHost}/video/VideoManager/listpage`; // 新添加分页接口
  return get(url, payload);
}
/**
 * 添加精彩视频
 * roomId: 直播间ID
 * liveTitle:标题
 * description:简介
 * cover:封面 base64
 * videoUrl：视频地址
 * bright: 是否精彩视频１是，０否
 */
export function addVideo(payload) {
  const url = `${liveHost}/video/VideoManager/Add`;
  return post(url, payload);
}
/**
 * 编辑精彩视频
 * roomId: 直播间ID
 * liveTitle:标题
 * description:简介
 * cover:封面 base64
 * videoUrl：视频地址
 * bright: 是否精彩视频１是，０否
 */
export function modifyVideo(payload) {
  const url = `${liveHost}/video/VideoManager/Modify`;
  return post(url, payload);
}
/**
 * 根据ID获取精彩视频
 * @param {*
 * id: 视频ID
 * } payload 
 */
export function getVideoById(payload) {
  const url = `${liveHost}/video/VideoManager/FindOne`;
  return get(url, payload);
}
/**
 * 设置视频
 * @param {*
 * id:视频id,
 * t: 1-精彩视频 2-置顶,3-删除
 * } payload 
 */
export function settingVideo(payload) {
  const url = `${liveHost}/video/VideoManager/Setting`;
  return get(url, payload);
}
/**
 * 获取视频文件列表
 */
export function sourceVideoList(payload) {
  const url = `${liveHost}/video/VideoManager/getfilelist`;
  // const res = get('https://playback.inquant.cn/cgi/inquant.sh');
  // console.log(1111, res);
  return get(url, payload);
}
