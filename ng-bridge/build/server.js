var config = require("./webpack.config.js");
var webpack = require('webpack');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');

var WebpackDevServer = require('webpack-dev-server');

const port = 5000;

for(key in config.entry) {
  config.entry[key] = ['webpack/hot/dev-server', 'webpack-dev-server/client?http://localhost:' + port , config.entry[key]];
}
// config.entry.unshift("webpack-dev-server/client?http://localhost:" + port + "/", 'webpack/hot/dev-server');
config.plugins.push(new OpenBrowserPlugin({
  url: 'http://localhost:' + port
}));

var compiler = webpack(config);
var server = new WebpackDevServer(compiler, {
  hot: true,
  disableHostCheck: true,
  stats: {
    colors: true // 用颜色标识
  },
  contentBase: 'src'
});
server.listen(port);
