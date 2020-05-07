// 业务
import {
  saveSelectedMsg,
} from 'service/bussiness.js';
import {
  openNotification,
} from 'utils/tool.js';

export default {
  namespace: 'bussiness',
  state: {},
  reducers: {}, // end reducers
  effects: {
    * updateSelectedMsg({
      payload,
    }, {
      call,
      put,
      select,
    }) {
      const {
        userToken: usertoken,
      } = yield select(state => state.user.userInfo);
      yield put({
        type: 'im/InitIMLoading',
        payload: true,
      });
      const result = yield call(saveSelectedMsg, Object.assign({}, payload, {
        usertoken,
      }));

      if (result && result.code === 0) {
        openNotification({
          description: '封面消息设置成功',
        });
      } else {
        openNotification({
          description: '封面消息设置失败，稍后重试',
        });
      }
      yield put({
        type: 'im/InitIMLoading',
        payload: false,
      });
    },
  }, // end effects
};
