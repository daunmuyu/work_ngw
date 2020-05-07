<template>
  <div class="container">
    <div class="search_nav">
      <div class="search_pane">
        <label for="search_input"><img src="/static/img/stock_search@2x.png" alt=""></label>
        <input id="search_input" @input="inputTyping" v-model.trim="inputVal" focus="true" type="text" placeholder="搜索股票代码/全拼/首字母">
        <icon class="icon_clear" @click="clearInput" :hidden="!inputVal" type="clear" size="14"></icon>
      </div>
      <div class="weui-search-bar__cancel-btn" @click="hideInput">取消</div>
    </div>
    <!-- 搜索前页面显示 -->
    <div class="stock_pane" v-if="!inputShowed">
      <!-- <h5 class="title_pane" v-if="hotStock"><span>最火个股</span></h5>
      <div class="stock_box" v-if="hotStock">
        <template v-for="(item, index) in hotStock.data" wx:key="item.innercode">
        <div class="stock_item" @click="gotoStock(item)">
          <h6>{{item.stockName}}</h6>
          <p>{{item.stockcode}}</p>
        </div>
        </template>
      </div> -->
      <!-- 历史记录 -->
      <template v-if="history && history.length">
        <h5 class="title_pane"><span>历史搜索</span></h5>
        <div class="host_stock_pane">
          <template v-for="(item, index) in history" wx:key="index">
          <div class="stock_hist" @click="gotoStock(item)">
            <h6>{{item.stockName}}</h6>
            <p>{{item.stockcode}}</p>
          </div>
          </template>
        </div>
        <div class="clear_hist" @click="clearHistory">
          <span>清除历史记录</span>
        </div>
      </template>
    </div>
    <!-- 搜索中页面显示 -->
    <div class="stock_pane" v-if="inputShowed">
      <template v-if="searchData.length">
        <div class="stock_tab">
          <div><span>代码名称</span></div>
          <div><span>最新价</span></div>
          <div><span>涨跌幅</span></div>
        </div>
        <div class="search_stock">
          <template v-for="(item, key) in searchData" wx:key="item.stockcode">
            <div class="stock_list stock_hist" @click="gotoAddStock(item)">
              <div>
                <h6>{{item.stockname}}</h6>
                <p>{{item.stockcode}}</p>
              </div>
              <template v-if="item.updownrate == 0">
              <div class="font-gary"><b>{{item.nowprice}}</b></div>
              <div class="font-gary"><b>{{item.updownrate}}%</b></div>
              </template>
              <template v-else>
              <div :class="item.updownrate < 0 ? 'font-green' : 'font-red'"><b>{{item.nowprice}}</b></div>
              <div :class="item.updownrate < 0 ? 'font-green' : 'font-red'"><b>{{item.updownrate}}%</b></div>
              </template>
            </div>
          </template>
        </div>
      </template>
      <template v-else>
        <div class="search_none">
          <img src="/static/img/none.png" alt="">
          <p class="font-gary">未搜索到相关数据</p>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
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
      inputShowed: false,
      inputVal: '',
      searchData: null,
      hotStock: null,
      history: null
    }
  },
  onLoad () {
    this.inputVal = ''
    this.searchData = null
    this.inputShowed = false
    this.hotStock = null
    this.history = null
  },
  mounted () {
    this.hotData() // 获取热股
    this.historyData() // 获取搜索记录
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
    clorVn () {
      return 'font-red'
    },
    hideInput () {
      delay(() => {
        wx.navigateBack({delta: 1})
      }, 300)
    },
    clearInput () {
      this.inputVal = ''
      this.inputShowed = false
      this.searchData = null
      this.historyData() // 获取搜索记录
    },
    inputTyping (e) {
      this.inputVal = e.mp.detail.value
      if (!this.inputVal) {
        this.inputShowed = false
        this.historyData() // 获取搜索记录
      } else {
        delay(() => {
          this.queryStock(this.inputVal)
        }, 300)
      }
    },
    gotoStock (val) {
      delay(() => {
        wx.setStorageSync('innercode', val.innercode)
        wx.navigateTo({url: `../stock/main?code=${val.innercode}`})
      }, 300)
    },
    gotoAddStock (val) {
      delay(() => {
        const useCount = wx.getStorageSync('useCount')
        const hasmobile = wx.getStorageSync('hasmobile')
        if (!Number(hasmobile)) {
          if (!Number(useCount)) {
            wx.navigateTo({ url: '../phone/main' })
          } else {
            wx.setStorageSync('useCount', useCount - 1)
            this.addSearch(val)
            this.gotoStock(val)
          }
        } else {
          this.addSearch(val)
          this.gotoStock(val)
        }
      }, 300)
    },
    async addSearch (item) {
      await API.diagnosis({
        openid: wx.getStorageSync('openid'),
        innercode: item.innercode,
        stockcode: item.stockcode
      })
    },
    async queryStock (q) {
      if (!q) {
        this.inputShowed = false
        this.searchData = null
      } else {
        API.ngwSearch({q}).then(res => {
          if (res.status === 'success') {
            this.searchData = res.stocks
            this.inputShowed = true
          } else {
            console.log(res)
            wx.showToast({
              icon: 'error',
              title: res.message || '数据错误'
            })
          }
        })
      }
    },
    async hotData () {
      this.hotStock = await API.hotStock({})
    },
    async historyData () {
      const histData = await API.history({ openid: wx.getStorageSync('openid') })
      this.history = histData.data
    },
    clearHistory () {
      wx.showModal({
        content: '确认删除全部搜索历史记录？',
        showCancel: true,
        success: (res) => {
          if (res.confirm) {
            this.clearHist()
          }
        }
      })
    },
    async clearHist () {
      this.history = null
      await API.clearHist({ openid: wx.getStorageSync('openid') })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  color: #2A4159;
  .search_nav {
    width: 100%;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #e8e8e8;
    .weui-search-bar__cancel-btn {
      font-size: 14px;
      padding: 0 15px;
      color: #22BB7E;
    }
    .search_pane {
      width: 300px;
      height: 30px;
      background-color: #F4F5F6;
      margin: 10px 0 10px 15px;
      font-size: 12px;
      position: relative;
      .icon_clear {
        position: absolute;
        z-index: 9;
        top: 0px;
        right: 0px;
        border: 9px solid transparent;
        background-clip: padding-box;
        &::before {
          content: "";
          width: 40px;
          height: 40px;
          // background-color: #22BB7E;
          position: absolute;
          z-index: 9;
          top: -15px;
          right: -15px;
        }
      }
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
  .stock_pane {
    width: 100%;
    .search_none {
      padding-top: 40px;
      text-align: center;
      width: 100%;
      img {
        width: 111px;
        height: 79px;
      }
    }
    h6 {
      font-size: 16px;
    }
    p {
      font-size: 11px;
      color: #8997A5;
    }
    .stock_hist {
      padding: 12px 0;
      box-sizing: border-box;
      margin-left: 15px;
      border-bottom: 1px solid #e8e8e8;
      &:last-of-type {
        margin-left: 0;
        padding-left: 15px;
      }
    }
    .clear_hist {
      text-align: center;
      font-size: 14px;
      padding: 10px 0;
    }
    .stock_box {
      display: flex;
      flex-wrap: wrap;
      .stock_item {
        text-align: center;
        width: 33.33%;
        box-sizing: border-box;
        border-bottom: 1px solid #e8e8e8;
        padding: 8px 0;
        border-left: 1px solid #e8e8e8;
        &:nth-child(3n+1) {
          border-left: none;
        }
        // &:nth-child(2), &:nth-child(3), &:nth-child(5),
        // &:nth-child(6), &:nth-child(8), &:nth-child(9),
        // &:nth-child(11), &:nth-child(12), &:nth-child(14), 
        // &:nth-child(15), &:nth-child(17), &:nth-child(18) {
        //   border-left: 1px solid #e8e8e8;
        // }
      }
    }
  }
  .stock_tab {
    box-sizing: border-box;
    padding: 12px 15px;
    border-bottom: 1px solid #e8e8e8;
    font-size: 14px;
    color: #8997A5;
    display: flex;
    justify-content: space-between;
    div {
      flex: 1;
      &:nth-child(2) {
        text-align: center;
      }
      &:last-child {
        text-align: right;
      }
    }
  }
  .search_stock {
    .stock_list {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-right: 15px;
      div {
        flex: 1;
        &:nth-child(2) {
          text-align: center;
          font-size: 16px;
          font-weight: 600;
        }
        &:last-child {
          text-align: right;
          font-size: 16px;
          font-weight: 600;
        }
      }
    }
  }
  .title_pane {
    padding: 12px 0;
    border-bottom: 1px solid #e8e8e8;
    width: 100%;
    font-size: 14px;
    position: relative;
    &::before {
      content: "";
      position: absolute;
      width: 3px;
      height: 14px;
      top: 15px;
      left: 0;
      background-color: #ff4c51;
    }
    span {
      padding-left: 15px;
      line-height: 15px;
    }
  }
}
</style>
