import ema from './ema.js';

export default function getMacd(data) {
  const emaData = ema(data, [12, 26]);
  let preDea = 0;
  const resData = data.map((item, index) => {
    const dif = emaData[index].ma12 && emaData[index].ma26 ? ((+emaData[index].ma12) - (+emaData[index].ma26)) : 0;
    const dea = (preDea * 0.8) + (dif * 0.2);
    preDea = dea;
    const macd = 2 * (dif - dea);
    return {
      ...item,
      dif,
      dea,
      macd,
    };
  });
  return resData;
}
