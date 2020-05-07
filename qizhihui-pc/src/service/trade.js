import {
  get,
  // post,
  encodePost,
} from './request';

const qihuoniuHost = 'https://fd.qihuoniu.com';
// const userHost = 'https://user.qihuoniu.com';
// const payqihuoniuHost = 'https://pay.qihuoniu.com';
// 交易域名
const tradeHost = 'https://trade.qihuoniu.com';
// 模拟交易域名
const virtualTradeHost = 'https://strade.qihuoniu.com';

const defaultParams = {
  version: '9.9.9',
  packtype: '338',
  contracttypeid: 2,
  proxyid: 237,
};
/**
 *
 * 首页获取品种列表
 *
 * @export
 * @returns
 */
export function contractdatalist() {
  return get(`${qihuoniuHost}/mktdata/contractdatalist.ashx`, defaultParams);
}

/**
 * 获取期货行情页分时数据
 */
export function futuresshare(payload) {
  const query = {
    ...defaultParams,
    ...payload,
  };
  return get(`${qihuoniuHost}/mktdata/futuresshare.ashx`, query);
}
/**
 * 获取期货行情k线数据
 */
export function futureskline(payload) {
  const query = {
    ...defaultParams,
    ...payload,
  };
  return get(`${qihuoniuHost}/mktdata/futureskline.ashx`, query);
}
/**
 * 交易首页
 */
export function tradeHomePageInfo({
  usertoken,
  contractid,
  onlypos = 0,
}, simulate = false) {
  const args = {
    ...defaultParams,
    usertoken,
    contractid,
    onlypos,
  };
  const host = simulate ? virtualTradeHost : tradeHost;
  return encodePost(`${host}/tradehome.ashx`, args);
}
/**
 * 获取结算列表
 * @param {
 * usertoken: 用户token
 * page: 分页index,
 * pagesize: 分页size
 * } param
 * @param {是否模拟} simulate
 */
export function closetrade({
  usertoken,
  page,
  pagesize,
}, simulate) {
  const params = {
    ...defaultParams,
    usertoken,
    page,
    pagesize,
  };
  const host = simulate ? virtualTradeHost : tradeHost;
  return encodePost(`${host}/closetrade.ashx`, params);
}
/**
 * 获取流单列表
 * @param {*
 * usertoken: 用户token
 * page: 分页页码
 * pagesize: 每页条数
 * } param
 * @param {*是否模拟交易} simulate
 */
export function querydroporder({
  usertoken,
  page,
  pagesize,
}, simulate) {
  const params = {
    ...defaultParams,
    usertoken,
    page,
    pagesize,
  };
  const host = simulate ? virtualTradeHost : tradeHost;
  return encodePost(`${host}/querydroporder.ashx`, params);
}
/**
 * 获取下单页信息
 * @param {*
 * usertoken: 用户token,
 * contractid: 合约id,
 * bstype: 买涨/买跌
 * } param0
 */
export function buypage({
  usertoken,
  contractid,
  bstype,
}, simulate) {
  const params = {
    ...defaultParams,
    usertoken,
    contractid,
    bstype,
  };
  const host = simulate ? virtualTradeHost : tradeHost;
  return encodePost(`${host}/buypage.ashx`, params);
}

/**
 * 下单
 * @param {*
 * usertoken: 用户token
 * contractid: 合约ID
 * ordertype: 委托类型。限价 1；市价 2
 * price: ordertype=1时需传此参数 下单价格
 * direction: 买涨/买跌。买涨 1； 买跌 2
 * quantity: 委托手数
 * stopprofit: 触发止盈。没有限制时，传0
 * stoploss: 触发止损。
 * tradefee: 交易综合费
 * margin: 履约保证金
 * datatype: 数据来源 1：安卓 2：IOS 3：微信 4：M站 5：WEB站
 * deviceid: 设备标识
 * mobilemode: 手机型号
 * } payload
 * @param {*是否模拟交易} simulate
 */
export function order(payload, simulate) {
  const params = {
    ...defaultParams,
    ...payload,
  };
  const host = simulate ? virtualTradeHost : tradeHost;
  return encodePost(`${host}/order.ashx`, params);
}
/**
 * 这是止盈止损
 */
export function setstopprice(payload, simulate) {
  const params = {
    ...defaultParams,
    ...payload,
  };
  const host = simulate ? virtualTradeHost : tradeHost;
  return encodePost(`${host}/setstopprice.ashx`, params);
}
/**
 * 平仓
 * @param {*
 * usertoken: 用户token
 * posid: 持仓id,
 * ordertype: 委托类型，1限价；2市价
 * price: 下单价格，在ordertype为1时有效
 * quantity: 委托手数
 * datatype: 数据来源 1：安卓 2：IOS 3：微信 4：M站 5：WEB站
 * deviceid: 设备标识
 * mobilemode: 手机型号
 * } payload
 * @param {*是否模拟} simulate
 */
export function closepos(payload, simulate) {
  const params = {
    ...defaultParams,
    ...payload,
  };
  const host = simulate ? virtualTradeHost : tradeHost;
  return encodePost(`${host}/closepos.ashx`, params);
}
/**
 * 模拟交易-用户模拟交易配置
 */
export function simulateSettingInfo(payload) {
  const params = {
    ...defaultParams,
    ...payload,
  };
  return encodePost(`${virtualTradeHost}/fundaccountconfig.ashx`, params);
}
