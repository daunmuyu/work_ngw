<template>
  <div class="container">
    <div class="logo-pane">
      <div class="logo-icon"><img src="/static/img/favicon128X128.png" alt=""></div>
      <h5>涨了么诊股</h5>
    </div>
    <div class="content-pane">
      <h6>您今日的3次免费诊股机会已经用尽</h6>
      <p><span>·</span>授权微信注册手机号注册涨了么账号获得无限诊股机会！</p>
      <button open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">立即授权</button>
    </div>
  </div>
</template>

<script>
import API from '@/utils/api'

export default {
  data () {
    return {
      session: null,
      phoneData: null
    }
  },
  mounted () {
    this.session = {
      openid: wx.getStorageSync('openid'),
      session_key: wx.getStorageSync('session_key')
    }
    this.getSetting()
  },
  methods: {
    getSetting () {
      wx.getSetting({
        success: (res) => {
          if (res.authSetting['scope.userInfo']) {
            console.log('用户授权过')
          } else {
            console.log('用户还未授权过')
            wx.redirectTo({ url: '../index/main' })
          }
        }
      })
    },
    getPhoneNumber (e) {
      this.phoneData = e.mp.detail
      wx.checkSession({
        success: res => {
          console.log(res)
          this.nggPhone()
        },
        fail: () => {
          this.login()
        }
      })
    },
    redirectPage () {
      wx.redirectTo({ url: '../home/main' })
    },
    // 调用登录接口
    login () {
      const _this = this
      wx.login({
        success: (ck) => {
          if (ck.code) {
            console.log(ck)
            _this.wxOpenId(ck)
          } else {
            this.toast.showZanToast({
              icon: 'fail',
              title: ck.errMsg
            }, 2000)
          }
        }
      })
    },
    wxOpenId (ck) {
      API.ngwOpenId({
        code: ck.code
      }).then(res => {
        this.session = res
        wx.setStorageSync('openid', res.openid)
        wx.setStorageSync('session_key', res.session_key)
        this.nggPhone()
      })
    },
    nggPhone () {
      API.ngwPhone({
        sessionkey: this.session.session_key,
        openid: this.session.openid,
        encryptedData: this.phoneData.encryptedData,
        iv: this.phoneData.iv,
        code: ''
      }).then(res => {
        if (res.result === 1 && res.code === 0) {
          wx.redirectTo({ url: '../home/main' })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  color: #000;
  .logo-pane {
    .logo-icon {
      padding-top: 35px;
      width: 100%;
      img {
        width: 64px;
        height: 64px;
        margin: 0 auto;
        display: block;
      }
    }
    h5 {
      text-align: center;
      font-size: 18px;
      padding-top: 5px;
      padding-bottom: 30px;
    }
  }
  .content-pane {
    width: 310px;
    margin: 0 auto;
    border-top: 1px solid #e8e8e8;
    padding-top: 30px;
    text-align: left;
      font-size: 14px;
    h6 {
      width: 100%;
    }
    p {
      width: 100%;
      color: #999999;
      padding-top: 5px;
      padding-bottom: 40px;
      span {
        padding-right: 10px;
        font-size: 18px;
      }
    }
    button {
      border: none;
      width: 100%;
      height: 40px;
      line-height: 40px;
      background-color: #ff4c51;
      color: #fff;
      &:active {
        background-color: #e43339;
      }
    }
  }
}
</style>
