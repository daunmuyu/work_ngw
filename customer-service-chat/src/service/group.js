// 群相关的接口
// import Cookie from 'js-cookie';
import {
  post,
} from './request';

const IMHost = 'https://imapi.stockhn.com/';

function usertoken() {
  return JSON.parse(localStorage.getItem('vuejs__CS-TOKEN')).value;
}

// .建群 teamName 群名称  userIDs 群成员 string 多个userID之间用(,)分隔，可为空
export const IMTmCt = (arg) => {
  return post(`${IMHost}api/CreateTeam.ashx`, { usertoken: usertoken(), ...arg });
};

// .更新群 teamName 群名称  userIDs 群成员 string 多个userID之间用(,)分隔，可为空
export const IMTmUd = (arg) => {
  return post(`${IMHost}api/UpdateTeamUser.ashx`, { usertoken: usertoken(), ...arg });
};

// 添加群成员 teamID 群ID   userIDs 群成员
export const IMAddTm = (arg) => {
  return post(`${IMHost}api/AddMembers.ashx`, { usertoken: usertoken(), ...arg });
};

// 提拔管理员 teamID 群ID   userID 群成员
export const IMAddMage = (arg) => {
  return post(`${IMHost}api/AddManager.ashx`, { usertoken: usertoken(), ...arg });
};

// .踢人出群 teamID 群ID   userID 群成员
export const IMTMKict = (arg) => {
  return post(`${IMHost}api/TeamKick.ashx`, { usertoken: usertoken(), ...arg });
};

// .解散群 teamID 群ID
export const IMTMRemove = (arg) => {
  return post(`${IMHost}api/TeamRemove.ashx`, { usertoken: usertoken(), ...arg });
};

// 获取群成员列表 teamID 群ID
export const IMTMUserList = (arg) => {
  return post(`${IMHost}api/TeamUserList.ashx`, { usertoken: usertoken(), ...arg });
};

// 获取群列表
export const IMTMList = () => {
  return post(`${IMHost}api/TeamListGetByWorkerID.ashx`, { usertoken: usertoken() });
};

// 添加分组 name: 组名
export const IMGroupAdd = (arg) => {
  return post(`${IMHost}api/GroupManager.ashx?action=add`, { usertoken: usertoken(), ...arg });
};

// 删除分组 groupID: 组id
export const IMGroupDel = (arg) => {
  return post(`${IMHost}api/GroupManager.ashx?action=del`, { usertoken: usertoken(), ...arg });
};

// 调换归属分组 groupID: 组id userids 用户id，
export const IMGroupChange = (arg) => {
  return post(`${IMHost}api/GroupManager.ashx?action=change`, { usertoken: usertoken(), ...arg });
};

// 名下分组列表
export const IMGroupList = () => {
  return post(`${IMHost}api/GroupManager.ashx?action=list`, { usertoken: usertoken() });
};

// 名下分组列表 groupID: 组id
export const IMGroupUser = (arg) => {
  return post(`${IMHost}api/GroupManager.ashx?action=userlist`, { usertoken: usertoken(), ...arg });
};

// 分组以及所有成员
export const IMALLGroupUser = (arg) => {
  return post(`${IMHost}api/GroupListWithUser.ashx?action=userlist`, { usertoken: usertoken(), ...arg });
};

// 修改备注 remark 备注
export const IMGroupRemark = (arg) => {
  return post(`${IMHost}api/GroupManager.ashx?action=remark`, { usertoken: usertoken(), ...arg });
};
