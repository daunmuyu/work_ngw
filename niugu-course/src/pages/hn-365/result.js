import Vue from 'vue';
import { Toast } from 'vant';

import WXShare from '../../plugins/wxshare';

import './scss/index.scss';

Vue.use(Toast);

new Vue({
  el: '#app',
  data() {
    return {
      isbuy: false,
      utoken: sessionStorage.getItem('usertoken'),
      isMark: false,
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      const opts = {
        til: '好股365',
        cont: '每天一块钱 投资更轻松',
        lik: `${location.origin}${location.pathname}?share=yes`,
        imgsrc: 'https://h5.stockhn.com/img/hntg/96.png',
        flag: false,
      };
      WXShare.init(opts);
      window.mqq.data.setShareInfo({
        share_url: encodeURI(opts.lik),
        title: opts.til,
        desc: opts.cont,
        image_url: opts.imgsrc,
      }, () => {
        // 成功回调函数
        Toast('分享成功');
      });
    },
    download(type) {
      const isIOS = /(iphone|ipad|ipod)/gi.test(window.navigator.userAgent);
      const weixin = /micromessenger/gi.test(window.navigator.userAgent);
      const qq = / qq/gi.test(window.navigator.userAgent);
      const qqb = /mqqbrowser/gi.test(window.navigator.userAgent);
      const url = 'https://h5.stockhn.com/2019y/luodi/hntg-down/index.html';
      const sme = 'hntg.scheme://';
      if (isIOS) {
        location.href = url;
        return;
      }
      if (+type === 1 && (weixin || qq || qqb)) {
        this.isMark = true;
        return;
      }
      if (+type === 1) {
        location.href = sme;
      } else {
        location.href = url;
      }
    },
  },
});
