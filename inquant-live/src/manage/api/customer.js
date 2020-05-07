import {
  encodePost,
} from 'request';
import { encode } from 'punycode';

const userHost = 'https://user.inquant.cn';
const liveHost = 'https://live.inquant.cn';
const tradeHost = 'https://trade.inquant.cn/';
const test = 'https://futuretest.inquant.cn/indicator/';
// const online = 'https://user.inquant.cn';
/**
 * 获取观众列表
 * @param {*
 * userToken: 用户令牌
 * fundAccount: 资金账号
 * realName: 真实姓名
 * liveRoomID: 直播间编号
 * status: 1：正常 0：冻结
 * beginLoginTime: 开始登陆时间 格式：yyyyMMdd
 * endLoginTime: 结束登陆时间 格式：yyyyMMdd
 * beginCreateTime: 开始创建时间 格式：yyyyMMdd
 * endCreateTime: 结束创建时间 格式：yyyyMMdd
 * page: 页码（从1开始）
 * pageSize: 页大小
 * } payload 
 */
export function getCustomerList(payload) {
  const url = `${liveHost}/manager/agent/searchagentviewer.ashx`;
  return encodePost(url, payload);
}
/**
 * 根据id获取观众详情
 * @param {*
 * userToken: 用户令牌
 * agentUserID: 代理用户编号
 * } payload 
 */
export function getCustomerDetail(payload) {
  const url = `${liveHost}/manager/agent/qryagentviewerinfo.ashx`;
  return encodePost(url, payload);
}
/**
 * 新增观众
 * @param {*
 * userToken: 用户令牌
 * fundAccount: 资金账号
 * realName: 真实姓名
 * status: 1:正常 0：冻结
 * roomIds: 房间ID列表，多个已逗号分隔 
 * } payload 
 */
export function addCustomer(payload) {
  const url = `${liveHost}/manager/agent/addagentviewer.ashx`;
  return encodePost(url, payload);
}
/**
 * 编辑观众
 * @param {*
 * userToken: 用户令牌
 * fundAccount: 资金账号
 * agentUserID: 代理用户编号
 * realName: 真实姓名
 * status: 1:正常 0：冻结
 * roomIds: 房间ID列表，多个已逗号分隔  房间列表找红卫要
 * } payload 
 */
export function editCustomer(payload) {
  const url = `${liveHost}/manager/agent/setagentviewer.ashx`;
  return encodePost(url, payload);
}
/**
 * 删除代理观众
 * @param {*
 * userToken: 用户令牌
 * agentUserID: 代理观众编号
 * } payload 
 */
export function deleteCustomer(payload) {
  const url = `${liveHost}/manager/agent/delagentviewer.ashx`;
  return encodePost(url, payload);
}
/**
 * 获取策略列表
 */
export function qrysubstrategylist() {
  const url = `${liveHost}/manager/liveStrategy/qrysubstrategylist.ashx`;
  return encodePost(url, {});
}
/**
 * 获取期货公司列表
 * @param {*
 *  userToken: 用户令牌
 * } payload
 */
export function qrybrokerinfo(payload) {
  const url = `${tradeHost}/tradefut/qrybrokerinfo.ashx`;
  return encodePost(url, payload);
}


// 获取技术指标列表
export function getindicatorstatus(payload) {
  const url = `${userHost}/indicator/getindicatorstatus.ashx`;
  return encodePost(url, payload);
}

// 设置技术指标列表

export function setindicatorstatus(payload) {
  const url = `${userHost}/indicator/setindicatorstatus.ashx`;
  return encodePost(url, payload);
}
