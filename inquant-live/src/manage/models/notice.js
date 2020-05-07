import {
  getNoticeList,
  updateNotice,
  setPreviewInfo
} from '../api/notice';

const SET_NOTICE_LIST = 'SET_NOTICE_LIST';

export default {
  state: {
    noticeList: [],
  },
  mutations: {
    [SET_NOTICE_LIST](state, payload) {
      state.noticeList = payload;
    },
  },
  actions: {
    loadNoticeList({
      commit,
      rootState,
    }) {
      const Id = rootState.app.userInfo.agentID;
      return getNoticeList({
        Id,
      }).then((res) => {
        if (res.code === 1) {
          commit(SET_NOTICE_LIST, res.data);
        }
        return res;
      }, (err) => {
        console.log('[err]', err);
      });
    },
    updateNotice(state, payload) {
      return updateNotice(payload);
    },
    setNoticeInfo(state, payload) {
      return setPreviewInfo({
        ...payload
      })
    }
  },
  getters: {
    noticeList({
      noticeList,
    }) {
      return noticeList;
    },
  },
};
