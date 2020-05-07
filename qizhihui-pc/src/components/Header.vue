<template>
  <div id="header" ref="top" :class="{'color-header': path === 'trade'}">
    <sweet-modal ref="toast" :icon="toast.icon" class="toast-modal">
      {{toast.value}}
    </sweet-modal>
    <Login
    @setUsertoken="val => $emit('setUsertoken', val)"
    @setUserinfo="val => $emit('setUserinfo', val)"
    ></Login>
    <div class='am-g'>
      <a href="#" class="logo fl">
        <div class="det"></div>
      </a>
      <ul class="tabs fl" ref="tabs">
        <li class="tab" :class="{'active':path === 'index'}">
          <!-- <a href="/index.html">首页</a> -->
          <router-link to="/">首页</router-link>
        </li>
        <li class="tab" :class="{'active':path === 'productservice'}">
          <!-- <a href="/productservice.html">产品服务</a> -->
          <router-link to="/productservice">产品服务</router-link>
        </li>
        <li class="tab" :class="{'active':path === 'trade'}">
          <!-- <a href="/productservice.html">产品服务</a> -->
          <router-link to="/trade">交易中心</router-link>
        </li>
        <li class="tab" :class="{'active':path === 'tradeguide'}">
          <!-- <a href="/tradeguide.html">交易指南</a> -->
          <router-link to="/tradeguide">交易指南</router-link>
        </li>
        <li class="tab" :class="{'active':path === 'about'}">
          <!-- <a href="/about.html">关于我们</a> -->
          <router-link to="/about">关于我们</router-link>
        </li>
      </ul>
      <div class="logo-about fr">
        <div class="login-icon fl"></div>
        <a href="javascript:;" class="login fl" @click="doLogin" v-show="!userInfo">
          <span class="login-flag"></span>登录
          <span class="line"></span>
        </a>
        <!-- <a href="/personalcenter.html" class="info fl" v-if="userInfo">个人中心</a> -->
        <router-link to="/personalcenter" class="info fl" v-if="userInfo">个人中心</router-link>
        <a href="javascript:;" class="register fl" @click="doRegister" v-show="!userInfo">注册</a>
        <a href="javascript:;" class="logout fl" @click="dologoOut" v-show="userInfo">退出</a>
      </div>
    </div>
  </div>
</template>

<script>
import EventName from 'EventName';
import Cookies from 'js-cookie';
import { SweetModal } from 'sweet-modal-vue';
import Login from './Login';

const Base64 = require('js-base64').Base64;

export default {
  name: 'header',
  data() {
    return {
      showModal: '',
      loginStatus: '',
      registerStatus: '',
      // userInfo: null,
      toast: {
        icon: 'info',
        value: '',
      },
    };
  },
  components: { Login, SweetModal },
  // props: {
  //   checkTab: {
  //     type: Number,
  //     default: 1,
  //   },
  // },
  computed: {
    path() {
      return this.$route.name;
    },
    userInfo() {
      return this.$root.userinfo;
    },
  },
  mounted() {
    console.log(this.path);
    this.bindScroll();
    // this.refreshUserInfo();
    // // 更新用户信息
    // this.$root.eventBus.$on(EventName.refreshUserInfo, this.refreshUserInfo);
    // // 更新toast信息
    this.$root.eventBus.$on(EventName.noticeToast, (payload) => {
      this.$refs.toast.open();
      this.toast = payload;
    });
    // 判断用户是否在个人中心页面
    // this.verifyPersonalPage();
    this.scrollTop();
  },
  methods: {
    scrollTop() {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    },
    // verifyPersonalPage() {
    //   const href = location.href;
    //   if (href.indexOf('personalcenter') > -1) {
    //     console.log('this.$refs.tabs', this.$refs.tabs);
    //     const list = this.$refs.tabs.querySelectorAll('.tab');
    //     [].forEach.call(list, (item) => {
    //       item.classList.remove('active');
    //     });
    //   }
    // },
    getTell(tell) {
      return Base64.decode(tell);
    },
    // refreshUserInfo() {
    //   this.userInfo = Cookies.getJSON('userInfo') || null;
    // },
    dologoOut() {
      Cookies.remove('userToken');
      Cookies.remove('userInfo');
      this.$emit('logout');
      // this.refreshUserInfo();
      window.location.reload();
      this.$router.push('/index');
    },
    doLogin() {
      this.$root.eventBus.$emit(EventName.noticeLogin);
    },
    doRegister() {
      this.$root.eventBus.$emit(EventName.noticeRegister);
    },
    bindScroll() {
      const headerDom = this.$refs.top;
      const app = document.getElementById('app');
      app.addEventListener('scroll', () => {
        // const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollTop = app.scrollTop;
        if (scrollTop > 10) {
          headerDom.classList.add('scrollHeader');
        } else {
          headerDom.classList.remove('scrollHeader');
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
#header {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  height: 98px;
  z-index: 999;
  .toast-modal {
    z-index: 10000;
  }
  .logo {
    display: inline-block;
    height: 100%;
    .det {
      width: 136px;
      height: 36px;
      margin-top: 30px;
      background: url('/static/img/logo.png') no-repeat;
    }
  }
  .tabs {
    display: block;
    height: 100%;
    color: #fff;
    margin-left: 258px;

    .tab {
      float: left;
      height: 100%;
      line-height: 98px;
      a {
        position: relative;
        color: #fff;
        display: inline-block;
        height: 100%;
        margin: 0 36px;
      }
    }
    .active {
      a::after {
        content: ' ';
        position: absolute;
        bottom: 30px;
        left: 0;
        right: 0;
        height: 2px;
        background: #fff;
      }
    }
  }
  .logo-about {
    a {
      float: left;
      color: #fff;
      display: inline-block;
      height: 100%;
      line-height: 98px;
      vertical-align: top;
    }
    .login-icon {
      width: 14px;
      height: 16px;
      background: url('/static/img/denglu_icon.png') no-repeat;
      margin-top: 41px;
      margin-right: -3px;
    }
    .login {
      position: relative;
      width: 65px;
      text-align: center;

      // .login-flag {
      //   background: url('/static/img/') no-repeat;
      // }
      .line {
        position: absolute;
        right: -1px;
        top: 41px;
        height: 17px;
        background: #fff;
        width: 1px;
        opacity: .5;
      }
    }
    .register {
      width: 65px;
      text-align: center;
    }
    .logout {
      width: 65px;
      text-align: center;
    }
    .info {
      max-width: 130px;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding: 0 5px;
    }
  }
}

#header.scrollHeader,#header.color-header {
  border: 1px solid #e8e8e8;
  background: #fff;
  .logo {
    .det {
      width: 136px;
      height: 36px;
      margin-top: 30px;
      background: url('/static/img/scoll-logo.png') no-repeat;
    }
  }
  .tabs {
    .tab {
      a {
        color: #000;
      }
    }
    .active {
      a {
        color: red;
      }
      a::after {
        content: ' ';
        position: absolute;
        bottom: 30px;
        left: 0;
        right: 0;
        height: 2px;
        background: red;
      }
    }
  }
  .logo-about {
    a {
      color: #000;
    }
    .login {
      .line {
        background: #000;
        opacity: .3;
      }
    }
    .login-icon {
      width: 14px;
      height: 16px;
      background: url('/static/img/denglu_icon_red.png') no-repeat;
      margin-top: 40px;
      margin-right: -3px;
    }
  }
}
</style>
