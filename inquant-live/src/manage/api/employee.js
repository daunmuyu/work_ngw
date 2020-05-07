import {
  get,
  post,
} from 'request';

const liveHost = '//live.inquant.cn';
/**
 * 获取内部人员列表
 * @param {*
 * Id: agentId
 * } payload 
 */
export function getEmployeeList(payload) {
  const url = `${liveHost}/video/VideoList/ListInsideUser`;
  return get(url, payload);
}
/**
 * 根据id获取内部人员
 * @param {*
 * Id: 内部人员ID
 * } payload 
 */
export function getEmployeeDetail(payload) {
  const url = `${liveHost}/video/VideoList/FindOneInsideUser`;
  return get(url, payload);
}
/**
 * 新增内部人员
 * @param {*} payload 
 */
export function addEmployee(payload) {
  const url = `${liveHost}/video/VideoList/AddInsideUser`;
  return post(url, payload);
}
/**
 * 编辑内部人员
 * @param {*} payload 
 */
export function editEmployee(payload) {
  const url = `${liveHost}/video/VideoList/ModifyInsideUser`;
  return post(url, payload);
}
export function deleteEmployee(payload) {
  const url = `${liveHost}/video/VideoList/removeInsiderUser`;
  return post(url, payload);
}
