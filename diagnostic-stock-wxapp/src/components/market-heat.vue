<template>
<!-- 市场热度 -->
  <div class="tab_view_pane">
    <div class="tab_view_main">
      <p>{{marketHeatData.contentmsg}}</p>
    </div>
    <div class="tab_view_graph">
      <h4>个股热度</h4>
      <div class="line_pane">
        <mpvue-echarts :echarts="echarts" :onInit="lineOneInit" canvasId="lineCanvas1" />
      </div>
      <h4>市场热度</h4>
      <div class="line_pane">
        <mpvue-echarts :echarts="echarts" :onInit="lineTwoInit" canvasId="lineCanvas2" />
      </div>
    </div>
  </div>
</template>

<script>
// import * as echarts from 'echarts/dist/echarts.min'
import mpvueEcharts from 'mpvue-echarts'
import echarts from '../../static/js/echarts.min'

export default {
  data () {
    return {
      echarts,
      lineOneInit: null,
      lineTwoInit: null
    }
  },
  components: {
    mpvueEcharts
  },
  props: ['marketHeatData'],
  created () {
    this.lineOneInit = (canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      })
      canvas.setChart(chart)
      const option = {
        backgroundColor: '#fff',
        color: ['#37A2DA'],
        grid: {
          left: 10,
          right: 10,
          bottom: 15,
          top: 15,
          containLabel: true
        },
        xAxis: {
          // boundaryGap: ['10%', '10%'],
          type: 'category',
          data: this.marketHeatData.stockheatxaxis,
          nameLocation: 'center',
          axisLabel: {
            showMaxLabel: true,
            color: '#8997A5',
            fontSize: 10,
            fontWeight: 'normal'
          },
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#E2E9F1',
              width: 1
            }
          }
        },
        yAxis: {
          x: 'center',
          type: 'value',
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: true,
            color: '#8997A5',
            fontSize: 12,
            formatter: (val) => {
              return (val * 100).toFixed(1) + '%'
            }
          }
        },
        series: [{
          name: '个股热度',
          type: 'line',
          data: this.marketHeatData.stockheatyaxis,
          lineStyle: {
            color: '#FF4C51',
            width: 1
          },
          hoverAnimation: false,
          itemStyle: {
            color: '#FF4C51'
          }
        }]
      }
      chart.setOption(option)
      return chart
    }
    this.lineTwoInit = (canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      })
      canvas.setChart(chart)
      const option = {
        backgroundColor: '#fff',
        color: ['#37A2DA'],
        grid: {
          left: 10,
          right: 10,
          bottom: 15,
          top: 15,
          containLabel: true
        },
        xAxis: {
          // boundaryGap: ['10%', '10%'],
          type: 'category',
          data: this.marketHeatData.markeheatxaxis,
          nameLocation: 'center',
          axisLabel: {
            showMaxLabel: true,
            color: '#8997A5',
            fontSize: 10,
            fontWeight: 'normal'
          },
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#E2E9F1',
              width: 1
            }
          }
        },
        yAxis: {
          x: 'center',
          type: 'value',
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: true,
            color: '#8997A5',
            fontSize: 12
          }
        },
        series: [{
          name: '市场热度',
          type: 'line',
          data: this.marketHeatData.markeheatyaxis,
          lineStyle: {
            color: '#FF4C51',
            width: 1
          },
          hoverAnimation: false,
          itemStyle: {
            color: '#FF4C51'
          }
        }]
      }
      chart.setOption(option)
      return chart
    }
  }
}
</script>
<style lang="scss" scoped>
.line_pane {
  width: 100%;
  height: 170px;
}
</style>
