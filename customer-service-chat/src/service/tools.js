/**
 * 工具函数
 */
export default {
  // 获取地址栏参数
  search: (key) => {
    let res;
    let ss;
    let i;
    let sss;
    let s = location.search;
    if (s) {
      s = s.substr(1);
      if (s) {
        ss = s.split('&');
        for (i = 0; i < ss.length; i += 1) {
          sss = ss[i].split('=');
          if (sss && sss[0] === key) {
            res = sss[1];
          }
        }
      }
    }
    return res;
  },
  // 判断时间为今天 如果数字为负数，-1为明天   负多少就是差多少    正数相反的道理
  judgeTime: (dt) => {
    const data = dt.replace(/-|T|:/g, '');
    const date = data.toString();
    const year = date.substring(0, 4);
    const month = date.substring(4, 6);
    const day = date.substring(6, 8);
    const d1 = new Date(`${year}/${month}/${day}`);
    const dd = new Date();
    const y = dd.getFullYear();
    const m = dd.getMonth() + 1;
    const d = dd.getDate();
    const d2 = new Date(`${y}/${m}/${d}`);
    const iday = parseInt(d2 - d1, 10) / 1000 / 60 / 60 / 24;
    return iday;
  },
  /**
   * 获取浏览器的名称和版本号信息
   */
  getBrowser: () => {
    const browser = {
      msie: false,
      firefox: false,
      opera: false,
      safari: false,
      chrome: false,
      netscape: false,
      appname: 'unknown',
      version: 0,
    };
    const ua = window.navigator.userAgent.toLowerCase();
    if (/(msie|firefox|opera|chrome|netscape)\D+(\d[\d.]*)/.test(ua)) {
      browser[RegExp.$1] = true;
      browser.appname = RegExp.$1;
      browser.version = RegExp.$2;
    } else if (/version\D+(\d[\d.]*).*safari/.test(ua)) {
      // safari
      browser.safari = true;
      browser.appname = 'safari';
      browser.version = RegExp.$2;
    }
    return `${browser.appname}<=>${browser.version}`;
  },
  /**
   * 如果浏览器非IE10,Chrome, FireFox, Safari, Opera的话，显示提示
   */
  showNotice: () => {
    const browser = this.getBrowser();
    const temp = browser.split('<=>');
    const appname = temp[0];
    const version = temp[1];
    if (['msie', 'firefox', 'opera', 'safari', 'chrome'].contains(appname)) {
      if (appname === 'msie' && version < 10) {
        this.$footer.find('p').removeClass('hide');
      }
    } else {
      this.$footer.find('p').removeClass('hide');
    }
  },
};
