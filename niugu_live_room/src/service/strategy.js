import { get, post} from '../utils/request.js';

const apiHost = 'https://live.niuguwang.com/chat/CallOrderAstock/';

export function add(args) {
  return post(`${apiHost}addCallOrder`, args);
}

export function getList(args) {
  return get(`${apiHost}getCallOrderList`, args);
}

export function del(args) {
  return get(`${apiHost}delCallOrder`, args);
}

export function set(args) {
  return get(`${apiHost}closedPosition`, args);
}

export function show(args) {
  return get(`${apiHost}isCanCallOrder`, args);
}
