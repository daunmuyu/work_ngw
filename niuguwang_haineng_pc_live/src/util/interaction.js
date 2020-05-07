// 表情包
const emojiCode = ['1f60a', '1f60c', '1f60f', '1f601', '1f604',
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
  return content.replace(/\[([0-9a-f]{4,5})\]/g, (match, group) => {
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
  let result = content.replace(/&nbsp;/g, ' ').trim();
  result = result.replace(/<br>/g, '\n');
  result = result.replace(/<img[^>]+?([a-zA-Z0-9]{4,5}(?=\.png))[^>]*>/g, (match, key) => {
    return `[${key}]`;
  });

  return result;
};

export function getUrlParam(name) {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`);
  const r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}
