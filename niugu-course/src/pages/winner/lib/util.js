import bridge from "ng-bridge";

/**
 * 字符串转DateTime
 * @param strTime 字符串 YYYYMMDDHHmmSS
 */
export default function parseDate(strTime) {
  return new Date(
    +strTime.substr(0, 4),
    +strTime.substr(4, 2) - 1,
    +strTime.substr(6, 2),
    +strTime.substr(8, 2),
    +strTime.substr(10, 2),
    +strTime.substr(12, 2),
  );
}

export function hasClass(element, str) {
  if (typeof str === 'string' && element.className.includes(str)) {
    return true;
  }
  return false;
}

/**
 * 增加class
 * @param  字符串 'red'
 */
export function addClass(element, strClass) {
  if (!hasClass(element, strClass)) {
    const array = element.className.split(' ');
    array.push(strClass);
    element.className = array.join(' ');
  }
}

/**
 * 删除class
 * @param  字符串 'red'
 */
export function removeClass(element, strClass) {
  if (hasClass(element, strClass)) {
    const array = element.className.split(' ');
    const index = strClass.indexOf(array);
    array.splice(index, 1);
    element.className = array.join(' ');
  }
}

/**
 * 查询参数
 */
export function qsearch(name) {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`);
  const r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}

