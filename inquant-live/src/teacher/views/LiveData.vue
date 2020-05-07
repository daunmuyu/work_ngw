<template>
  <div>
    <div class="date-container">
      <!-- <h1>直播浏览量统计</h1> -->
      <Col span="6">
        <DatePicker @on-change="checkDateChange" :value="checkDate" :options="options3" type="date"  placeholder="选择查看日期" style="width: 200px"></DatePicker>
      </Col>
      <Col span="12">
          选择导出日期
          <DatePicker @on-change="exportDateChange" :options="options3" format="yyyy/MM/dd" type="daterange" placement="bottom-end" placeholder="选择导出日期" style="width: 200px"></DatePicker>
          <Button @click.native="downloadData" type="success">确认导出</Button>
      </Col>
    </div>
    <div class="chart-container">
      <div id="chart"></div>
      <div id="pie"></div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import {
  timeSegment,
  enterNum,
  exportData
} from '../api/index'

export default {
    data() {
      return {
        options3: {
          disabledDate (date) {
            return date && date.valueOf() > Date.now() - 86400000;
          }
        },
        checkDate: undefined,
        showCheckDate: '',
        exportDate: undefined,
      }
    },
    mounted() {
      this.checkDate = new Date(Date.now() - 86400000);
      this.initLine();
      this.initPie();
    },
    methods: {
      checkDateChange(date) {
        this.showCheckDate = date;
        this.initLine(date.replace(/-/g, ''));
        this.initPie(date.replace(/-/g, ''));
      },
      exportDateChange(date) {
        this.exportDate = date;
        console.log(this.exportDate)
      },
      initLine(date) {
        timeSegment({
          selectTime: date
        }).then((res) => {
          const lineAllData = res.data;
          const lineTitle = Object.keys(lineAllData);
          const processData = {
            d1: {
              name: [],
              data: []
            },
            d2: {
              name: [],
              data: []
            },
            d3: {
              name: [],
              data: []
            }
          }
          lineTitle.map((v, i) => {
            lineAllData[v].map((val) => {
              processData[v].name.push(val.text);
              processData[v].data.push(val.value)
            })
          })
          this.drawLine(processData, lineTitle);
        })
        
      },
      initPie(date) {
        enterNum({
          selectTime: date
        }).then((res) => {
          this.drawPie(res.data);
        })
      },
      downloadData() {
        console.log(this.exportDate)
        let data = '';
        if (this.exportDate) {
          data = `?startTime=${this.exportDate[0].replace(/\//g, '')}&endTime=${this.exportDate[1].replace(/\//g, '')}`
        }
        window.location.href = `https://live.inquant.cn/chatroom/livedata/export${data}`;
      },
      drawLine(data, title) {
        let chart = echarts.init(document.getElementById('chart'));
        chart.setOption({
          title: {
            text: '直播浏览数据统计'
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['乾坤看盘', '白马追踪', '准神联盟']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: data['d1'].name,
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            name: '乾坤看盘',
            type: 'line',
            // stack: '总量',
            data: data['d1'].data,
            smooth: true
          },
          {
            name: '白马追踪',
            type: 'line',
            // stack: '总量',
            data: data['d2'].data,
            smooth: true
          },
          {
            name: '准神联盟',
            type: 'line',
            // stack: '总量',
            data: data['d3'].data,
            smooth: true
          }]
        })
      },
      drawPie(data) {
        let pie = echarts.init(document.getElementById('pie'));
        pie.setOption({
          title: {
            text: '节目直播点击量统计',
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: ['乾坤看盘', '白马追踪', '准神联盟']
          },
          series: [{
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [{
              value: data['d1'],
              name: '乾坤看盘'
            },
            {
              value: data['d2'],
              name: '白马追踪'
            },
            {
              value: data['d3'],
              name: '准神联盟'
            },
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }]
        })
      }
    }
  }
</script>

<style>
.date-container {
  width: 100%;
  /* height: 74px; */
  /* margin-bottom: 50px; */
}
.chart-container {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
#chart {
  margin-top: 50px;
  width: 650px;
  height: 500px;
}
#pie {
  margin-left: 50px;
  margin-top: 50px;
  width: 650px;
  height: 500px;
}
</style>
