/**
 * 对接网易云信
 * http://dev.netease.im/docs?doc=web&#聊天室功能概述
 */


const NEIMConfig = {
  appKey: '3b95e461fd9bbc17dc72e638d5a5fcf8',
};

/**
 * 初始化
 */
export default function getInstance({
  account = '',
  token = '',
  chatroomId = '',
  chatroomAddresses = [],
  onconnect = () => {},
  onerror = () => {},
  onwillreconnect = () => {},
  ondisconnect = () => {},
  onmsgs = () => {},
  chatroomNick = '', // 游客昵称
  isAnonymous = false,
}) {
  if (window.chatroomInstance) {
    window.chatroomInstance.disconnect();
  }
  let conf = {
    appKey: NEIMConfig.appKey,
    chatroomId,
    chatroomAddresses,
    onconnect,
    onerror,
    onwillreconnect,
    ondisconnect,
    // 消息
    onmsgs,
  }
  if (isAnonymous) {
    conf = {
      ...conf,
      isAnonymous,
      chatroomNick,
    }
  } else {
    conf = {
      ...conf,
      account,
      token,
    }
  }
  window.chatroomInstance = window.Chatroom.getInstance(conf);
}
