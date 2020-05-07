import cookie from 'js-cookie';
import {
  SET_USER_INFO,
  CLEAR_USER_INFO,
  SET_ROOMID,
} from '../store/mutationType';
import { login } from '../api/app';

export default {
  state: {
    userInfo: {},
    roomid: 1
  },
  mutations: {
    [SET_USER_INFO](state, payload) {
      cookie.set('m-userinfo', payload);
      state.userInfo = payload;
    },
    [CLEAR_USER_INFO](state) {
      cookie.remove('m-userinfo');
      state.userInfo = {};
    }
  },
  actions: {
    // login({ commit }, payload) {
    //   return login(payload).then(
    //     res => {
    //       let userInfo;
    //       if (res.result === '1' || res.result === 1) {
    //         userInfo = {
    //           userName: payload.userName,
    //           nickName: res.NickName,
    //           userToken: res.userToken,
    //           loginUserId: res.loginUserID
    //         };
    //         commit(SET_USER_INFO, userInfo);
    //       } else {
    //         console.log('[err]', res);
    //       }
    //       return userInfo;
    //     },
    //     err => {
    //       console.log('[err]', err);
    //     }
    //   );
    // },
    login({ commit }, payload) {
      return login(payload).then(
        res => {
          let userInfo;
          if (res.error_no === 0) {
            userInfo = {
              userName: res.userName,
              mobile: res.mobile,
              userToken: res.userToken,
              agentID: res.agentID,
            };
            commit(SET_USER_INFO, userInfo);
          } else {
            console.log('[err]', res);
          }
          return res;
        },
        err => {
          console.log('[err]', err);
        }
      );
    },
    clearUserInfo({ commit }) {
      commit(CLEAR_USER_INFO);
    }
  },
  getters: {
    userInfo({ userInfo }) {
      return userInfo;
    }
  }
};
