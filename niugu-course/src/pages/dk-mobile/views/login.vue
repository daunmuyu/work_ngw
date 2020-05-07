<template>
<van-popup v-model="$root.loginShow" position="bottom">
  <div class="login">
    <div class="close" @click="$root.loginShow = false">
      <img src="../images/close.png" alt="">
    </div>
    <div class="title">
      <p @click="changeLoginTab(0)"><b :class='{col:0==flag}'>手机登录</b></p>
      <p @click="changeLoginTab(1)"><b :class='{col:1==flag}'>账号登录</b></p>
    </div>
    <div class="input phone" v-show="!flag">
      <input type="text" v-model="clmobile" maxlength="11" required placeholder="请输入手机号" ref="inp"><br/>
      <input type="text" v-model="verify" maxlength="4" required placeholder="请输入验证码">
      <button class="button" @click="getverify" :disabled="text != 60" :class="{cols:col}">{{text === 60? '获取验证码':text + 's后重发'}}</button>
    </div>
    <div class="input user" v-show="flag">
      <input type="text" v-model="user" placeholder="请输入手机号／用户名"><br/>
      <input type="password" v-model="pwd" placeholder="请输入密码">
    </div>
    <div class="btn">
      <button @click="login" :class="{'login-active': loginBtnStatus}">登录</button>
      <p>未注册海能的手机号，登录时将自动注册且代表您已同意<a href="https://h5.stockhn.com/huodong/base/protocol/index.html">《海能注册协议》</a></p>
    </div>
  </div>
</van-popup>
</template>
<script>
import { Toast, Popup } from 'vant';
import MD5 from 'blueimp-md5';
import  API from '../service/api.js';

export default {
  name: 'Login',
  // props: ['$root.loginShow'],
  data() {
    return {
      usertoken: '',
      clmobile: '',
      alipay: '',
      verify: '',
      text: 60,
      select: {},
      courseInfo: {},
      flag: 0,
      user: '',
      pwd: '',
      pay: false,
      mobile: '',
      loginType: '',
      digest: '',
      col: false,
      // $root.loginShow: false,
    };
  },
  computed: {
    loginBtnStatus() {
      let status;
      if (this.flag === 0) {
        status = this.clmobile && this.verify;
      } else {
        status = this.user && this.pwd;
      }
      return status;
    },
  },
  watch: {
    clmobile(val) {
      if (/^1[3456789]\d{9}$/.test(val)) {
        this.col = true;
      } else {
        this.col = false;
      }
    },
  },
  methods: {
    // 获取验证码
    async getverify() {
      if (!this.clmobile) {
        Toast('请输入手机号');
        return;
      }
      API.getCode({
        mobile: this.clmobile,
        smsType: 29,
      }).then((verify) => {
        if (verify.code === 0) {
          Toast('发送成功');
          const id = setInterval(() => {
            if (this.text >= 0) {
              this.text = this.text - 1;
            } else {
              clearInterval(id);
              this.text = 60;
            }
          }, 1000);
        } else {
          Toast(verify.message);
        }
      });
    },
    changeLoginTab(index) {
      this.flag = index;
      if (index === 0) {
        this.user = '';
        this.pwd = '';
      } else {
        this.clmobile = '';
        this.verify = '';
      }
    },
    // 登录
    login() {
      // Toast({
      //   duration: 900,
      //   message: '登录中，请稍等~ '
      // });
      // 验证码登录
      if (!this.flag) {
        if (this.clmobile) {
          if (!this.verify) {
            Toast('请填写验证码');
          } else {
            API.getPhone({
              mobile: this.clmobile,
              code: this.verify,
            }).then((res) => {
              if (res.code === 0) {
                Toast(res.message);
                sessionStorage.setItem('usertoken', res.userInfo.userToken);
                sessionStorage.setItem('uuid', res.userInfo.uuid);
                setTimeout(() => {
                  this.$root.loginShow = false;
                }, 500);
              } else {
                Toast(res.message);
              }
            });
          }
        } else {
          Toast('请输入手机号');
          return;
        }
      }
      // 帐号密码登录
      if (this.flag) {
        if (this.user) {
          if (!this.pwd) {
            Toast('请填写密码');
          } else {
            API.getLogin({
              mobile: this.user,
            }).then((res) => {
              if (res.code === 0) {
                let pwd = this.pwd;
                this.loginType = res.loginType;
                if (this.loginType === 2) {
                  this.digest = res.digest;
                  pwd = MD5(`${this.digest} ${this.pwd}`).toUpperCase();
                }
                this.userLogin(this.loginType, this.user, pwd);
              } else {
                Toast(res.message);
              }
            });
          }
        } else {
          Toast('请输入账号');
        }
      }
    },
    // 获取用户信息
    userLogin(loginType, user, pwd) {
      API.getUser({
        loginType,
        mobile: user,
        password: pwd,
      }).then((res) => {
        if (res.code === 0) {
          sessionStorage.setItem('usertoken', res.userInfo.userToken);
          sessionStorage.setItem('uuid', res.userInfo.uuid);
          setTimeout(() => {
            this.$root.loginShow = false;
          }, 500);
        } else {
          Toast(res.message);
        }
      });
    },
  },
}
</script>
<style lang="scss" scoped>
[v-cloak] { display: none }

$browser-default-font-size: 37.5px !default;

@function px2rem($px) {
  @return $px / $browser-default-font-size * 1rem;
}

.van-popup {
  width: 100%;
  height: 100%;
  .login{
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    bottom: 0;
    text-align: center;
    z-index: 233;
    background: #fff;
    overflow: hidden;
    .close {
      position: absolute;
      top: px2rem(20px);
      right: px2rem(20px);
      width: 14px;
      height: 14px;
      font-size: 14px;
      text-align: center;
    }

    .title{
      width: 50%;
      height: px2rem(40px);
      margin-left: 25%;
      margin-top: px2rem(70px);
      display: flex;
      p{
        flex: 1;
        font-size: px2rem(17px);
        line-height: px2rem(40px);
        color: #999;
        b{
          font-weight: normal;
          padding-bottom: px2rem(8px);
        }
        .col{
          border-bottom: px2rem(1.5px) solid #ff4c51;
          color: #000;
        }
      }
    }

    .input{
      width: 100%;
      position: relative;
      margin-top: px2rem(45px);
      input{
        width: 78%;
        height: px2rem(38px);
        border: none;
        border-bottom: px2rem(1px) solid #c4c7cc;
        padding-left: px2rem(10px);
        border-radius: 0;
        color: #000;
        font-size: px2rem(14px);
        margin-top: px2rem(20px);
      }
      input::-webkit-input-placeholder {
        color: #999;
      }
      .button{
        position: absolute;
        right: px2rem(60px);
        bottom: px2rem(10px);
        color: #ff4c51;
        opacity: 0.5;
        font-size: px2rem(12px);
        border: none;
        background: transparent;
      }
      .cols{
        opacity: 0.5;
      }
    }

    .btn{
      position: relative;
      top: px2rem(18px);
      button{
        background: url(../images/btn_bg_login.png);
        background-size: 100% 100%;
        width: 317px;
        height: 81px;
        border: none;
        outline: none;
        color: #fff;
        font-size: 17px;
      }
      .login-active {
        background: url(../images/login_btn.png);
        background-size: 100% 100%;
      }
      p{
        font-size: 12px;
        color: #999999;
        width: 60%;
        margin-left: 20%;
        a{
          color: #458cf5;
        }
      }
    }
  }
}

</style>

