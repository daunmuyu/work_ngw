function getRSIByDay(list, count, i) {
  if (i < count) {
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
  const rsiItem = (100 * a) / (a + b);
  return rsiItem;
}

export default function getRsiData(data) {
  const result = [];
  for (let i = 0; i < data.length; i += 1) {
    result.push({
      ...data[i],
      rsi6: getRSIByDay(data, 6, i),
      rsi12: getRSIByDay(data, 12, i),
      rsi24: getRSIByDay(data, 24, i),
    });
  }
  return result;
}
