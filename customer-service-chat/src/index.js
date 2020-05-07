import Vue from 'vue';
import VueContextMenu from '@xunlei/vue-context-menu';
// import VueContextMenu from 'vue-contextmenu';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

// import VueLazyLoad from 'vue-lazyload';
/* LocalStorage 本地储存 */
import Storage from 'vue-ls';
import Viewer from 'v-viewer';
import 'viewerjs/dist/viewer.css';
import router from './router/index';
import store from './store/index';
import tools from './service/tools';

import './index.scss';

Vue.config.productionTip = false;
Vue.use(VueContextMenu);
Vue.use(ElementUI);
Vue.use(Storage, {
  namespace: 'vuejs__', // 前缀
  name: 'ls', // 属性调用别名 Vue.[ls] or this.[$ls],
  storage: 'local', // 存储模式 (session, local, memory)
});
// Vue.use(Viewer) 默认配置写法
Vue.use(Viewer, {
  defaultOptions: {
    zIndex: 9999,
  },
});
Vue.prototype.$bus = new Vue();

new Vue({
  router,
  store,
  data() {
    return {
      sipObj: null,
    };
  },
  beforeCreate() {
    // 如果浏览器非IE10,Chrome, FireFox, Safari, Opera的话，显示提示
    const browser = tools.getBrowser();
    const temp = browser.split('<=>');
    const appname = temp[0];
    const version = temp[1];
    if (['msie', 'firefox', 'opera', 'safari', 'chrome'].includes(appname)) {
      if (appname === 'msie' && version < 10) {
        this.$message({
          message: '为了更好地体验，建议您使用IE10、Chrome、FireFox、Safari、360等主流浏览器。',
          type: 'warning',
        });
      }
    } else {
      this.$message({
        message: '为了更好地体验，建议您使用IE10、Chrome、FireFox、Safari、360等主流浏览器。',
        type: 'warning',
      });
    }
  },
}).$mount('#app');
