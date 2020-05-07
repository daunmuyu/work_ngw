
export default function maDay(data, dayArr) {
  const total = [];
  return data.map((item, index) => {
    const res = {
      ...item,
    };
    for (let i = 0; i < dayArr.length; i += 1) {
      const day = dayArr[i];
      if (index < day) {
        total[i] = index === 0 ? item.close : (total[i] + item.close);
        res[`ma${dayArr[i]}`] = undefined;
      } else {
        total[i] += item.close - data[index - day].close;
        res[`ma${dayArr[i]}`] = total[i] / day;
      }
    }
    return res;
  });
}
