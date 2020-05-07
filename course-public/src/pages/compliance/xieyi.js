
import 'babel-polyfill';
import Vue from 'vue';
// import VConsole from 'vconsole';
import SignaturePad from 'signature_pad';
import bridge from 'ng-bridge';
import 'muse-ui/lib/styles/base.less';
import { Button, Drawer, Checkbox, List, Snackbar, Icon } from 'muse-ui';
import Toast from 'muse-ui-toast';
import 'muse-ui/lib/styles/theme.less';
import Tips from './common/tips.vue';
import { riskProtocol, denver } from './api/api';
import './style.scss';

Vue.use(Button);
Vue.use(Drawer);
Vue.use(List);
Vue.use(Checkbox);
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
      docked: false,
      open: false,
      position: 'left',
      isMe: false,
      isRead: false,
      signaturePad: null,
      isEmpty: true,
      base64Img: '',
      agreementtext: '',
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
      // const vConsole = new VConsole();
      // vConsole.setOption({ maxLogNumber: 5000 });
      console.log(location.href);
      this.initSignaturePad();
      if (typeof window.orientation === 'number' && typeof window.onorientationchange === 'object') {
        window.addEventListener('orientationchange', () => {
          window.setTimeout(this.resizeCanvas, 300);
          window.setTimeout(this.resizeExampleImg, 300);
        }, false);
      } else {
        window.addEventListener('resize', () => {
          window.setTimeout(this.resizeCanvas, 300);
          window.setTimeout(this.resizeExampleImg, 300);
        }, false);
      }
      setTimeout(() => {
        this.resizeCanvas();
      }, 500);
      this.denverInit();
    },
    denverInit() {
      denver({
        usertoken,
        courseid,
      }).then(res => {
        this.agreementtext = res.newagreementtext.replace(
          /(《.+?》)/g,
          (match, p1, p2) => {
            if (p2 < 7) return `<a href="${res.hdurl}">${match}</a>`;
            if (p2 < 22) return `<a href="${res.riskurl}">${match}</a>`;
            if (p2 > 25) return `<a href="${res.specialriskurl}">${match}</a>`;
          }
        );
      });
    },
    initSignaturePad() {
      this.canvas = document.getElementById('signature-pad');
      this.signaturePad = new SignaturePad(this.canvas, {
        backgroundColor: 'transparent',
        onBegin: () => {
          this.isEmpty = false;
        }
      });
    },
    resizeExampleImg() {
      const el = document.getElementsByClassName('exampleImg')[0];
      if (el.style.top === '-3.5rem') {
        el.style.top = '-1.86667rem';
        el.style.left = '4.48rem';
      } else {
        el.style.top = '-3.2rem';
        el.style.left = '4rem';
      }
    },
    resizeCanvas() {
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      this.canvas.width = this.canvas.offsetWidth * ratio;
      this.canvas.height = this.canvas.offsetHeight * ratio;
      const context = this.canvas.getContext('2d');
      context.scale(ratio, ratio);
      if (window.orientation === 0) {
        context.translate(0, this.canvas.offsetHeight);
        context.rotate((-90 * Math.PI) / 180);
      }
    },
    clearCanvas() {
      this.resizeCanvas();
      this.base64Img = '';
      this.signaturePad.clear();
      this.isEmpty = true;
    },
    // 保存签名
    saveSignature() {
      if (this.signaturePad.isEmpty()) {
        Toast.error('请您签写您的手写签名');
      } else {
        this.open = false;
        this.isEmpty = false;
        this.base64Img = this.signaturePad.toDataURL();
      }
    },
    riskProtocol() {
      riskProtocol({
        usertoken,
        courseid,
        riskProfile: 1,
        riskComfirm: 1,
        imgData: this.signaturePad.toDataURL(),
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
    },
    submit() {
      if (this.isMe && this.isRead) {
        if (this.signaturePad.isEmpty()) {
          Toast.error('请您签写您的手写签名');
        } else {
          this.riskProtocol();
        }
      } else {
        Toast.error('请您勾选确认协议');
      }
    },
  }
});
