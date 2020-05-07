import Vue from 'vue';
import {
  DatePicker,
  Button,
  Select,
  Option,
  Pagination,
  Message,
  MessageBox,
} from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Input from '@/components/Input';
import { SweetModal } from 'sweet-modal-vue';
import {
  addidcard,
  paymentmethod,
  // getwalletbank,
  getUserIndex,
  getuserbalance,
  addbank,
  unbindbank,
  getavail,
  walletrquest,
  querymoneyflow,
} from 'API';
import EventName from 'EventName';
import Cookies from 'js-cookie';
import {
  Base64,
} from 'js-base64';

Vue.use(Button);
Vue.use(Select);
Vue.use(Option);
Vue.use(Pagination);
Vue.use(DatePicker);
Vue.prototype.$message = Message;
Vue.prototype.$alert = MessageBox.alert;

require('./personalcenter.scss');
const template = require('./personalcenter.html');

export default Vue.extend({
  metaInfo() {
    return {
      title: '个人中心',
      meta: [{                 // set meta
        name: 'keywords',
        content: '个人中心 入金',
      }],
    };
  },
  template,
  components: { Top: Header, Bottom: Footer, SweetModal, cusInput: Input },
  data() {
    return {
      leaveNum: '',
      usertoken: '',
      userInfo: undefined,
      tabShow: 1,
      amount: '',
      canusedamount: '',
      renzheng: {
        name: '',
        idcard: '',
        canSubmit: false,
      },
      payment: {},
      bankInfo: {
        bankstatus: '0',
      },
      bangDing: {
        name: '',
        idcard: '',
        canSubmit: false,
      },
      draw: {
        title: '添加提现银行卡',
        content: '添加绑定提现银行卡，请先进行实名认证',
        btnTxt: '认证',
      },
      selectOptions: [{
        value: '0',
        label: '全部',
      }, {
        value: '1',
        label: '充值',
      }, {
        value: '2',
        label: '提现',
      }, {
        value: '3',
        label: '开仓',
      }, {
        value: '4',
        label: '结算',
      }],
      value: '0',
      dataValue: '',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        },
      },
      moneyData: [],
      pageNum: 1,
      pageCount: 1,
      recordcount: 0,
      loading: true,
    };
  },
  computed: {
    phone() {
      if (typeof this.userInfo !== 'undefined') {
        const mobile = Base64.decode(this.userInfo.mobile);
        return `${mobile.slice(0, 3)}****${mobile.slice(-4)}`;
      }
      return '';
    },
  },
  mounted() {
    this.usertoken = Cookies.getJSON('userToken');
    this.userInfo = Cookies.getJSON('userInfo');
    console.log(this.userInfo);
    if (this.userInfo && this.usertoken) {
      console.log(5555, this.$route);
      if (typeof this.$route.params.type !== 'undefined') {
        this.tabShow = +this.$route.params.type;
        console.log(9999, this.tabShow);
      }
      this.getPayMethod();
      this.getUserAccount();
    } else {
      // window.location.href = './index.html';
      // window.location.href = '/';
      // this.$router.push('/login');
      this.$root.eventBus.$on('login-success', () => {
        window.location.reload();
      });
      this.$nextTick(() => {
        this.$root.eventBus.$emit(EventName.noticeLogin);
      });
    }
    // this.querymoneyflow();
  },
  methods: {
    getUserAccount() {
      const currenttype = 'CNY';
      getavail({
        usertoken: this.usertoken,
        currenttype,
      }).then((res) => {
        console.log('walletbank', res);
        if (res.status === '1') {
          this.bankInfo = res;
        }
      });
      getuserbalance({
        usertoken: this.usertoken,
      }).then((res) => {
        console.log(res);
        if (res.status === '1') {
          this.canusedamount = res.data.canusedamount;
        }
      });
    },
    modifyPass() {
      this.$root.eventBus.$emit(EventName.noticeModifyPass);
    },
    querymoneyflow() {
      querymoneyflow({
        usertoken: this.usertoken,
        optype: this.value,
        page: this.pageNum,
        pagesize: 20,
      }).then((res) => {
        // this.pageCount = res
        this.moneyData = this.moneyData.concat(res.data.list);
        this.recordcount = res.recordcount;
        this.loading = (res.data.list.length >= 20);
        console.log(this.loading, res);
      });
    },
    queryRange() {
      // console.log(this.value);
      this.pageNum = 1;
      this.moneyData = [];
      this.querymoneyflow();
    },
    currentChange(val) {
      this.pageNum = val;
      this.querymoneyflow();
    },
    getPayMethod() {
      paymentmethod({ os: 'pc' }).then((res) => {
        if (res.status === '1') {
          this.payment = res.data[0];
          console.log('this.payment', this.payment);
        } else {
          console.error('获取支付地址失败:', res);
        }
      });
    },
    doAddBankCard() {
      const banktypename = this.bangDing.name;
      const bankaccount = this.bangDing.idcard;
      const usertoken = Cookies.getJSON('userToken');
      addbank({
        banktypename,
        bankaccount,
        usertoken,
      }).then((res) => {
        if (res.status === '1') {
          this.$root.toast('success', '添加成功');
          // 更新状态
          this.getUserAccount();
          // 关闭认证窗口
          this.$refs.bangDingModal.close();
        } else {
          // this.$root.toast('error', res.info);
          this.$message({
            message: res.info || '身份信息有误',
            type: 'info',
          });
        }
      });
    },
    addDelete() {
      if (this.draw.btnTxt === '确定') {
        const walletbankid = this.bankInfo.walletbankid;
        const usertoken = Cookies.getJSON('userToken');
        unbindbank({
          walletbankid,
          usertoken,
        }).then((res) => {
          if (res.status === '1') {
            this.getUserAccount();
            this.$root.toast('success', '解绑成功');
          } else {
            this.$root.toast('error', res.info);
          }
        });
      } else {
        this.doRenZheng();
      }
      this.addDeleteClose();
    },
    addDeleteClose() {
      this.$refs.addDeleteModal.close();
    },
    doBangDing() {
      if (this.bankInfo.idauthentication === 1) {
        if (this.bankInfo.bankstatus === 1) {
          this.draw.title = '解除绑定';
          this.draw.content = '解除绑定的银行卡？';
          this.draw.btnTxt = '确定';
          this.$refs.addDeleteModal.open();
        } else {
          this.$refs.bangDingModal.open();
        }
      } else {
        this.$refs.addDeleteModal.open();
      }
    },
    bangDingClose() {
      this.$refs.bangDingModal.close();
    },
    doPayment() {
      const reg = /^\d+\.?\d{0,2}$/;
      if (!reg.test(this.amount)) {
        this.$root.toast('error', '输入金额有误,只能输入两位小数或整数');
        return;
      }
      if (this.amount === '') {
        this.$root.toast('error', '请输入金额');
      } else if (this.bankInfo.idauthentication !== 1) {
        // this.$root.toast('error', '请先实名认证');
        const seft = this;
        this.$alert('充值入金，请先实名认证', {
          confirmButtonText: '认证',
          callback: () => {
            seft.doRenZheng();
          },
        });
      } else {
        const payid = this.payment.payid;
        const usertoken = Cookies.getJSON('userToken');
        const amount = this.amount;
        const os = 'pc';
        const url = `${this.payment
          .h5payurl}?packtype=338&proxyid=237&version=1.0.0&payid=${payid}&usertoken=${usertoken}&amount=${amount}&os=${os}`;
        window.open(url);
      }
    },
    doAddIdCard() {
      const name = this.renzheng.name;
      const idcard = this.renzheng.idcard;
      const usertoken = Cookies.getJSON('userToken');
      addidcard({
        name,
        idcard,
        usertoken,
      }).then((res) => {
        console.log('res', res);
        // 添加成功,弹出成功modal
        if (res.status === '1') {
          this.$root.toast('success', '认证成功');
          // 更新状态
          this.bankInfo.idauthentication = 1;
          getUserIndex({ userToken: Cookies.getJSON('userToken') }).then((innerRes) => {
            if (innerRes.result === 1 && innerRes.code === 0) {
              Cookies.set('userInfo', innerRes.userInfo, { expires: 7 });
            }
          });
          // 关闭认证窗口
          this.$refs.renzhengModal.close();
        } else {
          // this.$root.toast('error', res.info);
          this.$message({
            message: res.info || '身份信息有误',
            type: 'info',
          });
        }
      });
    },
    renzhengClose() {
      this.$refs.renzhengModal.close();
    },
    doRenZheng() {
      this.$refs.renzhengModal.open();
    },
    tabclick(value) {
      // const target = e.target;
      // [].forEach.call(target.parentNode.children, (item) => {
      //   item.classList.remove('active');
      // });
      // target.classList.add('active');
      if (value === 1) {
        this.tabShow = 1;
      } else if (value === 2) {
        this.tabShow = 2;
      } else if (value === 3) {
        this.tabShow = 3;
      } else if (value === 4) {
        this.tabShow = 4;
        this.querymoneyflow();
      }
    },
    leaveAll() {
      this.leaveNum = this.bankInfo.amount;
    },
    walletrquest() {
      const usertoken = Cookies.getJSON('userToken');
      const walletbankid = this.bankInfo.walletbankid;
      const amount = this.leaveNum;
      if (this.leaveNum >= 10) {
        walletrquest({
          usertoken,
          walletbankid,
          amount,
        }).then((res) => {
          if (res.status === '1') {
            this.$root.toast('success', '提现成功');
            this.$refs.renzhengModal.close();
            this.leaveNum = '';
            this.getUserAccount();
          } else {
            this.$root.toast('error', res.info);
          }
        });
      } else {
        this.$root.toast('error', '提现金额不能小于10元或为空');
      }
    },
    className(num) {
      if (num > 0) return 'fontred';
      if (num < 0) return 'fontgreen';
      return '';
    },
  },
  watch: {
    amount: {
      // const reg = /^\d*\.(\d{2})$/gi;
    },
    renzheng: {
      handler(val) {
        if (val.name.trim() !== '' && val.idcard.trim() !== '') {
          this.renzheng.canSubmit = true;
        }
      },
      deep: true,
    },
    bangDing: {
      handler(val) {
        if (val.name.trim() !== '' && val.idcard.trim() !== '') {
          this.bangDing.canSubmit = true;
        }
      },
      deep: true,
    },
  },
  tabShow(n) {
    console.log(12121, n);
  },
});
