var path = require('path');
var glob = require('glob');

function getEntry(sourcePath, isBuild) {
  var entrys = {};
  var basename;
  sourcePath = sourcePath;
  glob.sync(sourcePath).forEach(function (entry) {
    if (!/\/_\/|\/plugins\/|\/custom_plugins\//g.test(entry)) {
      var basename = entry.replace('./src/pages/', '');
      basename = basename.substr(0, basename.lastIndexOf('.'));
      if (entry.indexOf('.js') > 1 && !isBuild) {
        entrys[basename] = [entry];
      } else {
        entrys[basename] = entry;
      }
    }
  });
  return entrys;
}
module.exports = getEntry;
