import { openNotification } from 'utils/tool.js';
import { setWelcome, getWelcomeList } from 'service/welcome.js';

export default {
  namespace: 'welcome',
  state: {
    list: []
  },
  reducers: {
    updateData(state, { payload: list }) {
      return { ...state, list };
    }
  },
  effects: {
    * get({ payload }, { call, put }) {
      const res = yield call(getWelcomeList, payload);
      if (res.code === 0) {
        yield put({
          type: 'updateData',
          payload: res.data || []
        });
      } else {
        openNotification({
          description: res.message || '操作失败，稍后重试',
        });
      }
    },
    * update({ payload }, { select, call, put }) {
      const userInfo = yield select(state => state.user.userInfo);
      const { VideoChatRoom: roomid} = yield select(state => state.chatRoom.currentRoom);
      if (!roomid) return;
      const res = yield call(setWelcome, { usertoken: userInfo.userToken, roomid, ...payload});
      if (res.code === 0) {
        yield put({
          type: 'get',
          payload: { usertoken: userInfo.userToken, roomid }
        });
      }
    }
  }
};
