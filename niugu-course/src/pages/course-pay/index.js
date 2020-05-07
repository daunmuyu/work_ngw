import Vue from 'vue';
import bridge from 'ng-bridge';
import Dk from './views/dk.vue';
import King from './views/king.vue';
import Config from './util/config.json';
import mixin from './util/mixin.js';
import './scss/index.scss';

Vue.prototype.$bridge = bridge;

new Vue({
  el: '#app',
  mixins: [mixin],
  components: {
    Dk,
    King
  },
  data() {
    return {
      activePage: Config[bridge.search('courseid')]
    };
  },
  beforeCreate() {
    bridge.init();
    bridge.initRefresh(1);
    bridge.setTitle('支付前页');
  },
  mounted() {
  },
  methods: {
    init() {
    }
  },
});
