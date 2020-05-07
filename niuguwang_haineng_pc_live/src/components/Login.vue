<template lang="html">
	<div v-show="loginModal" class="login" @click.self="close">
		<div class="login-box">
      <div class="close-btn">
        <img src="../images/close1.png" @click="closes"/>
      </div>
      <div class="nav-bar">
        <div class="nav-bar-item" @click="tab = 1" :class="tab===1?'active':''">
          手机动态登录
        </div>
        <div class="nav-bar-item" @click="tab = 2" :class="tab===2?'active':''">账号登录</div>
      </div>
      <div class="content">
        <div v-show="tab === 1">
          <div class="form">
            <img src="../images/mobile.png"/>
            <input placeholder="请输入您的手机号" maxlength="11" v-model.trim="mobile" required onkeypress="if(event.keyCode < 45 || event.keyCode > 57)event.returnValue = false"/>
          </div>
          <div class="form">
            <img src="../images/code.png"/>
            <input placeholder="请输入验证码" v-model.trim="verify" maxlength="4" required onkeypress="if(event.keyCode < 45 || event.keyCode > 57)event.returnValue = false"/>
            <span class="num" @click="getCode">{{num === 60 ? '获取验证码': num + '秒后重新获取'}}</span>
          </div>
          <div class="submit" @click="mobileSubmit">登录</div>
        </div>
        <div v-show="tab === 2">
          <div class="form">
            <img src="../images/mobile.png"/>
            <input placeholder="请输入您的账号" v-model.trim="username"/>
          </div>
          <div class="form">
            <img src="../images/pwd.png"/>
            <input placeholder="请输入账号密码" v-model.trim="passward" type="password"/>
          </div>
          <div class="submit" @click="userSubmit">登录</div>
        </div>
      </div>
    </div>
	</div>
</template>

<script>
  import { mapGetters, mapMutations, mapActions, } from 'vuex';
  import Cookie from 'js-cookie';
  import Md5 from 'md5';
  export default {
    data () {
      return {
        tab: 1,
        num: 60,
        id: 0,
        mobile: '',
        username: '',
        verify: '',
        passward: '',
      }
    },
    methods: {
      ...mapActions(['getVerify', 'mobileLogin', 'getUserInfo', 'loginCheck', 'userLogin']),
      ...mapMutations(['showLogin', 'setLogin']),
      close () {
        this.showLogin(false);
      },
      closes() {
        this.showLogin(false);
        location.reload();
      },
      getCode () {
        if (this.num !== 60) return;
        if (/^1[0-9]{10}$/.test(this.mobile)) {
          this.getVerify({
            mobile: this.mobile,
            smsType: 29,
          }).then((res) => {
            if (res.code === 0) {
              this.id = setInterval(() => {
                if (this.num > 0) {
                  this.num -= 1;
                } else {
                  this.num = 60;
                  clearInterval(this.id);
                }
              }, 1000);
            } else {
              this.$Message.error(res.message || '网络错误！');
            }
          })
        } else {
          this.$Message.error('请输入正确的手机号！');
        }
      },
      mobileSubmit () {
        if (!/^1[0-9]{10}$/.test(this.mobile)) this.$Message.error('请输入正确的手机号！');
        if (this.verify) {
          this.mobileLogin({
            mobile: this.mobile,
            code: this.verify
          }).then((res) => {
            if (res.code === 0) {
              this.close();
              this.setLogin(true);
              const usertoken = res.userInfo.userToken;
              Cookie.set('hn-token', usertoken);
              Cookie.set('uuid', res.userInfo.uuid);
              this.getUserInfo({ usertoken });
              setTimeout(()=>{
                location.reload();
              },1000);
            } else {
              this.$Message.error(res.message || '网络错误！');
            }
          })
        } else {
          this.$Message.error('请输入验证码！');
        }
      },
      userSubmit () {
        if (!this.username) { this.$Message.error('请输入帐户名！'); return; };
        if (!this.passward) { this.$Message.error('请输入密码！'); return; };
        this.loginCheck({ mobile: this.username }).then((res) => {
          if (res.code === 0) {
            const password = res.loginType === 1 ? this.passward : Md5(`${res.digest} ${this.passward}`).toUpperCase()
            this.userLogin({
              loginType: res.loginType,
              mobile: this.username,
              password,
            }).then((data) => {
              if (data.code === 0) {
                this.close();
                this.setLogin(true);
                const usertoken = data.userInfo.userToken;
                Cookie.set('hn-token', usertoken);
                Cookie.set('uuid', data.userInfo.uuid);
                console.log(data.userInfo.uuid);
                this.getUserInfo({ usertoken });
                setTimeout(()=>{
                  location.reload();
                },1000);
              } else {
                this.$Message.error(data.message || '网络错误！');
              }
            })
          } else {
            this.$Message.error(res.message || '网络错误！');
          }
        })
      }
    },
    computed: {
      ...mapGetters(['loginModal'])
    },
  }
</script>

<style lang="scss" scoped>
  .login {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 100;
    text-align: center;
    & .login-box {
      position: absolute;
      left: 50%;
      top: 50%;
      width: 480px;
      padding: 0 60px;
      z-index: 101;
      text-align: center;
      background-color: #fff;
      border-radius: 4px;
      transform: translate(-50%, -50%);
      .nav-bar {
        width: 100%;
        height: 60px;
        .nav-bar-item {
          float: left;
          width: 50%;
          height: 100%;
          line-height: 60px;
          transition: color .3s ease-in-out;
          font-size: 24px;
          cursor: pointer;
          &.active {
            border-bottom: 1px solid rgb(0, 93, 207);
            color: rgb(0, 93, 207);
          }
        }
      }
      .content {
        padding: 20px 0;
        .form {
          width: 100%;
          height: 42px;
          line-height: 42px;
          border-bottom: 1px solid #e8e8e8;
          text-align: left;
          font-size: 18px;
          margin: 20px auto;
          padding: 0 5px;
          span.num {
            font-size: 14px;
            float: right;
            cursor: pointer;
          }
          input {
            border: 0;
            margin: 0 10px;
            height: 90%;
            width: 200px;
            font-size: 18px;
            &:focus {
              outline: none;
              border: 0;
            }
          }
        }
        .submit {
          width: 100%;
          height: 56px;
          line-height: 56px;
          border-radius: 28px;
          font-size: 18px;
          margin-top: 40px;
          color: #fff;
          background-color: rgb(0, 93, 207);
          cursor: pointer;
        }
        .tips {
          margin-top: 20px;
          font-size: 16px;
        }
      }
      & .close-btn {
        width: 100%;
        height: 40px;
        cursor: pointer;
        img {
          position: absolute;
          right: 20px;
          top: 20px;
        }
      }
    }
  }
</style>
