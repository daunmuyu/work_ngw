import Vue from 'vue';
import bridge from 'ng-bridge';
import API from './service/api';

import './detail.scss';

new Vue({
  el: '#app',
  data() {
    return {
      telShow: false,
      curTel: '',
      serTel: '',
    };
  },
  created() {
    bridge.init();
    bridge.setTitle('牛熊分界');
    this.init();
  },
  mounted() {
    console.log('mou');
  },
  methods: {
    init() {
      API.getBuyTel({
        courseid: '4425',
        usertoken: bridge.search('usertoken'),
      }).then((res) => {
        this.telShow = +res.result;
        this.serTel = res.servicetel;
        this.curTel = res.custtel;
      });
    },
    telPhone(num) {
      console.log(num);
      bridge.telPhone(num);
    },
  },
});
