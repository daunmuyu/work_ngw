import Vue from 'vue';
import 'babel-polyfill';
import './style.scss';

new Vue({
  el: '#app',
  components: {},
  data() {
    return {};
  },
  watch: {},
  created() {},
  methods: {
    toLoad() {
      location.href = 'https://sj.qq.com/myapp/detail.htm?apkName=com.niuguwang.stock.app3';
    },
  },
});
