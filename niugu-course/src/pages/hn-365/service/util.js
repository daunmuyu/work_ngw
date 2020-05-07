// 节流函数
export const delay = (() => {
  let timer = 0;
  return (callback, ms) => {
    clearTimeout(timer);
    timer = setTimeout(callback, ms);
  };
})();

// 获取地址栏参数
export const qsearch = (name) => {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`);
  const r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return '';
};

export const nameReg = /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/;// 验证姓名正则;

// 身份证验证
export const idCardReg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;

// 手机号码验证
export const telReg = /^1[3456789]\d{9}$/;

// 验证码验证
export const smsCode = /^\d{4,6}/;
