import {
  getVideoList,
  addVideo,
  modifyVideo,
  getVideoById,
  settingVideo,
  sourceVideoList,
} from '../api/video';

const SET_VIDEO_LIST = 'SET_VIDEO_LIST';

export default {
  state: {
    videoList: [],
  },
  mutations: {
    [SET_VIDEO_LIST](state, payload) {
      state.videoList = payload;
    },
  },
  actions: {
    loadVideoList({
      commit,
    }, payload) {
      return getVideoList(payload).then((res) => {
        if (res.code === 1) {
          commit(SET_VIDEO_LIST, res.data);
        }
        return res;
      }, (err) => {
        console.log('[err]', err);
      });
    },
    addVideo(state, payload) {
      return addVideo(payload);
    },
    modifyVideo(state, payload) {
      return modifyVideo(payload);
    },
    getVideoById(state, payload) {
      return getVideoById(payload);
    },
    settingVideo(state, payload) {
      return settingVideo(payload);
    },
    sourceVideoList({
      rootState,
    }) {
      const Id = rootState.app.userInfo.agentID;
      return sourceVideoList({
        Id,
      });
    }
  },
  getters: {
    videoList({
      videoList,
    }) {
      return videoList;
    },
  },
};
