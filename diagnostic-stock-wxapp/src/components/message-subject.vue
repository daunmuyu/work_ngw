<template>
<!-- 消息题材 -->
  <div class="tab_view_pane">
    <div class="tab_view_main">
      <p>该板块题材今日热度{{msgSjtData.industrymsg}}板块个股{{msgSjtData.industryflag}}关注。而该股{{msgSjtData.industrystockflag}}</p>
    </div>
    <div class="tab_view_graph">
      <h4 v-if="warnlist">近期大事</h4>
      <div class="msg_pane" v-if="warnlist">
        <template v-for="(item, index) in warnlist" wx:key="index">
        <div class="msg_list">
          <h6>{{item[0]}}&nbsp;&nbsp;{{item[1]}}</h6>
          <p>{{item[2]}}</p>
        </div>
        </template>
      </div>
      <div class="msg_graph">
        <h6>题材解读</h6>
        <p>该板块题材今日热度{{msgSjtData.industrymsg}}板块内部有{{msgSjtData.industryupcount}}支股票上涨，其中{{msgSjtData.industrylimtupcount}}支涨停。有{{msgSjtData.industrydowncount}}支股票下跌，其中{{msgSjtData.industrylimtdowncount}}支跌停。</p>
      </div>
    </div>
    <div class="bar_pane">
      <mpvue-echarts :echarts="echarts" :onInit="onInit" canvasId="barCanvas"/>
    </div>
  </div>
</template>

<script>
import mpvueEcharts from 'mpvue-echarts'
import echarts from '../../static/js/echarts.min'
import API from '../utils/api'

let lineChart = null

export default {
  data () {
    return {
      warnlist: null,
      echarts,
      onInit: null,
      dshData: null
    }
  },
  components: {
    mpvueEcharts
  },
  props: ['msgSjtData'],
  mounted () {
    API.shqStock({
      type: 0,
      packtype: 0,
      version: '4.3.9',
      code: wx.getStorageSync('innercode')
    }).then(res => {
      if (res && res.warnlist) {
        this.warnlist = res.warnlist
      }
    })
  },
  created () {
    this.onInit = (canvas, width, height) => {
      lineChart = echarts.init(canvas, null, {
        width: width,
        height: height
      })
      canvas.setChart(lineChart)

      const option = {
        color: ['#37a2da', '#32c5e9', '#67e0e3'],
        tooltip: {
          show: false
        },
        legend: {
          show: false
        },
        grid: {
          left: 20,
          right: 20,
          bottom: 15,
          top: 20,
          containLabel: true
        },
        xAxis: {
          data: ['涨停', '上涨', '下跌', '跌停'],
          axisLabel: {
            show: true,
            color: '#8997A5',
            fontSize: 12
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          }
        },
        yAxis: {
          axisTick: { show: false },
          splitLine: {
            show: true,
            lineStyle: {
              width: 1,
              color: '#E8E8E8'
            }
          },
          axisLabel: {
            show: true,
            color: '#8997A5',
            fontSize: 12
          },
          axisLine: {
            show: false
          }
        },
        series: [
          {
            name: '热度',
            type: 'bar',
            animation: false,
            label: {
              normal: {
                show: true,
                position: 'top'
              }
            },
            barWidth: 30,
            itemStyle: {
              fontSize: 13
            },
            data: [
              {
                value: this.msgSjtData.industrylimtupcount,
                itemStyle: {
                  color: 'rgba(255, 76, 81, 0.6)'
                },
                label: {
                  color: '#FF4C51'
                }
              },
              {
                value: this.msgSjtData.industryupcount,
                itemStyle: {
                  color: 'rgba(255, 76, 81, 0.6)'
                },
                label: {
                  color: '#FF4C51'
                }
              },
              {
                value: this.msgSjtData.industrydowncount,
                itemStyle: {
                  color: 'rgba(69, 140, 245, 0.8)'
                },
                label: {
                  color: '#458CF5'
                }
              },
              {
                value: this.msgSjtData.industrylimtdowncount,
                itemStyle: {
                  color: 'rgba(69, 140, 245, 0.8)'
                },
                label: {
                  color: '#458CF5'
                }
              }
            ]
          }
        ]
      }

      lineChart.setOption(option)
      return lineChart
    }
  }
}
</script>

<style lang="scss" scoped>
.msg_pane {
  padding-bottom: 20px;
  border-bottom: 1px solid #e8e8e8;
  .msg_list {
    position: relative;
    padding: 0 15px 15px;
    &::before {
      content: "";
      position: absolute;
      left: 3px;
      top: 8px;
      height: 100%;
      border-left: 1px solid #8697A7;
    }
    &::after {
      content: "";
      position: absolute;
      border: 3.5px solid #8697A7;
      border-radius: 50%;
      overflow: hidden;
      left: 0;
      top: 8px;
    }
    &:last-child {
      padding-bottom: 0;
      &::before {
        height: calc(100% - 12px);
      }
    }
    h6 {
      color: #2A4860;
      font-size: 14px;
      font-weight: 600;
    }
    p {
      padding-top: 5px;
      color: #8697A7;
      font-size: 14px;
      line-height: 1.5;
    }
  }
}
.msg_graph {
  padding: 15px 0;
  h6 {
    font-size: 14px;
    color: #2A4860;
  }
  p {
    padding-top: 5px;
    font-size: 14px;
    color: #8697A7;
    line-height: 1.5;
  }
}
.bar_pane {
  width: 100%;
  height: 170px;
}
</style>
