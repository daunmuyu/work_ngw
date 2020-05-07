<template>
  <div class="container">
    <div class="search_bg_pane">
      <img class="banner_bg" src="/static/img/diagnose_stock_banner@2x.png" alt="">
      <div class="search_nav">
        <div class="search_pane" @click="goToSearch">
          <label for="search_input"><img src="/static/img/stock_search@2x.png" alt=""></label>
          <input id="search_input" disabled type="text" placeholder="搜索股票代码/全拼/首字母">
        </div>
        <div class="nav_cont">
          <img src="/static/img/diagnose_stock_graph@2x.png" alt="">
          <div class="cont_text">
            <h5>AI智能诊股</h5>
            <p>以数据为基础多维度研判，市场、题材、资金、财务、技术五维模型让优质股票无处可遁。</p>
          </div>
        </div>
      </div>
    </div>
    <div class="cont-pane">
      <h5 class="title_pane">
        <img src="/static/img/diagnose_stock_title_left@2x.png" alt="">
        <span>多维度智能诊股</span>
        <img src="/static/img/diagnose_stock_title_right@2x.png" alt="">
        </h5>
      <div class="data_pane" v-if="homeData">
        <div class="diagnose_stock">
          <p>累计诊股</p>
          <h6>{{homeData.totalcount}}次</h6>
        </div>
        <div class="diagnose_stock">
          <p>今日诊股</p>
          <h6>{{homeData.todayCount}}次</h6>
        </div>
        <div class="diagnose_stock">
          <template v-if="homeData.hasmobile != 0">
          <p>累计诊股总人数</p>
          <h6>{{homeData.totalUser}}人</h6>
          </template>
          <template v-else>
          <p>剩余免费诊股</p>
          <h6>{{homeData.useCount}}次</h6>
          </template>
        </div>
      </div>
      <!-- <h5 class="title_pane">
        <img src="/static/img/diagnose_stock_title_left@2x.png" alt="">
        <span>最火个股</span>
        <img src="/static/img/diagnose_stock_title_right@2x.png" alt="">
      </h5>
      <div class="hot_stock" v-if="homeData">
        <template v-for="(item, index) in homeData.data" wx:key="item.innercode">
        <button class="stock_btn" @click="gotoStock(item)">{{item.stockName}}</button>
        </template>
      </div> -->
    </div>
    <!-- <phone :get-phone="getPhone" v-on:childPhone="childPhone"></phone> -->
  </div>
</template>

<script>
import API from './../../utils/api'
// import Phone from './../../components/phone'
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
      homeData: null,
      getPhone: false
    }
  },
  // components: {
  //   Phone
  // },

  onShow () {
    this.indexData()
    this.getSetting()
  },
  mounted () {
    wx.showShareMenu({
      withShareTicket: true
    })
  },
  methods: {
    childPhone (val) {
      this.getPhone = val
    },
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
    goToSearch () {
      delay(() => {
        API.indexData({ openid: wx.getStorageSync('openid') }).then(res => {
          this.homeData = res
          wx.setStorageSync('hasmobile', this.homeData.hasmobile)
          wx.setStorageSync('useCount', this.homeData.useCount)
          if (this.homeData.hasmobile === '0' && this.homeData.useCount === '0') {
            wx.navigateTo({ url: '../phone/main' })
          } else {
            const url = '../search/main'
            wx.navigateTo({ url })
          }
        })
      }, 300)
    },
    async indexData () {
      this.homeData = await API.indexData({ openid: wx.getStorageSync('openid') })
      wx.setStorageSync('hasmobile', this.homeData.hasmobile)
      wx.setStorageSync('useCount', this.homeData.useCount)
    },
    gotoStock (val) {
      delay(() => {
        wx.setStorageSync('innercode', val.innercode)
        wx.navigateTo({url: `../stock/main?code=${val.innercode}`})
      }, 300)
    }
  }
}
</script>

<style  lang="scss" scoped>
.container {
  .search_bg_pane {
    width: 100%;
    height: 235px;
    position: relative;
    overflow: hidden;
    .banner_bg {
      width: 100%;
      height: 293px;
      position: absolute;
      bottom: 0;
      left: 0;
    }
  }
  .search_nav {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 235px;
    .search_pane {
      width: 345px;
      height: 30px;
      background-color: rgba($color: #fff, $alpha: 0.9);
      margin: 10px auto;
      font-size: 12px;
      position: relative;
      label {
        img {
          width: 13px;
          height: 13px;
          position: absolute;
          top: 9px;
          left: 12px;
        }
      }
      input {
        display: block;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        padding-left: 30px;
      }
    }
    .nav_cont {
      width: 345px;
      margin: 0 auto;
      padding-top: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      img {
        display: block;
        width: 134px;
        height: 113px;
      }
      .cont_text {
        width: 175px;
        color: #fff;
        h5 {
          font-weight: 600;
          line-height: 1.6;
          font-size: 20px;
          padding-bottom: 6px;
        }
        p {
          font-size: 12px;
          line-height: 1.6;
        }
      }
    }
  }
  .cont-pane {
    width: 345px;
    margin: 0 auto;
    h5.title_pane {
      color: #2A4159;
      line-height: 20px;
      text-align: center;
      padding-bottom: 15px;
      padding-top: 30px;
      font-size: 16px;
      font-weight: 600;
      span {
        padding: 0 15px;
      }
      img {
        display: inline-block;
        content: "";
        width: 12px;
        height: 12px;
      }
    }
    .data_pane {
      padding: 10px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .diagnose_stock {
        width: 33%;
        box-sizing: border-box;
        height: 38px;
        text-align: center;
        p {
          color: #999;
          font-size: 12px;
          line-height: 18px;
        }
        h6 {
          color: #2A4159;
          font-size: 16px;
          font-weight: 600;
          line-height: 18px;
        }
        &:nth-child(2) {
          border-left: 1px solid #E8E8E8;
          border-right: 1px solid #E8E8E8;
        }
      }
    }
    .hot_stock {
      display: flex;
      padding: 10px 0;
      margin: 0 auto;
      width: 345px;
      flex-wrap: wrap;
      button {
        width: 100px;
        height: 33px;
        box-sizing: border-box;
        border-color: #E2E9F1;
        background-color: #F9FBFD;
        font-size: 14px;
        color: #52668C;
        margin-bottom: 10px;
        &:active {
          background-color: #E2E9F1;
        }
      }
    }
  }
}
</style>
