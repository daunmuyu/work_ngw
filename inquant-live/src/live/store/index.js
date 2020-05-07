import Vue from 'vue';
import Vuex from 'vuex';
import app from './model';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    app
  },
});
