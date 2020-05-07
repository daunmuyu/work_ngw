// function emaAlphaInit (period) {
//   return 2 / (period + 1)
// }

// // const day = 6;

// // let previous = null;
// // // const alpha = emaAlphaInit(day);
// // let initialTotal = 0;
// // let initialCount = 0;

// function average (value, day, previous, initialCount = 0, initialTotal = 0) {
//   const alpha = emaAlphaInit(day)
//   let count
//   let total
//   if (initialCount < day) {
//     total = initialTotal + value
//     count = initialCount + 1
//     previous = total / count
//     return {
//       value: previous,
//       count,
//       total
//     }
//   }
//   previous += alpha * (value - previous)
//   return {
//     value: previous,
//     count,
//     total
//   }
// }

// export default function getMa (data, dayArr) {
//   const previous = []
//   const initialTotal = []
//   const initialCount = []
//   return data.map((d, i) => {
//     const res = {
//       ...d
//     }
//     for (let j = 0; j < dayArr.length; j += 1) {
//       const day = dayArr[j]
//       const {
//         value,
//         count,
//         total
//       } = average(d.close, day, previous[j], initialCount[j], initialTotal[j])
//       previous[j] = value
//       initialCount[j] = count
//       initialTotal[j] = total
//       if (i + 1 < day) {
//         // value = null;
//         res[`ma${day}`] = null
//       } else {
//         res[`ma${day}`] = value
//       }
//     }

//     return res
//   })
// }

export default function getMa(data, dayArr) {
  // const previous = []
  // const initialTotal = []
  // const initialCount = []
  const aArr = dayArr.map(day => (day - 2) / (day + 1));
  const bArr = dayArr.map(day => 2 / (day + 1));
  return data.map((d, i) => {
    const res = d;
    if (i === 0) {
      for (let j = 0; j < dayArr.length; j += 1) {
        res[`ma${dayArr[j]}`] = res.close;
      }
    } else {
      for (let j = 0; j < dayArr.length; j += 1) {
        const preItem = data[i - 1];
        res[`ma${dayArr[j]}`] = ((aArr[j] * preItem[`ma${dayArr[j]}`]) + (bArr[j] * d.close)).toFixed(9);
        // const day = dayArr[j]
        // const {
        //   value,
        //   count,
        //   total
        // } = average(d.close, day, previous[j], initialCount[j], initialTotal[j])
        // previous[j] = value
        // initialCount[j] = count
        // initialTotal[j] = total
        // if (i + 1 < day) {
        //   // value = null;
        //   res[`ma${day}`] = null
        // } else {
        //   res[`ma${day}`] = value
        // }
      }
    }

    return res;
  });
}
