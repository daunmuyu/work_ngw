// 角色相关接口
import { get, newPost } from '../utils/request.js';

// const liveHost = 'https://live.niuguwang.com';
const roleHost =
  'https://api.niuguwang.com/subscribe/admin/liveauth.ashx?action=';

// 当前房间所有角色成员
export function allRoleMembers(args) {
  return get(`${roleHost}getrolelist`, args);
}

// 获取当前房间可用角色
export function myRoles(args) {
  return get(`${roleHost}getrobotlist`, args);
}

// 添加角色成员
export function addRoleMember(args) {
  return newPost(`${roleHost}userroleadd`, args);
}

// 移除角色成员
export function removeRoleMember(args) {
  return get(`${roleHost}userroledel`, args);
}

// 检查是否是直播
export function verifyRole(args) {
  return get(`${roleHost}isliveteacher`, args);
}

// 用户模糊搜索
export function searchUser(args) {
  return get(`${roleHost}searchuser`, args);
}
