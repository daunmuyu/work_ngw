import { login } from 'service/login.js';
import { userLiveToken, recommendStocks } from 'service/chat-room.js';
import Cookie from 'js-cookie';
import { USERINFO, clearCookie } from 'service/cookie-names.js';
import { routerRedux } from 'dva/router';

export default {
  namespace: 'user',
  state: {
    userInfo: null,
    currentRoute: 'chat-room',
    // 量化推荐股票
    recommendStocks: [],
    recommendStockLoading: true
  },
  reducers: {
    saveUesrInfo(state, { payload: userInfo }) {
      return {
        ...state,
        userInfo
      };
    },
    CurrentRoute(state, { payload: currentRoute }) {
      return {
        ...state,
        currentRoute
      };
    },
    RecommendStocks(state, { payload }) {
      return {
        ...state,
        recommendStocks: payload
      };
    },
    RecommendStockLoading(state, { payload: recommendStockLoading }) {
      return {
        ...state,
        recommendStockLoading
      };
    }
  }, // end reducers
  effects: {
    * login({ payload }, { put, call }) {
      clearCookie();
      yield put({
        type: 'login/loginLoading',
        payload: true
      });
      const result = yield call(login, payload);

      yield put({
        type: 'login/loginLoading',
        payload: false
      });
      yield put({
        type: 'login/tip',
        payload: {
          display: true,
          content: result.message,
          type: result.code === 0 ? 'success' : 'error'
        }
      });
      if (result.code === 0) {
        const liveRes = yield call(userLiveToken, {
          usertoken: result.userInfo.userToken
        });
        const { im_user } = liveRes;
        result.userInfo.chatToken = im_user.token;
        yield put({
          type: 'saveUesrInfo',
          payload: result.userInfo
        });
        Cookie.set(USERINFO, result.userInfo);
        yield put(routerRedux.push('/home'));
        yield put({
          type: 'chatRoom/initMyRooms',
          payload: {
            userToken: result.userInfo.userToken
          }
        });
      }
    },
    // 用户信息
    * userInfo({ payload }, { put }) {
      yield put({
        type: 'saveUesrInfo',
        payload
      });
    },
    * userLogout({ payload }, { put, select }) {
      const instance = yield select(state => state.im.chatRoomInstance);
      // 关闭前一个直播间
      if (instance && instance.disconnect) {
        instance.disconnect();
      }
      clearCookie();
      yield put({
        type: 'saveUesrInfo',
        payload
      });
      yield put(routerRedux.push('/login'));
    },
    // 获取量化股票列表
    * recommendStockList({ payload }, { select, put, call }) {
      yield put({
        type: 'RecommendStockLoading',
        payload: true
      });
      const { userId: Id } = yield select(state => state.user.userInfo);
      const result = yield call(recommendStocks, {
        Id
      });
      if (result && result.items && result.items.length) {
        yield put({
          type: 'RecommendStocks',
          payload: result.items
        });
      }
      yield put({
        type: 'RecommendStockLoading',
        payload: false
      });
    }
  } // end effects
};
