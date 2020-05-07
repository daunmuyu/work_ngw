import Vue from 'vue';
import Vuex from 'vuex';
import app from '../models/app';
import customer from '../models/customer';
import employee from '../models/employee';
import live from '../models/live';
import video from '../models/video';
import notice from '../models/notice';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    app,
    customer,
    employee,
    live,
    video,
    notice,
  },
});
