import Vue from 'vue';
import { onlineCount } from '../../api';
import template from './index.html';
import './style.scss';


export default Vue.extend({
  template,
  data() {
    return {
      onlineCount: '',
      timeInterval: undefined,
    }
  },
  props: {
    title: {
      required: true,
      type: String,
    },
    content: {
      required: true,
      type: String,
    },
  },
  mounted() {
    console.log(this.$root.roomid)
    // this.init();
    if (this.roomId) this.getOnlintCount();
  },
  computed: {
    roomId() {
      return this.$root.roomid;
    }
  },
  destroyed() {
    clearInterval(this.timeInterval);
  },
  watch: {
    roomId(index, old) {
      if (index && !old) {
        this.getOnlintCount();
      }
    }
  },
  methods: {
    getOnlintCount() { // 获取在线人数
      onlineCount({
        roomIds: this.$root.roomid
      }).then((res) => {
        this.onlineCount = res.data[0].onlineUserCount;
        this.timeInterval = setTimeout(() => {
          this.getOnlintCount();
        }, 60000);
      })
    },
  }
});
