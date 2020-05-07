const webpack = require('webpack')
const config = require('./webpack.build.config');
const getEntry = require('./getEntry.js');
var argv = process.argv;

var pages;
var target = '';

function isEmptyObject(e) {
  var t;
  for (t in e)
    return !1;
  return !0
}

if (argv.length > 2 && argv[2]) {
  target = argv[2];
}
if (target && target.indexOf('/') > 1) {
  config.entry = getEntry('./src/pages/' + target + '/*.js', true);
  pages = getEntry('./src/pages/' + target + '/*.html');
} else if (target) {
  config.entry = getEntry('./src/pages/' + target + '/*.js', true);
  pages = getEntry('./src/pages/' + target + '/*.html');
} else{
  pages = getEntry('./src/pages/*/*.html');
}

console.log('page:', pages);

if (target && isEmptyObject(config.entry)) {
  console.log('没有获取到指定目录的文件！！！！');
  return;
}

console.log('[info] 启动编译....');

webpack(config, function (err, stats) {
  if (err) throw err
  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }) + '\n')

  console.log('[info] 编译完成！！')
})