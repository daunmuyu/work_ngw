// import { getCSToken } from '../store/authToken';
import {
  get,
  post,
} from './request';

const IMHost = 'https://imapi.stockhn.com/';

const usertoken = '**';

// 登录接口 username=小晨007&password=xiaochen007
export const IMlogin = (arg) => {
  return get(`${IMHost}api/Login.ashx`, arg);
};

// 获取云信云信token
export const IMUToken = (arg) => {
  return get(`${IMHost}appapi/gettoken.ashx`, arg);
};

// 获取个人信息头像
export const IMInfo = (arg) => {
  return get(`${IMHost}api/UserInfoManager.ashx?action=info`, { usertoken, ...arg });
};

// 登录状态  loginState 0-离线;1-在线;2-离开
export const IMUserState = (arg) => {
  return post(`${IMHost}api/UserInfoManager.ashx?action=state`, { usertoken, ...arg });
};

// 设置自动回复消息内容 msgContent - 自动回复消息内容
export const IMUserAutoMsg = (arg) => {
  return post(`${IMHost}api/UserInfoManager.ashx?action=msg`, { usertoken, ...arg });
};

// 查询客户信息接口  userID 要查询的用户ID
export const IMUserInfo = (arg) => {
  return post(`${IMHost}api/UserInfoManager.ashx?action=customer`, { usertoken, ...arg });
};

// 聊天列表页面接口 pageIndex=1&pageSize=10
export const IMMsgList = (arg) => {
  return post(`${IMHost}api/MessageFind.ashx`, { usertoken, ...arg });
};

// 聊天_更新未读消息数为0  msgtype=1&relationID=6035582
export const IMMsRead = (arg) => {
  return post(`${IMHost}api/MessageUpdateUnRead.ashx`, { usertoken, ...arg });
};

// .建群 teamName 群名称  userIDs 群成员 string 多个userID之间用(,)分隔，可为空
export const IMTmCt = (arg) => {
  return post(`${IMHost}api/CreateTeam.ashx`, { usertoken, ...arg });
};

// 添加群成员 teamID 群ID   userIDs 群成员
export const IMAddTm = (arg) => {
  return post(`${IMHost}api/AddMembers.ashx`, { usertoken, ...arg });
};

// 提拔管理员 teamID 群ID   userID 群成员    mute：0-提拔管理员;1-取消管理员
export const IMAddMage = (arg) => {
  return post(`${IMHost}api/AddManager.ashx`, { usertoken, ...arg });
};

// .踢人出群 teamID 群ID   userID 群成员
export const IMTMKict = (arg) => {
  return post(`${IMHost}api/TeamKick.ashx`, { usertoken, ...arg });
};

// .解散群 teamID 群ID
export const IMTMRemove = (arg) => {
  return post(`${IMHost}api/TeamRemove.ashx`, { usertoken, ...arg });
};

// 获取群成员列表 teamID 群ID
export const IMTMUserList = (arg) => {
  return post(`${IMHost}api/TeamUserList.ashx`, { usertoken, ...arg });
};

// 获取群成员列表
export const IMTMList = (arg) => {
  return post(`${IMHost}api/TeamListGetByWorkerID.ashx`, { usertoken, ...arg });
};

// 添加分组 name: 组名
export const IMGroupAdd = (arg) => {
  return post(`${IMHost}api/GroupManager.ashx?action=add`, { usertoken, ...arg });
};

// 删除分组 groupID: 组id
export const IMGroupDel = (arg) => {
  return post(`${IMHost}api/GroupManager.ashx?action=del`, { usertoken, ...arg });
};

// 调换归属分组 groupID: 组id userids 用户id，
export const IMGroupChange = (arg) => {
  return post(`${IMHost}api/GroupManager.ashx?action=change`, { usertoken, ...arg });
};

// 名下分组列表
export const IMGroupList = (arg) => {
  return post(`${IMHost}api/GroupManager.ashx?action=list`, { usertoken, ...arg });
};

// 名下分组列表 groupID: 组id
export const IMGroupUser = (arg) => {
  return post(`${IMHost}api/GroupManager.ashx?action=userlist`, { usertoken, ...arg });
};

// 修改备注 remark 备注
export const IMGroupRemark = (arg) => {
  return post(`${IMHost}api/GroupManager.ashx?action=remark`, { usertoken, ...arg });
};

// 感兴趣的用户列表
export const IMITPole = (arg) => {
  return post(`${IMHost}api/InterestedPeople.ashx`, { usertoken, ...arg });
};

// 模糊查询用户列表接口 content：查询关键字（不可为空）
export const IMSerch = (arg) => {
  return post(`${IMHost}api/SearchUserList.ashx`, { usertoken, ...arg });
};

// 发送消息 messageType：0-系统消息;1-私信;2-群聊  contentType：0-文本消息;1-图片;2-语音;3-文件content：消息内容
export const IMAddMsg = (arg) => {
  return post(`${IMHost}api/AddMessage.ashx`, { usertoken, ...arg });
};

// 发送消息 messageType：0-系统消息;1-私信;2-群聊  contentType：0-文本消息;1-图片;2-语音;3-文件content：消息内容
export const IMAddMsgBatch = (arg) => {
  return post(`${IMHost}api/AddMessageBatch.ashx`, { usertoken, ...arg });
};

// 更新登录状态  userID=6035582&loginState=0
export const IMLoginState = (arg) => {
  return post(`${IMHost}api/UpdateUserLoginState.ashx`, { usertoken, ...arg });
};

// 更新未读条数  msgType=1&relationID=13161448
export const IMReadCount = (arg) => {
  return post(`${IMHost}api/GetUnReadCount.ashx`, { usertoken, msgType: 1, ...arg });
};

// 更新组名称  groupID：组ID；name：组名称
export const IMUpGroupName = (arg) => {
  return post(`${IMHost}api/GroupNameUpdate.ashx`, { usertoken, ...arg });
};

// 用户置顶 action:add-添加置顶;cancel-取消置顶  relationID:要置顶的UserID/群ID  msgType:对象类型:1-人;2-群
export const IMUserTop = (arg) => {
  return post(`${IMHost}api/StickTopManager.ashx`, { usertoken, ...arg });
};

// 禁言管理  userID:目标用户ID  mute：0-解禁;1-禁言 teamID:群ID
export const IMTalkState = (arg) => {
  return post(`${IMHost}api/TeamTalkStateUpdate.ashx`, { usertoken, ...arg });
};

// 查询通话记录  userID:目标用户ID
export const IMCallRecord = (arg) => {
  return post(`${IMHost}api/CallLogGet.ashx`, { usertoken, ...arg });
};

// 消息撤回  msgID:消息ID
export const IMMSGRecall = (arg) => {
  return post(`${IMHost}api/MessageRecall.ashx`, { usertoken, ...arg });
};

// 咨询列表接口 articleType 1=>独家资讯  2=>攻略秘籍
export const IMArticle = (arg) => {
  return get('https://api.niuguwang.com/taogu/articleList', arg);
};

// 搜索 content：搜索内容 contentType：搜索类型 0-文本 目前只支持文本搜索
export const IMHostChat = (arg) => {
  return get(`${IMHost}api/SearchHistoryChats.ashx`, { usertoken, ...arg });
};

// 搜索 content：搜索内容 MsgType：RelationID的类型  1-私聊  2-群聊  默认1-私聊  Addtime：过滤比这个时间早的数据，第一页展示可不传或传当前时间，之后数据加载请传入结果数据中，最早一条消息的AddTime
// RelationID：搜索对象id  用户id/群组id PageSize：每次获取的数据大小 默认10条
export const IMHostSearch = (arg) => {
  return get(`${IMHost}api/SearchHistory.ashx`, arg);
};

// 通讯录接口 content：查询关键字
export const IMMailList = (arg) => {
  return get(`${IMHost}api/AddressList.ashx`, { usertoken, ...arg });
};

// 转发 toID 消息接受者 cID 消息ID userType: 1私信 2群发
export const IMTransmit = (arg) => {
  return get(`${IMHost}api/TransmitMsg.ashx`, { usertoken, ...arg });
};

// 获取手机号码信息
export const IMMobile = (arg) => {
  return get(`${IMHost}api/GetUserInfoByMobile.ashx`, { usertoken, ...arg });
};
