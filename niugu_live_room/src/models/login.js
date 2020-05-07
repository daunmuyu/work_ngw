// 登陆相关

export default {
  namespace: 'login',
  state: {
    loginLoading: false,
    tip: {
      display: false,
      content: 'this is a content',
      type: 'info',
    }
  },
  reducers: {
    loginLoading(state, {
      payload: loginLoading,
    }) {
      return {
        ...state,
        loginLoading,
      };
    },
    setTip(state, {
      payload,
    }) {
      return {
        ...state,
        tip: payload,
      };
    }
  },
  effects: {
    * setLoginLoading(action, {
      put,
    }) {
      yield put({
        type: 'loginLoading',
        payload: action.payload,
      });
    },
    * tip({
      payload,
    }, {
      put,
    }) {
      yield put({
        type: 'setTip',
        payload,
      });
    },
  },
};
