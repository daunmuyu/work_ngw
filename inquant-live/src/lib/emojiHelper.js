export function emojiToImg(content) {
  console.log(231, content);
  return content.replace(/\[([0-9a-f]{4,5})\]/g, (match, group) => {
    console.log(match, group);
    if (!/^\d+$/g.test(group) && group.length < 6) {
      return `<img class="emoji" style="width:28px;height:28px;" src="https://i0.niuguwang.com/emoji/emoji_${group}.png">`;
    }
    return match;
  });
}

/**
 * 将内容转换为可以发送的内容
 */
export function formatMsg(content) {
  let result = content.replace(/&nbsp;/g, ' ').trim();
  result = result.replace(/<br>/g, '\n');
  result = result.replace(/<img[^>]+?([a-zA-Z0-9]{4,5}(?=\.png))[^>]*>/g, (match, key) => {
    return `[${key}]`;
  });

  return result;
}

