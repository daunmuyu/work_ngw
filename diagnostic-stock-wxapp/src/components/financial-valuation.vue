<template>
<!-- 财务估值 -->
  <div class="tab_view_pane">
    <div class="tab_view_main">
      <p>该公司盈利能力{{financialData.profitabilityflag}}，成长能力{{financialData.growthabilityflag}}，市场机构认为{{financialData.typeflag}}机会{{financialData.marketflag}}。</p>
    </div>
    <div class="rabar_pane" v-if="financialData">
      <mpvue-echarts :echarts="echarts" :onInit="onInit" canvasId="financaCanvas" />
    </div>
  </div>
</template>

<script>
import mpvueEcharts from 'mpvue-echarts'
import echarts from '../../static/js/echarts.min'

export default {
  data () {
    return {
      echarts,
      onInit: null
    }
  },
  components: {
    mpvueEcharts
  },
  props: ['financialData'],
  created () {
    console.log(this.financialData)
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
          // splitNumber: 3, // 内圈线
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
              fontSize: 12
            }
          },
          indicator: this.financialData.financialindicator
        },
        series: [{
          type: 'radar',
          symbol: 'none',
          areaStyle: {normal: {
            opacity: 0.7
          }},
          data: [
            {
              value: this.financialData.financialvalue
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
  width: 100%;
  height: 345px;
}
</style>
