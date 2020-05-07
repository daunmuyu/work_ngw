<template>
<!-- 主力资金 -->
  <div class="tab_view_pane">
    <div class="tab_view_main">
      <p>该股5日资金呈{{mianData.fivedayfundsflag}}，共计{{mianData.fivedayfundsflag}}{{mianData.fivedayfunds}}万元。最近一个交易日资金共计{{mianData.currentdayfundsflag}}{{mianData.currentdayfunds}}万元。</p>
    </div>
    <h4>今日资金流向</h4>
    <div class="bar_pane" v-if="fundsflow">
      <mpvue-echarts :echarts="echarts" :onInit="pieChart" canvasId="oneBarCanvas"/>
    </div>
    <h4><span class="font-gary">单位（万元）</span>近五日资金流</h4>
    <div class="bar_pane" v-if="fundsflow">
      <mpvue-echarts :echarts="echarts" :onInit="barChart" canvasId="twoBarCanvas"/>
    </div>
  </div>
</template>

<script>
import mpvueEcharts from 'mpvue-echarts'
import echarts from '../../static/js/echarts.min'
import API from './../utils/api'

let lineChart = null

const handleData = (num, str = false) => {
  const numStr = str ? num + str : num
  if (Number(num)) {
    return numStr
  }
  return ''
}

export default {
  data () {
    return {
      echarts,
      pieChart: null,
      barChart: null,
      fundsflow: null
    }
  },
  components: {
    mpvueEcharts
  },
  props: ['mianData'],
  mounted () {
    API.shqFlow({ code: wx.getStorageSync('innercode') }).then(res => {
      this.fundsflow = res
    })
  },
  created () {
    this.pieChart = (canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      })
      canvas.setChart(chart)
      let option = null
      if (Number(this.fundsflow.mainforcein) || Number(this.fundsflow.privateinvestin) || Number(this.fundsflow.mainforceout) || Number(this.fundsflow.privateinvestout)) {
        option = {
          backgroundColor: '#ffffff',
          color: ['#ff4248', '#ff7034', '#1db272', '#56de96'],
          title: {
            text: '资金\n流向',
            left: 'center',
            top: 'middle',
            textStyle: {
              color: '#8997A5',
              fontWeight: 'bold',
              fontSize: 16
            }
          },
          silent: true,
          series: [{
            label: {
              normal: {
                fontSize: 14
              }
            },
            type: 'pie',
            center: ['50%', '50%'],
            radius: [0, '80%']
          },
          {
            type: 'pie',
            radius: ['25%', '70%'],
            data: [{
              value: handleData(this.fundsflow.mainforcein),
              name: handleData(this.fundsflow.mainforcein, '%\r\n主力流入')
            }, {
              value: handleData(this.fundsflow.privateinvestin),
              name: handleData(this.fundsflow.privateinvestin, '%\r\n散户流入')
            }, {
              value: handleData(this.fundsflow.mainforceout),
              name: handleData(this.fundsflow.mainforceout, '%\r\n主力流出')
            }, {
              value: handleData(this.fundsflow.privateinvestout),
              name: handleData(this.fundsflow.privateinvestout, '%\r\n散户流出')
            }]
          }]
        }
      } else {
        option = {
          backgroundColor: '#ffffff',
          color: ['#eeeeee'],
          title: {
            text: '暂无\n数据',
            left: 'center',
            top: 'middle',
            textStyle: {
              color: '#8997A5',
              fontWeight: 'bold',
              fontSize: 16
            }
          },
          silent: true,
          series: [{
            type: 'pie',
            center: ['50%', '50%'],
            radius: [0, '80%']
          },
          {
            type: 'pie',
            radius: ['25%', '70%'],
            itemStyle: {
              normal: {
                label: {
                  show: false
                },
                labelLine: {
                  show: false
                }
              }
            },
            data: [{
              value: 0
            }]
          }]
        }
      }
      chart.setOption(option)
      return chart
    }
    this.barChart = (canvas, width, height) => {
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
          bottom: 20,
          top: 20,
          containLabel: true
        },
        xAxis: {
          data: (() => {
            const arr = []
            for (let i in this.fundsflow.list) {
              arr.push(this.fundsflow.list[i].date)
            }
            return arr
          })(),
          axisLine: {
            lineStyle: {
              color: '#999'
            }
          },
          axisLabel: {
            color: '#666'
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          }
        },
        yAxis: {
          axisTick: { show: false },
          splitLine: {
            show: false
          },
          axisLabel: {
            show: false
          },
          axisLine: {
            show: false
          }
        },
        series: [
          {
            name: '近五日资金流',
            type: 'bar',
            animation: false,
            barWidth: 30,
            label: {
              show: true,
              position: 'top'
            },
            itemStyle: {
              color: (params) => {
                if (params.value < 0) return '#56de96'
                return '#ff4248'
              }
            },
            data: (() => {
              const arr = []
              for (let i in this.fundsflow.list) {
                arr.push(this.fundsflow.list[i].val)
              }
              return arr
            })()
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
h4 {
  padding-top: 15px;
  span {
    float: right;
  }
}
.bar_pane {
  width: 100%;
  height: 200px;
  position: relative;
  border-bottom: 1px solid #eeeeee;
  &:last-child {
    border: none;
  }
}
</style>
