import axios from 'axios';
import qs from 'qs';

const BASEHOST = 'https://api.niuguwang.com/subscribe/';

const fetch = (options) => {
  const { method = 'get', data, url } = options;
  data.date = new Date().getTime();
  switch (method.toLowerCase()) {
    case 'get':
      return axios.get(url, {
        params: data,
      });
    case 'post':
      return axios.post(url, qs.stringify(data));
    case 'delete':
      return axios.delete(url, {
        data,
      });
    case 'put':
      return axios.put(url, data);
    case 'patch':
      return axios.patch(url, data);
    default:
      return axios(options);
  }
};

export default function request(options) {
  return fetch(options)
    .then((response) => {
      const data = response.data;
      return Promise.resolve(data);
    })
    .catch((error) => {
      return Promise.reject({ message: '网络错误！', ...error });
    });
}

module.exports = {
  // 风险提示
  getRiskText(arg) {
    return request({
      url: 'https://api.niuguwang.com/subscribe/Denver.ashx?action=isbuy',
      method: 'get',
      data: arg,
    });
  },
};
