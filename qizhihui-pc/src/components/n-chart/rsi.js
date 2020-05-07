const d3 = window.d3;

function getRSIByDay(list, count, i) {
  // const result = [];
  // for (let i = 0, j = list.length; i < j; i += 1) {
  if (i < count) {
    // result.push(0);
    return '';
  }
  let a = 0;
  let b = 0;
  for (let m = i - count, n = i; m < n; m += 1) {
    const ud = +list[m].close;
    if (list[m].updownrate.indexOf('-') === -1) {
      a += +ud;
    } else {
      b += +ud;
    }
  }
  const rsiItem = (100 * a) / (a + b); // (100 * (a / b)) / (100 + (a / b));
  // result.push(rsiItem);
  return rsiItem;
  // }
  // }
  // return result;
}

export default function () {
  const rsi = (svg) => {
    if (svg.select('g.data').empty()) {
      svg.append('g')
        .attr('class', 'data');
    }
    svg.select('g.data').selectAll('path.rsi')
      .data(['rsi6', 'rsi12', 'rsi24'])
      .enter()
      .append('path')
      .attr('class', c => `rsi ${c}`);
    rsi.refresh(svg);
  };
  // 绑定x轴
  rsi.xScale = (x) => {
    rsi.x = x;
    return rsi;
  };
  // 绑定y轴
  rsi.yScale = (y) => {
    rsi.y = y;
    return rsi;
  };
  rsi.rsi6 = d3.line()
    .x(item => rsi.x(item.date))
    .y(item => rsi.y(item.rsi6));
  rsi.rsi12 = d3.line()
    .x(item => rsi.x(item.date))
    .y(item => rsi.y(item.rsi12));
  rsi.rsi24 = d3.line()
    .x(item => rsi.x(item.date))
    .y(item => rsi.y(item.rsi24));
  rsi.getRSIData = (data) => {
    // const rsi6 = getRSIByDay(data, 6);
    // const rsi12 = getRSIByDay(data, 12);
    // const rsi24 = getRSIByDay(data, 24);
    const result = [];
    for (let i = 0; i < data.length; i += 1) {
      result.push({
        date: data[i].date,
        rsi6: getRSIByDay(data, 6, i),
        rsi12: getRSIByDay(data, 12, i),
        rsi24: getRSIByDay(data, 24, i),
      });
      // getRSIByDay(data, 6, i);
    }
    return result;
    // console.log(333, rsi6);
    // const res = _.zip(rsi6, rsi12, rsi24)
    //   .map((item) => {
    //     return _.object(['rsi6', 'rsi12', 'rsi24'], item);
    //   });
    // console.log(222, res);
    // window.res = res;
    // return res;
    // return {
    //   rsi6,
    //   rsi12,
    //   rsi24,
    // };
  };
  rsi.refresh = (svg) => {
    svg.select('path.rsi6').attr('d', rsi.rsi6);
    svg.select('path.rsi12').attr('d', rsi.rsi12);
    svg.select('path.rsi24').attr('d', rsi.rsi24);
  };
  rsi.domain = (data) => {
    const minRsi6 = d3.min(data.map(d => d.rsi6));
    const minRsi12 = d3.min(data.map(d => d.rsi12));
    const minRsi24 = d3.min(data.map(d => d.rsi24));
    const min = d3.min([minRsi6, minRsi12, minRsi24]);

    const maxRsi6 = d3.max(data.map(d => d.rsi6));
    const maxRsi12 = d3.max(data.map(d => d.rsi12));
    const maxRsi24 = d3.max(data.map(d => d.rsi24));
    const max = d3.max([maxRsi6, maxRsi12, maxRsi24]);

    const padding = (max - min) / 4;
    return [min - padding, max + padding];
  };
  return rsi;
}
