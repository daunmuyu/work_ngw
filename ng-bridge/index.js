
import bridge from './lib/index';
import {
  // bridge, // 总bridge方法
  Bridges, // 重新封装 总方法
  NGWbg, // 二次封装总方法
  NGWBridge, // 全部模块
  bridgeInit, // 初始化 需要在每个页面初始化时调用
} from './lib/index';

console.log(12, bridge);
console.log(Bridges);
console.log(NGWbg);
console.log(NGWBridge);
console.log(bridgeInit);

