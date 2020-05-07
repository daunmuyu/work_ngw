const d3 = window.d3;

function getRSVList(list) {
  const result = [];
  let max = 0;
  let min;
  for (let i = 0, j = list.length; i < j; i += 1) {
    const {
      high,
      low,
      close,
    } = list[i];
    if (high > max) {
      max = high;
    }
    if (!min || low < min) {
      min = low;
    }
    if (max === min) {
      result.push(50);
    } else {
      result.push((((close - min) / (max - min)) * 100));
    }
  }
  return result;
}

export default function () {
  const kdj = (svg) => {
    if (svg.select('g.data').empty()) {
      svg.append('g')
      .attr('class', 'data');
    }
    svg.select('g.data').selectAll('path.kdj')
      .data(['k', 'd', 'j'])
      .enter()
      .append('path')
      .attr('class', c => `kdj ${c}`);
    kdj.refresh(svg);
  };
  // 绑定x轴
  kdj.xScale = (x) => {
    kdj.x = x;
    return kdj;
  };
  // 绑定y轴
  kdj.yScale = (y) => {
    kdj.y = y;
    return kdj;
  };
  kdj.k = d3.line()
    .x(item => kdj.x(item.date))
    .y(item => kdj.y(item.k));
  kdj.d = d3.line()
    .x(item => kdj.x(item.date))
    .y(item => kdj.y(item.d));
  kdj.j = d3.line()
    .x(item => kdj.x(item.date))
    .y(item => kdj.y(item.j));
  kdj.getKDJData = (data) => {
    // 当日K 值=2/3×前一日K 值＋1/3×当日RSV
    const rsvList = getRSVList(data);
    const kdjData = [];
    // const kList = [];
    // const dList = [];
    let preK = 50;
    let preD = 50;
    // const jList = [];
    for (let i = 0, j = rsvList.length; i < j; i += 1) {
      const item = rsvList[i];
      preK = ((2 * preK) + item) / 3;
      preD = ((2 * preD) + (+preK)) / 3;
      kdjData.push({
        date: data[i].date,
        k: preK,
        d: preD,
        j: (3 * (+preD)) - (2 * (+preK)),
      });
    }
    return kdjData;
  };
  kdj.refresh = (svg) => {
    svg.select('path.k').attr('d', kdj.k);
    svg.select('path.d').attr('d', kdj.d);
    svg.select('path.j').attr('d', kdj.j);
  };
  kdj.domain = (data) => {
    const maxK = d3.max(data.map(d => d.k));
    const maxD = d3.max(data.map(d => d.d));
    const maxJ = d3.max(data.map(d => d.j));
    const max = d3.max([maxK, maxD, maxJ]);

    const minK = d3.min(data.map(d => d.k));
    const minD = d3.min(data.map(d => d.d));
    const minJ = d3.min(data.map(d => d.j));
    const min = d3.min([minK, minD, minJ]);

    const padding = (max - min) / 4;
    return [min - padding, max + padding];
  };
  return kdj;
}
