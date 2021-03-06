// 返回传递给他的任意对象的类
const isClass = (o) => {
  if (o === null) return 'Null';
  if (o === undefined) return 'Undefined'
  return Object.prototype.toString.call(o).slice(8, -1);
}

export const deepClone = (obj) => {
  if (!obj) { return null }
  let result = isClass(obj);
  const oClass = isClass(obj);
  // 确定result的类型
  if (oClass === 'Object') {
    result = {};
  } else if (oClass === 'Array') {
    result = [];
  } else {
    return obj;
  }

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const copy = obj[key];
      if (isClass(copy) === 'Object') {
        result[key] = deepClone(copy); // 递归调用
      } else if (isClass(copy) === 'Array') {
        result[key] = deepClone(copy);
      } else {
        result[key] = obj[key];
      }
    }
  }
  return result;
}
