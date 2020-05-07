<template>
  <div class="nav">
    <div class="logo f-l" href="#">
      <img src="../images/logo.png" class="logoimg">
      <a href="./static/hnstock.url" download="趋势稳盈直播间.url" v-show="save">
        <div class="save-btn">
          <img src="../images/deskdrop.png"> 保存到桌面
        </div>
      </a>
      <div class="reload-btn" @click="reload">
        <img src="../images/material.png"> 刷新页面
      </div>
      <p class="reload-text">用于黑屏或页面卡顿</p>
    </div>
    <div class="login f-r">
      <span class="username">{{userInfo.userName}}</span>
      <span class="loginbtn" v-if="!isLogin" @click="showLogin(true)">登录</span>
      <span class="logoutbtn" v-else @click="logout">退出</span>
    </div>
  </div>
</template>
<script>
  import { mapGetters, mapMutations, mapActions } from 'vuex';
  import Cookie from 'js-cookie';
  import { getUrlParam } from '../util/interaction'
  export default {
    name: 'top',
    data () {
      return {
        save: 'download' in document.createElement('a')
      }
    },
    computed: {
      ...mapGetters(['userInfo', 'isLogin'])
    },
    methods: {
      ...mapMutations(['showLogin', 'setLogin']),
      ...mapActions(['getUserInfo', 'logout']),
      reload() {
        location.reload();
      },
      logout () {
        // const lids = Cookie.get('lid');
        // if (lids === '568') {
        //   this.logout({
        //     usertoken: Cookie.get('hn-token'),
        //     uuid: Cookie.get('uuid'),
        //   });
        // }
        Cookie.set('hn-token', '');
        Cookie.set('mark', 'lock');
        Cookie.set('vid', '9659068');
        Cookie.set('lid', '570');
        Cookie.set('uuid', '');
        this.setLogin(false);
        const tmp = Cookie.get('hn-tmptoken');
        if (getUrlParam('t')) location.search = ''
        if (tmp) {
          this.getUserInfo({ usertoken: tmp });
        } else {
          this.guestReg().then((res) => {
            if (res.code === 0) {
              const ut = res.userInfo.userToken;
              Cookie.set('hn-tmptoken', ut);
              this.getUserInfo({ usertoken: ut });
            }
          });
        }
        location.href = location.origin + location.pathname;
        // location.reload();
      }
    }
  }
</script>

<style lang="scss">
  .nav {
    height: 60px;
    margin-bottom: 5px;
    width: 100%;
    line-height: 60px;
    color: #fff;
    background: rgb(31, 34, 39);
    box-shadow: 0 2px 3px rgba(0, 0, 0, .18);
    div {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
    .logo {
      height: 100%;
      line-height: 80px;
      margin-left: 30px;
      img {
        vertical-align: middle;
        &.logoimg {
          margin-right: 15px;
        }
      }
      p.reload-text {
        font-size: 14px;
        color: rgb(126, 133, 148);
        margin-left: 10px;
      }
      div {
        display: inline-block;
        margin: 0 6px;
        font-size: 12px;
        text-align: center;
        cursor: pointer;
        &.save-btn,
        &.reload-btn {
          background: url('../images/down.png');
          background-size: contain;
          color: #9a610f;
          height: 32px;
          line-height: 32px;
          width: 104px;
          user-select: none;
          img {
            width: 21px;
            margin: 0 2px;
          }
        }
        &.reload-btn {
          background: transparent;
          border: 1px solid rgb(126, 133, 148);
          color: rgb(126, 133, 148);
          width: 100px;
          height: 34px;
          img {
            width: 16px;
            height: 23px;
          }
        }
      }
    }
    .login {
      height: 100%;
      line-height: 80px;
      margin-right: 30px;
      span {
        padding: 0 5px;
        margin: 0 5px;
        font-size: 18px;
        height: 32px;
        line-height: 32px;
        display: inline-block;
        text-align: center;
        border-radius: 4px;
        &.loginbtn,
        &.logoutbtn {
          width: 74px;
          cursor: pointer;
        }
      }
      .loginbtn {
        background-color: rgb(255, 198, 0);
        color: rgb(154, 97, 15);
      }
      .logoutbtn {
        background-color: rgb(248, 136, 27);
        color: #fff;
      }
    }
  }
</style>
