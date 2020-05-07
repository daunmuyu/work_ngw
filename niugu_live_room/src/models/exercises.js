import { openNotification } from 'utils/tool.js';
import { pages, add, del, show } from 'service/exercises.js';

export default {
  namespace: 'exercises',
  state: {
    list: [],
    page: 1,
    visible: false,
    isCanExercise: false,
    listLength: 0,
  },
  reducers: {
    updateData(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    * get({ payload }, { call, put }) {
      const res = yield call(pages, payload);
      if (res.code === 0) {
        let calist = [];
        if (res.exerciseInfo && res.exerciseInfo.exerciseList) {
          calist = res.exerciseInfo.exerciseList.map((val, idx) => {
            const vals = val;
            vals.key = idx.toString();
            return vals;
          });
        }
        yield put({
          type: 'updateData',
          payload: {
            list: calist,
            listLength: res.exerciseInfo.pageCount,
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
            page: 1,
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
        id: payload.Id
      });
      if (res.code === 0) {
        yield put({
          type: 'get',
          payload: {
            liveid: payload.liveId,
            page: 1,
            pageSize: 20
          }
        });
      }
    },
    * show({ payload }, { call, put }) {
      const res = yield call(show, { ...payload });
      if (res.code === 0 && res.isCanExercise !== 0) {
        yield put({
          type: 'updateData',
          payload: {
            isCanExercise: true
          }
        });
      } else {
        yield put({
          type: 'updateData',
          payload: {
            isCanExercise: false
          }
        });
      }
    },
    * stop({ payload }, { select, call, put }) {
      const { VideoChatRoom: roomId } = yield select(
        state => state.chatRoom.currentRoom
      );
      if (!roomId) return;
      const res = yield call(pages, {
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
            page: 1,
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
