import Vue from 'vue';
import VueRouter from 'vue-router';
import 'babel-polyfill';
import iView from 'iview';
import Message from 'iview/src/components/message';
import Modal from 'iview/src/components/modal';
import 'iview/dist/styles/iview.css';
import Lightbox from 'vue-lightbox';
import search from 'lib/urlSearch.js';
// import store from './live/store'
import {
  statistics,
} from './live/api';
import routes from './live/router'
import App from './live/app';
// import LiveList from './live/livelist.vue';
import './index.scss';

Vue.component('Lightbox', Lightbox);
Vue.use(iView);
Vue.use(VueRouter);

Vue.prototype.$Message = Message;
Vue.prototype.$Modal = Modal;

const livetoken = search('livetoken') || '';
const isWeb = search('isWeb') || '';
const usertoken = search('usertoken') || '';
const roomid = search('roomid');
const sid = search('sid');
const type = search('endTime');
const router = new VueRouter({
  routes
})

function IsPC() {
  const userAgentInfo = navigator.userAgent;
  const Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'];
  let flag = true;
  for (let v = 0; v < Agents.length; v += 1) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      flag = false;
      break;
    }
  }
  return flag;
}

if (!IsPC()) {
  window.location.href = `./mobile.html${window.location.search}`;
} else {
  // 用户统计
  if (typeof sid !== 'undefined') {
    statistics({
      sid,
      type: type ? 1 : 0,
    });
  }
  new Vue({
    // store,
    router,
    components: {
      App,
      // LiveList,
    },
    data() {
      return {
        roomid,
        livetoken,
        isPublic: false,
        temName: '', // 游客name
        liveInfo: {},
        userInfo: {
          liveToken: livetoken,
          userToken: usertoken,
        }
      };
    },
    render(h) {
      // store.commit('SET_ROOMID', roomid);
      // console.log(store)
      return h('router-view');
      // if (!this.roomid) {
      //   return h('LiveList', {
      //     on: {
      //       roomSelected: (room) => {
      //         this.roomid = room.roomid;
      //         this.liveInfo = room;
      //       },
      //       isPublic: (isPublic) => {
      //         this.isPublic = isPublic;
      //       },
      //     }
      //   });
      // }
      // return h('App', {
      //   on: {
      //     initTemName: (temName) => {
      //       this.temName = temName;
      //     },
      //   }
      // });
    },
    mounted() {
      this.initStyle();
      // document.getElementById('xixi').style.background = 'red'
      console.log(1)
      console.log(document.getElementById('xixi'))
    },
    methods: {
      initStyle() {
        // document.querySelector('body').style.backgroundColor = isDayMode === 'day' ? '#f7f7f7' : '#141414';
        document.querySelector('body').classList.add(+search('skin') === 1 ? 'day' : 'night')
      },
    }
  }).$mount('#app');
}
