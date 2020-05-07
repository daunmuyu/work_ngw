<template>
  <div class="container">
    <div class="stock-container">
      <!-- 预警盯盘 -->
      <!-- <div class="waring-pane">
        <img class="warn-icon" src="/static/img/yujingdingpan_icon@2x.png" alt="">
        <div class="warn-cont">
          <h6>预警盯盘</h6>
          <p>盘面机会，持仓异动，尽在掌握</p>
        </div>
        <img class="warn-btn" src="/static/img/shezhidingpan@2x.png" alt="">
      </div> -->
      <!-- 个股信息 -->
      <div class="stock-pane">
        <div class="stock-name" v-if="stockData.stockname">
          <h5 class="font-black">{{stockData.stockname}}<span class="font-gary">{{stockData.stockcode}}</span></h5>
          <h5 class="font-black"><b>{{stockData.lastpx}}</b></h5>
          <template v-if="stockData.issuspend">
            <h5 class="font-gary"><b>停牌</b></h5>
          </template>
          <template v-else>
            <template v-if="stockData.updownrate == 0">
            <h5 class="font-gary"><b>{{(0 | stockData.updownrate * 10000) / 100}}%</b></h5>
            </template>
            <template v-else>
            <h5 :class="stockData.updownrate < 0 ? 'font-green' : 'font-red'"><b>{{(0 | stockData.updownrate * 10000) / 100}}%</b></h5>
            </template>
          </template>
        </div>
        <div class="graph-pane">
          <div class="graph">
            <!-- <mpvue-echarts :echarts="echarts" :onInit="onInit" canvasId="rabar-canvas" /> -->
            <rabar-chart v-if="stockData.fivelinesfiguredata" :rabar-data="stockData.fivelinesfiguredata" />
          </div>
          <p class="font-gary" v-if="stockData.fivelinesfiguredata">近期该股消息面{{stockData.fivelinesfiguredata.noticflag}}，有资金{{stockData.fivelinesfiguredata.fundsflowflag}}迹象，短期呈{{stockData.fivelinesfiguredata.sortflag}}趋势，公司质地{{stockData.fivelinesfiguredata.companyqualityflag}}。</p>
        </div>
      </div>
      <!-- 个股分析 -->
      <div class="analyze-pane">
        <h5><span>短线分析</span></h5>
        <template v-if="stockData.shorttermanalysisdata">
          <p class="font-gary" v-if="stockData.shorttermanalysisdata.newstockmsg">{{stockData.shorttermanalysisdata.newstockmsg}}</p>
          <p class="font-gary" v-else>该股目前压力位{{stockData.shorttermanalysisdata.press}}元，支撑位{{stockData.shorttermanalysisdata.support}}元。近期平均成本{{stockData.shorttermanalysisdata.averagecost}}元，股价在成本{{stockData.shorttermanalysisdata.analysisflage}}运行。</p>
        </template>
        <h5><span>中长线分析</span></h5>
        <template v-if="stockData.isnew">
          <p class="font-gary" >新股上市，暂无数据。</p>
        </template>
        <template v-else>
          <p class="font-gary" v-if="stockData.longtermanalysisdata">近20日资金呈{{stockData.longtermanalysisdata.twentydayfundsflag}}状态，共计{{stockData.longtermanalysisdata.twentydayfundsflag}}{{stockData.longtermanalysisdata.twentydayfunds}}万元。近5日资金呈{{stockData.longtermanalysisdata.fivedayfundsflag}}状态，共计{{stockData.longtermanalysisdata.fivedayfundsflag}}{{stockData.longtermanalysisdata.fivedayfunds}}万元。最近一个交易日资金共计{{stockData.longtermanalysisdata.currentdayfundsflag}}{{stockData.longtermanalysisdata.currentdayfunds}}万元。</p>
        </template>

      </div>
    </div>
    <!-- 个股tab信息 -->
    <div class="stock_tap_container">
      <zan-tab v-bind="tabNav" :componentId="'tabNav'" @change="handleZanTabChange"/>
      <div class="stock_cont_pane">
        <market-heat v-if="selectedId == 1 && stockData.marketheatdata" :market-heat-data="stockData.marketheatdata"></market-heat>
        <message-subject v-if="selectedId == 2 && stockData.messagesubjectdata" :msg-sjt-data="stockData.messagesubjectdata"></message-subject>
        <main-funds v-if="selectedId == 3 && stockData.mianfundsdata" :mian-data="stockData.mianfundsdata"></main-funds>
        <financial-valuation v-if="selectedId == 4 && stockData.financialdata" :financial-data="stockData.financialdata"></financial-valuation>
        <technical-analysis v-if="selectedId == 5 && stockData.technicalindicatorsdata" :technical-data="stockData.technicalindicatorsdata"></technical-analysis>
      </div>
    </div>
  </div>
</template>

<script>
// 引用 tab 小插件
import ZanTab from 'mpvue-zanui/src/components/zan/tab'
// rabar charts
import RabarChart from '@/components/rabar-chart'
// tab - view 小组件
import MarketHeat from '@/components/market-heat'
import MessageSubject from '@/components/message-subject'
import MainFunds from '@/components/main-funds'
import FinancialValuation from '@/components/financial-valuation'
import TechnicalAnalysis from '@/components/technical-analysis'

import API from '@/utils/api'
// import { getQuery } from '@/utils/index'

export default {
  data () {
    return {
      tabNav: null,
      selectedId: 1,
      fundsData: null,
      stockData: null
    }
  },
  components: {
    MarketHeat,
    MessageSubject,
    MainFunds,
    FinancialValuation,
    TechnicalAnalysis,
    ZanTab,
    RabarChart
  },
  onLoad () {
    this.tabNav = {
      list: [{
        id: '1',
        title: '市场热度'
      }, {
        id: '2',
        title: '消息题材'
      }, {
        id: '3',
        title: '主力资金'
      }, {
        id: '4',
        title: '财务估值'
      }, {
        id: '5',
        title: '技术研判'
      }],
      selectedId: '1',
      scroll: true,
      height: 35
    }
    this.selectedId = 1
    this.fundsData = null
    this.stockData = {
      fivelinesfiguredata: null,
      shorttermanalysisdata: null,
      longtermanalysisdata: null,
      marketheatdata: null,
      messagesubjectdata: null,
      mianfundsdata: null,
      financialdata: null,
      technicalindicatorsdata: null
    }
  },
  mounted () {
    this.homeData()
    this.getSetting()
  },
  methods: {
    ...ZanTab.methods,
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
    handleZanTabChange (e) {
      const {componentId, selectedId} = e
      this[componentId].selectedId = selectedId
      this.selectedId = this[componentId].selectedId
    },
    homeData () {
      API.homeData({ code: wx.getStorageSync('innercode') }).then(res => {
        if (res.code === 0) {
          this.stockData = res
        } else {
          wx.showToast({
            icon: 'fail',
            title: res.message || '数据异常！'
          })
        }
      })
    },
    numToFixed (num) {
      return (num * 100).toFixed()
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  background-color: #F4F5F6;
  font-size: 14px;
  .stock-container {
    background-color: #fff;
    width: 100%;
    .waring-pane {
      background-image: url('data:image/png;base64,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');
      background-repeat: no-repeat;
      background-size: contain;
      width: 366px;
      height: 71px;
      margin: 15px auto;
      display: flex;
      align-items: center;
      justify-content: center;
      padding-left: 10px;
      box-sizing: border-box;
      .warn-icon {
        width: 31px;
        height: 32.5px;
        display: block;
      }
      .warn-cont {
        width: 180px;
        color: #fff;
        opacity: .8;
        padding-left: 10px;
        box-sizing: border-box;
        h6 {
          font-size: 16px;
          font-weight: 600;
        }
        p {
          font-size: 12px;
        }
      }
      .warn-btn {
        width: 104px;
        height: 54px;
        display: block;
      }
    }
    .stock-pane {
      width: 345px;
      margin: 0 auto;
      .stock-name {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 16px;
        h5 {
          width: 40%;
          span {
            font-size: 12px;
          }
          &:nth-child(2) {
            width: 20%;
            text-align: center;
          }
          &:last-child {
            text-align: right;
          }
        }
      }
      .graph-pane {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 0;
        border-bottom: 1px solid #E8E8E8;
        .graph {
          width: 150px;
          height: 140px;
        }
        p {
          width: 180px;
          line-height: 1.5;
        }
      }
    }
    .analyze-pane {
      width: 345px;
      padding-bottom: 20px;
      margin: 0 auto;
      h5 {
        background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkBAMAAAATLoWrAAAAElBMVEX/TFH/TVH/TVAAAAD/TFH///95LegTAAAABHRSTlPxrSYAnzdaTwAAADxJREFUKM9jMBJwQQGMygwKLmiAiUEEXciRgQVdyIHBBQPQT8g1NIRCIRhv2AvRNYYwkwm2xISZ5LAkTACjX6zLfbL4IwAAAABJRU5ErkJggg==');
        background-position: left center;
        background-size: 18px 18px;
        background-repeat: no-repeat;
        padding-left: 28px;
        line-height: 1.5;
        font-size: 16px;
        margin-top: 25px;
      }
      p {
        padding-top: 6px;
        line-height: 1.5;
      }
    }
  }
  .stock_tap_container {
    width: 100%;
    background-color: #fff;
    margin-top: 5px;
  }
}
</style>
