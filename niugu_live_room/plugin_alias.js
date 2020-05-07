var path = require('path');
var containerPath = path.resolve('./');

var alias = {
  constants:  path.resolve(containerPath, './src/constants'),
  actions:  path.resolve(containerPath, './src/actions'),
  components:  path.resolve(containerPath, './src/components'),
  reducers:  path.resolve(containerPath, './src/reducers'),
  utils:  path.resolve(containerPath, './src/utils'),
  routers:  path.resolve(containerPath, './src/routers'),
  store:  path.resolve(containerPath, './src/store'),
  service: path.resolve(containerPath, './src/service'),
  nim: path.resolve(containerPath, './src/plugins/NIM/NIM_Web_Chatroom_v3.5.0.js'),
};

module.exports = alias;
