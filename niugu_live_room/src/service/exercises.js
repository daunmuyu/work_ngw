import { get } from '../utils/request.js';

const apiHost = 'https://live.niuguwang.com/chat/Exercise/';

// 是否显示习题册
export function show(args) {
  return get(`${apiHost}isCanExercise`, args);
}

// 删除习题册
export function del(args) {
  return get(`${apiHost}delExercise`, args);
}

// 获取习题册列表
export function getList(args) {
  return get(`${apiHost}getExerciseList`, args);
}

// 获取习题册分页
export function pages(args) {
  return get(`${apiHost}getExerciseListPaging`, args);
}

// 添加习题册
export function add(args) {
  return get(`${apiHost}addExercise`, args);
}
