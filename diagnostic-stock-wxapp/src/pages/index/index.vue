<template>
  <div class="container" v-show="showMadil">
    <div class="logo-pane">
      <div class="logo-icon"><img src="/static/img/favicon128X128.png" alt=""></div>
      <h5>涨了么诊股</h5>
    </div>
    <div class="content-pane">
      <h6>请使用微信授权登陆涨了么诊股</h6>
      <p><span>·</span>您的数据仅用于诊股使用</p>
      <button open-type="getUserInfo" @getuserinfo="bindGetUserInfo" @click="authorize"> 微信授权登陆 </button>
    </div>
    <_toast></_toast>
  </div>
</template>

<script>
import { getComponentByTag } from '@/utils/helper'
import ZanToast from 'mpvue-zanui/src/components/zan/toast'
import API from '@/utils/api'

// 节流函数
const delay = (() => {
  let timer = 0
  return (callback, ms) => {
    clearTimeout(timer)
    timer = setTimeout(callback, ms)
  }
})()

export default {
  data () {
    return {
      session: null,
      userInfo: null,
      showMadil: false
    }
  },
  components: {
    _toast: ZanToast
  },
  mounted () {
    this.toast = getComponentByTag(this, '_toast')
    // 一进来看看用户是否授权过
    this.getSetting()
  },
  methods: {
    getSetting () {
      wx.getSetting({
        success: (res) => {
          console.log(res)
          if (res.authSetting['scope.userInfo']) {
            // 用户已经授权过
            wx.getUserInfo({
              success: (rs) => {
                this.userInfo = rs.userInfo
                this.login()
              }
            })
          } else {
            console.log('用户还未授权过')
            this.showMadil = true
          }
        }
      })
    },
    redirectPage () {
      wx.redirectTo({ url: '../home/main' })
    },
    bindGetUserInfo (e) {
      if (e.mp.detail.userInfo) {
        // 用户按了允许授权按钮
        this.userInfo = e.mp.detail.userInfo
        this.login()
      } else {
        // 用户按了拒绝按钮
        console.log('用户按了拒绝按钮11')
      }
    },
    authorize () {
      // 判断小程序的API，回调，参数，组件等是否在当前版本可用。  为false 提醒用户升级微信版本
      delay(() => {
        if (wx.canIUse('button.open-type.getUserInfo')) {
          // 用户版本可用
          // this.login()
        } else {
          this.toast.showZanToast({
            icon: 'fail',
            title: '请升级微信版本'
          }, 2000)
        }
      }, 300)
    },
    // 调用登录接口
    login () {
      const _this = this
      wx.login({
        success: (ck) => {
          if (ck.code) {
            console.log(ck)
            _this.wxOpenId(ck)
            // wx.navigateTo({url: '../home/main'})
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
        console.log(res)
        this.userInfoData()
      })
    },
    userInfoData () {
      console.log('res')
      API.userInfo({
        openid: wx.getStorageSync('openid') || '',
        nickname: this.userInfo.nickName || '',
        sex: this.userInfo.sex || '',
        province: this.userInfo.province || '',
        city: this.userInfo.city || '',
        country: this.userInfo.country || '',
        headimgurl: this.userInfo.avatarUrl || '',
        remark: this.userInfo.remark || ''
      }).then(res => {
        console.log(res)
        if (res.result === 1) {
          this.redirectPage()
        } else {
          wx.showToast({
            icon: 'fail',
            title: res.message || '授权失败！'
          })
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
      padding-top: 6px;
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
