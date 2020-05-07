import { IMlogin, IMUToken, IMMsgList } from '../service/api';
import { setIMInfo, removeIMInfo, getCSToken } from './authToken';

export default {
  Login({
    commit,
  }, args) {
    return new Promise((resolve, reject) => {
      IMlogin(args).then((res) => {
        if (+res.result) {
          IMUToken((rs) => {
            if (+rs.result) {
              setIMInfo(res.data.userToken, res.data.userID, rs.data.token);
              commit();
              commit('LOGIN_ERR_MSG', '');
            } else {
              removeIMInfo();
              commit('LOGIN_ERR_MSG', res.message || '数据错误');
            }
          });
        } else {
          removeIMInfo();
          commit('LOGIN_ERR_MSG', res.message || '数据错误');
        }
      }).catch((error) => {
        reject(error);
      });
    });
  },
  chatMsgList({ commit }, args) {
    return new Promise((resolve, reject) => {
      IMMsgList({
        ...args,
        userToken: getCSToken(),
      }).then((res) => {
        if (+res.result) {
          commit('CHAT_LIST', res);
        } else {
          commit('LOGIN_ERR_MSG', res.message || '数据错误');
        }
      }).catch((error) => {
        reject(error);
      });
    });
  },
};

