/**
 * 字符串转DateTime
 * @param strTime 字符串 YYYYMMDDHHmmSS
 */
export function parseDate(strTime) {
  return new Date(
    +strTime.substr(0, 4),
    +strTime.substr(4, 2) - 1,
    +strTime.substr(6, 2),
    +strTime.substr(8, 2),
    +strTime.substr(10, 2),
    +strTime.substr(12, 2),
  );
}

export const aa = 'aa';
