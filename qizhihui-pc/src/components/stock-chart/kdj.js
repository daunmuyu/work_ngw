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

export default function getKDJData(data) {
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
      ...data[i],
      k: preK,
      d: preD,
      j: (3 * (+preD)) - (2 * (+preK)),
    });
  }
  return kdjData;
}
