import Vue from 'vue';
import Vuex from 'vuex';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';
import manage from './manage';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userId: '',
    userInfo: null,
    groupId: '',
    chatMsgs: [], // 聊天信息
    currEmoji: '',
    emojiShow: false,
    kehuShow: false,
    groupShow: false,
    setShow: false,
    telShow: false,
    interShow: false,
    updateSession: [],
    chatLsit: [],
    sipTel: null,
    showTeamTransfer: false,
    msgEvents: [],
    msgReceipt: null,
    msgList: null,
    groupList: null,
    histIdSer: null,
    msgCount: '0', // 未读消息总数
    forbiddenWords: null,
    zxunShow: false,
    histShow: {
      isShow: false,
      isCurr: '',
    }, // 历史记录
    nimSDK: null,
    atUsers: [],
    mailList: { // 转发通讯录
      isShow: false,
      msgId: '',
    },
  },
  actions,
  getters,
  mutations,
  modules: {
    manage,
  },
});
