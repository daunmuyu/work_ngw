<template>
  <div id="login" ref="top">
    <SweetModal ref="modal" :blocking="true" hide-close-button>
      <!-- 登录 -->
      <div class="doLogin" :class="{'hide':!login.show}">
        <div class="head">
          <img src="/static/img/rrqz_logo.png" alt="">
          <p class="name">登录人人期指</p>
        </div>
        <div class="content">
          <CusInput v-model="login.tell" placeholder="请输入手机号" class="tell" />
          <CusInput placeholder="请输入密码" v-model="login.pass" type="password" imgPath="/static/img/mima.png" class="pass" />
          <p class="hint clearfix">
            <img src="/static/img/weixuan.png" ref="logincheck" @click="loginCheckClick()" alt="" class="fl icon">
            <span class="des fl" @click="loginCheckClick">一周内自动登录</span>
            <a href="javascript:;" class="tofpwd fr" @click="loginToForget">忘记密码?</a>
            <span class="space-line fr"></span>
            <a href="javascript:;" class="toreg fr" @click="loginToRegister">注册人人期指</a>
          </p>
          <a href="javascript:;" class="btn submit" :class="{'disabled':!login.canSubmit}" @click="doLogin">登录</a>
        </div>
      </div>
      <!-- 重置交易密码 -->
      <div class="doFogetPass" :class="{'hide':!forgetPass.show}">
        <div class="head">
          <img v-if="showBack" src="/static/img/icon-back.png" alt="" class="back" @click="forgetPassBack">
          {{passwordTitle}}
          <div v-if="!showBack" class="del" @click="forgetPassClose">
            <svg class="del-svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="#292c34"></path>
            </svg>
          </div>
        </div>
        <div class="content">
          <CusInput placeholder="请输入手机号码" v-model="forgetPass.tell" class="tell mt20" />
          <div class="input-code clearfix mt20">
            <CusInput v-model="forgetPass.code" imgPath="/static/img/yanzhengma.png" placeholder="请输入验证码" class="control fl" />
            <VerifyCode @goVerify="goForgetPassVerify" :tell.sync="forgetPass.tell" class="verify fl" />
          </div>
          <CusInput v-model="forgetPass.newpass" type="password" class="new-pass mt20" imgPath="/static/img/mima.png" placeholder="请输入新密码(6-15位包含数字及字母)" />
          <CusInput v-model="forgetPass.repeatpass" type="password" class="old-pass mt20" imgPath="/static/img/mima.png" placeholder="请再次输入新密码" />
          <a href="javascript:;" class="btn submit" :class="{'disabled':!forgetPass.canSubmit}" @click="doForgetPass">确定</a>
        </div>
      </div>
      <!-- 注册人人期指 -->
      <div class="doRegister" :class="{'hide':!register.show}">
        <div class="head">
          注册人人期指
          <div class="del" @click="registerClose">
            <svg class="del-svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="#292c34"></path>
            </svg>
          </div>
        </div>
        <div class="content">
          <CusInput v-model="register.tell" placeholder="请输入手机号码" class="tell mt20" />
          <div class="input-code clearfix mt20">
            <CusInput v-model="register.code" imgPath="/static/img/yanzhengma.png" placeholder="请输入验证码" class="control fl" />
            <VerifyCode @goVerify="goRegVerify" :tell.sync="register.tell" class="verify fl" />
          </div>
          <CusInput v-model="register.pass" type="password" class="new-pass mt20" imgPath="/static/img/mima.png" placeholder="请输入新密码(6-15位包含数字及字母)" />
          <p class="hint clearfix">
            <img src="/static/img/weixuan.png" alt="" class="fl icon" ref="registercheck" @click="registerCheckClick">
            <span class="des fl" @click="registerCheckClick">一周内自动登录</span>
            <!-- <a href="/protocol.html" target="_blank" class="toProto fl"><<人人期指注册协议>></a> -->
            <router-link to="/protocol" target="_blank" class="toProto fl"><<人人期指注册协议>></router-link>
          </p>
          <a href="javascript:;" class="btn submit" :class="{'disabled':!register.canSubmit}" @click="doRegister">注册</a>
          <div class="space-line"></div>
          <p class="bottom">
            <span>如果您已经拥有人人期指 ID,则可在此</span><a href="javascript:;" class="toLogin" @click="regToLogin">登录</a>
          </p>
        </div>
      </div>
    </SweetModal>
  </div>
</template>

<script>
import { SweetModal } from 'sweet-modal-vue';
import Input from '@/components/Input';
import VerifyCode from '@/components/VerifyCode';
import EventName from 'EventName';
import { login, register, getverifycode, getUserIndex, resetPassword } from 'API';
import Cookies from 'js-cookie';
import utils from 'utils';

const Base64 = require('js-base64').Base64;

export default {
  name: 'login',
  data() {
    return {
      modalShow: false,
      verifyReset: '',
      login: {
        show: false,
        tell: '',
        pass: '',
        autoLogin: false,
        canSubmit: false,
      },
      forgetPass: {
        show: false,
        tell: '',
        pass: '',
        code: '',
        newpass: '',
        repeatpass: '',
        canSubmit: false,
      },
      register: {
        show: false,
        tell: '',
        pass: '',
        code: '',
        autoLogin: false,
        canSubmit: false,
      },
      showBack: true,
      passwordTitle: '忘记密码',
    };
  },
  components: { SweetModal, CusInput: Input, VerifyCode },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    loginStatus: {
      type: Boolean,
      default: false,
    },
    registerStatus: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    const modal = this.$refs.modal;
    this.$root.eventBus.$on(EventName.noticeLogin, () => {
      modal.open();
      this.login.show = true;
      this.register.show = false;
    });
    this.$root.eventBus.$on(EventName.noticeRegister, () => {
      modal.open();
      this.login.show = false;
      this.register.show = true;
    });
    this.$root.eventBus.$on(EventName.noticeModifyPass, () => {
      modal.open();
      this.login.show = false;
      this.register.show = false;
      this.forgetPass.show = true;
      this.showBack = false;
      this.passwordTitle = '修改密码';
    });
  },
  methods: {
    doRegister() {
      if (!this.register.canSubmit) {
        return false;
      }
      console.log('this.register.tell', this.register.tell);
      const modal = this.$refs.modal;
      const mobile = Base64.encode(this.register.tell);
      const code = this.register.code;
      const password = this.register.pass;
      register({
        mobile,
        code,
        password,
      }).then((res) => {
        console.log('res', res);
        if (res.code === 0) {
          modal.close();
          // this.$root.toast('success', '注册成功!');
          getUserIndex({ userToken: res.userInfo.userToken }).then((innerRes) => {
            console.log('innerRes', innerRes);
            // 注册成功获取用户信息
            if (this.login.autoLogin) {
              Cookies.set('userInfo', innerRes.userInfo, { expires: 7 });
              Cookies.set('userToken', res.userInfo.userToken, { expires: 7 });
            } else {
              Cookies.set('userInfo', innerRes.userInfo);
              Cookies.set('userToken', res.userInfo.userToken);
            }
            this.$emit('setUsertoken', res.userInfo.userToken);
            this.$emit('setUserinfo', innerRes.userInfo);
            this.$root.eventBus.$emit('login-success');
            // location.reload();
          });
        } else {
          this.$root.toast('error', res.message);
        }
      });
      return false;
    },
    doLogin() {
      if (!this.login.canSubmit) {
        return false;
      }
      const modal = this.$refs.modal;
      const mobile = Base64.encode(this.login.tell);
      const password = this.login.pass;
      login({
        mobile,
        password,
      }).then((res) => {
        if (res.code === 0) {
          // this.$root.toast('success', '登录成功!');
          modal.close();
          getUserIndex({ userToken: res.userInfo.userToken }).then((innerRes) => {
            console.log('innerRes', innerRes);
            // 登录成功获取用户信息
            if (this.login.autoLogin) {
              Cookies.set('userInfo', innerRes.userInfo, { expires: 7 });
              Cookies.set('userToken', res.userInfo.userToken, { expires: 7 });
            } else {
              Cookies.set('userInfo', innerRes.userInfo);
              Cookies.set('userToken', res.userInfo.userToken);
            }
            this.$emit('setUsertoken', res.userInfo.userToken);
            this.$emit('setUserinfo', innerRes.userInfo);
            this.$root.eventBus.$emit('login-success');
            // 通知更新用户信息
            // location.reload();
            // window.location.href = './personalcenter.html';
            // window.location.href = '/personalcenter';
          });
        } else {
          this.$root.toast('error', res.message);
        }
      });
      return false;
    },
    doForgetPass() {
      const modal = this.$refs.modal;
      const mobile = Base64.encode(this.forgetPass.tell);
      const code = this.forgetPass.code;
      const newpwd = Base64.encode(this.forgetPass.newpass);
      const userToken = Cookies.getJSON('userToken');
      resetPassword({
        mobile,
        code,
        newpwd,
        userToken,
      }).then((res) => {
        console.log('res', res);
        // 修改密码成功
        if (res.code === 0) {
          modal.close();
          this.$root.toast('success', '修改成功!');
        } else {
          this.$root.toast('error', res.message);
        }
      });
    },
    goForgetPassVerify() {
      if (this.forgetPass.tell.trim().length === 11) {
        this.goVerify(this.forgetPass, 22);
      }
    },
    goRegVerify() {
      if (this.register.tell.trim().length === 11) {
        this.goVerify(this.register);
      }
    },
    goVerify(data, smsType = 21) {
      const mobile = Base64.encode(data.tell);
      getverifycode({ mobile, smsType }).then((res) => {
        if (res.code !== 0) {
          this.$root.toast('error', res.message);
        }
      });
    },
    loginCheckClick() {
      const t = this.$refs.logincheck;
      this.login.autoLogin = !this.login.autoLogin;
      if (this.login.autoLogin) {
        t.setAttribute('src', '/static/img/xuanzhong.png');
      } else {
        t.setAttribute('src', '/static/img/weixuan.png');
      }
    },
    registerCheckClick() {
      const t = this.$refs.registercheck;
      this.register.autoLogin = !this.register.autoLogin;
      if (this.register.autoLogin) {
        t.setAttribute('src', '/static/img/xuanzhong.png');
      } else {
        t.setAttribute('src', '/static/img/weixuan.png');
      }
    },
    regToLogin() {
      this.login.show = true;
      this.register.show = false;
    },
    loginToRegister() {
      this.login.show = false;
      this.register.show = true;
    },
    loginToForget() {
      this.login.show = false;
      this.register.show = false;
      this.forgetPass.show = true;
      this.showBack = true;
      this.passwordTitle = '忘记密码';
    },
    forgetPassBack() {
      this.login.show = true;
      this.register.show = false;
      this.forgetPass.show = false;
    },
    registerClose() {
      this.$refs.modal.close();
    },
    forgetPassClose() {
      this.$refs.modal.close();
    },
  },
  watch: {
    login: {
      handler(val) {
        const pass = val.pass.trim();
        const passState = pass !== '' && pass.length > 5 && pass.length < 16;
        if (val.tell.trim() !== '' && passState && utils.verifyTell(val.tell.trim())) {
          this.login.canSubmit = true;
        } else {
          this.login.canSubmit = false;
        }
      },
      deep: true,
    },
    register: {
      handler(val) {
        const pass = val.pass.trim();
        const passState = pass !== '' && pass.length > 5 && pass.length < 16;
        if (val.tell.trim() !== '' && pass !== '' && val.code.trim() !== '' && utils.verifyTell(val.tell.trim()) && val.code.trim() !== '' && passState) {
          this.register.canSubmit = true;
        } else {
          this.register.canSubmit = false;
        }
      },
      deep: true,
    },
    forgetPass: {
      handler(val) {
        const newpass = val.newpass.trim();
        const repeatpass = val.repeatpass.trim();
        const newpassState = newpass !== '' && newpass.length > 5 && newpass.length < 16;
        const repeatpassState = repeatpass !== '' && repeatpass.length > 5 && repeatpass.length < 16;
        if (val.tell.trim() !== '' && val.code.trim() !== '' && utils.verifyTell(val.tell.trim()) && val.code.trim() !== '' && newpassState && repeatpassState) {
          this.forgetPass.canSubmit = true;
        } else {
          this.forgetPass.canSubmit = false;
        }
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss">
$red:#ff001e;
$blue:#6b93f2;
.mt20 {
  margin-top: 20px;
}

#login {
  .sweet-modal {
    width: 450px;
    .sweet-content {
      padding: 0;
    }
  }
  .btn {
    width: 370px;
    height: 50px;
    margin-top: 30px;
    line-height: 50px;
    display: block;
    text-align: center;
    font-size: 20px;
    color: #fff;
    background-color: $red;
  }
  .doLogin {
    height: 500px;
    .head {
      margin-top: 65px;
      .name {
        font-size: 20px;
        margin-top: 25px;
      }
    }
    .content {
      padding: 0 40px;
      .tell {
        margin: 54px 0 20px 0;
      }
      .pass {}
      .hint {
        margin-top: 14px;
        .icon {
          position: relative;
          top: 1px;
        }
        .des {
          font-size: 14px;
          color: #999;
          margin-left: 6px;
          cursor: pointer;
        }
        .tofpwd {
          color: $blue;
          font-size: 14px;
        }
        .space-line {
          position: relative;
          top: 3px;
          width: 1px;
          height: 14px;
          background: #ccc;
          margin: 0 10px;
        }
        .toreg {
          font-size: 14px;
          color: $blue;
        }
      }
      .disabled {
        background: #ffbdbf;
      }
    }
  }
  .doFogetPass {
    height: 475px;
    .head {
      position: relative;
      height: 60px;
      line-height: 60px;
      text-align: center;
      font-size: 20px;
      background: #fbfbfb;
      .back {
        position: absolute;
        top: 0;
        left: 0;
        padding: 20px;
        cursor: pointer;
      }
      .del {
        position: absolute;
        top: 6px;
        right: 14px;
        width: 42px;
        height: 42px;
        font-size: 14px;
        border-radius: 50%;
        color: #222C38;
        .del-svg {
          fill: currentColor;
        }
      }
      .del:hover {
        background: #039BE5;
        color: #fff;
      }
    }
    .content {
      padding: 0 40px;
      .tell {}
      .input-code {
        .control {
          width: 230px;
          .input-control {
            width: 178px;
            float: left;
          }
        }
        .verify {
          margin-left: 8px;
        }
      }
      .btn-code {}
      .new-pass {}
      .old-pass {}
      .disabled {
        background: #ffbdbf;
      }
    }
  }
  .doRegister {
    height: 494px;
    .head {
      position: relative;
      height: 60px;
      line-height: 60px;
      text-align: center;
      font-size: 20px;
      background: #fbfbfb;
      .del {
        position: absolute;
        top: 6px;
        right: 14px;
        width: 42px;
        height: 42px;
        font-size: 14px;
        border-radius: 50%;
        color: #222C38;
        .del-svg {
          fill: currentColor;
        }
      }
      .del:hover {
        background: #039BE5;
        color: #fff;
      }
    }
    .content {
      padding: 20px 40px 0 40px;
      .tell {}
      .input-code {
        .control {
          width: 230px;
          .input-control {
            width: 178px;
            float: left;
          }
        }
        .verify {
          margin-left: 8px;
        }
      }
      .hint {
        margin-top: 14px;
        .icon {
          position: relative;
          top: 1px;
        }
        .des {
          font-size: 14px;
          color: #999;
          margin-left: 6px;
        }
        .toProto {
          font-size: 14px;
          color: $blue;
          margin-left: 9px;
        }
      }
      .btn-code {}
      .new-pass {}
      .old-pass {}
      .space-line {
        height: 1px;
        transform: scaleY(.5);
        background: #ccc;
        margin-top: 30px;
      }
      .bottom {
        font-size: 14px;
        color: #666;
        padding-top: 20px;
        .toLogin {
          color: $blue;
        }
      }
      .disabled {
        background: #ffbdbf;
      }
    }
  }
}
</style>
