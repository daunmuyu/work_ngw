import * as types from './mutation-types.js';

const unique = (arr) => {
  const x = new Set(arr);
  return [...x];
};

const uniqueReverse = (arr) => {
  const res = arr.reverse();
  const x = new Set(res);
  const xr = x.reverse();
  return [...xr];
};

// const reduceObj = (arr) => {
//   const obj = {};
//   return arr.reduce((item, next) => {
//     // eslint-disable-next-line no-unused-expressions
//     obj[next.time] ? '' : obj[next.time] = true && item.push(next);
//     return item;
//   }, []);
// };

export default {
  unique,
  uniqueReverse,
  // reduceObj,
  // 用户信息
  [types.LOGIN_ERR_MSG](s, err) {
    s.loginErrMsg = err;
  },
  // 用户信息
  [types.USER_INFO](s, info) {
    s.userInfo = info;
  },
  // 聊天室信息
  [types.CHATROOM_INFO](s, info) {
    s.chatroomInfo = Object.assign({}, s.chatroomInfo, info);
  },
  // 历史消息
  [types.HISTORY_MSG](s, msgs) {
    s.chatMsgs = Object.assign(msgs, s.chatMsg);
  },
  // 新消息
  [types.CHAT_MSG](s, msg) {
    console.log(s.chatMsgs, msg, 'vuex');
    const serArr = s.chatMsgs.map((v) => { return v.idServer; });
    const index = serArr.indexOf(msg.idServer);
    console.log(index);
    if (index === -1) {
      s.chatMsgs.push(msg);
    } else {
      s.chatMsgs.splice(index + 1, 1);
    }
  },
  // 会话列表
  [types.CHAT_LIST](s, opt) {
    s.chatList = opt;
  },
  // 会话id
  [types.SESSION_ID](s, id) {
    s.sessionID = id;
  },
  // 用户id
  [types.USERID](s, info) {
    s.userId = info;
  },
  // 群id
  [types.GROUPID](s, info) {
    s.groupId = info;
  },
  // 当前选择表情
  [types.CURR_EMOJI](s, info) {
    s.currEmoji = info;
  },
  // 当前选择表情
  [types.EMOJI_SHOW](s, ble) {
    s.emojiShow = ble;
  },
  // 客户显示隐藏
  [types.KEHU_SHOW](s, ble) {
    s.kehuShow = ble;
  },
  // 客户显示隐藏
  [types.SET_SHOW](s, ble) {
    s.setShow = ble;
  },
  // 客户显示隐藏
  [types.TEL_SHOW](s, ble) {
    s.telShow = ble;
  },
  // 客户显示隐藏
  [types.GROUP_SHOW](s, ble) {
    s.groupShow = ble;
  },
  // 客户显示隐藏
  [types.INTER_SHOW](s, ble) {
    s.interShow = ble;
  },
  // 客户显示隐藏
  [types.UPDATE_SESSION](s, msg) {
    s.updateSession = (msg);
  },
  // 拨打电话
  [types.SIP_TEL](s, obj) {
    s.sipTel = obj;
  },
  // 群成员管理
  [types.SHOW_TEAM_TRANSFER](s, obj) {
    s.showTeamTransfer = obj;
  },
  // 在线成员
  [types.MSG_EVENTS](s, arr) {
    s.msgEvents = arr;
  },
  // 消息已读回调
  [types.MSG_RECEIPT](s, obj) {
    s.msgReceipt = obj;
  },
  // 消息列表数据
  [types.MSG_LIST](s, obj) {
    s.msgList = obj;
  },
  // 群成员列表数据
  [types.GROUP_LIST](s, obj) {
    s.groupList = obj;
  },
  // 历史列表数据
  [types.HIST_ID_SER](s, obj) {
    s.histIdSer = obj;
  },
  // 未读消息总数
  [types.MSG_COUNT](s, num) {
    s.msgCount = num;
  },
  // 禁言用户信息
  [types.FORBIDDEN_WORDS](s, user) {
    s.forbiddenWords = user;
  },
  // 资讯显示隐藏
  [types.ZXUN_SHOW](s, ble) {
    s.zxunShow = ble;
  },
  // 资讯显示隐藏
  [types.HIST_SHOW](s, obj) {
    s.histShow = obj;
  },
  // 资讯显示隐藏
  [types.NIM_SDK](s, obj) {
    s.nimSDK = obj;
  },
  // 资讯显示隐藏
  [types.AT_USERTS](s, arr) {
    s.atUsers = arr;
  },
  // 转发通讯录
  [types.MAIL_LIST](s, arr) {
    s.mailList = arr;
  },
};
