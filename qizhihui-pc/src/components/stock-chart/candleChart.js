import * as d3 from 'd3';
import kdj from './kdj.js';
import rsi from './rsi.js';
import ma from './maDay.js';
import macd from './macd.js';

export default class CandleChart {
  constructor(dom, options, data) {
    const defaultOptions = {
      width: 600,
      height: 400,
      marginLeft: 40,
      marginRight: 40,
      marginTop: 8,
      marginBottom: 25,
      mainPercentage: 0.8,
      xAxisHeight: 10,
      timeFormat: '%m/%d',
      pageCount: 51,
      curIndex: 0,
      rectWidth: 3,
      indicatorType: 'VOL',
      offset: 1,
    };
    if (typeof options !== 'undefined') {
      this.options = {
        ...defaultOptions,
        ...options,
      };
    } else {
      this.options = {
        ...defaultOptions,
      };
    }
    this.options.dom = dom;
    this.dom = d3.select(dom);
    this.options.width = +d3.select(this.options.dom).style('width').replace('px', '');
    this.options.height = +d3.select(this.options.dom).style('height').replace('px', '');
    this.options.chartWidth = this.options.width - this.options.marginLeft - this.options.marginRight;
    this.options.chartHeight = this.options.height - this.options.marginTop - this.options.marginBottom;

    if (typeof this.options.mainPercentage !== 'undefined') {
      this.options.mainHeight = this.options.chartHeight * this.options.mainPercentage;
      this.options.indicatorHeight = this.options.chartHeight - this.options.mainHeight - this.options.xAxisHeight;
    } else {
      this.options.mainHeight = this.options.chartHeight;
      this.options.indicatorHeight = 0;
    }
    if (typeof data !== 'undefined') {
      this.candleData = data;
      switch (this.options.indicatorType) {
        case 'MACD':
          this.candleData = macd(this.candleData);
          break;
        case 'KDJ':
          this.candleData = kdj(this.candleData);
          break;
        case 'RSI':
          this.candleData = rsi(this.candleData);
          break;
        case 'VOL':
        default:
          break;
      }
      this.candleData = ma(this.candleData, [5, 10, 20]);
      this.refreshData();
    }
    this.initLayout();
    this.drawScales();
    this.drawCandleChart();

    this.initIndicatorLayout();
    this.drawIndicator();

    this.initCross();
    this.initDrag();
  }
  initLayout() {
    this.svg = d3.select(this.options.dom)
    .append('svg')
    .attr('width', this.options.width)
    .attr('height', this.options.height);

    this.mainChart = this.svg.append('g')
    .attr('class', 'main-charts')
    .attr('transform', `translate(${this.options.marginLeft},${this.options.marginTop})`);

    this.mainChart.append('g')
    .attr('class', 'x axis')
    .attr('transform', `translate(0,${this.options.mainHeight + this.options.marginTop})`);

    this.mainChart.append('g')
    .attr('class', 'y axis');

    this.mainChart.append('g')
    .attr('class', 'main charts')
    .selectAll('path')
    .data(['up-rect', 'up-wick', 'down-rect', 'down-wick'])
    .enter()
    .append('path')
    .attr('class', d => d);

    this.mainChart.append('g')
    .attr('class', 'ma charts')
    .selectAll('path')
    .data(['ma5', 'ma10', 'ma20'])
    .enter()
    .append('path')
    .attr('class', d => d);

    this.crossChart = this.svg.append('g')
    .attr('class', 'cross');
  }
  drawScales() {
    if (typeof this.x === 'undefined') {
      this.x = d3.scaleLinear()
        .range([0, this.options.chartWidth]);

      this.xAxis = d3.axisBottom()
        .scale(this.x)
        .tickPadding(5)
        .tickSize(-this.options.mainHeight);
    }
    this.x.domain([0, this.options.pageCount + 1]);
    this.timeFormat = d3.timeFormat(this.options.timeFormat);
    this.xAxis.tickValues([1, 10, 20, 30, 40, 50])
    .tickFormat((x) => {
      return this.pageData[x] ? this.timeFormat(this.pageData[x - 1].date) : '';
    });
    this.svg.select('g.x.axis')
      .call(this.xAxis);

    if (typeof this.y === 'undefined') {
      this.y = d3.scaleLinear()
        .range([this.options.mainHeight + this.options.marginTop, this.options.marginTop]);

      this.yAxis = d3.axisLeft()
        .scale(this.y)
        .ticks(5)
        .tickSize(-this.options.chartWidth);
    }
    this.y.domain([
      d3.min(this.pageData, d => d3.min([d.low, d.ma5, d.ma10, d.ma20])),
      d3.max(this.pageData, d => d3.max([d.high, d.ma5, d.ma10, d.ma20])),
    ])
    .nice();

    this.svg.select('g.y.axis')
      .call(this.yAxis);
  }
  drawCandleRect(data) {
    const width = 3;
    const path = data.map((item) => {
      return `M ${this.x(item.index) - width} ${this.y(item.open)} l ${2 * width} 0 L ${this.x(item.index) + width} ${this.y(item.close)} l ${-2 * width} 0 L ${this.x(item.index) - width} ${this.y(item.open)}`;
    }).join(' ');
    return path;
  }
  drawCandleWick(data) {
    return data.map((item) => {
      return `M ${this.x(item.index)} ${this.y(item.high)} L ${this.x(item.index)} ${this.y(item.low)}`;
    }).join(' ');
  }
  drawCandleChart() {
    this.svg.select('path.up-rect')
      .attr('d', () => {
        const path = this.drawCandleRect(this.upData);
        return path;
      });
    this.svg.select('path.up-wick')
      .attr('d', () => this.drawCandleWick(this.upData));
    this.svg.select('path.down-rect')
      .attr('d', () => this.drawCandleRect(this.downData));
    this.svg.select('path.down-wick')
      .attr('d', () => this.drawCandleWick(this.downData));

    const ma5Line = d3.line()
    .defined(d => d.ma5)
    .x(d => this.x(d.index))
    .y(d => this.y(d.ma5))
    .curve(d3.curveCatmullRom.alpha(0.5));

    this.svg.select('path.ma5')
    .attr('d', () => ma5Line(this.pageData));

    const ma10Line = d3.line()
    .defined(d => d.ma10)
    .x(d => this.x(d.index))
    .y(d => this.y(d.ma10))
    .curve(d3.curveCatmullRom.alpha(0.5));

    this.svg.select('path.ma10')
    .attr('d', () => ma10Line(this.pageData));

    const ma20Line = d3.line()
    .defined(d => d.ma20)
    .x(d => this.x(d.index))
    .y(d => this.y(d.ma20))
    .curve(d3.curveCatmullRom.alpha(0.5));

    this.svg.select('path.ma20')
    .attr('d', () => ma20Line(this.pageData));
  }
  initIndicatorLayout() {
    const indicatorChart = this.svg.selectAll('indicator-charts')
    .data(['indicator-charts'])
    .enter()
    .append('g')
    .attr('class', 'indicator-charts')
    .attr('transform', `translate(${this.options.marginLeft},${this.options.xAxisHeight + this.options.marginTop})`);

    indicatorChart.selectAll('g')
    .data(['ix axis', 'iy axis', 'indicator charts'])
    .enter()
    .append('g')
    .attr('class', d => d);

    indicatorChart.select('g.ix.axis')
    .attr('transform', `translate(0,${this.options.chartHeight + this.options.marginTop})`);

    this.svg.selectAll('indicator-cross')
    .data(['indicator-cross'])
    .enter()
    .append('g')
    .attr('class', d => d);
  }
  drawIndicatorScale() {
    if (typeof this.ixAxis === 'undefined') {
      this.ixAxis = d3.axisBottom()
      .scale(this.x)
      .ticks(5)
      .tickFormat('')
      .tickSize(-this.options.indicatorHeight);
    }

    this.svg.select('g.ix.axis')
    .call(this.ixAxis);

    if (typeof this.iy === 'undefined') {
      this.iy = d3.scaleLinear()
      .range([this.options.chartHeight + this.options.marginTop, (this.options.chartHeight + this.options.marginTop) - this.options.indicatorHeight]);

      this.iyAxis = d3.axisLeft()
        .scale(this.iy)
        .ticks(3)
        .tickSize(-this.options.chartWidth);
    }
    switch (this.options.indicatorType) {
      case 'MACD':
        // console.log(this.options.indicatorType);
        this.iy.domain([
          d3.min(this.pageData, d => d3.min([d.dif, d.dea, d.macd])),
          d3.max(this.pageData, d => d3.max([d.diff, d.dea, d.macd])),
        ]);
        break;
      case 'KDJ':
        this.iy.domain([
          d3.min(this.pageData, d => d3.min([d.k, d.d, d.j])),
          d3.max(this.pageData, d => d3.max([d.k, d.d, d.j])),
        ]);
        break;
      case 'RSI':
        // this.iy.domain(rsi().domain(this.pageData));
        this.iy.domain([
          d3.min(this.pageData, d => d3.min([d.rsi6, d.rsi12, d.rsi24])),
          d3.max(this.pageData, d => d3.max([d.rsi6, d.rsi12, d.rsi24])),
        ]);
        break;
      case 'VOL':
      default:
        this.iy.domain([
          0,
          d3.max(this.pageData, d => d.vol),
        ])
        .nice();
        break;
    }

    this.svg.select('g.iy.axis')
      .call(this.iyAxis);
  }
  drawVolChart() {
    this.svg.select('path.up-vol')
    .attr('d', () => {
      return this.upData.map((item) => {
        return `M ${this.x(item.index) - this.options.rectWidth} ${this.iy(0)} l ${2 * this.options.rectWidth} 0 L ${this.x(item.index) + this.options.rectWidth} ${this.iy(item.vol)} l ${-2 * this.options.rectWidth} 0 L ${this.x(item.index) - this.options.rectWidth} ${this.iy(0)}`;
      }).join(' ');
    });
    this.svg.select('path.down-vol')
    .attr('d', () => {
      return this.downData.map((item) => {
        return `M ${this.x(item.index) - this.options.rectWidth} ${this.iy(0)} l ${2 * this.options.rectWidth} 0 L ${this.x(item.index) + this.options.rectWidth} ${this.iy(item.vol)} l ${-2 * this.options.rectWidth} 0 L ${this.x(item.index) - this.options.rectWidth} ${this.iy(0)}`;
      }).join(' ');
    });
  }
  drawMacdChart() {
    // console.log(9999);
    const difLine = d3.line()
    .defined(d => d)
    .x(d => this.x(d.index))
    .y(d => this.iy(d.dif))
    .curve(d3.curveCatmullRom.alpha(0.5));

    this.svg.select('path.dif-line')
    .attr('d', () => difLine(this.pageData));

    const deaLine = d3.line()
    .defined(d => d)
    .x(d => this.x(d.index))
    .y(d => this.iy(d.dea))
    .curve(d3.curveCatmullRom.alpha(0.5));

    this.svg.select('path.dea-line')
    .attr('d', () => deaLine(this.pageData));

    this.svg.select('path.macd-up')
    .attr('d', () => {
      const data = this.pageData.filter(item => item.macd > 0);
      return data.map((item) => {
        const x = this.x(item.index);
        const y = this.iy(item.macd);
        const y0 = this.iy(0);
        return `M ${x - this.options.rectWidth} ${y0} l ${2 * this.options.rectWidth} 0 l 0 ${y - y0} l ${-2 * this.options.rectWidth} 0 l 0 ${y0 - y}`;
      }).join(' ');
    });

    this.svg.select('path.macd-down')
    .attr('d', () => {
      const data = this.pageData.filter(item => item.macd < 0);
      return data.map((item) => {
        const x = this.x(item.index);
        const y = this.iy(item.macd);
        const y0 = this.iy(0);
        return `M ${x - this.options.rectWidth} ${y0} l ${2 * this.options.rectWidth} 0 l 0 ${y - y0} l ${-2 * this.options.rectWidth} 0 l 0 ${y0 - y}`;
      }).join(' ');
    });
  }
  drawKdjChart() {
    const kLine = d3.line()
      .defined(d => d)
      .x(d => this.x(d.index))
      .y((d) => {
        return this.iy(d.k);
      })
      .curve(d3.curveCatmullRom.alpha(0.5));
    this.svg.select('path.k-line')
    .attr('d', () => kLine(this.pageData));

    const dLine = d3.line()
      .defined(d => d)
      .x(d => this.x(d.index))
      .y((d) => {
        return this.iy(d.d);
      })
      .curve(d3.curveCatmullRom.alpha(0.5));
    this.svg.select('path.d-line')
    .attr('d', () => dLine(this.pageData));

    const jLine = d3.line()
      .defined(d => d)
      .x(d => this.x(d.index))
      .y((d) => {
        return this.iy(d.j);
      })
      .curve(d3.curveCatmullRom.alpha(0.5));
    this.svg.select('path.j-line')
    .attr('d', () => jLine(this.pageData));
  }
  drawRsiChart() {
    const rsi6Line = d3.line()
      .defined(d => d)
      .x(d => this.x(d.index))
      .y((d) => {
        return this.iy(d.rsi6);
      })
      .curve(d3.curveCatmullRom.alpha(0.5));
    this.svg.select('path.rsi6-line')
    .attr('d', () => rsi6Line(this.pageData));

    const rsi12Line = d3.line()
      .defined(d => d)
      .x(d => this.x(d.index))
      .y((d) => {
        return this.iy(d.rsi12);
      })
      .curve(d3.curveCatmullRom.alpha(0.5));
    this.svg.select('path.rsi12-line')
    .attr('d', () => rsi12Line(this.pageData));

    const rsi24Line = d3.line()
      .defined(d => d)
      .x(d => this.x(d.index))
      .y((d) => {
        return this.iy(d.rsi24);
      })
      .curve(d3.curveCatmullRom.alpha(0.5));
    this.svg.select('path.rsi24-line')
    .attr('d', () => rsi24Line(this.pageData));
  }
  drawIndicatorChart() {
    switch (this.options.indicatorType) {
      case 'MACD':
        // console.log(this.options.indicatorType);
        this.drawMacdChart();
        break;
      case 'KDJ':
        this.drawKdjChart();
        break;
      case 'RSI':
        this.drawRsiChart();
        break;
      case 'VOL':
      default:
        this.drawVolChart();
        break;
    }
  }
  drawIndicator() {
    this.svg.select('g.indicator.charts')
    .selectAll('*')
    .remove();

    switch (this.options.indicatorType) {
      case 'MACD':
        this.svg.select('g.indicator.charts')
        .selectAll('path')
        .data(['dif-line', 'dea-line', 'macd-up', 'macd-down'])
        .enter()
        .append('path')
        .attr('class', d => d);
        break;
      case 'KDJ':
        this.svg.select('g.indicator.charts')
        .selectAll('path')
        .data(['k-line', 'd-line', 'j-line'])
        .enter()
        .append('path')
        .attr('class', d => d);
        break;
      case 'RSI':
        this.svg.select('g.indicator.charts')
        .selectAll('path')
        .data(['rsi6-line', 'rsi12-line', 'rsi24'])
        .enter()
        .append('path')
        .attr('class', d => d);
        break;
      case 'VOL':
      default:
        this.svg.select('g.indicator.charts')
        .selectAll('path')
        .data(['up-vol', 'down-vol'])
        .enter()
        .append('path')
        .attr('class', d => d);
        // this.drawVolChart();
        break;
    }
    this.drawIndicatorScale();
    this.drawIndicatorChart();
  }
  refreshData() {
    this.pageData = this.candleData
    .slice(-this.options.curIndex - this.options.pageCount, this.options.curIndex > 0 ? -this.options.curIndex : undefined)
    .map((item, index) => {
      return {
        ...item,
        index: index + 1,
      };
    });
    this.upData = this.pageData.filter(item => item.open <= item.close);
    this.downData = this.pageData.filter(item => item.open > item.close);
  }
  refresh(data, options) {
    if (typeof options !== 'undefined') {
      this.options = {
        ...this.options,
        ...options,
      };
    }
    this.candleData = data;
    switch (this.options.indicatorType) {
      case 'MACD':
        this.candleData = macd(this.candleData);
        break;
      case 'KDJ':
        this.candleData = kdj(this.candleData);
        break;
      case 'RSI':
        this.candleData = rsi(this.candleData);
        break;
      case 'VOL':
      default:
        break;
    }
    this.candleData = ma(this.candleData, [5, 10, 20]);
    this.refreshData();
    this.drawScales();
    this.drawCandleChart();
    this.drawIndicatorScale();
    this.drawIndicatorChart();
  }
  changeIndicatorType(type) {
    this.options.indicatorType = type;
    switch (this.options.indicatorType) {
      case 'MACD':
        this.candleData = macd(this.candleData);
        break;
      case 'KDJ':
        this.candleData = kdj(this.candleData);
        break;
      case 'RSI':
        this.candleData = rsi(this.candleData);
        break;
      case 'VOL':
      default:
        break;
    }
    // this.candleData = ma(this.candleData, [5, 10, 20]);
    this.refreshData();
    this.drawIndicator();
  }
  crossHandler() {
    this.svg.select('.cross')
    .selectAll('path')
    .data(['x-line', 'y-line'])
    .enter()
    .append('path')
    .attr('class', d => d);
    this.svg.select('.cross')
    .selectAll('text')
    .data(['x-text', 'y-text'])
    .enter()
    .append('text')
    .attr('class', d => d);

    this.svg.select('.indicator-cross')
    .selectAll('path')
    .data(['indicator-line'])
    .enter()
    .append('path')
    .attr('class', d => d);

    const minX = this.options.marginLeft;
    const maxX = this.options.marginLeft + this.options.chartWidth;
    const minY = this.options.marginTop + 8;
    const maxY = minY + this.options.mainHeight;

    const maxInd = this.options.chartHeight + this.options.marginTop + this.options.xAxisHeight + 8;
    const minInd = maxInd - this.options.indicatorHeight;
    const offsetX = d3.event.offsetX;
    const offsetY = d3.event.offsetY;

    if (minX <= offsetX && offsetX <= maxX && minY <= offsetY && offsetY <= maxY) {
      this.svg.style('cursor', 'crosshair');
      this.svg.select('.cross').select('path.x-line')
      .attr('d', `M ${offsetX} ${minY} L ${offsetX} ${maxY}`);
      this.svg.select('.cross').select('path.y-line')
      .attr('d', `M ${minX} ${offsetY} L ${maxX} ${offsetY}`);
      this.svg.select('.indicator-cross').select('path.indicator-line')
      .attr('d', `M ${offsetX} ${minInd} L ${offsetX} ${maxInd}`);

      const curX = this.pageData[parseInt(this.x.invert(offsetX), 10) - 3];
      this.svg.select('.cross')
      .select('text.x-text')
      .text(curX ? this.timeFormat(curX.date) : '')
      .attr('transform', `translate(${offsetX - 10},${maxY + 13})`);

      this.svg.select('.cross')
      .select('text.y-text')
      .text(this.y.invert(offsetY - this.y(this.y.domain()[1])).toFixed(this.options.offset))
      .attr('transform', `translate(${maxX + 3},${offsetY})`);

      this.showInfoTips(parseInt(this.x.invert(offsetX), 10) - 3);
    } else {
      this.svg.style('cursor', 'default');
      this.svg.selectAll('.cross path')
      .attr('d', '');
      this.svg.selectAll('.cross text')
      .text('');
      this.svg.select('.indicator-cross path.indicator-line')
      .attr('d', '');
    }
  }
  hideCross() {
    this.svg.style('cursor', 'default');
    this.svg.selectAll('.cross path')
    .attr('d', '');
    this.svg.selectAll('.cross text')
    .text('');
    this.svg.select('.indicator-cross path.indicator-line')
    .attr('d', '');
  }
  dragHandler() {
    const offset = parseInt(this.x.invert(d3.event.offsetX - this.startOffset), 10);
    if (this.options.startIndex + offset <= this.candleData.length - this.options.pageCount && this.options.startIndex + offset >= 0) {
      this.options.curIndex = this.options.startIndex + offset;
      this.refreshData();
      this.drawScales();
      this.drawCandleChart();
      this.drawIndicatorScale();
      this.drawIndicatorChart();
    }
  }
  initCross() {
    this.mask = this.svg.selectAll('rect.mask')
    .data(['mask'])
    .enter()
    .append('rect')
    .attr('class', d => d)
    .attr('fill-opacity', 0)
    .attr('width', this.options.width)
    .attr('height', this.options.mainHeight + this.options.marginTop);
    // .attr('transform', `translate(${this.options.marginLeft},${this.options.marginTop})`);
    // this.dom.on('mousemove');
    // this.dom.on('mousemove', this.crossHandler.bind(this));
    this.mask.on('mousemove', null);
    this.mask.on('mouseout', null);
    this.mask.on('mousemove', this.crossHandler.bind(this));
    this.mask.on('mouseout', this.hideCross.bind(this));
  }
  initDrag() {
    this.mask.on('mousedown', () => {
      this.hideCross();
      this.svg.style('cursor', 'move');
      this.startOffset = d3.event.offsetX;
      this.options.startIndex = this.options.curIndex;
      this.mask.on('mousemove', null);
      this.mask.on('mousemove', this.dragHandler.bind(this));
    });
    this.mask.on('mouseup', () => {
      this.svg.style('cursor', 'default');
      this.mask.on('mousemove', null);
      this.mask.on('mousemove', this.crossHandler.bind(this));
    });
  }
  showInfoTips(xVal) {
    if (xVal && xVal >= 0 && xVal < this.pageData.length) {
      const showItem = this.pageData[xVal];
      if (typeof this.curInfo === 'undefined') {
        this.curInfo = this.svg.select('.cross')
        .selectAll('.cur-info')
        .data(['cur-info'])
        .enter()
        .append('g')
        .attr('class', d => d)
        .attr('transform', `translate(${this.options.marginLeft}, ${this.options.marginTop + 2})`)
        .style('font-size', '12px')
        .append('text');
      }

      const info = [
        `时间:${this.timeFormat(showItem.date)}`,
        `开盘价:${showItem.open}`,
        `最高价:${showItem.high}`,
        `最低价:${showItem.low}`,
        `收盘价:${showItem.close}`,
        `MA5:${showItem.ma5 ? showItem.ma5.toFixed(this.options.offset) : '-'}`,
        `MA10:${showItem.ma10 ? showItem.ma10.toFixed(this.options.offset) : '-'}`,
        `MA20:${showItem.ma20 ? showItem.ma20.toFixed(this.options.offset) : '-'}`,
        `成交量:${showItem.vol}`,
        `涨跌幅:${showItem.updownrate}`,
      ].join('  ');

      this.svg.select('.cross .cur-info text')
      .text(info);
    } else {
      this.svg.select('.cross .cur-info text').text('');
    }
  }
}
