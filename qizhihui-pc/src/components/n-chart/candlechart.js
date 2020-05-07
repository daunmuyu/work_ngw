import Vue from 'vue';
import moment from 'moment';
import techan from 'techan';
import _ from 'underscore';
// import Hammer from 'hammerjs';
import kdj from './kdj.js';
import rsi from './rsi.js';

import template from './candlechart.html';
import './style.scss';

const d3 = window.d3;

export default Vue.extend({
  template,
  props: {
    getMarketData: {
      type: Function,
    },
    ohlcData: {
      type: Array,
      required: true,
    },
    timeFormat: {
      type: String,
      default: 'HH:mm',
    },
    options: {
      type: Object,
      default() {
        return {
          showYAxis: true,
          indicatorType: 'VOL',
        };
      },
    },
  },
  data() {
    return {
      refreshStep: 1000,
      showCount: 30,
      initStartCount: 0,
      initEndCount: 0,
      startCount: 0,
      endCount: 0,
      svg: undefined,
      x: undefined,
      y: undefined,
      xAxis: undefined,
      percentAxis: undefined,
      // candlestick: undefined,
      ma5: undefined,
      ma10: undefined,
      ma20: undefined,
      ma5Data: [],
      ma10Data: [],
      ma20Data: [],
      indicatorScale: undefined,
      indicatorAxis: undefined,
      indicator: undefined,
      // ohlcData: [],
      indicatorData: [],
      indicatorType: 'VOL',
      dom: {
        mainHeight: 0.75,
        axisHeight: 20,
      },
      margin: {
        top: 0,
        right: 0,
        bottom: 30,
        left: 0,
      },
      panstartHandler: () => {},
      panmoveHandler: () => {},
    };
  },
  computed: {
    width() {
      return this.$refs.candledom.offsetWidth;
    },
    height() {
      return this.$refs.candledom.offsetHeight - this.margin.bottom;
    },
    candleHeight() {
      return this.height * this.dom.mainHeight;
    },
    indTop() {
      return (this.height * this.dom.mainHeight) + this.dom.axisHeight;
    },
    indHeight() {
      return (this.height * (1 - this.dom.mainHeight)) - this.dom.axisHeight;
    },
  },
  watch: {
    indicatorType() {
      this.redrawIndicator();
    },
    ohlcData() {
      if (this.ohlcData.length > 0) {
        this.bindData();
      }
    },
  },
  mounted() {
    // 取消浏览器默认长按菜单
    this.$refs.candledom.addEventListener('contextmenu', (event) => {
      event.preventDefault();
    });
    this.init();
    this.panstartHandler = this.startZoom;
    this.panmoveHandler = this.refreshZoom;
    // this.bindHammerEvents();
  },
  methods: {
    // bindHammerEvents() {
    //   // @press="initCrosshair" @pressup="removeCrosshair" @panstart="panstartHandler" @panmove="panmoveHandler" @panend="removeCrosshair" :pan-options="{ direction: 'horizontal' }"
    //   const mc = new Hammer.Manager(this.$refs.candlestick);
    //   const pan = new Hammer.Pan({
    //     direction: Hammer.DIRECTION_HORIZONTAL,
    //   });
    //   const press = new Hammer.Press();
    //   mc.add([pan, press]);
    //   mc.on('press', (e) => {
    //     this.initCrosshair(e);
    //   });
    //   mc.on('pressup', (e) => {
    //     this.removeCrosshair(e);
    //   });
    //   mc.on('panstart', (e) => {
    //     this.panstartHandler(e);
    //   });
    //   mc.on('panmove', (e) => {
    //     this.panmoveHandler(e);
    //   });
    //   mc.on('panend', (e) => {
    //     this.removeCrosshair(e);
    //   });
    // },
    initCrosshair(e) {
      e.preventDefault();
      this.refreshCrosshair(e);
      this.panstartHandler = this.refreshCrosshair;
      this.panmoveHandler = this.refreshCrosshair;
    },
    removeCrosshair() {
      this.hideCrosshair();
      this.panstartHandler = this.startZoom;
      this.panmoveHandler = this.refreshZoom;
    },
    startZoom() {
      this.initStartCount = this.startCount;
      this.initEndCount = this.endCount;
    },
    refreshZoom(e) {
      const deltaCount = parseInt(this.showCount * (e.deltaX / this.width), 10);
      this.startCount = this.initStartCount - deltaCount;
      this.endCount = this.initEndCount - deltaCount;
      if (this.startCount < 0) {
        this.startCount = 0;
        this.endCount = this.startCount + this.showCount;
      }
      if (this.endCount > this.ohlcData.length) {
        this.endCount = this.ohlcData.length;
        this.startCount = this.ohlcData.length - this.showCount;
      }

      this.x.domain(techan.scale.plot.time(this.ohlcData.slice(this.startCount, this.endCount)).domain());
      this.y.domain(techan.scale.plot.ohlc(this.ohlcData.slice(this.startCount, this.endCount)).domain());
      switch (this.indicatorType) {
        case 'MACD':
          this.indicatorScale.domain(techan.scale.plot.macd(this.indicatorData).domain());
          break;
        case 'KDJ':
          this.indicatorScale.domain(kdj().domain(this.indicatorData.slice(this.startCount, this.endCount)));
          break;
        case 'RSI':
          this.indicatorScale.domain(rsi().domain(this.indicatorData.slice(this.startCount, this.endCount)));
          break;
        case 'VOL':
        case 'VOLUME':
        default:
          this.indicatorScale.domain(techan.scale.plot.volume(this.ohlcData.slice(this.startCount, this.endCount)).domain());
          break;
      }
      this.drawChart();
    },
    refreshCrosshair(e) {
      const offsetLeft = document.getElementById('candlestick').offsetLeft;

      const ax = e.changedPointers[0].pageX - offsetLeft;
      const dx = this.x.invert(ax);
      const dy = this.ohlcData.filter(item => _.isEqual(item.date, dx))[0];
      const ma5Item = this.ma5Data.filter(item => _.isEqual(item.date, dx))[0];
      const ma10Item = this.ma10Data.filter(item => _.isEqual(item.date, dx))[0];
      const ma20Item = this.ma20Data.filter(item => _.isEqual(item.date, dx))[0];
      const indY = this.indicatorData.filter(item => _.isEqual(item.date, dx))[0];

      if (typeof dy !== 'undefined') {
        const ay = this.y(dy.close);
        this.svg.select('g.crosshair')
          .attr('display', '');
        this.svg.select('g.crosshair path.horizontal')
          .attr('d', `M 0 ${ay} L ${this.width} ${ay}`);
        this.svg.select('g.crosshair path.vertical')
          .attr('d', `M ${ax} 0 L ${ax} ${this.candleHeight}`);
        this.svg.select('g.crosshair g.x.annotation text')
          .text(moment(dx).format(this.timeFormat))
          .attr('transform', `translate(${ax - 10},${this.candleHeight + 10})`);
        this.svg.select('g.crosshair g.y.annotation text')
          .text(dy.close)
          .attr('transform', `translate(${this.width - 40},${ay - 10})`);

        this.svg.select('g.crosshair path.ind-vertical')
          .attr('d', `M ${ax} ${this.indTop} L ${ax} ${this.height}`);

        this.showCandleInfo({
          ...dy,
          ma5: ma5Item.value,
          ma10: ma10Item.value,
          ma20: ma20Item.value,
        }, ax < this.width / 2);
        this.showIndicatorInfo(indY, ax < this.width / 2);
      }
    },
    hideCrosshair() {
      this.svg.select('g.crosshair')
        .attr('display', 'none');
    },
    init() {
      this.initCandle();

      this.initIndicator();

      this.initChart();

      if (this.ohlcData.length > 0) {
        this.bindData();
      }
    },
    initCandle() {
      const xScale = d3.scaleLinear()
      .rangeRound([0, this.width]);

      this.x = techan.scale.financetime(xScale)
        .range([0, this.width]);

      const step = 1 / (2 * this.showCount);

      this.xAxis = d3.axisBottom(xScale)
        .tickValues([0 + step, 0.2 + step, 0.4 + step, 0.6 + step, 0.8 + step])
        .tickSizeInner(-this.candleHeight)
        .tickFormat((d) => {
          const offset = this.width * d;
          if (offset) {
            return moment(this.x.invert(offset)).format(this.timeFormat);
          }
          return '';
        });

      this.y = d3.scaleLinear()
        .range([this.candleHeight, 0]);

      this.percentAxis = d3.axisRight(this.y)
        // .tickSizeInner(-this.dim.total.width)
        // .tickPadding(-40)
        .ticks(2);

      this.candlestick = techan.plot.candlestick()
        .xScale(this.x)
        .yScale(this.y);

      this.ma5 = techan.plot.sma()
        .xScale(this.x)
        .yScale(this.y);

      this.ma10 = techan.plot.sma()
        .xScale(this.x)
        .yScale(this.y);

      this.ma20 = techan.plot.ema()
        .xScale(this.x)
        .yScale(this.y);
    },
    initIndicator() {
      this.indicatorScale = d3.scaleLinear()
        .range([this.height, this.indTop]);

      this.indicatorAxis = d3.axisRight(this.indicatorScale)
        .tickSizeInner(-this.width)
        // .tickPadding(-10)
        .ticks(3);

      switch (this.indicatorType) {
        case 'MACD':
          this.indicator = techan.plot.macd()
            .xScale(this.x)
            .yScale(this.indicatorScale);
          break;
          // case 'RSI':
          //   this.indicator = techan.plot.rsi()
          //     .xScale(this.x)
          //     .yScale(this.indicatorScale);
          //   break;
        case 'KDJ':
          this.indicator = kdj()
            .xScale(this.x)
            .yScale(this.indicatorScale);
          break;
        case 'RSI':
          this.indicator = rsi()
            .xScale(this.x)
            .yScale(this.indicatorScale);
          break;
        case 'VOL':
        case 'VOLUME':
        default:
          this.indicator = techan.plot.volume()
            .accessor(this.candlestick.accessor()) // Set the accessor to a ohlc accessor so we get highlighted bars
            .xScale(this.x)
            .yScale(this.indicatorScale);
          break;
      }
    },
    initChart() {
      this.svg = d3.select('#candlestick')
        .append('svg')
        .attr('width', this.width)
        .attr('height', this.height);

      const defs = this.svg.append('defs');

      defs.append('clipPath')
        .attr('id', 'ohlcClip')
        .append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', this.width)
        .attr('height', this.candleHeight);

      defs.append('clipPath')
        .attr('id', 'indicatorClip')
        .append('rect')
        .attr('x', 0)
        .attr('y', this.indTop)
        .attr('width', this.width)
        .attr('height', this.indHeight);

      this.svg = this.svg.append('g')
        .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

      this.svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(0,${this.candleHeight})`);

      const ohlcSelection = this.svg.append('g')
        .attr('class', 'ohlc')
        .attr('transform', 'translate(0,0)');

      ohlcSelection.append('g')
        .attr('class', 'close annotation up');

      ohlcSelection.append('g')
        .attr('class', 'candlestick')
        .attr('clip-path', 'url(#ohlcClip)');

      ohlcSelection.append('g')
        .attr('class', 'indicator sma ma-0')
        .attr('clip-path', 'url(#ohlcClip)');

      ohlcSelection.append('g')
        .attr('class', 'indicator sma ma-1')
        .attr('clip-path', 'url(#ohlcClip)');

      ohlcSelection.append('g')
        .attr('class', 'indicator ema ma-2')
        .attr('clip-path', 'url(#ohlcClip)');

      ohlcSelection.append('g')
        .attr('class', 'percent axis');

      const indicatorSelection = this.svg.append('g')
        .attr('class', 'indicator');

      indicatorSelection.append('g')
        .attr('class', 'axis left');

      indicatorSelection.append('g')
        .attr('class', 'indicator-plot')
        .attr('clip-path', 'url(#indicatorClip)');
      const crosshair = this.svg.append('g')
        .attr('class', 'crosshair');
      crosshair.append('path')
        .attr('class', 'vertical');
      crosshair.append('path')
        .attr('class', 'horizontal');
      crosshair.append('g')
        .attr('class', 'x annotation')
        .append('text');
      crosshair.append('g')
        .attr('class', 'y annotation')
        .append('text');

      crosshair.append('path')
        .attr('class', 'ind-vertical');

      crosshair.append('g')
        .attr('class', 'candle-info')
        .append('rect');
      this.svg.select('g.candle-info')
        .append('text')
        .attr('id', 'candleInfo')
        .attr('x', 10);
      crosshair.append('g')
        .attr('class', 'indicator-info')
        .append('text')
        .attr('x', 10);
    },
    bindData() {
      this.ma5Data = techan.indicator.sma().period(5)(this.ohlcData);
      this.ma10Data = techan.indicator.sma().period(10)(this.ohlcData);
      this.ma20Data = techan.indicator.sma().period(20)(this.ohlcData);

      this.svg.select('g.candlestick').datum(this.ohlcData).call(this.candlestick);
      this.svg.select('g.sma.ma-0').datum(this.ma5Data).call(this.ma5);
      this.svg.select('g.sma.ma-1').datum(this.ma10Data).call(this.ma10);
      this.svg.select('g.ema.ma-2').datum(this.ma20Data).call(this.ma20);

      // if (this.endCount === 0 || this.endCount === this.ohlcData.length) {
      this.startCount = this.ohlcData.length - this.showCount;
      this.endCount = this.ohlcData.length;

      this.x.domain(techan.scale.plot.time(this.ohlcData.slice(this.startCount)).domain());
      this.y.domain(techan.scale.plot.ohlc(this.ohlcData.slice(this.startCount)).domain());
      // }

      switch (this.indicatorType) {
        case 'MACD':
          this.indicatorData = techan.indicator.macd()(this.ohlcData);
          this.indicatorScale.domain(techan.scale.plot.macd(this.indicatorData).domain());
          this.svg.select('g.indicator-plot').datum(this.indicatorData).call(this.indicator);
          break;
        case 'KDJ':
          this.indicatorData = kdj().getKDJData(this.ohlcData);
          this.indicatorScale.domain(kdj().domain(this.indicatorData.slice(this.startCount, this.endCount)));
          this.svg.select('g.indicator-plot').datum(this.indicatorData).call(this.indicator);
          break;
        case 'RSI':
          this.indicatorData = rsi().getRSIData(this.ohlcData);
          this.indicatorScale.domain(rsi().domain(this.indicatorData.slice(this.startCount, this.endCount)));
          this.svg.select('g.indicator-plot').datum(this.indicatorData).call(this.indicator);
          break;
        case 'VOL':
        case 'VOLUME':
        default:
          this.indicatorData = this.ohlcData;
          this.indicatorScale.domain(techan.scale.plot.volume(this.ohlcData.slice(this.startCount, this.endCount)).domain());
          this.svg.select('g.indicator-plot').datum(this.ohlcData).call(this.indicator);
          break;
      }
      this.drawChart();
    },
    drawChart() {
      this.svg.select('g.x.axis').call(this.xAxis);
      this.svg.select('g.percent.axis').call(this.percentAxis);
      this.svg.select('g.indicator .axis.left').call(this.indicatorAxis);

      this.svg.select('g.candlestick').call(this.candlestick.refresh);
      this.svg.select('g .sma.ma-0').call(this.ma5.refresh);
      this.svg.select('g .sma.ma-1').call(this.ma10.refresh);
      this.svg.select('g .ema.ma-2').call(this.ma20.refresh);
      this.svg.select('g .indicator-plot').call(this.indicator.refresh);
    },
    redrawIndicator() {
      this.svg.select('g.indicator-plot').selectAll('g').remove();
      switch (this.indicatorType) {
        case 'MACD':
          this.indicator = techan.plot.macd()
            .xScale(this.x)
            .yScale(this.indicatorScale);
          break;
        case 'KDJ':
          this.indicator = kdj()
            .xScale(this.x)
            .yScale(this.indicatorScale);
          break;
        case 'RSI':
          this.indicator = rsi()
            .xScale(this.x)
            .yScale(this.indicatorScale);
          break;
        case 'VOL':
        case 'VOLUME':
        default:
          this.indicator = techan.plot.volume()
            .accessor(this.candlestick.accessor())
            .xScale(this.x)
            .yScale(this.indicatorScale);
          break;
      }

      switch (this.indicatorType) {
        case 'MACD':
          this.indicatorData = techan.indicator.macd()(this.ohlcData);
          this.indicatorScale.domain(techan.scale.plot.macd(this.indicatorData).domain());
          this.svg.select('g.indicator-plot').datum(this.indicatorData).call(this.indicator);
          break;
        case 'KDJ':
          this.indicatorData = kdj().getKDJData(this.ohlcData);
          this.indicatorScale.domain(kdj().domain(this.indicatorData.slice(this.startCount, this.endCount)));
          this.svg.select('g.indicator-plot').datum(this.indicatorData).call(this.indicator);
          break;
        case 'RSI':
          this.indicatorData = rsi().getRSIData(this.ohlcData);
          this.indicatorScale.domain(rsi().domain(this.indicatorData.slice(this.startCount, this.endCount)));
          this.svg.select('g.indicator-plot').datum(this.indicatorData).call(this.indicator);
          break;
        case 'VOL':
        case 'VOLUME':
        default:
          this.indicatorData = this.ohlcData;
          this.indicatorScale.domain(techan.scale.plot.volume(this.ohlcData.slice(this.startCount, this.endCount)).domain());
          this.svg.select('g.indicator-plot').datum(this.ohlcData).call(this.indicator);
          break;
      }
    },
    showCandleInfo(info, isRight) {
      const infoData = [
        moment(info.date).format(this.timeFormat),
        `开: ${info.open}`,
        `高: ${info.high}`,
        `低: ${info.low}`,
        `收: ${info.close}`,
        `ma5: ${info.ma5.toFixed(3)}`,
        `ma10: ${info.ma10.toFixed(3)}`,
        `ma20: ${info.ma20.toFixed(3)}`,
      ];
      this.svg.select('g.candle-info')
        .attr('transform', `translate(${isRight ? this.width - 100 : 0}, 0)`);

      if (this.svg.select('g.candle-info text tspan').empty()) {
        this.svg.select('g.candle-info text')
          .selectAll('tspan')
          .data(infoData)
          .enter()
          .append('tspan')
          .attr('x', 10)
          .attr('dy', 15)
          .text(d => d);
      } else {
        this.svg.selectAll('g.candle-info text tspan')
          .data(infoData)
          .text(d => d);
      }
      const rect = document.getElementById('candleInfo').getBBox();
      this.svg.select('g.candle-info rect')
        .attr('x', rect.x)
        .attr('y', rect.y)
        .attr('width', rect.width)
        .attr('height', rect.height);
    },
    showIndicatorInfo(info, isRight) {
      let infoData = [];
      let rightP = this.width - 100;
      switch (this.indicatorType) {
        case 'MACD':
          infoData = [
            `DIFF: ${info.macd.toFixed(3)}`,
            `DEA: ${info.signal.toFixed(3)}`,
            `MACD: ${info.difference.toFixed(3)}`,
          ];
          rightP = this.width - 220;
          break;
        case 'KDJ':
          infoData = [
            `K: ${info.k.toFixed(3)}`,
            `D: ${info.d.toFixed(3)}`,
            `J: ${info.j.toFixed(3)}`,
          ];
          rightP = this.width - 160;
          break;
        case 'RSI':
          infoData = [
            `RSI6: ${info.rsi6.toFixed(3)}`,
            `RSI12: ${info.rsi12.toFixed(3)}`,
            `RSI24: ${info.rsi24.toFixed(3)}`,
          ];
          rightP = this.width - 220;
          break;
        case 'VOL':
        case 'VOLUME':
        default:
          break;
      }
      this.svg.selectAll('g.indicator-info text tspan').remove();
      if (infoData.length > 0) {
        this.svg.select('g.indicator-info')
          .attr('transform', `translate(${isRight ? rightP : 0}, ${this.indTop})`);
        this.svg.select('g.indicator-info text')
          .selectAll('tspan')
          .data(infoData)
          .enter()
          .append('tspan')
          .attr('dx', 5)
          .text(d => d);
      }
    },
  },
});
