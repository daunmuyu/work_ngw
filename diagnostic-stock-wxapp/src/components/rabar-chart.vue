<template>
  <div class="rabar_pane">
    <mpvue-echarts :echarts="echarts" :onInit="onInit" canvasId="rabarCanvas" />
  </div>
</template>
<script>
// 引入图标库
// import echarts from 'echarts/dist/echarts.min'
import mpvueEcharts from 'mpvue-echarts'
import echarts from '../../static/js/echarts.min'

export default {
  data () {
    return {
      echarts,
      onInit: null
    }
  },
  props: ['rabarData'],
  components: {
    mpvueEcharts
  },
  created () {
    this.onInit = (canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      })
      canvas.setChart(chart)

      const option = {
        backgroundColor: '#ffffff',
        color: ['#FF4C51', '#FF8F4C'],
        tooltip: {},
        xAxis: {
          show: false
        },
        yAxis: {
          show: false
        },
        radar: {
          // shape: 'circle',
          radius: '60%', // 图表占位比
          splitNumber: 3, // 内圈线
          splitArea: {
            areaStyle: {
              color: ['#fff']
            }
          },
          axisLine: {
            lineStyle: {
              color: '#E8E8E8'
            }
          },
          splitLine: {
            lineStyle: {
              color: '#E8E8E8'
            }
          },
          name: {
            textStyle: {
              color: '#52668C',
              fontSize: 10
            }
          },
          indicator: this.rabarData.indicator
        },
        series: [{
          type: 'radar',
          symbol: 'none',
          areaStyle: {normal: {
            opacity: 0.7
          }},
          data: [
            {
              value: this.rabarData.indicatorvalue
            }
          ],
          lineStyle: {
            opacity: 0
          }
        }]
      } // ECharts 配置
      chart.setOption(option)

      return chart // 返回 chart 后可以自动绑定触摸操作
    }
  }
}
</script>
<style lang="scss" scoped>
.rabar_pane {
  width: 150px;
  height: 140px;
  .ec-canvas {
    width: 100%;
    height: 100%;
  }
}
</style>
