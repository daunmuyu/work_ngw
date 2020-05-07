<template>
  <div class="login">
    <!-- <div class="logo" :class="{active: showSign}">
      <h3 class="title">Hi, 海能淘股 ！</h3>
      <p class="begain" @click="showSign = true">立即体验</p>
    </div> -->
    <div class="sign" v-if="showSign">
      <el-form ref="signForm" label-width="80px" class="signForm"
      :rules="signRules" :model="signForm">
        <div class="title">
          <h4>海能淘股客服系统</h4>
        </div>
        <el-form-item prop="name">
          <el-input v-model="signForm.name" placeholder="用户名">
          </el-input>
        </el-form-item>
        <el-form-item prop="pass">
          <el-input v-model="signForm.pass" placeholder="密码"
          type="password">
          </el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="enter('signForm')">登录</el-button>
    </div>
  </div>
</template>
<script>
import { IMlogin, IMUToken } from '../service/api/auth.js';
import { setIMInfo, removeIMInfo } from '../store/authToken.js';

export default {
  name: 'Login',
  data() {
    const validateName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入账号'));
      }
    };
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        const reg = /^[a-zA-Z0-9]{6,12}$/;
        if (!reg.test(value)) {
          callback(new Error('请输入正确密码'));
          return;
        }
        callback();
      }
    };
    return {
      showSign: true,
      signRules: {
        name: [{ validator: validateName, trigger: 'blur' }],
        pass: [{ validator: validatePass, trigger: 'blur' }],
      },
      signForm: { name: '', pass: '' },
    };
  },
  methods: {
    enter(formName) {
      console.log(formName);
      this.$refs[formName].validate((valid) => {
        console.log(valid);
        // if (!valid) return false;
      });
      IMlogin({
        username: this.signForm.name,
        password: this.signForm.pass,
      }).then((res) => {
        if (+res.result) {
          IMUToken({
            userToken: res.data.userToken,
          }).then((rs) => {
            if (+rs.result) {
              setIMInfo(res.data.userToken, res.data.userID, rs.data.token, res.groupcount);
              this.$router.push('/');
            } else {
              this.$message({
                message: rs.message || '信息错误',
                type: 'warning',
              });
              removeIMInfo();
            }
          });
        } else {
          removeIMInfo();
          this.$message({
            message: res.message || '信息错误',
            type: 'warning',
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/base.scss';

  .login {
    width:100%;
    height: 100%;
    overflow: hidden;
    position: relative;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
    background-image: url('../assets/img/loginBg.png');
  }
  .logo{
    margin-top: 15%;
    transform: translateY(0%);
    transition: transform 0.5s;
    h3.title{
      font-size: 38px;
      color: $bg-FFFFFF;
      text-align: center;
      font-weight: 400;
      margin-bottom: 20px;
    }
    p.begain{
      color: $bg-FFFFFF;
      font-size: 20px;
      animation: fide 2s infinite;
      cursor: pointer;
    }
    p.begain:hover{
      opacity: 1;
      animation-play-state:paused;
      -webkit-animation-play-state:paused;
    }
    @keyframes fide {
      0% {
        opacity: 1;
      }
      50% {
        opacity: 0.3;
      }
      100% {
        opacity: 1;
      }
    }
  }
  .logo.active{
    transform: translateY(-100%);
  }
  .sign {
    width: 400px;
    height: 357px;
    background-color: $bg-FFFFFF;
    border-radius: 8px;
    box-sizing: border-box;
    position: absolute;
    left:50%;
    top:50%;
    margin-left: -200px;
    margin-top: -178.5px;
    animation: move 1.2s;
    .title {
      padding-top: 35px;
      line-height: 1.2;
      font-weight: bold;
      font-size: 28px;
      color: $bg-2A4159;
      position: relative;
      &:after, &::before {
        content: "";
        position: absolute;
        width: 55px;
        border-top: 1px solid $bg-3D70F6;
        top: 75%;
      }
      &::after {
        right: 0;
      }
      &::before  {
        left: 0;
      }
    }
    .el-form-item {
      margin-top: 30px;
      margin-left: 45px!important;
      margin-right: 45px!important;
    }
    button {
      width: 310px;
      height: 50px;
      background-color: $bg-3D70F6;
      border-radius: 25px !important;
      font-size: 18px;
      color: $bg-FFFFFF;
      border: none;
      overflow: hidden;
    }
  }
  @keyframes move {
    0% {
      left: 0
    }
    40% {
      left: 50%;
    }
    40%, 100% {
      transform: translate(0, 0);
    }
    50%,
    70%,
    90% {
      transform: translate(-5px, -5px);
    }
    60%,
    80% {
      transform: translate(5px, 5px);
    }
  }
</style>
