// 直播间
import {
  myRoomList,
  updateLiveName,
  // playLive,
  startOrStopLive,
  saveNotice,
  saveWelcomeTip,
  forbidAllUser,
  updateVideoStatus,
  setPassword,
  setPasswordStatus,
  getAdvanceList,
  setAdvance,
  delAdvance
} from 'service/chat-room.js';
import { openNotification } from 'utils/tool.js';
import { Modal } from 'antd';
import { clearCookie } from 'service/cookie-names.js';
import { routerRedux } from 'dva/router';

export default {
  namespace: 'chatRoom',
  state: {
    // 我的直播间
    myRooms: [],
    myRoomsLoading: true,
    // 当前房间
    currentRoom: {
      userid: 0,
      noticeList: []
    },
    // 房间信息设置
    roomSettingEdit: {
      // 主题
      theme: false,
      themeLoading: false,
      // 公告
      notice: false,
      noticeLoading: false,
      // 欢迎语
      welcome: false,
      welcomeLoading: false,
      // 预告
      advance: false,
      advanceLoading: false
    },
    liveSwitchLoading: false
  },
  reducers: {
    MyRoomsLoading(state, { payload: myRoomsLoading }) {
      return {
        ...state,
        myRoomsLoading
      };
    },
    MyRooms(state, { payload: myRooms }) {
      return {
        ...state,
        myRooms
      };
    },
    CurrentRoom(state, { payload: currentRoom }) {
      return {
        ...state,
        currentRoom: Object.assign({}, state.currentRoom, currentRoom)
      };
    },
    Member(state, { payload: members }) {
      return {
        ...state,
        members
      };
    },
    RoomSetting(state, { payload }) {
      return {
        ...state,
        roomSettingEdit: payload
      };
    },
    LiveSwitchLoading(state, { payload: liveSwitchLoading }) {
      return {
        ...state,
        liveSwitchLoading
      };
    }
  }, // end reducers
  effects: {
    * initMyRooms({ payload }, { put, call, select }) {
      function goLogin() {
        clearCookie();
        window.location.href = '#login';
        setTimeout(() => {
          window.location.reload();
        }, 300);
      }
      yield put({
        type: 'MyRoomsLoading',
        payload: true
      });
      const currentRoom = yield select(state => state.chatRoom.currentRoom);
      const usertoken = yield select(state => state.user.userInfo.userToken);
      const result = yield call(myRoomList, payload);
      if (result && result.result) {
        if (currentRoom && !currentRoom.liveid) {
          // 设置默认房间
          yield put({
            type: 'selectedRoom',
            payload: result.data[0]
          });
          yield put({
            type: 'getList',
            payload: {
              liveid: result.data[0].liveid
            }
          });
          yield put({
            type: 'exercises/show',
            payload: {
              usertoken,
              liveid: result.data[0].liveid
            }
          });
          yield put({
            type: 'tactics/show',
            payload: {
              usertoken,
              liveid: result.data[0].liveid
            }
          });
          yield put({
            type: 'strategy/show',
            payload: {
              usertoken,
              liveid: result.data[0].liveid
            }
          });
        }
        // 设置房间列表
        yield put({
          type: 'MyRooms',
          payload: result.data.slice()
        });
      } else {
        Modal.warning({
          title: '访问受限',
          content: result.message || '无法进入直播间',
          onOk: goLogin,
          onCancel: goLogin
        });
      }
      yield put({
        type: 'MyRoomsLoading',
        payload: false
      });
    },
    // 选中房间
    * selectedRoom({ payload }, { put }) {
      yield put(routerRedux.push('/home/chat-room'));
      yield put({
        type: 'user/CurrentRoute',
        payload: 'chat-room'
      });
      yield put({
        type: 'CurrentRoom',
        payload
      });
      yield put({
        type: 'role/resetCurrentRole'
      });
      // 获取当前房间可用角色
      yield put({
        type: 'role/getAllMyRoles'
      });
      yield put({
        type: 'im/ResetChatHistory',
        payload: []
      });
      // 直播间消息
      yield put({
        type: 'im/getChatHistory',
        payload: {}
      });

      // 设置直播
      yield put({
        type: 'setUpLive'
      });
    },
    // 直播状态控制
    * liveSwitch({ payload }, { put, call, select }) {
      yield put({
        type: 'LiveSwitchLoading',
        payload: true
      });
      const { liveid } = yield select(state => state.chatRoom.currentRoom);
      const { userToken: usertoken } = yield select(
        state => state.user.userInfo
      );
      const result = yield call(startOrStopLive, {
        liveid,
        usertoken,
        LiveSwitch: payload.liveswitch
      });
      const notify = {
        description: '操作失败，请稍后重试'
      };
      if (result && result.result) {
        yield put({
          type: 'chatRoom/CurrentRoom',
          payload
        });
        yield put({
          type: 'updateRoomListStatus',
          payload: null
        });
        notify.description = !payload.liveswitch ? '直播间已停止直播' : '开播成功，马上开始直播吧';
      } else {
        notify.description = result.message;
      }
      yield put({
        type: 'LiveSwitchLoading',
        payload: false
      });
      openNotification(notify);
    },
    * videoSwitch({ payload }, { select, put, call }) {
      yield put({
        type: 'LiveSwitchLoading',
        payload: true
      });
      const { liveid } = yield select(state => state.chatRoom.currentRoom);
      const { userToken: usertoken } = yield select(
        state => state.user.userInfo
      );

      const result = yield call(updateVideoStatus, {
        usertoken,
        liveid
      });
      const notify = {
        description: '操作失败，请稍后重试'
      };
      if (result && result.code === 0) {
        yield put({
          type: 'chatRoom/CurrentRoom',
          payload
        });
        yield put({
          type: 'updateRoomListStatus',
          payload: null
        });
        notify.description = '已关闭视频直播';
      }
      openNotification(notify);
      yield put({
        type: 'LiveSwitchLoading',
        payload: false
      });
    },
    * updateRoomListStatus(s, { select, put }) {
      const myRooms = yield select(state => state.chatRoom.myRooms);
      const current = yield select(state => state.chatRoom.currentRoom);
      const temp = myRooms.map((item) => {
        if (+item.liveid === +current.liveid) {
          return current;
        }
        return item;
      });
      yield put({
        type: 'MyRooms',
        payload: temp
      });
    },
    // 设置直播
    * setUpLive({ payload }, { put, select }) {
      const instance = yield select(state => state.im.chatRoomInstance);
      // 关闭前一个直播间
      if (instance && instance.disconnect) {
        instance.disconnect();
      }
      // 初始化IM
      yield put({
        type: 'im/initIM'
      });
    },
    // 更新主题
    * updateLiveTheme({ payload }, { put, call }) {
      yield put({
        type: 'RoomSetting',
        payload: {
          theme: true,
          themeLoading: true
        }
      });
      const result = yield call(updateLiveName, payload);
      if (result && result.code === 0) {
        yield put({
          type: 'RoomSetting',
          payload: {
            theme: false,
            themeLoading: false
          }
        });
        // 更新当前房间信息
        yield put({
          type: 'CurrentRoom',
          payload: {
            livename: payload.livename
          }
        });
        // 更新列表数据
        yield put({
          type: 'updateMyRooms'
        });
        openNotification({
          title: '提示',
          description: '房间主题修改成功'
        });
      } else {
        yield put({
          type: 'RoomSetting',
          payload: {
            theme: true,
            themeLoading: false
          }
        });
        openNotification({
          title: '出错了',
          description: '房间主题修改失败'
        });
      }
    },
    // 设置密码
    * setRoomPassword({ payload }, { call, put }) {
      const result = yield call(setPassword, payload);
      if (result && result.code === 0) {
        openNotification({
          description: result.message || '操作成功'
        });
        yield put({
          type: 'CurrentRoom',
          payload: {
            password: payload.password
          }
        });
      } else {
        openNotification({
          description: result.message || '操作失败， 稍后重试'
        });
      }
    },
    // 设置密码状态
    * setRoomPasswordStatus({ payload }, { call, put }) {
      const result = yield call(setPasswordStatus, payload);
      const apwdst = {passwordStatus: payload.status === 0 ? '1' : '2'};
      const ppwdst = {passwordStatusWeb: payload.status === 0 ? '1' : '2'};
      console.log(payload);
      if (result && result.code === 0) {
        yield put({
          type: 'CurrentRoom',
          payload: payload.type === 1 ? apwdst : ppwdst
        });
        openNotification({
          description: result.message || '操作成功'
        });
      } else {
        openNotification({
          description: result.message || '操作失败， 稍后重试'
        });
      }
    },
    // 更新公告
    * updateNotice({ payload }, { put, call }) {
      yield put({
        type: 'RoomSetting',
        payload: {
          notice: true,
          noticeLoading: true
        }
      });
      const result = yield call(saveNotice, payload);
      const notify = {
        description: result.message || '修改公告失败，稍后重试'
      };
      if (result && result.code === 0) {
        yield put({
          type: 'RoomSetting',
          payload: {
            notice: false,
            noticeLoading: false
          }
        });
        notify.description = '公告修改成功，请等待审核通过.';
      } else {
        yield put({
          type: 'RoomSetting',
          payload: {
            notice: true,
            noticeLoading: false
          }
        });
      }
      openNotification(notify);
    },
    * updateMyRooms(s, { put, select }) {
      const currentRoom = yield select(state => state.chatRoom.currentRoom);
      const myRooms = yield select(state => state.chatRoom.myRooms);
      const temp = myRooms.slice();
      temp.forEach((item, index) => {
        if (item.liveid === currentRoom.liveid) {
          temp[index] = Object.assign({}, currentRoom);
        }
      });
      yield put({
        type: 'MyRooms',
        payload: temp
      });
    },
    // 更新欢迎语
    * updateWelcomeTip(
      { payload },
      {
        put,
        // select,
        call
      }
    ) {
      yield put({
        type: 'RoomSetting',
        payload: {
          welcome: true,
          welcomeLoading: true
        }
      });
      const result = yield call(saveWelcomeTip, payload);
      const notify = {
        description: result.message || '修改公告失败，稍后重试'
      };
      if (result && result.code === 0) {
        yield put({
          type: 'RoomSetting',
          payload: {
            welcome: false,
            welcomeLoading: false
          }
        });
        notify.description = '公告修改成功，请等待审核通过.';
      } else {
        yield put({
          type: 'RoomSetting',
          payload: {
            welcome: true,
            welcomeLoading: false
          }
        });
      }
      openNotification(notify);
    },
    * markChatroomMute({ payload: { mute } }, { select, put, call }) {
      const { VideoChatRoom: roomid } = yield select(
        state => state.chatRoom.currentRoom
      );
      const { userToken: usertoken } = yield select(
        state => state.user.userInfo
      );
      const chatRoomInfo = yield select(state => state.im.chatRoomInfo);
      const result = yield call(forbidAllUser, {
        mute,
        roomid,
        usertoken
      });
      if (result && result.code === 0) {
        chatRoomInfo.mute = mute;
        yield put({
          type: 'im/ChatRoomInfo',
          payload: chatRoomInfo
        });
        openNotification({
          description: mute ? '直播间进入全员禁言状态。' : '已解除全员禁言状态。'
        });
      } else {
        openNotification({
          description: result.error_info || '操作失败，稍后重试'
        });
      }
    },
    * getList({ payload }, { call, put }) {
      const { liveid } = payload;
      const advance = yield call(getAdvanceList, {
        liveid
      });
      if (advance.code === 0) {
        yield put({
          type: 'CurrentRoom',
          payload: {
            noticeList: advance.noticeList
          }
        });
      }
    },
    * addAdvance({ payload }, { call, put }) {
      const res = yield call(setAdvance, {
        ...payload
      });
      const notify = {description: '直播预告修改成功.'};
      if (res.code === 0) {
        yield put({
          type: 'RoomSetting',
          payload: {
            advance: false,
            advanceLoading: false
          }
        });
        yield put({
          type: 'getList',
          payload: {
            liveid: payload.liveId
          }
        });
      } else {
        yield put({
          type: 'RoomSetting',
          payload: {
            advance: true,
            advanceLoading: false
          }
        });
        notify.description = res.message || '直播预告修改失败，请重试';
      }
      openNotification(notify);
    },
    * deleteAdvance({payload}, {call, put, select}) {
      const { liveid } = yield select(state => state.chatRoom.currentRoom);
      const res = yield call(delAdvance, {
        ...payload
      });
      const notify = {description: '直播预告删除成功.'};
      if (res.code === 0) {
        yield put({
          type: 'getList',
          payload: {
            liveid
          }
        });
      } else {
        notify.description = res.message || '直播预告删除失败.';
      }
      openNotification(notify);
    }
  } // end effects
};
