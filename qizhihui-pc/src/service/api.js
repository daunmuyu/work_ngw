// import Request from './request';
import {
  get,
  post,
  encodePost,
} from './request';

const qihuoniuHost = 'https://fd.qihuoniu.com';
const userHost = 'https://user.qihuoniu.com';
const payqihuoniuHost = 'https://pay.qihuoniu.com';

const defaultParams = {
  version: '1.0.0',
  packtype: '779',
  contracttypeid: 2,
  proxyid: 237,
};

const initialParams = {
  version: '1.0.0',
  packtype: '779',
  currenttype: 'CNY',
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
 * 注册接口
 *
 * @export
 * @returns
 */
export function register(args) {
  return post(`${userHost}/Api/register.ashx`, {
    ...defaultParams,
    ...args,
  });
}

/**
 * 登录接口
 *
 * @export
 * @returns
 */
export function login(args) {
  return post(`${userHost}/Api/login.ashx`, {
    ...defaultParams,
    ...args,
  });
}

/**
 * 登录接口
 *
 * @export
 * @returns
 */
export function getUserIndex(args) {
  return post(`${userHost}/Api/getUserIndex.ashx`, {
    ...defaultParams,
    ...args,
  });
}

/**
 * 发送验证码
 *
 * @export
 * @returns
 */
export function getverifycode(args) {
  return get(`${userHost}/Api/getverifycode.ashx`, {
    ...defaultParams,
    ...args,
  });
}
/**
 * 重置密码
 *
 * @export
 * @returns
 */

export function resetPassword(args) {
  return post(`${userHost}/Api/resetPassword.ashx`, {
    ...defaultParams,
    ...args,
  });
}

/**
 * 实名认证
 *
 * @export
 * @returns
 */
export function addidcard(args) {
  return encodePost(`${payqihuoniuHost}/wallet/addidcard.ashx`, {
    ...args,
    ...defaultParams,
  });
}

/**
 * 获取支付地址
 *
 * @export
 * @returns
 */
export function paymentmethod(args) {
  return get('https://pay.qihuoniu.com/payment/paymentmethod.ashx', {
    ...defaultParams,
    ...args,
  });
}
/**
 * 获取用户是否开户是否认证银行卡
 *
 * @export
 * @returns
 */
export function getwalletbank(args) {
  return encodePost('https://pay.qihuoniu.com/wallet/getwalletbank.ashx', {
    ...defaultParams,
    ...args,
  });
}
/**
 * 获取用户余额
 * @param {*
 * usertoken: 用户token
 * } args
 */
export function getuserbalance(args) {
  return encodePost('https://trade.qihuoniu.com/getuserbalance.ashx', {
    ...defaultParams,
    ...args,
  });
}

/**
 * 提交银行卡信息
 * @param {*
 * usertoken: 用户token
 * } args
 */
export function addbank(args) {
  return encodePost('https://pay.qihuoniu.com/wallet/addbank.ashx', {
    ...initialParams,
    ...args,
  });
}

/**
 * 解绑银行卡
 * @param {*
 * usertoken: 用户token
 * } args
 */
export function unbindbank(args) {
  return encodePost('https://pay.qihuoniu.com/wallet/unbindbank.ashx', {
    ...initialParams,
    ...args,
  });
}

/**
 * 获取可提金额,银行卡与身份验证信息
 * @param {*
 * usertoken: 用户token
 * } args
 */
export function getavail(args) {
  return encodePost('https://pay.qihuoniu.com/wallet/getavail.ashx', {
    ...initialParams,
    ...args,
  });
}

/**
 * 获取可提金额,银行卡与身份验证信息
 * @param {*
 * usertoken: 用户token
 * } args
 */
export function walletrquest(args) {
  return encodePost('https://pay.qihuoniu.com/wallet/walletrquest.ashx', {
    ...initialParams,
    ...args,
  });
}

/**
 * 获取可提金额,银行卡与身份验证信息
 * @param {*
 * usertoken: 用户token
 * } args
 */
export function querymoneyflow(args) {
  return encodePost('https://trade.qihuoniu.com/querymoneyflow.ashx', {
    ...initialParams,
    ...args,
  });
}

