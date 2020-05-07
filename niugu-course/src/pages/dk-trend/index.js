import Vue from 'vue';
import 'babel-polyfill';
import { Toast, Button, Field, Lazyload, CellGroup, Row, Col, Actionsheet, Popup, Dialog, Swipe, SwipeItem } from 'vant';
import bridge from 'ng-bridge';
import API from './service/api';
import stockData from './service/stock';
import NGW from '../../plugins/download';
import wxShare from '../../plugins/wxshare';
import Login from './views/login.vue';
import './style.scss';

Vue.use(Toast).use(Button).use(Field).use(CellGroup)
  .use(Lazyload, { lazyComponent: true })
  .use(Row)
  .use(Col)
  .use(Popup)
  .use(Dialog)
  .use(Actionsheet)
  .use(Swipe)
  .use(SwipeItem);

const courseid = bridge.search('courseid') || '4357';
const fromType = bridge.search('fromtype') ? `&fromType=${bridge.search('fromtype')}` : '';
const read = bridge.search('read') ? `&read=${bridge.search('read')}` : '';
const buy = bridge.search('buy') ? `&buy=${bridge.search('buy')}` : '';
const pageInit = {
  title: 'DK趋势',
  content: '智能掘取好股 尊享机会仅此1次',
  url: `${location.origin}${location.pathname}?share=yes&courseid=${courseid}${fromType}${read}${buy}`,
};

new Vue({
  el: '#app',
  components: {
    Login,
  },
  data() {
    return {
      isLogin: false, // 用户是否登录
      userType: 0, // 用户类别 0未领取 ；1 已领取 ；2 已领取并且产品已到期
      isThirdUser: true, // 是否三方用户
      userName: '', // 用户姓名
      userSex: '先生', // 用户性别
      phoneNum: '', // 手机号码
      verifyCode: '', // 验证码
      timeNum: 60, // 倒计时
      stockData, // 股票代码信息
      popupShow: false, // 弹出层
      showmessage: '',
      alertMsg: '',
      telNum: '021-2509-9066',
      imgList: [
        require('./images/image2@2x.png'),
        require('./images/image3@2x.png'),
        require('./images/image4@2x.png')
      ],
      images: [
        require('./images/lunbo1.png'),
        require('./images/lunbo2.png'),
        require('./images/lunbo3.png')
      ],
      actions: [{ name: '先生' }, { name: '女士' }],
      selectShow: false,
      isGoBtn: false,
      isShare: bridge.search('share'),
      usertoken: '',
      fromType: +bridge.search('fromtype') || 0, // 默认是0， 个股页领取： 1  banner页领取： 2， 以后以此类推
      read: bridge.search('read') || bridge.search('buy'),
      buy: bridge.search('buy') || bridge.search('btn'),
      loginShow: false, // 登录页面显示
      timer: null,
      isInput: true
    };
  },
  watch: {
    loginShow(val) {
      if (!val) {
        this.usertoken = sessionStorage.getItem('usertoken');
        if (!this.buy) this.filterStatus(this.usertoken, 'login');
      }
    },
  },
  created() {
    // Toast('加载完成~ ~');
    this.init();
  },
  methods: {
    init() {
      if (this.isShare) {
        this.shareInit();
        // this.isInput = this.phoneNum.length === 0;
      } else {
        this.appInit();
        // this.isInput = this.phoneNum.length === 0;
      }
      console.log(this.phoneNum ? 1 : 0, 'phoneNummmmmm');
    },
    appInit() {
      bridge.init();
      bridge.initRefresh(1);
      bridge.setTitle(pageInit.title);
      const shareNum = bridge.search('right') ? 0 : 1;
      bridge.initShare(pageInit.title, pageInit.content, pageInit.url, shareNum);
      bridge.utoken((ut) => {
        this.usertoken = ut;
        if (this.usertoken && !this.read) this.filterStatus(ut);
        this.payCallBack();
        if (!bridge.search('right')) this.controls();
      });
    },
    controls() {
      API.controls({
        usertoken: bridge.search('usertoken'),
      }).then((res) => {
        if (res.control === '1') {
          this.buy = false;
        } else {
          this.buy = true;
        }
      });
    },
    // 如果走了这个方法 说明已登录
    filterStatus(usertoken = this.usertoken) {
      API.userStatus({
        usertoken,
        courseid,
        action: 'freecollectstatus',
      }).then((result) => {
        console.log(result, 'filterrrrr');
        if (+result.code) {
          Toast(result.message || 'freecollectstatus 接口信息错误~ ');
          return;
        }
        if (+result.status === 1) { // 已领取过dk
          this.goQuantDK(result.message);
        } else {
          this.userType = +result.status;
          this.phoneNum = result.mobile;
          this.isThirdUser = +result.isthreeuser === 1;
          this.showmessage = result.showmessage;
          this.telNum = result.tel;
          this.alertMsg = result.alertcontent;
          this.isInput = result.mobile.length === 0;
        }
      }).catch((err) => {
        Toast(err || '网络错误~');
      });
    },
    payCallBack() {
      if (NGW.qvendor.android) {
        window.coursePaymentCallBack = () => {
          bridge.closePage();
        };
      }
    },
    shareInit() {
      wxShare.init({
        tit: pageInit.title,
        cont: pageInit.content,
        lik: pageInit.url,
        imgsrc: '',
        flag: true,
      });
      this.usertoken = sessionStorage.getItem('usertoken') || bridge.search('usertoken') || '';
      if (!this.buy) {
        NGW.init();
        if (this.usertoken) this.filterStatus();
      }
    },
    toDownload() {
      console.log('dawnload');
      NGW.comDown();
    },
    scrollView() {
      const vlh = this.$refs.clienView.clientHeight;
      const slt = this.$refs.scrollView.scrollTop;
      this.isGoBtn = slt > vlh;
    },
    telPhone(tel) {
      bridge.telPhone(tel);
    },
    toBuy() {
      if (this.isShare) {
        if (this.usertoken) {
          location.href = `${location.origin}/public/pay/index.html?courseid=${courseid}&usertoken=${this.usertoken}`;
        } else {
          this.loginShow = true;
        }
      } else {
        bridge.toCoursePayment(courseid, '');
      }
    },
    scrollTopView() {
      if (this.userType > 1) {
        this.toBuy();
        return;
      }
      const nlh = this.$refs.navView.clientHeight * 0.3;
      const svw = this.$refs.scrollView;
      const tlh = svw.scrollTop - nlh;
      clearTimeout(this.timer);
      this.timer = setTimeout(function animation() {
        if (svw.scrollTop - tlh > 0) {
          setTimeout(() => {
            svw.scrollTop -= 10;
            if ((svw.scrollTop - tlh) < 10) {
              svw.scrollTop = nlh;
            }
            animation();
          }, 1);
        }
      }, 1);
    },
    getVerifyCode() {
      if (!/^1\d{10}$/.test(this.phoneNum)) {
        Toast('请输入正确格式的手机号');
        return;
      }
      const smsType = this.usertoken ? 30 : 29;
      API.getCode({
        mobile: this.phoneNum,
        smsType,
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
    checkInput() {
      if (!this.userSex) {
        Toast('请选择性别');
        return;
      }
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
    checkName() {
      if (this.userName) {
        if (!/^[\u4e00-\u9fa5]{1,6}$/.test(this.userName)) {
          Toast('姓名仅可填写1-6个汉字');
        }
      }
    },
    submitFree() {
      if (this.isThirdUser) {
        if (!this.checkInput()) return;
      }

      const sex = this.userSex === '先生' ? 1 : 2;
      // （app内\app外）已登录
      if (this.usertoken) {
        console.log(this.usertoken, 'usertoken');
        this.postGetFree();
      } else if (this.isShare) {
        console.log('shareeee');
        API.getPhone({
          mobile: this.phoneNum,
          code: this.verifyCode,
        }).then((res) => {
          if (!+res.code) {
            this.usertoken = res.userInfo.userToken;
            this.postGetFree();
          } else {
            Toast(res.message);
          }
        }).catch((err) => {
          Toast(err || '网络错误~');
        });
      } else {
        console.log('mobileLoginnnnnn');
        // （app内）没有登录 领取了Dk
        bridge.mobileLogin(this.phoneNum, this.verifyCode, this.userName, this.fromType, sex);
      }
    },
    // 领取试用
    postGetFree() {
      const data = {
        courseid,
        usertoken: this.usertoken,
        action: this.isShare ? 'sharecollect' : 'freecollect', // app内=freecollect app外=sharecollect
        verify: this.usertoken && !this.isThirdUser ? '0' : '1',
        mobile: this.phoneNum,
        code: this.verifyCode,
        nickname: this.name,
        fromtype: this.fromType,
        sex: this.sex,
      };
      API.userStatus(data).then((res) => {
        if (+res.code) { // code: -1 领取失败
          if (this.isShare) {
            console.log("dialogAlert");
            this.dialogAlert(res.message);
          } else {
            console.log("filterStatus");
            this.filterStatus();
          }
        } else { // code 领取成功
          this.userType = 1;
          if (this.isShare) {
            console.log('-rescode dialogAlert');
            this.dialogAlert(res.message);
          } else {
            console.log('-rescode popupShow呜呜呜');
            this.popupShow = true;
          }
        }
        Toast(res.message);
      }).catch((err) => {
        Toast(err || '网络错误~');
      });
    },
    dialogAlert(message) {
      Dialog.alert({
        message,
        confirmButtonText: '去下载牛股王',
        confirmButtonColor: '#EB4757',
      }).then(() => {
        this.toDownload();
      });
    },
    goQuantDK(message) {
      console.log('goquantdk');
      if (this.isShare) {
        this.dialogAlert(message);
      } else {
        bridge.goQuantDK();
        bridge.closePage();
      }
    },
    onSelect(item) {
      // 点击选项时默认不会关闭菜单，可以手动关闭
      this.selectShow = false;
      this.userSex = item.name;
    },
  },
});
