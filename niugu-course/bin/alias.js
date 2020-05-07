/**
 * 插件别名配置
 */
var path = require('path');
var containerPath = path.resolve('./');

//	别名
var alias = {
  // 'vue': path.resolve(containerPath, './node_modules/vue/dist/vue.esm.js'),
  'vue': 'vue/dist/vue.esm.js',
  // 'vux-components': path.resolve(containerPath, './node_modules/vux/src/components'),
  'vux-components': 'vux/src/components',
  plugins: path.resolve(__dirname, '../src/plugins'),
  lib: path.resolve(__dirname, '../src/lib'),
  'ngBridge': path.resolve(containerPath, './node_modules/astockbridge/bridge/bridge.js'),
  'ngSearch': path.resolve(containerPath, './node_modules/astockbridge/util/search.js'),
  'ngAjax': path.resolve(containerPath, './node_modules/astockbridge/util/ajax.js'),
  'ngEvent': path.resolve(containerPath, './node_modules/astockbridge/util/event.js'),
  'ngShare': path.resolve(containerPath, './node_modules/astockbridge/share/index.js'),
};


module.exports = alias;
