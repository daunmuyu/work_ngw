import Vue from 'vue';

// export const appKey = '4b8b29df56fda98eba58be7037ccf331';  //海能淘股key
export const appKey = '3b95e461fd9bbc17dc72e638d5a5fcf8';

export const getIMToken = () => {
  return Vue.ls.get('IM-TOKEN');
};

export const setIMToken = (token) => {
  return Vue.ls.set('IM-TOKEN', token);
};

export const removeIMToken = () => {
  return Vue.ls.remove('IM-TOKEN');
};

export const getCSToken = () => {
  return Vue.ls.get('CS-TOKEN');
};

export const setCSToken = (token) => {
  return Vue.ls.set('CS-TOKEN', token);
};

export const removeCSToken = () => {
  return Vue.ls.remove('CS-TOKEN');
};

export const getCSUserid = () => {
  return Vue.ls.get('CS-USERID');
};

export const getIMGcount = () => {
  return Vue.ls.get('IM-GCOUNT');
};

export const setCSUserid = (id) => {
  return Vue.ls.set('CS-USERID', id);
};

export const setIMGcount = (groupcount) => {
  return Vue.ls.set('IM-GCOUNT', groupcount);
};

export const removeIMGcount = () => {
  return Vue.ls.remove('IM-GCOUNT');
};

export const removeCSUserid = () => {
  return Vue.ls.remove('CS-USERID');
};

export const removeIMInfo = () => {
  removeCSUserid();
  removeCSToken();
  removeIMToken();
  removeIMGcount();
};

export const setIMInfo = (cstoken, csuserid, imtoken, groupcount) => {
  setCSToken(cstoken);
  setCSUserid(csuserid);
  setIMToken(imtoken);
  setIMGcount(groupcount);
};

export const vuelsChange = (callback) => {
  Vue.ls.on('IM-TOKEN', (val, oldVal) => {
    console.log(val, oldVal);
    // location.reload();
    callback(val, oldVal);
  });
};
