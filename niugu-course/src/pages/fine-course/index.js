import Vue from 'vue';
import 'babel-polyfill';
import { Toast, Button, Field, Lazyload, CellGroup, Row, Col, Actionsheet, Popup, Dialog } from 'vant';
import bridge from 'ng-bridge';
import API from './service/api';
import NGW from '../../plugins/download';
import wxShare from '../../plugins/wxshare';
import './style.scss';

Vue.use(Toast).use(Button).use(Field).use(CellGroup)
  .use(Lazyload, { lazyComponent: false })
  .use(Row)
  .use(Col)
  .use(Popup)
  .use(Dialog)
  .use(Actionsheet);

const pageInit = {
  title: '高级定制',
  content: '现在加入 可免费领《抢占黄金点》精品课程'
};

new Vue({
  el: '#app',
  components: {},
  data() {
    return {
      phoneNum: '', // 手机号码
      timeNum: 60, // 倒计时
      verifyCode: '', // 验证码
      inviterUserId: bridge.search('inviterUserId'), // 企业微信邀请ID
      imgList: [
        require('./images/img1.png'),
        require('./images/img2.png')
      ],
      show: false, // 二维码弹窗
      isRule: false
    };
  },
  watch: {},
  created() {
    this.init();
    this.isWx();
  },
  methods: {
    // 初始化
    init() {
      bridge.init();
      bridge.initRefresh(1);
      bridge.setTitle(pageInit.title);
      bridge.initShare(pageInit.title, pageInit.content, pageInit.url, 1);
    },
    // 判断手机号、验证码
    checkInput() {
      if (!/^1\d{10}$/.test(this.phoneNum)) {
        Toast('请输入正确格式的手机号');
        return;
      }
      if (!/\d{4}/.test(this.verifyCode)) {
        Toast('请输入验证码');
        return;
      }
      return true;
    },
    // 获取验证码
    getVerifyCode() {
      if (!/^1\d{10}$/.test(this.phoneNum)) {
        Toast('请输入正确格式的手机号');
        return;
      }
      // 时间戳
      const date = new Date().getTime();

      API.getCode({
        mobile: this.phoneNum,
        smsType: 29,
        date
      }).then((res) => {
        Toast(res.message || '发送失败~');
        if (!+res.code) {
          const time = setInterval(() => {
            if (this.timeNum > 0) {
              this.timeNum -= 1;
            } else {
              this.timeNum = 60;
              clearInterval(time);
            }
          }, 1000);
        }
      }).catch((err) => {
        Toast(err || '网络错误~');
      });
    },
    // 提交
    submitFree() {
      if (!this.checkInput()) return;

      API.getWorkChat({
        mobile: this.phoneNum,
        code: this.verifyCode,
        inviterUserId: this.inviterUserId
      }).then((res) => {
        if (+res.code === 200) {
          Toast(res.message);
        } else {
          Toast(res.message || '网络错误~');
        }
        this.openPop();
      }).catch((err) => {
        Toast(err || '网络错误~');
      });
    },
    // 打开二维码弹窗
    openPop() {
      // 判断手机号是否正确
      if (!/^1\d{10}$/.test(this.phoneNum)) {
        Toast('请输入正确格式的手机号');
        return;
      }
      this.show = true;
    },
    // 关闭二维码弹窗
    closePop() {
      this.show = false;
    },
    // 判断是否是微信客户端
    isWx() {
      const ua = window.navigator.userAgent.toLowerCase();
      if (!ua.match(/MicroMessenger/i)) {
        Toast('分享至微信再打开，效果体验更强哦~', 4000);
      }
    }
  },
});
