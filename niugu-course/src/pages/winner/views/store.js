import Vue from 'vue';
import Vuex from 'vuex';
import Cookie from "js-cookie";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    validtime: '',
    usertoken: '',
    isH5: false,
    notAudit: false,
    notThrough: false,
    isLive: false,
    videoData: {},
    courseType: '',
  },
  mutations: {
    SET_VALID_TIME(state, time) {
      state.validtime = time;
    },
    SET_USERTOKEN(state, token) {
      state.usertoken = token;
      Cookie.set('usertoken', token);
    },
    SET_isH5(state, bol) {
      state.isH5 = bol;
    },
    SET_COURSE_TYPE(state, type) {
      state.courseType = type;
    },
    SET_NOT_AUDIT(state, status) {
      state.notAudit = status;
    },
    SET_NOT_THROUGH(state, status) {
      state.notThrough = status;
    },
    SET_LIVE(state, status) {
      state.isLive = status;
    },
    SET_VIDEO_DATA(state, data) {
      state.videoData = data;
    },
  }
});
