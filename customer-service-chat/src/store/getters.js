export default {
  userId(state) {
    return state.userId;
  },
  userInfo(state) {
    return state.userInfo;
  },
  groupId(state) {
    return state.groupId;
  },
  // 聊天表情
  emojiShow(state) {
    return state.emojiShow;
  },
  // 当前选择表情
  currEmoji(state) {
    return state.currEmoji;
  },
  // 聊天信息
  chatMsgs(state) {
    return state.chatMsgs;
  },
  // 聊天列表
  chatLsit(state) {
    return state.chatLsit;
  },
  // 聊天id
  sessionID(state) {
    return state.sessionID;
  },
  // 客户显示
  kehuShow(state) {
    return state.kehuShow;
  },
  // 客户显示
  setShow(state) {
    return state.setShow;
  },
  // 客户显示
  telShow(state) {
    return state.telShow;
  },
  // 客户显示
  groupShow(state) {
    return state.groupShow;
  },
  // 客户显示
  interShow(state) {
    return state.interShow;
  },
  // 客户显示
  updateSession(state) {
    return state.updateSession;
  },
  // 拨打电话
  sipTel(state) {
    return state.sipTel;
  },
  // 群成员管理
  showTeamTransfer(state) {
    return state.showTeamTransfer;
  },
  // 在线成员
  msgEvents(state) {
    return state.msgEvents;
  },
  // 在线成员
  msgReceipt(state) {
    return state.msgReceipt;
  },
  // 消息列表数据
  msgList(state) {
    return state.msgList;
  },
  // 消息列表数据
  groupList(state) {
    return state.groupList;
  },
  // 历史列表数据
  histIdSer(state) {
    return state.histIdSer;
  },
  // 未读消息总数
  msgCount(state) {
    return state.msgCount;
  },
  // 未读消息总数
  forbiddenWords(state) {
    return state.forbiddenWords;
  },
  // 资讯显示
  zxunShow(state) {
    return state.zxunShow;
  },
  // 历史记录显示
  histShow(state) {
    return state.histShow;
  },
  // 历史记录显示
  nimSDK(state) {
    return state.nimSDK;
  },
  // 历史记录显示
  atUsers(state) {
    return state.atUsers;
  },
  // 历史记录显示
  mailList(state) {
    return state.mailList;
  },
};
