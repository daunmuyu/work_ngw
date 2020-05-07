<template>
<div>
  <div class="phone_view" v-if="hasmobile" @click="toastHide">
    <div class="phone_toast">
      <div class="toast_titlte">温馨提示</div>
      <div class="toast_cont">您的3次免费诊股机会已经用尽<br/>授权微信注册手机号注册涨了么账号<br/>获得无限诊股机会！</div>
      <div class="toast_btn">
        <button open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">获取手机号</button>
      </div>
    </div>
  </div>
  <_toast></_toast>
</div>
</template>
<script>
import { getComponentByTag } from '@/utils/helper'
import ZanToast from 'mpvue-zanui/src/components/zan/toast'
import API from './../utils/api'
export default {
  data () {
    return {
      hasmobile: false
    }
  },
  components: {
    _toast: ZanToast
  },
  props: ['getPhone'],
  watch: {
    getPhone (val) {
      this.hasmobile = val
    }
  },
  mounted () {
    this.toast = getComponentByTag(this, '_toast')
    this.login()
    this.getSetting()
  },
  methods: {
    getSetting () {
      wx.getSetting({
        success: (res) => {
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: (rs) => {
                console.log('用户已经授权过')
              }
            })
          } else {
            console.log('用户还未授权过')
          }
        }
      })
    },
    getPhoneNumber (e) {
      wx.checkSession({
        success: (res) => {
          console.log(res)
        }
      })
      console.log(445)
      console.log(e)
    },
    toastHide () {
      this.hasmobile = false
      this.$emit('childPhone', this.hasmobile)
    },
    telPhone () {
      console.log('click=>getPhoneNumber')
    },
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
        code: ck.code,
      }).then(res => {
        this.session = res
        wx.setStorageSync('openid', res.openid)
        wx.setStorageSync('session_key', res.session_key)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.phone_view {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  .phone_toast {
    width: 80%;
    padding-top: 10px;
    text-align: center;
    background-color: white;
    border-radius: 5px;
    overflow: hidden;
    .toast_titlte {
      padding: 10px 0;
      font-size: 18px;
    }
    .toast_cont {
      color: #999;
      font-size: 14px;
      line-height: 1.6;
      padding-bottom: 10px;
    }
    .toast_btn {
      button {
        background: #fff;
        color: #FF4C51;
      }
    }
  }
}
</style>
