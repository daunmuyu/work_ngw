import Vue from 'vue';
import VueRouter from 'vue-router';
import cookie from 'js-cookie';
import iView from 'iview';
import 'iview/dist/styles/iview.css';

import routes from './manage/routes';
import store from './manage/store/';
import './manage.scss';

Vue.use(VueRouter);
Vue.use(iView);

// 开启debug模式
// Vue.config.debug = true;

const router = new VueRouter({
  routes
});

router.beforeEach((to, from, next) => {
  if (
    to.name !== 'login' &&
    (!store.state.app.userInfo || !store.state.app.userInfo.userToken)
  ) {
    const cookieData = cookie.get('m-userinfo');
    if (typeof cookieData !== 'undefined') {
      const userInfo = JSON.parse(cookieData);
      if (userInfo && userInfo.userToken) {
        store.commit('SET_USER_INFO', userInfo);
        next();
      } else {
        next('login');
      }
    } else {
      next('login');
    }
  } else {
    next();
  }
});

new Vue({
  router,
  store,
  data() {
    return {
      roomid: 1
    };
  },
  render(h) {
    this.roomid = cookie.getJSON('roomid') || 1;
    cookie.set('roomid', this.roomid);
    store.state.roomid = this.roomid;
    return h('router-view');
  }
}).$mount('#app');
