import { openNotification } from 'utils/tool.js';
import { set, getList, add, del, show } from 'service/strategy.js';

export default {
  namespace: 'strategy',
  state: {
    list: [],
    pageIndex: 1,
    visible: false,
    isCanCallOrder: false,
    listLength: 0,
  },
  reducers: {
    updateData(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    * get({ payload }, { call, put }) {
      const res = yield call(getList, payload);
      console.log(payload);
      if (res.code === 0) {
        let calist = [];
        if (res.callOrderList) {
          calist = res.callOrderList.map((val, idx) => {
            const vals = val;
            vals.key = idx.toString();
            return vals;
          });
        }
        yield put({
          type: 'updateData',
          payload: {
            list: calist,
            listLength: res.pageCount,
          }
        });
      } else {
        openNotification({
          description: res.message || '操作失败，稍后重试'
        });
      }
    },
    * addcall({ payload }, { call, put }) {
      const res = yield call(add, {
        ...payload
      });
      if (res && res.code === 0) {
        yield put({
          type: 'get',
          payload: {
            liveid: payload.liveId,
            pageIndex: 1,
            pageSize: 20
          }
        });
        yield put({
          type: 'updateData',
          payload: {
            visible: false
          }
        });
      } else {
        openNotification({
          description: res.message || '操作失败，稍后重试'
        });
      }
    },
    * delcall({ payload }, { call, put }) {
      const res = yield call(del, {
        callid: payload.callId
      });
      if (res.code === 0) {
        yield put({
          type: 'get',
          payload: {
            liveid: payload.liveId,
            pageIndex: 1,
            pageSize: 20
          }
        });
      }
    },
    * show({ payload }, { call, put }) {
      const res = yield call(show, { ...payload });
      if (res.code === 0 && res.isCanCallOrder !== 0) {
        yield put({
          type: 'updateData',
          payload: {
            isCanCallOrder: true
          }
        });
      } else {
        yield put({
          type: 'updateData',
          payload: {
            isCanCallOrder: false
          }
        });
      }
    },
    * stop({ payload }, { select, call, put }) {
      const { VideoChatRoom: roomId } = yield select(
        state => state.chatRoom.currentRoom
      );
      if (!roomId) return;
      const res = yield call(set, {
        roomId,
        isPush: payload.isPush,
        exitPrice: payload.price,
        callId: payload.callId,
        usertoken: payload.usertoken
      });
      if (res.code === 0) {
        yield put({
          type: 'get',
          payload: {
            liveid: payload.liveId,
            pageIndex: 1,
            pageSize: 20
          }
        });
      } else {
        openNotification({
          description: res.message || '操作失败，稍后重试'
        });
      }
    }
  }
};
