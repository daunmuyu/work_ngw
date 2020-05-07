import bridge from "ng-bridge";
import { post } from '../lib/request.js';

const BASEHOST = 'https://api.niuguwang.com/subscribe/';

export const COURSE_ID = bridge.search('courseid') || '3926';

export const COURSE_TYPES = {
  3926: '1',
  4390: '2',
  4391: '3',
  4389: '4',
  4376: '5',
  4392: '6',
  4420: '6',
  4421: '6',
  4422: '6',
};

export const TITLES = {
  4392: '实战为王训练营',
  4420: '实战为王训练营',
  4421: '实战为王训练营',
  4422: '实战为王训练营',
  3926: '股海学院',
  4390: '王牌掘金',
  4391: '成长为王',
  4389: '五维擒龙',
  4376: '成长为王',
};

export const LIVE_ROOM_ID = {
  4392: '681',
  3926: '568',
  4389: '678',
  4391: '679',
  4390: '680',
  4376: '659',
};
// 0: 投顾协议，1：投教协议
const INVESTMENT_TYPE_INFOS = [
  {
    name: "《海能投顾产品服务协议》",
    url: "https://h5.niuguwang.com/appinline/2018y/agreement/investment-consult.html",
  },
  {
    name: "《海能投教产品服务协议》",
    url: "https://h5.niuguwang.com/appinline/2018y/agreement/investment.html",
  },
];

export const INVESTMENT_TYPES = {
  4392: INVESTMENT_TYPE_INFOS[0],
  3926: INVESTMENT_TYPE_INFOS[1],
  4389: INVESTMENT_TYPE_INFOS[1],
  4391: INVESTMENT_TYPE_INFOS[1],
  4390: INVESTMENT_TYPE_INFOS[0],
  4376: INVESTMENT_TYPE_INFOS[1],
};
// 购买判断 生成订单信息 购买后 股票池列表 研判走势历史列表 根据用户ID取购买课程
export function getIsBuy(arg) {
  // return post('https://api.niuguwang.com/subscribe/Denver.ashx', arg);
  return post(`${BASEHOST}Denver.ashx`, arg);
}
// 今日策略
export function getDenver(arg) {
  return post(`${BASEHOST}Denver.ashx?action=denverinfonew&courseid=${COURSE_ID}`, arg);
}
/*
  * vip直播室点击查看更多，获取第一层列表
  * 获取第二层列表-H5内
*/
export function fetchLiveList(arg) {
  // return post('https://live.niuguwang.com/video/Excellent/GetExcellentPart', arg);
  return post('https://api.niuguwang.com/subscribe/trendcourse.ashx', arg);
}
// vip直播室，获取第二层列表-app内
export function fetchLiveListDetail(arg) {
  return post('https://live.niuguwang.com/video/Excellent/VideoList', arg);
}
// 视频列表更多
export function getLive(arg) {
  return post('https://live.niuguwang.com/video/JueJinBaoQian/NewAfterBuy', arg);
}
// 课程预告
export function getCourse(arg) {
  return post(`${BASEHOST}trendcourse.ashx?action=coursetimeline&courseid=${COURSE_ID}`, arg);
}
// 股票池
// export function getPool(arg) {
//   return post(`${BASEHOST}trendcourse.ashx?action=stockpoollist&courseid=${COURSE_ID}`, arg);
// }
// 股票池2018
export function getPoolNew(arg) {
  return post(`${BASEHOST}trendcourse.ashx?action=stockpoollistnew&courseid=${COURSE_ID}`, arg);
}
// 股票池单项打开
export function getItemMore(arg) {
  return post(`${BASEHOST}trendcourse.ashx?action=stockpooldetailv2&courseid=${COURSE_ID}`, arg);
}
// 机构池
export function getCompany(arg) {
  return post(`${BASEHOST}CompanyPoolGet.ashx`, arg);
}
// 备选池
export function getAlternative(arg) {
  return post(`${BASEHOST}CompanyBaseGet.ashx`, arg);
}
// 内参
export function getReport(arg) {
  return post(`${BASEHOST}trendcourse.ashx?action=stockreportlist&courseid=${COURSE_ID}`, arg);
}
// 风险测试
export function getRiskTest(arg) {
  return post(`https://api.niuguwang.com/subscribe/otherset.ashx?courseid=${COURSE_ID}`, arg);
}

// 风险测试
export function ckConfirm(arg) {
  return post(`https://live.niuguwang.com/chat/course/checkidentityandprotocolconfirm?courseid=${COURSE_ID}`, arg);
}
// 风险提示
export function getRiskText(arg) {
  return post('https://api.niuguwang.com/subscribe/Denver.ashx?action=isbuy', arg);
}
