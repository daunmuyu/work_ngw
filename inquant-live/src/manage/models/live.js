import {
  getLiveList,
  getLiveBaseData,
  getInsideUserProxy,
  updateLiveBaseTopBanner,
  saveInsideUserProxy,
  createChatroom,
  addstrategy,
  qrystrategy,
} from '../api/live';

const SET_LIVE_LIST = 'SET_CUSTOMER_LIST';

export default {
  state: {
    liveList: [],
  },
  mutations: {
    [SET_LIVE_LIST](state, payload) {
      state.liveList = payload;
    },
  },
  actions: {
    loadLiveList({
      commit,
      rootState,
    }) {
      const proxyId = rootState.app.userInfo.agentID;
      return getLiveList({
        proxyId,
      }).then((res) => {
        if (res.result === 1) {
          commit(SET_LIVE_LIST, res.data);
        }
        return res;
      }, (err) => {
        console.log('[err]', err);
      });
    },
    getLiveDetail({
      commit,
      rootState,
    }, payload) {
      const Id = rootState.app.userInfo.agentID;
      const userToken = rootState.app.userInfo.userToken;
      return Promise.all([
        getLiveBaseData({
          // userToken,
          roomid: payload.roomid,
        }),
        getInsideUserProxy({
          Id,
          roomId: payload.roomid,
        }),
        qrystrategy({
          userToken,
          roomID: payload.roomid,
        })
      ]).then((results) => {
        const res = {
          LiveBanner: results[0].LiveBanner,
          LiveTitle: results[0].LiveTitle,
          LiveDesc: results[0].LiveDesc,
          strname: results[0].strname,
          strnumber: results[0].strnumber,
          teacherList: results[1].items.filter(item => item.roleId === 3),
          assistantList: results[1].items.filter(item => item.roleId === 2),
          slogan: results[1].slogan,
          qrcode: results[1].qrcode,
          desc: results[2].strategyDesc,
          strategyImg: results[2].strategyImg,
        }
        return res;
      });
    },
    saveLive({
      commit,
      rootState,
    }, payload) {
      const userToken = rootState.app.userInfo.userToken;
      return Promise.all([
        updateLiveBaseTopBanner({
          LiveBanner: payload.LiveBanner,
          LiveTitle: payload.LiveTitle,
          LiveDesc: payload.LiveDesc,
          roomid: payload.roomid,
          strname: payload.strname,
          strnumber: payload.strnumber
        }),
        saveInsideUserProxy({
          roomId: payload.roomid,
          userIds: payload.userIds,
          slogan: payload.slogan,
          img: payload.img,
        }),
        addstrategy({
          userToken,
          roomID: payload.roomid,
          strategyName: payload.strname,
          desc: payload.desc,
          strategyImg: payload.strategyImg,
        })
      ]);
    },
    createRoom({
      commit,
      rootState,
    }, payload) {
      const proxyId = rootState.app.userInfo.agentID;
      return createChatroom({
        proxyId,
      });
    }
  },
  getters: {
    liveList({
      liveList,
    }) {
      return liveList;
    },
  },
};
