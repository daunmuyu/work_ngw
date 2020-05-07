import Vue from 'vue';
import Router from 'vue-router';

import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style

import Login from '../views/Login.vue';
import Home from '../views/Home.vue';
// import HomeIndex from '../views/Home/index.vue';
// import HomeMsg from '../views/Home/message.vue';
// import HomeMage from '../views/Home/manage.vue';

Vue.use(Router);

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '*',
      name: 'home',
      component: Home,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/',
      name: 'home',
      component: Home,
      // redirect: 'home/index',
      // children: [
      //   {
      //     path: 'index',
      //     name: 'index',
      //     component: HomeIndex,
      //   },
      //   {
      //     path: 'message',
      //     name: 'message',
      //     component: HomeMsg,
      //   },
      //   {
      //     path: 'manage',
      //     name: 'manage',
      //     component: HomeMage,
      //   },
      // ],
    },
  ],
});

const whiteList = ['login', 'auth-redirect']; // 免登陆白名单
// 有登录状态  进一步判断路由权限
const authTrue = (to, from, next) => {
  if (to.name === 'login') {
    next({ name: 'home' });
  } else {
    next();
  }
};

// 无登录状态 跳转至登录页面
const authFalse = (to, from, next) => {
  if (whiteList.indexOf(to.name) > -1) {
    next();
  } else {
    next({ name: 'login' });
  }
};

router.beforeEach((to, from, next) => {
  NProgress.start(); // start progress bar
  if (Vue.ls.get('IM-TOKEN')) {
    authTrue(to, from, next);
  } else {
    authFalse(to, from, next);
  }
});

router.afterEach(() => {
  NProgress.done(); // finish progress bar
});

export default router;
