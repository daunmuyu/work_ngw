import Vue from 'vue';
import moment from 'moment';
import * as d3 from 'd3';

// import {
//   mapActions,
// } from 'vuex';

// import Hammer from 'hammerjs';
import template from './timeshare.html';
import './style.scss';

window.d3 = d3;
const techan = require('techan');

// const d3 = window.d3;

export default Vue.extend({
  template,
  props: {
    shareData: {
      type: Array,
    },
    config: {
      type: Object,
    },
    options: {
      type: Object,
      default() {
        return {
          showYAxis: true,
        };
      },
    },
  },
  data() {
    return {
      refreshStep: 1000,
      svg: undefined,
      x: undefined,
      y: undefined,
      xAxis: undefined,
      percentAxis: undefined,
      timeshare: undefined,
      shareLine: undefined,
      ma: undefined,
      indicatorScale: undefined,
      indicatorAxis: undefined,
      indicator: undefined,
      dom: {
        mainHeight: 0.75,
        axisHeight: 20,
      },
      margin: {
        top: 0,
        right: 0,
        bottom: 30,
        left: 50,
      },
    };
  },
  computed: {
    width() {
      return this.$refs.sharedom.offsetWidth - this.margin.right - this.margin.left;
    },
    height() {
      return this.$refs.sharedom.offsetHeight;
    },
    shareHeight() {
      return this.$refs.sharedom.offsetHeight * this.dom.mainHeight;
    },
    indTop() {
      return (this.$refs.sharedom.offsetHeight * this.dom.mainHeight) + this.dom.axisHeight;
    },
    indHeight() {
      return (this.$refs.sharedom.offsetHeight * (1 - this.dom.mainHeight)) - this.dom.axisHeight;
    },
  },
  watch: {
    shareData() {
      if (this.shareData && this.shareData.length > 0) {
        this.bindData();
      }
    },
  },
  mounted() {
    // this.bindHammerEvents();
    this.$refs.sharedom.addEventListener('contextmenu', (event) => {
      event.preventDefault();
    });
    this.init();
  },
  methods: {
    // ...mapActions([
    //   'loadMarketCandle',
    // ]),
    // bindHammerEvents() {
    //   const mc = new Hammer.Manager(this.$refs.timeshare);
    //   const pan = new Hammer.Pan({
    //     direction: Hammer.DIRECTION_HORIZONTAL,
    //   });
    //   const press = new Hammer.Press();
    //   mc.add([pan, press]);
    //   mc.on('press', this.refreshCrosshair);
    //   mc.on('panmove', this.refreshCrosshair);
    //   mc.on('panend', this.hideCrosshair);
    // },
    refreshCrosshair(e) {
      const offsetLeft = document.getElementById('timeshare').offsetLeft;

      const ax = e.changedPointers[0].pageX - offsetLeft;
      const dx = parseInt(this.x.invert(ax), 10);
      const dy = this.shareData[dx];

      if (typeof dy !== 'undefined') {
        const ay = this.y(dy.close);
        this.svg.select('g.crosshair')
          .attr('display', '');
        this.svg.select('g.crosshair path.horizontal')
          .attr('d', `M 0 ${ay} L ${this.width} ${ay}`);
        this.svg.select('g.crosshair path.vertical')
          .attr('d', `M ${ax} 0 L ${ax} ${this.shareHeight}`);
        this.svg.select('g.crosshair g.x.annotation text')
          .text(moment(dy.date).format('HH:mm'))
          .attr('transform', `translate(${ax - 10},${this.shareHeight + 10})`);
        this.svg.select('g.crosshair g.y.annotation text')
          .text(dy.close)
          .attr('transform', `translate(${this.width - 40},${ay - 10})`);

        this.svg.select('g.crosshair path.ind-vertical')
          .attr('d', `M ${ax} ${this.indTop} L ${ax} ${this.height}`);

        this.showShareInfo(dy, ax);
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

      if (this.shareData.length > 0) {
        this.bindData();
      }
    },
    initCandle() {
      this.x = d3.scaleLinear()
        .rangeRound([0, this.width]);

      this.xAxis = d3.axisBottom(this.x)
        .tickSize(0);

      this.y = d3.scaleLinear()
        .range([this.shareHeight, 0]);

      this.percentAxis = d3.axisLeft(this.y)
        // .tickSizeInner(-this.dim.total.width)
        // .tickPadding(-40)
        .ticks(2);
      // .tickSize(100);

      // 分时图折线
      this.shareLine = d3.line()
        .defined(d => d)
        .x((d, index) => this.x(index))
        .y(d => this.y(d.close));

      // 分时图阴影部分
      this.timeshare = d3.area()
        .x(this.shareLine.x())
        .y1(this.shareLine.y())
        .y0(this.y(0));

      // 分时图均线
      this.maLine = d3.line()
        .x((d, index) => this.x(index))
        .y(d => this.y(d.ma));
    },
    initIndicator() {
      this.indicatorScale = d3.scaleLinear()
        .range([this.height, this.indTop]);

      this.indicatorAxis = d3.axisRight(this.indicatorScale)
        // .tickSizeInner(-this.$refs.sharedom.offsetWidth)
        // .tickPadding(-10)
        .ticks(2);

      this.indicator = techan.plot.volume()
        .accessor(techan.accessor.ohlc())
        .xScale(this.x)
        .yScale(this.indicatorScale)
        .width(1);
    },
    initChart() {
      this.svg = d3.select('#timeshare')
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
        .attr('height', this.shareHeight);

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
        .attr('transform', `translate(0,${this.shareHeight})`);

      const ohlcSelection = this.svg.append('g')
        .attr('class', 'ohlc')
        .attr('transform', 'translate(0,0)');

      ohlcSelection.append('g')
        .attr('class', 'close annotation up');

      ohlcSelection.append('g')
        .attr('class', 'timeshare')
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
        .attr('class', 'info')
        .attr('transform', 'translate(0, 10)')
        .append('text');
    },
    bindData() {
      this.config.timeaxistext[0] = this.config.timeaxistext[0];
      this.config.timeaxistext[this.config.timeaxistext.length - 1] = `${this.config.timeaxistext[this.config.timeaxistext.length - 1]} ---`;

      this.xAxis.tickSizeInner(-this.shareHeight)
        .tickValues(this.config.timeaxisindex)
        .tickFormat(x => this.config.timeaxistext[this.config.timeaxisindex.indexOf(x)]);
      this.x.domain([0, this.config.length]);
      const max = d3.max(this.shareData, d => d.close);
      const min = d3.min(this.shareData, d => d.close);
      const padding = (max - min) / 6;
      this.y.domain([min - padding, max + padding]);

      const share = this.svg.select('g.timeshare')
        .datum(this.shareData);

      share.selectAll('path').data(['line', 'area', 'ma'])
        .enter()
        .append('path')
        .attr('class', d => `share ${d}`);

      share.select('path.share.line')
        .attr('d', this.shareLine);

      share.select('path.area')
        .attr('d', this.timeshare);

      share.select('path.ma')
        .attr('d', this.maLine);

      const indicatorData = this.shareData.map((item, index) => {
        return {
          date: index,
          open: +item.close,
          close: +item.close,
          volume: +item.volume,
        };
      });

      this.svg.select('g.indicator .axis.left').call(this.indicatorAxis);

      this.indicatorScale.domain(techan.scale.plot.volume(
        indicatorData,
        this.indicator.accessor().v,
      ).domain());
      this.svg.select('g.indicator-plot').datum(indicatorData).call(this.indicator);

      this.drawChart();
    },
    drawChart() {
      this.svg.select('g.x.axis').call(this.xAxis);
      this.svg.select('g.percent.axis').call(this.percentAxis);
      this.svg.select('g.indicator .axis.left').call(this.indicatorAxis);
    },
    showShareInfo(info) {
      this.svg.select('g.info text')
        .text(`${moment(info.date).format('HH:mm')} 价格:${info.close} 均价:${info.ma.toFixed(3)} 交易量:${info.volume}`);
    },
  },
});
