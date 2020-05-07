import Vue from 'vue';
import VueRouter from 'vue-router';
import jsCookie from 'js-cookie';
import iView, {
  Message
} from 'iview';
import 'iview/dist/styles/iview.css';
import Lightbox from 'vue-lightbox';
import search from 'lib/urlSearch.js';
import App from './teacher/app';
import Login from './teacher/login';
import './teacher.scss';
import routes from './teacher/router';
import Blob from './teacher/excel/Blob'
import Export2Excel from './teacher/excel/expor2Excal'

// eslint-disable-next-line import/first

Vue.component('Lightbox', Lightbox);
Vue.prototype.$Message = Message;

let livetoken = jsCookie.get('t-livetoken');
let loginInfo = jsCookie.getJSON('t-userinfo');

window.Bus = new Vue();

Vue.use(iView);
Vue.use(VueRouter)
const router = new VueRouter({
  routes
});

console.log(router)
router.beforeEach((to, from, next) => {
  console.log(to)
  if (to.name !== 'Login' && !livetoken && !loginInfo) {
    next('login')
  } else if (to.name === 'LiveData' && +to.params.roomid !== 10517689) {
    Message.error('暂时没有访问该页面权限');
    next('/home/0')
  } else {
    next();
  }
});

new Vue({
  components: {
    App,
    Login,
  },
  data() {
    return {
      roomid: '',
      livetoken,
      loginInfo,
    };
  },
  router,
  mounted() {
    this.init();
  },
  render(h) {
    return h('router-view');
  },
  methods: {
    setUserInfo(userInfo) {
      this.livetoken = userInfo.livetoken;
      livetoken = userInfo.livetoken;
      this.loginInfo = userInfo;
      loginInfo = userInfo;
      jsCookie.set('t-livetoken', userInfo.livetoken);
      jsCookie.set('t-userinfo', userInfo);
    },
    init() {
      window.Bus.$on('roomSelected', (roomid, callBack) => {
        this.roomid = roomid;
        // if (callBack) callBack();
        console.log(roomid)
        this.$router.push(`/home/${roomid}`)
      });
      window.Bus.$on('login', ({
        data,
        callBack
      }) => {
        this.setUserInfo(data);
        if (callBack) callBack();
      });
      window.Bus.$on('logout', (callBack) => {
        jsCookie.remove('t-userinfo');
        jsCookie.remove('t-livetoken');
        this.livetoken = undefined;
        livetoken = undefined;
        this.loginInfo = undefined;
        loginInfo = undefined;
        if (callBack) callBack();
      });
    },
  },
}).$mount('#app');
