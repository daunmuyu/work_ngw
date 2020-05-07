// IM相关逻辑
// import NIM from 'nim';
import {
  chatRoomAddress,
  chatHistory,
  sendMsg,
  sendFileMsg,
  forbidUser,
  selectForbidList,
} from 'service/chat-room.js';
/**
userIcons
7-普通用户, 8-徒弟, 9-主播,10-管理员, 11-主持人, 12-助理
 */
import {
  openNotification,
} from 'utils/tool.js';

// const appKey = '3b95e461fd9bbc17dc72e638d5a5fcf8';

export default {
  namespace: 'im',
  state: {
    // 房间成员
    members: [],
    // 禁言列表
    forbidList: [],
    // 黑名单
    blackList: [],
    // im实例
    chatRoomInstance: {},
    // NIM聊天室地址
    chatRoomAddr: [],
    // 聊天室基本信息
    chatRoomInfo: {},
    // 初始化加载中
    initIMLoading: true,
    memberLoading: true,
    sendMessageLoading: false,
    // 聊天记录
    chatHistoryList: [],
    // 输入文本框
    inputMsgDom: null,
    // 被回复的人
    byReply: {
      userId: '',
    },
    // 只看主播标记
    onlyAnchorChat: false,
    // 当前正在上传的文件名
    currentUpladFile: '',
    // 是否有新消息
    hasNewMsg: false,
    // 聊天历史页码
    chatHistoryPageIndex: 1,
  },
  reducers: {
    ChatRoomAddr(state, {
      payload: chatRoomAddr,
    }) {
      return {
        ...state,
        chatRoomAddr,
      };
    },
    ChatRoomInstance(state, {
      payload: chatRoomInstance,
    }) {
      return {
        ...state,
        chatRoomInstance,
      };
    },
    ChatRoomInfo(state, {
      payload: chatRoomInfo,
    }) {
      const data = Object.assign({}, state.chatRoomInfo, chatRoomInfo);
      data.customJSON = JSON.parse(chatRoomInfo.custom);
      return {
        ...state,
        chatRoomInfo: data,
      };
    },
    InitIMLoading(state, {
      payload: initIMLoading,
    }) {
      return {
        ...state,
        initIMLoading,
      };
    },
    MemberLoading(state, {
      payload: memberLoading,
    }) {
      return {
        ...state,
        memberLoading,
      };
    },
    Members(state, {
      payload: members,
    }) {
      return {
        ...state,
        members,
      };
    },
    MembersJoin(state, {
      payload,
    }) {
      return {
        ...state,
        members: [...state.members, ...payload],
      };
    },
    ForbidList(state, {
      payload: forbidList,
    }) {
      return {
        ...state,
        forbidList,
      };
    },
    BlackList(state, {
      payload: blackList,
    }) {
      return {
        ...state,
        blackList,
      };
    },
    ResetChatHistory(state) {
      return {
        ...state,
        chatHistoryList: []
      };
    },
    AddChatHistory(state, {
      payload,
    }) {
      return {
        ...state,
        chatHistoryList: [...state.chatHistoryList, ...payload],
      };
    },
    MoreChatHistory(state, {
      payload,
    }) {
      return {
        ...state,
        chatHistoryList: [...payload, ...state.chatHistoryList],
      };
    },
    InputMsgDom(state, {
      payload: inputMsgDom,
    }) {
      return {
        ...state,
        inputMsgDom,
      };
    },
    SendMessageLoading(state, {
      payload: sendMessageLoading,
    }) {
      return {
        ...state,
        sendMessageLoading,
      };
    },
    ByReply(state, {
      payload: byReply,
    }) {
      return {
        ...state,
        byReply: Object.assign({}, state.byReply, byReply),
      };
    },
    DelByReply(state) {
      return {
        ...state,
        byReply: {
          userId: '',
        },
      };
    },
    OnlyAnchorChat(state, {
      payload: onlyAnchorChat,
    }) {
      return {
        ...state,
        onlyAnchorChat,
      };
    },
    CurrentUpladFile(state, {
      payload,
    }) {
      return {
        ...state,
        currentUpladFile: payload,
      };
    },
    HasNewMsg(state, {
      payload,
    }) {
      return {
        ...state,
        hasNewMsg: payload,
      };
    },
    ChatHistoryPageIndex(state, {
      payload,
    }) {
      return {
        ...state,
        chatHistoryPageIndex: payload,
      };
    },
  },
  effects: {
    // 初始化IM chatRoom
    * initIM(s, {
      put,
      call,
      select,
    }) {
      yield put({
        type: 'InitIMLoading',
        payload: true,
      });
      yield put({
        type: 'MemberLoading',
        payload: true,
      });
      const userInfo = yield select(state => state.user.userInfo);
      const {
        VideoChatRoom: roomId,
      } = yield select(state => state.chatRoom.currentRoom);

      const imAddr = yield call(chatRoomAddress, {
        roomId,
        usertoken: userInfo.userToken,
      });

      if (imAddr && imAddr.code === 0) {
        yield put({
          type: 'ChatRoomAddr',
          payload: imAddr.im_addr,
        });
      }
    },
    * setChatRoomInfo({
      payload,
    }, {
      put,
    }) {
      yield put({
        type: 'ChatRoomInfo',
        payload,
      });

      yield put({
        type: 'InitIMLoading',
        payload: false,
      });
    },
    // 聊天室成员
    * setMembers({
      payload,
    }, {
      put,
    }) {
      yield put({
        type: 'Members',
        payload,
      });
      yield put({
        type: 'MemberLoading',
        payload: false,
      });
    },
    // 聊天室消息
    * getChatHistory({
      payload,
    }, {
      put,
      select,
      call,
    }) {
      const {
        VideoChatRoom: roomId,
        userid,
      } = yield select(state => state.chatRoom.currentRoom);
      const {
        userToken,
      } = yield select(state => state.user.userInfo);
      const params = Object.assign({
        roomId,
        direction: 0,
        order: 0,
        userToken,
      }, payload);
      const list = yield call(chatHistory, params);
      if (list && list.im_data && list.im_data.length > 0) {
        const data = list.im_data.map((item) => {
          const temp = item;
          temp.content = {
            content: '',
            type: '',
          };
          if (item.contentFormat && item.contentFormat.length > 0) {
            temp.content = item.contentFormat[0];
          }
          if (+userid === +item.userId) {
            temp.isAnchor = true;
          } else {
            temp.isAnchor = false;
          }
          temp.userFlag = +item.userIcons[0];
          return temp;
        }).filter((item) => {
          // 允许推荐股票类型消息通过
          if (item.content.type === 2 || +item.type === 1) {
            return true;
          }
          return !!item.content.content && item.content.content.indexOf('≡查看详情') === -1;
        });
        if (payload.order === -1 && payload.direction === -1) {
          data.reverse();
          yield put({
            type: 'MoreChatHistory',
            payload: data,
          });
        } else {
          yield put({
            type: 'AddChatHistory',
            payload: data,
          });
        }
      }
    },
    // 发送消息
    * sendMessage({
      payload,
    }, {
      select,
      call,
      put,
    }) {
      yield put({
        type: 'sendMessageLoading',
        payload: true,
      });
      // const {
      //   content,
      //   // sourceMsgId,
      //   roleID,
      //   ItemId,
      // } = payload;
      const dom = yield select(state => state.im.inputMsgDom);
      const {
        userToken: usertoken,
      } = yield select(state => state.user.userInfo);
      const {
        VideoChatRoom: roomId
      } = yield select(state => state.chatRoom.currentRoom);
      const {
        msgId: sourceMsgId,
      } = yield select(state => state.im.byReply);
      const result = yield call(sendMsg, {
        usertoken,
        roomId,
        sourceMsgId,
        ...payload,
      });
      yield put({
        type: 'sendMessageLoading',
        payload: false,
      });
      if (result && result.code === 0) {
        dom.innerHTML = '';
        yield put({
          type: 'DelByReply',
        });
      } else {
        openNotification({
          // title: '',
          description: result.message || '消息发送失败，请重试',
        });
      }
    },
    // 发送图片消息
    * sendFile({
      payload,
    }, {
      select,
      call,
      put,
    }) {
      const {
        userToken: usertoken,
      } = yield select(state => state.user.userInfo);
      const {
        VideoChatRoom: roomId,
      } = yield select(state => state.chatRoom.currentRoom);
      const roleid = yield select(state => state.role.currentRole.roleid);
      const {
        msgId: sourceMsgId,
      } = yield select(state => state.im.byReply);
      payload.append('usertoken', usertoken);
      payload.append('roomId', roomId);
      payload.append('sourceMsgId', sourceMsgId);
      payload.append('roleid', roleid);
      const result = yield call(sendFileMsg, payload);
      if (!result || result.code !== 0) {
        openNotification({
          description: '图片发送失败，请重新选择发送',
        });
      }
      yield put({
        type: 'CurrentUpladFile',
        payload: '',
      });
    },
    // 只看主播
    * anchorChatList({
      payload,
    }, {
      put,
    }) {
      yield put({
        type: 'OnlyAnchorChat',
        payload,
      });
    },
    // 获取直播间成员
    * getChatroomMembers(s, {
      call,
      select,
      put,
    }) {
      const {
        VideoChatRoom: roomId,
      } = yield select(state => state.chatRoom.currentRoom);
      const instance = yield select(state => state.im.chatRoomInstance);
      const getList = () => {
        return new Promise((resolve) => {
          instance.getChatroomMembers({
            guest: false,
            limit: 100,
            done: (err, obj) => {
              if (!err) {
                resolve(obj);
              } else {
                resolve(null);
              }
            }
          });
        });
      };
      const result = yield call(getList);
      if (result && result.members) {
        // const list = result.members.filter((item) => {
        //   return item.gaged && +roomId === +item.chatroomId;
        // });
        // // 禁言列表
        // yield put({
        //   type: 'ForbidList',
        //   payload: list,
        // });
        const black = result.members.filter((item) => {
          return item.blacked && +roomId === +item.chatroomId;
        });
        // 黑名单
        yield put({
          type: 'BlackList',
          payload: black,
        });
      }
      yield put({
        type: 'refreshForbidUserList',
        payload: null,
      });
    },
    * refreshForbidUserList(s, {
      select,
      call,
      put,
    }) {
      const {
        liveid: liveId,
        userid: masterId,
      } = yield select(state => state.chatRoom.currentRoom);
      const result = yield call(selectForbidList, {
        liveId,
        masterId,
      });
      if (result && result.code === 0) {
        // 禁言列表
        yield put({
          type: 'ForbidList',
          payload: result.GagList || [],
        });
      }
    },
    * forbidUserSendMsg({
      payload,
    }, {
      put,
      select,
      call,
    }) {
      const {
        userid: masterId
      } = yield select(state => state.chatRoom.currentRoom);
      const result = yield call(forbidUser, {
        masterId,
        gagstate: payload.state,
        userID: payload.account,
      });
      let msg = '操作失败，稍后重试';
      if (payload.state) {
        msg = `已将用户 ${payload.name} 禁言`;
      } else {
        msg = `恢复用户 ${payload.name} 发言`;
      }
      if (result && result.code === 0) {
        openNotification({
          description: msg,
        });
        yield put({
          type: 'refreshForbidUserList',
        });
      } else {
        openNotification({
          description: '操作失败，稍后重试',
        });
      }
    },
  }, // end effects
};
