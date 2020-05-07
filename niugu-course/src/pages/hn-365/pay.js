import Vue from 'vue';
import qs from 'qs';
// import VConsole from 'vconsole';
import { Toast, Dialog, Cell, CellGroup, Field, Button } from 'vant';
import { getCourse, getCode, getValid, getWXPay, COURSE_ID } from './service/api';
import { nameReg, idCardReg, telReg, smsCode, qsearch, delay } from './service/util';

import WXShare from '../../plugins/wxshare';

import './scss/pay.scss';

// new VConsole();

Vue.use(Toast)
  .use(Dialog)
  .use(Cell)
  .use(CellGroup)
  .use(Field)
  .use(Button);

new Vue({
  el: '#app',
  data() {
    return {
      userName: sessionStorage.getItem('userName') || '', // 王正伟
      idCard: sessionStorage.getItem('idCard') || '', // 411081199004235955
      kfCode: sessionStorage.getItem('kfCode') || qsearch('uid') || '',
      telNum: sessionStorage.getItem('telNum') || '', // 15369286654
      smsCode: sessionStorage.getItem('smsCode') || '',
      isRisk: false,
      isSubmit: true,
      timer: null,
      countdown: 60,
      info: null,
      select: {},
    };
  },
  created() {
    this.init();
    this.initShare();
  },
  methods: {
    initShare() {
      const pname = location.pathname.replace(/pay.html/, 'index.html');
      let lik = `${location.origin}${pname}?share=yes`;
      if (qsearch('uid')) lik += `&uid=${qsearch('uid')}`;
      const opts = {
        til: '好股365',
        cont: '每天一块钱 投资更轻松',
        lik,
        imgsrc: 'https://h5.stockhn.com/img/hntg/96.png',
        flag: false,
      };
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
    },
    init() {
      getCourse({
        servuid: qsearch('uid'),
      }).then(res => {
        if (+res.code === 0) {
          this.info = res;
          this.select = res.coursepriceData[0];
          this.info.newagreementtext = res.newagreementtext.replace(/《.+?》/g, (match, p1) => {
            let str = '';
            res.courseagreementData.forEach(v => {
              if (+p1 === +v.start) {
                str = `<a href="${v.url}">${match}</a>`;
              }
            });
            return str;
          });
        } else {
          Dialog.alert({ message: res.message || '请求出错请返回~' }).then(() => {
            window.history.back();
          });
        }
      });
    },
    changeInput() {
      sessionStorage.setItem('userName', this.userName);
      sessionStorage.setItem('idCard', this.idCard);
      sessionStorage.setItem('kfCode', this.kfCode);
      sessionStorage.setItem('telNum', this.telNum);
      sessionStorage.setItem('smsCode', this.smsCode);
      if (this.userName && this.idCard && this.telNum && this.smsCode && this.isRisk) {
        this.isSubmit = false;
      } else {
        this.isSubmit = true;
      }
    },
    getVerify() {
      if (!telReg.test(this.telNum)) {
        const msg = this.telNum ? '手机号码格式不正确~' : '请输入手机号~';
        Toast(msg);
        return;
      }
      delay(() => {
        clearInterval(this.timer);
        getCode({
          mobile: this.telNum,
          smsType: 29,
          packType: 1800,
        }).then(res => {
          if (+res.code === 0) {
            Toast('发送成功');
            this.timer = setInterval(() => {
              if (this.countdown >= 0) {
                this.countdown -= 1;
              } else {
                clearInterval(this.timer);
                this.countdown = 60;
              }
            }, 1000);
          } else {
            Toast(res.message);
          }
        });
      }, 150);
    },
    checks() {
      if (!nameReg.test(this.userName)) {
        Toast('姓名格式不正确~');
        return false;
      }
      if (!idCardReg.test(this.idCard)) {
        Toast('身份证格式不正确~');
        return false;
      }
      if (!telReg.test(this.telNum)) {
        Toast('手机号码格式不正确~');
        return false;
      }
      if (!smsCode.test(this.smsCode)) {
        Toast('验证码格式不正确~');
        return false;
      }
      if (!this.isRisk) {
        Toast('请勾选并确认协议~');
        return false;
      }
      return true;
    },
    purchase() {
      if (!this.checks()) return;
      delay(() => {
        getValid({
          mobile: this.telNum,
          code: this.smsCode,
          servuid: this.kfCode,
          packType: 1800,
        }).then(res => {
          if (+res.code === 0) {
            sessionStorage.setItem('usertoken', res.message);
            this.isWxPay(res.message);
          } else {
            Toast(res.message);
          }
        });
      }, 200);
    },
    isWxPay(userToken) {
      const isWX = /micromessenger/gi.test(navigator.userAgent);
      const params = {
        usertoken: userToken,
        clmobile: this.telNum,
        courseid: COURSE_ID,
        paytype: isWX ? 25 : 51,
        selcycle: this.select.selcycle,
        verify: 0,
        usercashid: this.select.qid,
        risktype: 1,
        cnl: 0,
        verifyIdCode: '1',
        realName: this.userName,
        idCode: this.idCard.toUpperCase(),
        servuid: this.kfCode,
      };
      console.log(params);
      if (isWX) {
        const owxurl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx438eca3f94f46d46&';
        const encURI = `https://user.niuguwang.com/wxpay/JsApiPageWenJie.aspx?${qs.stringify(params)}`;
        console.log(`${owxurl}redirect_uri=${encodeURIComponent(encURI)}&response_type=code&scope=snsapi_base&state=1#wechat_redirect`);
        window.location.href = `${owxurl}redirect_uri=${encodeURIComponent(encURI)}&response_type=code&scope=snsapi_base&state=1#wechat_redirect`;
      } else {
        this.wxPay(userToken);
      }
    },
    wxPay(params) {
      getWXPay(params).then(res => {
        if (+res.code === 0) {
          window.location.href = `https://user.niuguwang.com/wxpay/h5pay.aspx?${qs.stringify(params)}`;
        } else {
          Toast(res.message);
        }
      });
    },
  },
});
