import * as d3 from 'd3';

const defaultOptions = {
  width: 600,
  height: 400,
  marginLeft: 40,
  marginRight: 40,
  marginTop: 8,
  marginBottom: 30,
  mainPercentage: 0.8,
  xAxisHeight: 10,
};

export default class ShareChart {
  constructor(dom, options, data) {
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
    this.timeFormat = d3.timeFormat('%H:%M');
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
      this.shareData = data;
    }
    this.initLayout();
    this.drawScales();
    this.drawShareChart();
    this.drawIndicatorChart();

    this.initCross();
  }
  initLayout() {
    this.svg = d3.select(this.options.dom)
    .append('svg')
    .attr('width', this.options.width)
    .attr('height', this.options.height);

    const mainChart = this.svg.append('g')
    .attr('class', 'main-charts')
    .attr('transform', `translate(${this.options.marginLeft},${this.options.marginTop})`);

    this.mainChart = mainChart;

    mainChart.append('g')
    .attr('class', 'x axis')
    .attr('transform', `translate(0,${this.options.mainHeight + this.options.marginTop})`);

    mainChart.append('g')
    .attr('class', 'y axis');

    mainChart.append('g')
    .attr('class', 'main charts')
    .selectAll('path')
    .data(['share-line', 'share-area', 'share-ma'])
    .enter()
    .append('path')
    .attr('class', d => d);

    this.crossChart = this.svg.append('g')
    .attr('class', 'cross');

    const indicatorChart = this.svg.append('g')
    .attr('class', 'indicator-charts')
    .attr('transform', `translate(${this.options.marginLeft},${this.options.xAxisHeight})`);

    indicatorChart.append('g')
    .attr('class', 'ix axis')
    .attr('transform', `translate(0,${this.options.chartHeight + this.options.marginTop})`);

    indicatorChart.append('g')
    .attr('class', 'iy axis');

    indicatorChart.append('g')
    .attr('class', 'indicator charts')
    .selectAll('path')
    .data(['share-vol'])
    .enter()
    .append('path')
    .attr('class', d => d);

    this.svg.append('g')
    .attr('class', 'indicator-cross');
  }
  drawScales() {
    if (typeof this.x === 'undefined') {
      this.x = d3.scaleLinear()
      .rangeRound([1, this.options.chartWidth]);

      this.xAxis = d3.axisBottom()
      .scale(this.x)
      .tickSize(-this.options.mainHeight);
    }

    this.x.domain([0, this.options.totalCount]);
    this.xAxis.tickValues(this.options.timeaxisindex)
    .tickFormat(x => this.options.timeaxistext[this.options.timeaxisindex.indexOf(x)]);

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
      d3.min(this.shareData, d => d.price),
      d3.max(this.shareData, d => d.price),
    ])
    .nice();
    this.svg.select('g.y.axis')
      .call(this.yAxis);

    if (typeof this.ixAxis === 'undefined') {
      this.ixAxis = d3.axisBottom()
      .scale(this.x)
      .tickSize(-this.options.indicatorHeight);
    }

    this.ixAxis.tickValues(this.options.timeaxisindex)
    .tickFormat('');

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

    this.iy.domain([
      0,
      d3.max(this.shareData, d => d.vol),
    ])
    .nice();

    this.svg.select('g.iy.axis')
    .call(this.iyAxis);
  }
  drawShareChart() {
    this.shareLine = d3.line()
      .defined(d => d)
      .x((d, index) => this.x(index))
      .y((d) => {
        return this.y(d.price);
      });

    this.shareArea = d3.area()
      .x(this.shareLine.x())
      .y1(this.shareLine.y())
      .y0(this.options.mainHeight + this.options.marginTop);

    this.maLine = d3.line()
    .defined(d => d)
    .x((d, index) => this.x(index))
    .y(d => this.y(d.ma));

    this.svg.select('path.share-line')
      .attr('d', () => this.shareLine(this.shareData));

    this.svg.select('path.share-area')
      .attr('d', () => this.shareArea(this.shareData));

    this.svg.select('path.share-ma')
    .attr('d', () => this.maLine(this.shareData));
  }
  volChart(data) {
    const path = data.map((item, index) => {
      return `M ${this.x(index)} ${this.iy(item.vol)} L ${this.x(index)} ${this.iy(0)}`;
    }).join(' ');
    return path;
  }
  drawIndicatorChart() {
    this.svg.select('path.share-vol')
    .attr('d', () => this.volChart(this.shareData));
  }
  refresh(data, options) {
    if (typeof options !== 'undefined') {
      this.options = {
        ...this.options,
        ...options,
      };
    }
    this.shareData = data;
    this.drawScales();
    this.drawShareChart();
    this.drawIndicatorChart();
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
    const minY = this.options.marginTop * 2;
    const maxY = minY + this.options.mainHeight;

    const maxInd = this.options.chartHeight + (2 * this.options.marginTop) + this.options.xAxisHeight;
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

      const curX = this.shareData[parseInt(this.x.invert(offsetX - this.options.marginLeft), 10)];
      this.svg.select('.cross')
      .select('text.x-text')
      .text(curX ? this.timeFormat(curX.date) : '')
      .attr('transform', `translate(${offsetX - 10},${maxY + 10})`);

      this.svg.select('.cross')
      .select('text.y-text')
      .text(this.y.invert(offsetY - this.y(this.y.domain()[1])).toFixed(this.options.offset))
      .attr('transform', `translate(${maxX + 3},${offsetY})`);

      this.showInfoTips(parseInt(this.x.invert(offsetX - this.options.marginLeft), 10));
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
  initCross() {
    this.mask = this.svg.selectAll('rect.mask')
    .data(['mask'])
    .enter()
    .append('rect')
    .attr('class', d => d)
    .attr('fill-opacity', 0)
    .attr('width', this.options.width)
    .attr('height', this.options.mainHeight + this.options.marginTop);

    // this.dom.on('mousemove');
    // this.dom.on('mousemove', this.crossHandler.bind(this));
    this.mask.on('mousemove', null);
    this.mask.on('mouseout', null);
    this.mask.on('mousemove', this.crossHandler.bind(this));
    this.mask.on('mouseout', this.hideCross.bind(this));
  }
  showInfoTips(xVal) {
    if (xVal && xVal >= 0 && xVal < this.shareData.length) {
      const showItem = this.shareData[xVal];
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
        `价格:${showItem.price}`,
        `均价:${showItem.ma.toFixed(this.options.offset)}`,
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
