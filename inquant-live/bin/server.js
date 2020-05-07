const config = require('./webpack.dev.config.js');
const webpack = require('webpack');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');

const WebpackDevServer = require('webpack-dev-server');

const port = 8887;

for (key in config.entry) {
  config.entry[key] = ['webpack/hot/dev-server', `webpack-dev-server/client?https://localhost:${port}` , config.entry[key]];
}
// config.entry.unshift("webpack-dev-server/client?http://localhost:" + port + "/", 'webpack/hot/dev-server');
config.plugins.push(new OpenBrowserPlugin({
  url: `https://localhost:${port}`
}));

const compiler = webpack(config);
const server = new WebpackDevServer(compiler, {
  clientLogLevel: 'none', // 取消显示一些编译的消息
  hot: true,
  https: true,
  disableHostCheck: true,
  stats: {
    colors: true // 用颜色标识
  },
  contentBase: 'src'
});
server.listen(port, '', () => {
  console.log(new Date());
});
