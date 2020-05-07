var path = require('path');
var glob = require('glob');


function getEntry(sourcePath) {
  var entrys = {};
  var basename;
  sourcePath = sourcePath;
  glob.sync(sourcePath).forEach(function (entry) {
    if (!/\/_\/|\/plugins\/|\/custom_plugins\//g.test(entry)) {
      var basename = entry.replace('./src/', '');
      basename = basename.substr(0, basename.lastIndexOf('.'));
      // entrys[basename] = entry;
      if (entry.indexOf('.js') > 1) {
        entrys[basename] = [entry];
      } else {
        entrys[basename] = entry;
      }
    }
  });
  return entrys;
}

module.exports = getEntry;
