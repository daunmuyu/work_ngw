import Vue from 'vue';
import {
  Button,
} from 'mint-ui';
import {
  emojiToImg,
  formatMsg,
} from 'lib/emojiHelper.js';
import EmojiPanel from '../emoji';
import template from './index.html';
import './style.scss';

Vue.component(Button.name, Button);

export default Vue.extend({
  template,
  components: {
    EmojiPanel,
  },
  data() {
    return {
      actionUrl: '//live.inquant.cn/chatroom/chartroom/sendmsg',
      showEmoji: false,
      curMsg: '',
    };
  },
  methods: {
    clearScreen() {
      console.log('清屏');
      this.$emit('clearMsgList');
    },
    sendMsg(e) {
      e.preventDefault();
      // const evt = e || window.event;
      // if (!evt.shiftKey) {
      const msgContent = formatMsg(this.$refs.msgEditor.innerHTML);
      if (msgContent.length > 0) {
        this.$refs.msgEditor.innerHTML = '';
        this.$emit('sendMessage', msgContent);
      } else {
        this.$refs.msgEditor.focus();
      }
      // }
    },
    // test() {
    //   console.log(8888);
    //   this.$refs.msgEditor.innerHTML += '<br />';
    // },
    showEmojiPanel() {
      this.showEmoji = !this.showEmoji;
    },
    emojiSelected(code) {
      this.showEmoji = false;
      const emojiImg = emojiToImg(code);
      this.$refs.msgEditor.innerHTML += emojiImg;
    },
    upimgclick() {
      console.log('选择图片');
      const oData = new FormData(document.forms.namedItem('form1'));
      // oData.append('action', this.action);
      // oData.append('proxyid', this.proxyid);
      // oData.append('userToken', this.userToken);
      // oData.append('packtype', this.packtype);
      oData.append('livetoken', this.$root.livetoken);
      oData.append('roomid', this.$root.roomid);
      const oReq = new XMLHttpRequest();
      oReq.open('POST', this.actionUrl, true);
      oReq.onload = () => {
        // this.loading = false;
        if (oReq.status === 200) {
          console.log(123, oReq.response);
          const res = JSON.parse(oReq.response);
          if (res.code === 0) {
            console.log('发送图片成功');
          }
        } else {
          // Toast('网络异常');
          console.log('网络异常');
        }
      };
      // this.loading = true;
      oReq.send(oData);
    },
  }
});
