import _ from 'underscore';

function getEMA(list = [], number) {
  // 开始计算EMA值，
  const k = 2 / (number + 1); // 计算出序数
  const emaList = [];
  if (list.length === 0) {
    return emaList;
  }
  const lastEma = list.reduce((preEma, item) => {
    emaList.push(preEma);
    return (item * k) + (preEma * (1 - k));
  });
  emaList.push(lastEma);
  return emaList;
}

function getRSIByDay(list, count) {
  return list.map((item, index, array) => {
    if (index < count) {
      return '-';
    }
    let a = 0;
    let b = 0;
    array.slice(index - count, index)
      .forEach((aitem) => {
        if (aitem > 0) {
          a += +aitem;
        } else {
          b += 0 - aitem;
        }
      });
    return (100 * (a / b)) / (100 + (a / b));
  });
}

function getRSVList(list) {
  return list.map((item, index, array) => {
    const max = _.max(array.slice(0, index + 1), hitem => hitem.highp).highp;
    const min = _.min(array.slice(0, index + 1), litem => litem.lowp).lowp;
    if (max === min) {
      return 50;
    }
    return ((item.nowv - min) / (max - min)) * 100;
  });
}

// function accAdd(arg1, arg2) {
//   let r1;
//   let r2;
//   try {
//     r1 = arg1.toString().split('.')[1].length;
//   } catch (e) {
//     r1 = 0;
//   }
//   try {
//     r2 = arg2.toString().split('.')[1].length;
//   } catch (e) {
//     r2 = 0;
//   }
//   const m = Math.pow(10, Math.max(r1, r2));
//   const total = (arg1 * m) + (arg2 * m);
//   return parseInt(total, 10) / m;
// }

export function MaByDay(list, dayCount, place = 0) {
  return list.map((item, index, array) => {
    if (index < dayCount) {
      return '-';
    }
    const total = array.slice(index - dayCount, index).reduce((sum, sitem) => sum + sitem);
    return (total / dayCount).toFixed(Number(place));
  });
}

export function MA(list, place = 0) {
  return list.map((item, index, arr) => {
    const _arr = arr.slice(0, index + 1);
    const totalVal = _arr.map(arrItem => arrItem[0]).reduce((valItem, sum) => sum + valItem);
    const totalVol = _arr.map(arrItem => arrItem[1]).reduce((volItem, sum) => sum + volItem);
    return (totalVal / totalVol).toFixed(Number(place));
  });
}
/**
 * 获取MACD
 */
export function MACD(list) {
  const ema12 = getEMA(list, 12);
  const ema26 = getEMA(list, 26);
  const difList = ema12.map((item, index) => {
    return item - ema26[index];
  });
  difList[0] = 0;
  const deaList = getEMA(difList, 9);

  const macdList = difList.map((item, index) => {
    return 2 * (item - deaList[index]);
  });
  return {
    difList,
    deaList,
    macdList,
  };
}
/**
 * 获取KDJ
 */
export function KDJ(list) {
  // 当日K 值=2/3×前一日K 值＋1/3×当日RSV
  const rsvList = getRSVList(list);
  const kList = [];
  rsvList.reduce((preK, item) => {
    const k = (((2 * preK) + item) / 3).toFixed(3);
    kList.push(k);
    return k;
  }, 50);
  const dList = [];
  // 2/3×前一日D 值＋1/3×当日K 值
  kList.reduce((preD, item) => {
    const d = (((2 * preD) + (+item)) / 3).toFixed(3);
    dList.push(d);
    return d;
  }, 50);
  // J=3D—2K
  const jList = dList.map((item, index) => {
    return (3 * (+item)) - (2 * (+kList[index]));
  });
  return {
    kList,
    dList,
    jList,
  };
}

/**
 * 获取RSI
 */
export function RSI(list) {
  const rsi6 = getRSIByDay(list, 6);
  const rsi12 = getRSIByDay(list, 12);
  const rsi24 = getRSIByDay(list, 24);
  return {
    rsi6,
    rsi12,
    rsi24,
  };
}
