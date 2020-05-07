// 表情包
export const emojiCode = ['1f60a', '1f60c', '1f60f', '1f601', '1f604',
  '1f609', '1f612', '1f614', '1f616', '1f618', '1f621', '1f628',
  '1f630', '1f631', '1f633', '1f637', '1f603', '1f61e', '1f620',
  '1f61c', '1f60d', '1f613', '1f61d', '1f62d', '1f602', '1f622',
  '1f61a', '1f623', '1f632', '1f62a', '263a', '1f4aa', '1f44a',
  '1f44d', '1f44e', '1f44f', '1f64f', '1f446', '1f447', '261d',
  '270c', '1f44c', '270b', '270a', '1f440', '1f444', '1f35a',
  '1f382', '1f37b', '2615', '1f451', '1f494', '1f339', '1f4a3',
  '1f004', '1f437', '1f3b5', '2600', '1f319', '1f525', '1f47b',
  '1f489', '1f4a9', '1f47c', '1f52b', '1f3c6', '26bd', '1f680',
];

// 表情转图片
export const faceToImg = (content) => {
  return content.replace(/\r\n/g, '<br/>').replace(/\[([0-9a-f]{4,5})\]/g, (match, group) => {
    if (emojiCode.indexOf(group) >= 0) {
      return `<img style="width:30px;height:30px;" src="https://i0.niuguwang.com/emoji/emoji_${group}.png">`;
    }
    return match;
  });
};

/**
 * 将内容转换为可以发送的内容
 */
export const contentToSend = (content) => {
  const result = content.replace(/&nbsp;/g, ' ')
  .trim()
  .replace(/<img[^>]+?([a-zA-Z0-9]{4,5}(?=\.png))[^>]*>/g, (match, key) => {
    return `[${key}]`;
  })
  .replace(/<style[^>]*>[^>]*<\/style>/g, '')
  .replace(/<br\/?[^>]*>/g, '\r\n')
  .replace(/<\/(div|p|li|h1|h2|h3|h4|h5|h6)>/g, '\r\n')
  .replace(/<\/?[^>]*>/g, '');
  return result;
};

export function getUrlParam(name) {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`);
  const r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}

export const isToday = (str) => { // 判断时间是否为今日
  return new Date().getTime() - new Date(str).getTime() < 86400000;
};

export const typeMsg = (str) => { // 文本类型
  const typeAry = ['text', 'image', 'audio', 'video', 'file', 'geo', 'custom', 'tip', 'robot', 'notification'];
  const typeRst = ['', '[图片]', '[语音]', '[视频]', '[文件]', '[位置]', '[自定义]', '[提醒]', '[AI]', '[群消息]'];
  if (str) return false;
  return typeRst[typeAry.indexOf(str)];
};

export const timeFormat = (t, fmt) => {
  const time = new Date(t * 1);
  const o = {
    'M+': time.getMonth() + 1, // 月份
    'd+': time.getDate(), // 日
    'h+': time.getHours(), // 小时
    'm+': time.getMinutes(), // 分
    's+': time.getSeconds(), // 秒
    'q+': Math.floor((time.getMonth() + 3) / 3), // 季度
    S: time.getMilliseconds(), // 毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (`${time.getFullYear()}`).substr(4 - RegExp.$1.length));
  // eslint-disable-next-line no-restricted-syntax
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : ((`00${o[k]}`).substr((`${o[k]}`).length)));
    }
  }
  return fmt;
};

export const delay = (() => {
  let timer = 0;
  return (callback, ms) => {
    clearTimeout(timer);
    timer = setTimeout(callback, ms);
  };
})();

export const reduceObj = (arr) => {
  const obj = {};
  return arr.reduce((item, next) => {
    if (!obj[next.time]) (obj[next.time] = true && item.push(next));
    return item;
  }, []);
};

// 筛选userID
export const useridArr = (arr) => {
  const uidArr = [];
  arr.forEach((v) => {
    const uid = v.UserID || v.userID;
    uidArr.push(uid);
  });
  return uidArr.join();
};

// 过滤数组 筛选出某个值  组成新数组
export const filterArr = (arr, val) => {
  const newArr = [];
  arr.forEach((v) => {
    const newVal = v[val];
    newArr.push(newVal);
  });
  return newArr;
};

// 过滤重复数组
export const uniq = (array) => {
  const temp = [];
  const len = array.length;
  for (let i = 0; i < len; i += 1) {
    for (let j = i + 1; j < len; j += 1) {
      if (array[i].UserID === array[j].UserID) {
        i += 1;
        j = i;
      }
    }
    console.log(array[i]);
    temp.push(array[i]);
  }
  return temp;
};
