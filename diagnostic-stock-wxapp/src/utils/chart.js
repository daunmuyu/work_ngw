import WxCharts from '../../static/js/wxcharts.min.js'
export default {
  draw (id, type, data) {
    const chart = new WxCharts({
      canvasId: id,
      type,
      ...this[type](data)
    })
    console.log(chart)
  },
  radar (data) {
    let options = {
      categories: data.titles,
      series: [{
        name: '成交量1',
        data: data.rows
      }],
      width: 320,
      height: 200,
      extra: {
        radar: {
          max: 150
        }
      },
      legend: false
    }
    return options
  }
}
