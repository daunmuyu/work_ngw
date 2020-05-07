
import 'babel-polyfill';
import Vue from 'vue';
import bridge from 'ng-bridge';
// import bridge from 'ng-bridge';
import Tips from './common/tips.vue';

import './style.scss';

new Vue({
  el: '#app',
  data() {
    return {
    };
  },
  components: {
    Tips,
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      bridge.init();
      bridge.initClose(1);
      bridge.initRefresh(0);
      bridge.setTitle('协议签署及确定');
      document.body.style.display = 'block';
    }
  }
});
