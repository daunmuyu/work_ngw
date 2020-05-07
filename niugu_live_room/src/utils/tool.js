import {
  notification,
} from 'antd';

// const EMOJI_FLAG = ['1f60a', '1f60c', '1f60f', '1f601', '1f604',
//   '1f609', '1f612', '1f614', '1f616', '1f618', '1f621', '1f628',
//   '1f630', '1f631', '1f633', '1f637', '1f603', '1f61e', '1f620',
//   '1f61c', '1f60d', '1f613', '1f61d', '1f62d', '1f602', '1f622',
//   '1f61a', '1f623', '1f632', '1f62a', '263a', '1f4aa', '1f44a',
//   '1f44d', '1f44e', '1f44f', '1f64f', '1f446', '1f447', '261d',
//   '270c', '1f44c', '270b', '270a', '1f440', '1f444', '1f35a',
//   '1f382', '1f37b', '2615', '1f451', '1f494', '1f339', '1f4a3',
//   '1f004', '1f437', '1f3b5', '2600', '1f319', '1f525', '1f47b',
//   '1f489', '1f4a9', '1f47c', '1f52b', '1f3c6', '26bd', '1f680'
// ];

export function extend(target, data) {
  return Object.assign({}, target, ...data);
}

export const a = 1;

export function openNotification({
  title = '提示',
  description,
  duration = 3
}) {
  const args = {
    message: title,
    description,
    duration,
  };
  notification.open(args);
}
export function timeFormat(v, f) {
  const time = new Date(v);
  let fmt = f;
  const o = {
    'M+': time.getMonth() + 1, //  月份
    'd+': time.getDate(), // 日
    'h+': time.getHours(), // 小时
    'm+': time.getMinutes(), // 分
    's+': time.getSeconds(), // 秒
    'q+': Math.floor((time.getMonth() + 3) / 3), // 季度
    S: time.getMilliseconds() // 毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (`${time.getFullYear()}`).substr(4 - RegExp.$1.length));
  }
  Object.keys(o).map((k) => {
    if (new RegExp(`(${k})`).test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : ((`00${o[k]}`).substr((`${o[k]}`).length)));
    }
    return k;
  });
  return fmt;
}

// 将表情转换成图片
export function faceToImg(val) {
  if (!val) {
    return val;
  }
  const str = val.replace(/\n+|↵+/g, '<br>');
  return str.replace(/\[([0-9a-f]{4,5})\]/g, (match, group) => {
    if (!/^\d+$/g.test(group)) {
      return `<img class="face-main-expres" src="https://i0.niuguwang.com/emoji/emoji_${group}.png">`;
    }
    return match;
  });
}

export function clearHtml(content) {
  const regnbsp = /&nbsp;/g;
  return content.replace(/<[^>]+>/g, '').replace(regnbsp, ' ');
}

// 将消息转化为可以发送的数据
export function messageToData(content) {
  let result = content.replace(/&nbsp;/g, ' ').trim();
  result = result.replace(/<br>/g, '\n');
  result = result.replace(/<img[^>]+?data-tag="([a-zA-Z0-9]{4,5})"[^>]*>/g, (match, key) => {
    return `[${key}]`;
  });

  return clearHtml(result);
}
