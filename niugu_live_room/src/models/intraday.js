import { openNotification } from 'utils/tool.js';
import { setIntraday, getIntradayList } from 'service/intraday.js';

export default {
  namespace: 'intraday',
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
      const res = yield call(getIntradayList, payload);
      if (res.code === 0) {
        yield put({
          type: 'updateData',
          payload: res || [],
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
      const res = yield call(setIntraday, { usertoken: userInfo.userToken, roomid, ...payload});
      if (res.code === 0) {
        yield put({
          type: 'post',
          payload: { usertoken: userInfo.userToken, roomid }
        });
        openNotification({
          description: res.message,
        });
      } else {
        openNotification({
          description: res.message || '操作失败，稍后重试',
        });
      }
    }
  }
};
