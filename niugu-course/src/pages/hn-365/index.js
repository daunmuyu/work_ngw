import Vue from 'vue';
import { Toast, Dialog } from 'vant';
import bridge from 'ng-bridge';

import { isBuy, COURSE_ID } from './service/api';
import WXShare from '../../plugins/wxshare';

import './scss/index.scss';

Vue.use(Toast)
  .use(Dialog);

new Vue({
  el: '#app',
  data() {
    return {
      isbuy: false,
      isShare: bridge.search('share'),
      utoken: sessionStorage.getItem('usertoken'),
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      let lik = `${location.origin}${location.pathname}?share=yes`;
      if (bridge.search('uid')) lik += `&uid=${bridge.search('uid')}`;
      const opts = {
        til: '好股365',
        cont: '每天一块钱 投资更轻松',
        lik,
        imgsrc: 'https://h5.stockhn.com/img/hntg/96.png',
        flag: false,
      };
      if (this.isShare) {
        WXShare.init(opts);
        window.mqq.data.setShareInfo({
          share_url: encodeURI(lik),
          title: opts.til,
          desc: opts.cont,
          image_url: opts.imgsrc,
        }, () => {
          // 成功回调函数
          Toast('分享成功');
        });
        this.isBuyFun();
      } else {
        bridge.init();
        bridge.setTitle('好股365');
        bridge.initRefresh(1);
        bridge.initShare(opts.til, opts.cont, opts.lik, 1);
        bridge.utoken(ut => {
          this.utoken = ut;
          this.isBuyFun();
        });
      }
    },
    isBuyFun() {
      if (!this.utoken) return;
      isBuy({
        usertoken: this.utoken,
      }).then(res => {
        if (+res.code === 0) {
          this.isbuy = +res.isBuy;
        } else {
          Toast(res.message);
        }
      });
    },
    goInformation() {
      bridge.goInformation();
    },
    goToPay() {
      if (this.isShare) {
        let url = './pay.html';
        if (bridge.search('uid')) url += `?uid=${bridge.search('uid')}`;
        window.location.href = url;
      } else {
        bridge.toCoursePayment(COURSE_ID, '');
      }
    },
  },
});
