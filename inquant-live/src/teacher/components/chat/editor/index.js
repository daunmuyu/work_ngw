import Vue from 'vue';
import {
  emojiToImg,
  formatMsg,
} from 'lib/emojiHelper.js';
import EmojiPanel from '../emoji';
import template from './index.html';
import './style.scss';

export default Vue.extend({
  props: {
    placeholder: {
      type: String,
      default: '来跟大神聊聊天',
    },
  },
  template,
  components: {
    EmojiPanel,
  },
  data() {
    return {
      actionUrl: '//live.inquant.cn/chatroom/chartroom/sendmsg',
      showEmoji: false,
      curMsg: '',
      isPowerView: false
    };
  },
  mounted() {
    console.log(this.$refs.msgEditor.focus());
    const inputEle = this.$refs.msgEditor;
  },
  methods: {
    clearScreen() {
      console.log('清屏');
      this.$emit('clearMsgList');
    },
    set_focus(el) { // 光标移动到最后的方法
      el.focus();
      const range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      // if($.support.msie) // IE的跳转到最后的方法
      // {
      //     var range = document.selection.createRange();
      //     this.last = range;
      //     range.moveToElementText(el);
      //     range.select();
      //     document.selection.empty(); //取消选中
      // }
    },
    newLine(e) {
      if (e.ctrlKey && +e.keyCode === 13) {
        this.$refs.msgEditor.innerHTML = `${this.$refs.msgEditor.innerHTML}<br/><br/>`
        this.set_focus(this.$refs.msgEditor);
      } else if (+e.keyCode === 13) {
        this.sendMsg(e);
      }
    },
    sendMsg(e) {
      e.preventDefault();
      // const evt = e || window.event;
      // if (!evt.shiftKey) {
      const msgContent = formatMsg(this.$refs.msgEditor.innerHTML);
      if (msgContent.length > 0) {
        this.$refs.msgEditor.innerHTML = '';
        console.log(this.isPowerView)
        this.$emit('sendMessage', msgContent, this.isPowerView);
      } else {
        this.$refs.msgEditor.focus();
      }
      // }
    },
    change() {

    },
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
