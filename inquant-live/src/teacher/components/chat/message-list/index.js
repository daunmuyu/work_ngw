import Vue from 'vue';
import {
  format,
} from 'lib/date.js';
import template from './index.html';
import './style.scss';

import yk from '../../../../images/yk_flag.png';
import zhuli from '../../../../images/t_helper.png';
import teacher from '../../../../images/teacher.png';
import defaultImg from '../../../../images/default.png';
import gaoshou from '../../../../images/master_hand.png';

export default Vue.extend({
  template,
  props: {
    list: {
      type: Array,
    },
    jinyanList: {
      default: [],
      type: Array,
    },
  },
  data() {
    return {
      actItemId: undefined,
      defaultImg,
      messageCheck: [],
    };
  },
  mounted() {
    this.scrollCalc();
  },
  watch: {
    list(nList, oList) {
      let msgList = this.$refs.msgList;
      if (msgList.scrollTop < 5) {
        this.$nextTick(() => {
          msgList = this.$refs.msgList;
          this.newHeight = msgList.scrollHeight;
          this.scrollToPage(msgList, this.newHeight - this.oldHeight)
        })
      }
      if (msgList.scrollHeight - msgList.offsetHeight - msgList.scrollTop < 50) {
        this.$nextTick(() => {
          console.log('change')
          const scrollBottom = msgList.scrollHeight - msgList.offsetHeight;
          if (msgList.scrollTo) { // 低版本浏览器不兼容scrollto方法，用scrollTop的赋值替代
            msgList.scrollTo(0, scrollBottom);
          } else {
            msgList.scrollTop = scrollBottom;
          }
        });
      }
    }
  },
  methods: {
    getUserIcon(roleId) {
      if (roleId === 2) {
        return zhuli;
      }
      if (roleId === 3) {
        return teacher;
      }
      if (roleId === 4) {
        return gaoshou;
      }
      return '';
    },
    scrollCalc() {
      const msgList = this.$refs.msgList;
      const _this = this;
      // console.log('scrollteacher')
      msgList.addEventListener('scroll', function test() {
        if (_this.timer) {
          clearTimeout(_this.timer);
        }
        const scrollTop = this.scrollTop;
        _this.timer = setTimeout(() => {
          if (scrollTop < 5) {
            _this.oldHeight = msgList.scrollHeight;
            _this.$emit('moreList');
          }
        }, 500);
      }, false)
    },
    scrollToPage(el, val) {
      if (el.scrollTo) { // 低版本浏览器不兼容scrollto方法，用scrollTop的赋值替代
        el.scrollTo(0, val);
        console.log(val)
      } else {
        el.scrollTop = val;
      }
    },
    getMsgContent(msgItem) {
      const content = this.replaceEmoji(msgItem.attach.replace(/\n/g, '<br/>'));
      return content;
    },
    getReplyContent(msgItem) {
      const repMsg = this.replaceEmoji(msgItem.attach.replace(/\n/g, '<br/>'));
      const sourceMsg = this.replaceEmoji(msgItem.ext.other.content.replace(/\n/g, '<br/>'));
      return `@${msgItem.ext.other.to}：${repMsg}<hr class="hl" />${msgItem.ext.other.to}：${sourceMsg}`;
    },
    replaceEmoji(content) {
      return content.replace(/\[([0-9a-f]{4,5})\]/g, (match, group) => {
        // if (!/^\d+$/g.test(group) && group.length < 6) {
        if (group.length < 6) {
          return `<img class="emoji" style="width:30px;height:30px;" src="https://i0.niuguwang.com/emoji/emoji_${group}.png">`;
        }
        return match;
      });
    },
    deleteMsg(msg) {
      this.$emit('delMsg', msg);
    },
    jinyan(msg) {
      this.$emit('jinyan', msg);
    },
    check(msg, isFlag, index) {
      // console.log(this.messageCheck, msg.msgId)
      if (isFlag) msg.flag = 1;
      this.$emit('checkMsg', msg);
    },
    reply(msgItem) {
      console.log(777, msgItem);
      this.$emit('setReply', msgItem);
    },
    timeformat(dt) {
      return format(dt, 'yyyy/MM/dd hh:mm:ss');
    },
    changeCheck(val, num) {
      console.log(val, num)
      this.messageCheck.push(val);
    }
  },
});
