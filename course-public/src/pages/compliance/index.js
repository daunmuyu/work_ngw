
import 'babel-polyfill';
import Vue from 'vue';
import bridge from 'ng-bridge';
import 'muse-ui/lib/styles/base.less';
import { Button, Form, TextField, Snackbar, Icon } from 'muse-ui';
import Toast from 'muse-ui-toast';
import 'muse-ui/lib/styles/theme.less';
import { addUserInfo } from './api/api';

import Tips from './common/tips.vue';

import './style.scss';

Vue.use(Button);
Vue.use(Form);
Vue.use(TextField);
Vue.use(Snackbar);
Vue.use(Toast, {
  position: 'top',
  closeIcon: 'close',
  close: false,
  successIcon: '', // 成功信息图标
  infoIcon: '', // 信息信息图标
  warningIcon: '', // 提醒信息图标
  errorIcon: '' // 错误信息图标
});
Vue.use(Icon);


const courseid = bridge.search('courseid') || bridge.search('cid');
const usertoken = bridge.search('usertoken') || bridge.search('userToken');

new Vue({
  el: '#app',
  data() {
    return {
      usernameRules: [
        { validate: (val) => !!val, message: '必须填写用户名' },
        { validate: (val) => val.length >= 2, message: '用户名长度大于2' },
      ],
      cordcodeRules: [
        { validate: (val) => !!val, message: '必须填写身份证' },
        { validate: (val) => /(^\d{15}$)|(^\d{17}([0-9]|X))$/.test(val), message: '请填写正确身份证号码' },
      ],
      telcodeRules: [
        { validate: (val) => !!val, message: '必须填写手机号码' },
        { validate: (val) => /^1\d{10}$/.test(val), message: '请填入正确11位手机号' },
      ],
      validateForm: {
        username: '',
        cordcode: '',
        telcode: ''
      },
      hideShow: 'blcok',
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
      bridge.setTitle('身份信息认证');
      document.body.style.display = 'block';
    },
    submit() {
      this.$refs.form.validate().then((result) => {
        if (result) {
          this.addUserInfo();
        } else {
          Toast.error('请完善您的信息');
        }
      });
    },
    addUserInfo() {
      addUserInfo({
        usertoken,
        courseid,
        idcode: this.validateForm.cordcode,
        realname: this.validateForm.username,
        mobile: this.validateForm.telcode,
      }).then(res => {
        if (+res.code === 0 && +res.result === 1) {
          Toast.info(res.message);
          setTimeout(() => {
            if (bridge.search('packtype')) {
              bridge.closePage();
            } else {
              window.history.back();
            }
          }, 1500);
        } else {
          Toast.error(res.message);
        }
      });
    }
  }
});
