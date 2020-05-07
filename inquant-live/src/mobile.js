import Vue from 'vue';
import search from 'lib/urlSearch.js';
import {
  getLiveList,
  checkPulic,
  statistics,
} from './live/api';
import App from './mobile/app';
import './mobile.scss';

const livetoken = search('livetoken') || '';
const roomid = search('roomid');
const sid = search('sid');
const type = search('endTime'); // 是否时效链接
// 用户统计
if (typeof sid !== 'undefined') {
  statistics({
    sid,
    type: type ? 1 : 0,
  });
  console.log(statistics)
}

new Vue({
  data() {
    return {
      roomid,
      livetoken,
      isPublic: true,
      temName: '',
      liveInfo: {
        roomid: '',
        title: '',
        description: '',
      },
    };
  },
  render(h) {
    return h(App, {
      props: {
        liveInfo: this.liveInfo,
      },
      on: {
        initTemName: (temName) => {
          this.temName = temName;
        },
      }
    });
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      getLiveList({
        livetoken: this.$root.livetoken,
      }).then((res) => {
        if (res.code === 0 && res.data.length > 0) {
          this.roomid = res.data[0].roomId;
          this.liveInfo = {
            roomid: res.data[0].roomId,
            title: res.data[0].Title,
            description: res.data[0].Description,
          };
        }
      });
    }
  }
}).$mount('#app');
