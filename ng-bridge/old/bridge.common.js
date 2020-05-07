module.exports = {
  /**
   * 初始化
   * 需要在每个页面初始化时调用
   */
  bridge: '',
  init() {
    if (window.WebViewJavascriptBridge) {
      this.initCallback(window.WebViewJavascriptBridge);
    } else {
      document.addEventListener('WebViewJavascriptBridgeReady', function () {
        this.initCallback(window.WebViewJavascriptBridge);
      }, false);
    }
  },
  initCallback(b) {
    ready = true;

    this.bridge = b;
    if (this.bridge.init) this.bridge.init(function (message, responseCallback) {});

    readyCallbacks.forEach(function (callback) {
      callback();
    });
  },

  /**
   * ready
   * bridge就位后开始执行
   */
  ready(callback) {
    if (ready) {
      return callback();
    } else {
      readyCallbacks.push(callback);
    }
  },

  /**
   * 获取usertoken
   */
  utoken(callback) {
    var usertoken = this.search('usertoken');
    if (usertoken) {
      if (callback) callback(usertoken);
    } else if (typeof android != 'undefined') {
      if (callback && android.getUserToken) callback(android.getUserToken());
    } else {
      this.ready(function () {
        var msg = JSON.stringify({
          method: 'getUserToken',
          methodtype: 'getUserToken'
        });

        if (this.bridge.send) {
          this.bridge.send(msg, function (responseData) {
            var utoken = '';

            if (responseData) {
              var json = JSON.parse(responseData);
              if (json) utoken = json.usertoken;
            }

            if (callback) callback(utoken);
          });
        }
      });
    }
  },
  /*
    获取version
  */
  getVersion(callback) {
    var version = this.search('version');
    if (version) {
      if (callback) callback(version);
    } else if (typeof android !== 'undefined') {
      if (callback && android.getVersion) callback(android.getVersion());
    } else {
      this.ready(function () {
        var msg = JSON.stringify({
          method: 'getVersion',
          methodtype: 'getVersion'
        });
        if (this.bridge.send) {
          this.bridge.send(msg, function (res) {
            if (res) {
              version = JSON.parse(res).version;
            }
            if (callback) callback(version);
          });
        }
      });
    }
  },
  /**
   * 获取gm相关token
   */
  // gmflowno = 1, //debug时，在浏览器访问时使用，如果在app中，是由app来提供
  getGMToken(callback) {
    var param = {};
    if (this.search('debug')) {
      if (callback) {
        this.utoken(function (token) {
          param = {
            niuguToken: token,
            tradeToken: '0GYXSTBL6JOOOOH63ASQ',
            flowno: 2
          };
          callback(param);
        });
      }
    } else if (typeof android != 'undefined') {
      if (callback && android.getGMToken) {
        var jsonstr = android.getGMToken();
        if (jsonstr) callback(JSON.parse(jsonstr));
      }
    } else {
      this.ready(function () {
        var msg = JSON.stringify({
          method: 'getGMToken',
          methodtype: 'getGMToken'
        });

        if (this.bridge.send) {
          this.bridge.send(msg, function (responseData) {
            if (callback) callback(responseData ? JSON.parse(responseData) : {});
          });
        }
      });
    }
  },

  /**
   * A股-某一券商开户页面
   */
  openStockAccount(bid, burl, bchannel, bpackage, bscheme) {
    if (typeof android != 'undefined') {
      if (android.toOpenOneAccount) android.toOpenOneAccount(bid, burl, bchannel, bpackage, bscheme);
    } else {
      this.ready(function () {
        var msg = JSON.stringify({
          method: 'openStockAccount',
          methodtype: 'openStockAccount',
          bid: bid
        });

        if (this.bridge.send) this.bridge.send(msg);
        if (this.bridge.sendMessage) this.bridge.sendMessage(msg);
      });
    }
  },

  /*
   * 打开A股券商开户介绍页
   * id  1=> 海通
   * id  2=> 恒泰
   * id  3=> 新时代
   * */
  toOpenStockAccountIntro(href, id) {
    if (typeof android != 'undefined') {
      location.href = href;
    } else {
      this.ready(function () {
        var msg = JSON.stringify({
          method: 'toOpenStockAccountIntro',
          methodtype: 'toOpenStockAccountIntro',
          id: id
        });

        if (this.bridge.send) this.bridge.send(msg);
        if (this.bridge.sendMessage) this.bridge.sendMessage(msg);
      });
    }
  },

  /**
   * 拨打电话
   */
  telPhone(tel) {
    if (tel) {
      if (typeof android != 'undefined') {
        if (android.telPhone) android.telPhone(tel);
      } else {
        location.href = 'tel:' + tel;
      }
    }
  },

  /**
   * 打开pdf
   */
  openPDF(filepath, filename) {
    if (filepath && filename) {
      if (typeof android != 'undefined') {
        if (android.openPDF) android.openPDF(filepath, filename);
      } else {
        location.href = filepath;
      }
    }
  },

  /**
   * 获取相机相册权限
   */
  getCameraPhoto(callback) {
    if (this.search('debug')) {
      callback({});
    } else if (typeof android != 'undefined') {
      //      android.getCameraPhoto();
      callback({});
    } else {
      this.ready(function () {
        var msg = JSON.stringify({
          method: 'getCameraPhoto',
          methodtype: 'getCameraPhoto'
        });

        if (this.bridge.send) {
          this.bridge.send(msg, function (responseData) {
            if (callback) callback(responseData ? JSON.parse(responseData) : '');
          });
        }
      });
    }
  },
  /**
   * 搜索key
   */
  search(key) {
    var res;
    var ss;
    var i;
    var sss;
    var s = location.search;
    if (s) {
      s = s.substr(1);
      if (s) {
        ss = s.split('&');
        for (i = 0; i < ss.length; i++) {
          sss = ss[i].split('=');
          if (sss && sss[0] === key) {
            res = sss[1];
          }
        }
      }
    }
    return res;
  },

  // 通知android上传图片完成
  uploadImgFinished() {
    if (typeof android != 'undefined') {
      if (android.uploadImgFinished) android.uploadImgFinished();
    }
  },

  // 获取手机相册地址
  selectCameraPhotoPaths(callback) {
    this.ready(function () {
      var msg = JSON.stringify({
        method: 'selectCameraPhotoPaths',
        methodtype: 'selectCameraPhotoPaths'
      });
      if (this.bridge.send) {
        this.bridge.send(msg, function (responseData) {
          if (callback) callback(responseData ? JSON.parse(responseData) : {});
        });
      }
    });
  },

  // 版本号比较
  compareVersion(local, cur) {
    if (local === cur) {
      return 0;
    }
    var local = local.split(".");
    var cur = cur.split(".");
    var len = Math.min(local.length, cur.length);
    for (var i = 0; i < len; i++) {
      if (parseInt(local[i]) > parseInt(cur[i])) {
        return 1;
      }
      if (parseInt(local[i]) < parseInt(cur[i])) {
        return -1;
      }
    }
    if (local.length > cur.length) {
      return 1;
    }
    if (local.length < cur.length) {
      return -1;
    }
    return 0;
  },

  /*
  封装统一函数方法

    参数方式{
      func: 函数名，
      and: [
        liveId, userId
      ],
      ios: {
        method: 函数名，
        methodtype: 函数名，
        liveId: '45655',
        userId: '78814'
      }
    }
  */
  toOpenAppPage(res) {
    var func = res.func;
    if (typeof android != 'undefined') {
      if (android[func]) android[func](res.and);
    } else {
      this.ready(function () {
        var msg = JSON.stringify(res.ios);
        if (this.bridge.send) this.bridge.send(msg);
        if (this.bridge.sendMessage) this.bridge.sendMessage(msg);
      });
    }

  },
};
