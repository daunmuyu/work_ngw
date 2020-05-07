import Vue from 'vue';
import VueRouter from 'vue-router';
import MetaInfo from 'vue-meta-info';
import Cookies from 'js-cookie';
// import vueSource from 'vue-resource';
import EventName from 'EventName';
import routes from './router/index';
import App from './pages/app.vue';
import './index.scss';

const usertoken = Cookies.get('userToken');
const userinfo = Cookies.get('userInfo');

window.Promise = Promise;

Vue.use(VueRouter);
Vue.use(MetaInfo);
// Vue.use(vueSource);
const router = new VueRouter({
  mode: 'history',
  routes,
});

router.beforeEach((to, from, next) => {
  document.getElementById('app').scrollTop = 0;
  next();
});

const root = new Vue({
  el: '#app',
  router,
  data() {
    return {
      eventBus: this,
      simulate: false,
      usertoken,
      userinfo,
    };
  },
  created() {
    this.$on('changeSimulate', (simulate) => {
      this.simulate = simulate;
    });
  },
  methods: {
    toast(icon, value) {
      this.eventBus.$emit(EventName.noticeToast, { icon, value });
    },
  },
  render(h) {
    return h(App, {
      on: {
        setUsertoken: (val) => {
          this.usertoken = val;
        },
        setUserinfo: (val) => {
          this.userinfo = val;
        },
        logout: () => {
          this.usertoken = undefined;
          this.userinfo = undefined;
        },
      },
    });
  },
  // render(h) {
  //   return h('div', {
  //     attrs: {
  //       id: 'app',
  //     },
  //   }, [
  //     h('router-view'),
  //   ]);
  // },
});

console.log(root);

// // document.addEventListener('DOMContentLoaded', () => {
// //   app.$mount('#index');
// // });

// import Vue from 'vue';
// import VueRouter from 'vue-router';
// import App from './pages/app.vue';

// Vue.use(VueRouter);

// const Home = {
//   template: '<div><h2>Home Page{{count}}</h2></div>',
//   data() {
//     return {
//       count: 0,
//     };
//   },
//   mounted() {
//     setInterval(() => {
//       this.count += 1;
//     }, 1000);
//   },
// };
// const About = {
//   template: '<div><h2>About Page</h2></div>',
// };
// const Contact = {
//   template: '<div><h2>Contact Page</h2></div>',
// };

// const routes = [
//   { path: '/', component: Home },
//   { path: '/about', component: About },
//   { path: '/contact', component: Contact },
// ];

// const router = new VueRouter({
//   routes,
//   mode: 'history',
// });

// const root = new Vue({
//   el: '#app',
//   router,
//   render: h => h(App),
// });

// console.log(root);

