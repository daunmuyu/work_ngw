import _ from 'underscore';
import {
  MaByDay,
  MA,
  MACD,
  KDJ,
  RSI,
} from './DataStatistic.js';

import './style.scss';

const echarts = window.echarts;

// ma5线颜色
const colorMa5 = '#faaf66';
// ma10线颜色
const colorMa10 = '#5970e8';
// ma20线颜色
const colorMa20 = '#bd4aac';

/**
 * 初始化echart
 */
const chartConfig = {
  tooltip: {
    show: true,
    showContent: true,
    formatter(params) {
      const tem = params.map((item) => {
        if (item.seriesType === 'candlestick') {
          return `开价：${item.data[0]}<br/>收价：${item.data[1]}<br/>最低：${item.data[2]}<br/>最高：${item.data[3]}`;
        }
        return `${item.seriesName}：${item.data}`;
      }).join('<br />');
      return `${params[0].name}<br/>${tem}`;
    },
    trigger: 'axis',
    axisPointer: {
      type: 'line',
    },
  },
  grid: [{
    left: '60',
    right: '10',
    top: '5',
    height: '90%',
  }],
};

const seriesConfig = {
  // k线图基本设置
  candle: {
    type: 'candlestick',
    animation: false,
    itemStyle: {
      normal: {
        color: '#ef232a',
        color0: '#14b143',
        borderColor: '#ef232a',
        borderColor0: '#14b143',
      },
    },
  },
  // 折线图基本设置
  line: {
    type: 'line',
    animation: false,
    smooth: true,
    showSymbol: false,
    symbol: 'emptyCircle',
    symbolSize: 2,
    lineStyle: {
      normal: {
        opacity: 0.5,
        width: 1,
      },
    },
  },
  // 柱状图基本设置
  bar: {
    type: 'bar',
    animation: false,
    itemStyle: {
      normal: {},
    },
  },
};
/**
 * 获取分时图设置
 */
function getShareOption(opt) {
  return {
    ...chartConfig,
    xAxis: [{
      type: 'category',
      scale: true,
      axisLine: {
        onZero: false,
      },
      axisTick: {
        show: false,
      },
      splitNumber: 5,
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dotted',
        },
        interval: index => opt.xSplitIndexData.indexOf(index + 1) > -1,
      },
      axisLabel: {
        interval: index => opt.xSplitIndexData.indexOf(index + 1) > -1,
        formatter: (val, index) => {
          const ind = opt.xSplitIndexData.indexOf(index + 1);
          if (ind > -1) {
            if (ind === 0) {
              return `         ${opt.xSplitTextData[ind]}`;
            } else if (ind === opt.xSplitTextData.length - 1) {
              return `${opt.xSplitTextData[ind]}         `;
            }
            return opt.xSplitTextData[ind];
          }
          return '';
        },
      },
      data: _.range(opt.xCount),
    }],
    yAxis: [{
      scale: true,
      splitNumber: 5,
      splitArea: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dotted',
        },
      },
      axisLabel: {
        show: false,
      },
    }],
  };
}
/**
 * 获取分时图数据
 */
function getShareSeries(opt, data) {
  return [{
    type: 'line',
    name: '价格',
    data: data.map(item => item.curp),
    smooth: false,
    itemStyle: {
      normal: {
        color: '#6d7cff',
      },
    },
    areaStyle: {
      normal: {
        color: '#eee',
      },
    },
  }, {
    type: 'line',
    name: 'ma',
    data: MA(data.map(item => [+item.curvalue, +item.curvolume]), opt.place),
    smooth: true,
    lineStyle: {
      normal: {
        opacity: 0.5,
        color: colorMa5,
      },
    },
    itemStyle: {
      normal: {
        opacity: 0.5,
        color: colorMa5,
      },
    },
  }];
}
/**
 * 获取k线图设置
 */
function getKLineOption(opt, data) {
  const xAxisName = opt.xAxisName || 'timestamp';
  return {
    ...chartConfig,
    dataZoom: [{
      type: 'inside',
      start: 100 - (6000 / data.length),
      end: 100,
      // zoomLock: true,
    }],
    xAxis: [{
      type: 'category',
      scale: true,
      axisLine: {
        onZero: false,
      },
      axisLabel: {
        formatter: (val, index) => {
          if (index === 0) {
            return `      ${val}`;
          } else if (index === 30) {
            return `${val}        `;
          }
          return val;
        },
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dotted',
        },
      },
      splitNumber: 5,
      data: data.map(item => item[0]),
    }],
    yAxis: [{
      scale: true,
      splitNumber: 5,
      splitArea: {
        show: false,
      },
      axisLine: {
        show: false,
        onZero: false,
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dotted',
        },
      },
      axisLabel: {
        show: true,
      },
    }],
  };
}
/**
 * 获取K线图数据
 * markLineData(Array):建仓数据
 */
function getKLineSeries(opt, data, markLineData, tradelines) {
  // 交易线和建仓线的数据
  const mdata = markLineData.concat(tradelines);
  return [{
    ...seriesConfig.candle,
    name: 'k线图',
    data: data.map(item => [item[1], item[4], item[3], item[2]]),
    markLine: {
      symbol: ['none', 'none'],
      precision: 6,
      silent: true,
      label: {
        normal: {
          show: true,
          position: 'middle',
        },
        emphasis: {
          show: true,
          animation: true,
        },
      },
      data: mdata,
    },
  }, {
    ...seriesConfig.line,
    name: 'ma5',
    itemStyle: {
      normal: {
        opacity: 1,
        color: colorMa5,
      },
    },
    data: MaByDay(data.map(item => item[4]), 5, opt.place),
  }, {
    ...seriesConfig.line,
    name: 'ma10',
    itemStyle: {
      normal: {
        opacity: 1,
        color: colorMa10,
      },
    },
    data: MaByDay(data.map(item => item[4]), 10, opt.place),
  }, {
    ...seriesConfig.line,
    name: 'ma20',
    itemStyle: {
      normal: {
        opacity: 1,
        color: colorMa20,
      },
    },
    data: MaByDay(data.map(item => item[4]), 20, opt.place),
  }];
}
/**
 * 获取分时图副图设置
 */
function getShareBottomOption(opt) {
  return {
    grid: [{
      left: '60',
      right: '5',
      top: '5',
      height: '85%',
    }],
    dataZoom: [{
      type: 'inside',
      start: 0,
      end: 100,
    }],
    xAxis: [{
      type: 'category',
      splitNumber: 5,
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dotted',
        },
        interval: index => opt.xSplitIndexData.indexOf(index + 1) > -1,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
      data: _.range(opt.xCount),
    }],
    yAxis: [{
      splitNumber: 3,
      axisLine: {
        show: false,
        onZero: false,
      },
      axisTick: {
        show: false,
      },
      min: 'dataMin',
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dotted',
        },
      },
      axisLabel: {
        show: true,
      },
    }],
  };
}
/**
 * 获取分时图副图数据
 */
function getShareBottomSeries(opt, data) {
  return [{
    ...seriesConfig.bar,
    name: 'VOL',
    data: data.map(item => item.curvol || item.curvolume),
    itemStyle: {
      normal: {
        color(params) {
          const item = data[params.dataIndex];
          return item.updown.indexOf('+') === 0 ? '#ef232a' : '#14b143';
        },
      },
    },
  }];
}
/**
 * 获取K线图副图设置
 */
function getKLineBottomOption(opt, data) {
  const xAxisName = opt.xAxisName || 'timestamp';
  return {
    grid: [{
      left: '60',
      right: '5',
      top: '5',
      height: '85%',
    }],
    dataZoom: [{
      type: 'inside',
      start: 100 - (6000 / data.length),
      end: 100,
    }],
    xAxis: [{
      type: 'category',
      splitNumber: 5,
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dotted',
        },
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
      data: data.map(item => item[0]),
    }],
    yAxis: [{
      splitNumber: 3,
      axisLine: {
        show: false,
        onZero: false,
      },
      axisTick: {
        show: false,
      },
      min: 'dataMin',
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dotted',
        },
      },
      axisLabel: {
        show: true,
        formatter(value) {
          const cvalue = Number(value).toFixed(Number(opt.place));
          return cvalue === 0 ? 0 : parseFloat(cvalue);
        },
      },
    }],
  };
}
/**
 * 获取K线图副图数据
 */
function getKLineBottomSeries(opt, data) {
  const series = [];
  let statisticData;
  switch (opt.bottom) {
    case 'MACD':
      statisticData = MACD(data.map(item => item[4]), opt.place);
      series.push({
        ...seriesConfig.bar,
        name: 'MACD',
        data: statisticData.macdList,
        itemStyle: {
          normal: {
            color: (params) => {
              return params.data > 0 ? '#ef232a' : '#14b143';
            },
          },
        },
      });
      series.push({
        ...seriesConfig.line,
        name: 'DIF',
        data: statisticData.difList,
        itemStyle: {
          normal: {
            color: colorMa5,
          },
        },
      });
      series.push({
        ...seriesConfig.line,
        name: 'DEA',
        data: statisticData.deaList,
        itemStyle: {
          normal: {
            color: colorMa10,
          },
        },
      });
      break;
    case 'KDJ':
      statisticData = KDJ(data.map((item) => {
        return {
          highp: item[2],
          lowp: item[3],
          nowv: item[4],
        };
      }));
      series.push({
        ...seriesConfig.line,
        name: 'k',
        data: statisticData.kList,
        itemStyle: {
          normal: {
            color: colorMa5,
          },
        },
      });
      series.push({
        ...seriesConfig.line,
        name: 'd',
        data: statisticData.dList,
        itemStyle: {
          normal: {
            color: colorMa10,
          },
        },
      });
      series.push({
        ...seriesConfig.line,
        name: 'j',
        data: statisticData.jList,
        itemStyle: {
          normal: {
            color: colorMa20,
          },
        },
      });
      break;
    case 'RSI':
      statisticData = RSI(data.map(item => {
        // 涨跌
        const val = (item[4] - item[5]) / item[5];
        return val;
      }));
      series.push({
        ...seriesConfig.line,
        name: '6',
        data: statisticData.rsi6,
        itemStyle: {
          normal: {
            color: colorMa5,
          },
        },
      });
      series.push({
        ...seriesConfig.line,
        name: '12',
        data: statisticData.rsi12,
        itemStyle: {
          normal: {
            color: colorMa10,
          },
        },
      });
      series.push({
        ...seriesConfig.line,
        name: '24',
        data: statisticData.rsi24,
        itemStyle: {
          normal: {
            color: colorMa20,
          },
        },
      });
      break;
    case 'VOL':
    default:
      series.push({
        ...seriesConfig.bar,
        name: 'bottom',
        data: data.map(item => item.curvol || item.curvolume),
        itemStyle: {
          normal: {
            color(params) {
              const item = data[params.dataIndex];
              return item.updown.indexOf('+') === 0 ? '#ef232a' : '#14b143';
            },
          },
        },
      });
      break;
  }
  return series;
}

const bottomTool = `<div class="market-chart-bottom-bar">
  <a href="javascript:;" data-type="MACD">MACD</a>
  <a href="javascript:;" data-type="KDJ">KDJ</a>
  <a href="javascript:;" data-type="RSI">RSI</a>
</div>`;

function changeBottomType(chart, opt, data) {
  chart.clear();
  const bottomOption = getKLineBottomOption(opt, data);
  const bottomSeries = getKLineBottomSeries(opt, data);
  chart.setOption({
    ...bottomOption,
    series: bottomSeries,
  });
}
/**
 * dom 主行情图 挂载dom
 * opt 配置项
 *  type: share:分时图，kLine: k线图
 *  data: 行情数据
 *  xAxisName(可选): x轴属性名
 *  kLineConfig: k线图配置
 *  shareConfig: 分时图配置
 */
function init(dom, opt, data, lines, tradelines) {
  if (typeof opt.bottom !== 'undefined') {
    dom.innerHTML = `<div class="market-chart-main h75"></div>
                     ${bottomTool}
                     <div class="market-chart-bottom h15"></div>`;
  } else {
    dom.innerHTML = '<div class="market-chart-main"></div>';
  }
  const mainChart = echarts.init(dom.firstChild);
  if (typeof opt !== 'undefined') {
    // mainEchart.clear();
    if (opt.type === 'share') {
      const shareOpt = getShareOption(opt);
      const shareSeries = getShareSeries(opt, data, lines);
      mainChart.setOption({
        ...shareOpt,
        series: shareSeries,
      });
    } else {
      const klineOpt = getKLineOption(opt, data);
      const klineSeries = getKLineSeries(opt, data, lines, tradelines);
      mainChart.setOption({
        ...klineOpt,
        series: klineSeries,
      });
    }
  }
  let bottomChart;
  if (typeof opt.bottom !== 'undefined') {
    bottomChart = echarts.init(dom.lastChild);
    if (opt.type === 'share') {
      const bottomOption = getShareBottomOption(opt);
      const bottomSeries = getShareBottomSeries(opt, data);
      bottomChart.setOption({
        ...bottomOption,
        series: bottomSeries,
      });
    } else {
      const bottomOption = getKLineBottomOption(opt, data);
      const bottomSeries = getKLineBottomSeries(opt, data);
      bottomChart.setOption({
        ...bottomOption,
        series: bottomSeries,
      });
    }
    mainChart.on('datazoom', (params) => {
      if (typeof params.tag === 'undefined' || !params.tag) {
        bottomChart.dispatchAction({
          type: 'dataZoom',
          tag: true,
          start: params.batch[0].start,
          end: params.batch[0].end,
        });
      }
    });
    bottomChart.on('datazoom', (params) => {
      if (typeof params.tag === 'undefined' || !params.tag) {
        mainChart.dispatchAction({
          type: 'dataZoom',
          tag: true,
          start: params.batch[0].start,
          end: params.batch[0].end,
        });
      }
    });
    const bottomBars = dom.childNodes[2].getElementsByTagName('a');
    for (let i = 0; i < bottomBars.length; i += 1) {
      if (bottomBars[i].getAttribute('data-type') === opt.bottom) {
        bottomBars[i].className = 'active';
      }
      if (typeof bottomBars[i].attachEvent !== 'undefined') {
        bottomBars[i].attachEvent('onclick', (e) => {
          const barList = e.target.parentNode.getElementsByTagName('a');
          for (let j = 0; j < barList.length; j += 1) {
            barList[j].className = barList[j].className.replace('active', '');
          }
          e.target.className = 'active';
          const bottom = e.target.getAttribute('data-type');
          if (bottom !== opt.bottom) {
            opt.bottom = bottom;
            changeBottomType(bottomChart, opt, data);
          }
        });
      } else {
        bottomBars[i].addEventListener('click', (e) => {
          const barList = e.target.parentNode.getElementsByTagName('a');
          for (let j = 0; j < barList.length; j += 1) {
            barList[j].className = barList[j].className.replace('active', '');
          }
          e.target.className = 'active';
          const bottom = e.target.getAttribute('data-type');
          if (bottom !== opt.bottom) {
            opt.bottom = bottom;
            changeBottomType(bottomChart, opt, data);
          }
        });
      }
    }
  }
  return {
    mainChart,
    bottomChart,
    opt,
    data,
  };
}

function refresh(chartObj, data, lines, tradelines) {
  console.log('refresh');
  const {
    mainChart,
    bottomChart,
    opt,
  } = chartObj;
  const _opt = mainChart.getOption();
  let series;
  if (opt.type === 'share') {
    series = getShareSeries(opt, data);
  } else {
    series = getKLineSeries(opt, data, lines, tradelines);
  }
  mainChart.setOption({
    ..._opt,
    xAxis: [{
      type: 'category',
      scale: true,
      axisLine: {
        onZero: false,
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dotted',
        },
      },
      splitNumber: 5,
      data: data.map(item => item[0]),
    }],
    series,
  });
  if (typeof opt.bottom !== 'undefined') {
    const bottomOpt = bottomChart.getOption();
    let bottomSeries;
    if (opt.type === 'share') {
      bottomSeries = getShareBottomSeries(opt, data);
      bottomChart.setOption({
        ...bottomOpt,
        xAxis: [{
          type: 'category',
          splitNumber: 5,
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dotted',
            },
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
          data: data.map(item => item[0]),
        }],
        series: bottomSeries,
      });
    } else {
      bottomSeries = getKLineBottomSeries(opt, data);
      bottomChart.setOption({
        ...bottomOpt,
        series: bottomSeries,
      });
    }
  }
}

export default {
  init,
  refresh,
};
