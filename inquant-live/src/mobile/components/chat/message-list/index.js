import Vue from 'vue';
import {
  format,
} from 'lib/date.js';
import {
  Loadmore,
} from 'mint-ui';
// import 
import template from './index.html';
import './style.scss';

import yk from '../../../../images/yk_flag.png';
import zhuli from '../../../../images/t_helper.png';
import teacher from '../../../../images/teacher.png';
import defaultImg from '../../../../images/default.png';
import gaoshou from '../../../../images/master_hand.png';

Vue.component(Loadmore.name, Loadmore);

export default Vue.extend({
  template,
  props: {
    list: {
      type: Array,
    },
  },
  data() {
    return {
      defaultImg,
      fullImage: false,
      fullImageUrl: undefined,
    };
  },
  mounted() {
    console.log(this.$root);
  },
  watch: {
    list(nList, oList) {
      const msgList = this.$refs.msgList;
      if (msgList.scrollHeight - msgList.offsetHeight - msgList.scrollTop < 50) {
        this.$nextTick(() => {
          const scrollBottom = msgList.scrollHeight - msgList.offsetHeight;
          // msgList.scrollTo(0, scrollBottom);
          msgList.scrollTop = scrollBottom;
        });
      }
    }
  },
  methods: {
    loadTop() {
      this.$emit('getList', (val) => {
        console.log(val);
        this.$refs.loadmore.onTopLoaded.call(this); // 加载完成关闭加载的提示
      });
    },
    timeFormat(dt) {
      return format(dt, 'yyyy/MM/dd hh:mm:ss');
    },
    showImg(url) {
      if (url === 0) {
        this.fullImage = false;
        return;
      }
      this.fullImage = true;
      this.fullImageUrl = url.replace('/200', '');
    },
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
    }
  },
});
