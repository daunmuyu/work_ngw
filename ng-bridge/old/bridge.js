'use strict';
// var qiaong = (typeof require !== 'undefined') ? require('./ng.js') : window.ng;
var ready = false;
var readyCallbacks = [];
var bridge;
var NGWBridge = {};

/**
 * 初始化
 * 需要在每个页面初始化时调用
 */
NGWBridge.init = function () {
  if (window.WebViewJavascriptBridge) {
    NGWBridge.initCallback(window.WebViewJavascriptBridge);
  } else {
    document.addEventListener('WebViewJavascriptBridgeReady', function () {
      NGWBridge.initCallback(window.WebViewJavascriptBridge);
    }, false);
  }
};
NGWBridge.initCallback = function (b) {
  ready = true;

  bridge = b;
  if (bridge.init) bridge.init(function (message, responseCallback) { });

  readyCallbacks.forEach(function (callback) {
    callback();
  });
};

/**
 * ready
 * bridge就位后开始执行
 */
NGWBridge.ready = function (callback) {
  if (ready) {
    return callback();
  } else {
    readyCallbacks.push(callback);
  }
};

/**
 * 获取usertoken
 */
NGWBridge.utoken = function (callback) {
  var usertoken = NGWBridge.search('usertoken');
  if (usertoken) {
    if (callback) callback(usertoken);
  } else if (typeof android != 'undefined') {
    if (callback && android.getUserToken) callback(android.getUserToken());
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'getUserToken',
        methodtype: 'getUserToken'
      });

      if (bridge.send) {
        bridge.send(msg, function (responseData) {
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
};
/*
  获取version
*/
NGWBridge.getVersion = function (callback) {
  var version = NGWBridge.search('version');
  if (version) {
    if (callback) callback(version);
  } else if (typeof android !== 'undefined') {
    if (callback && android.getVersion) callback(android.getVersion());
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'getVersion',
        methodtype: 'getVersion'
      });
      if (bridge.send) {
        bridge.send(msg, function (res) {
          if (res) {
            version = JSON.parse(res).version;
          }
          if (callback) callback(version);
        });
      }
    });
  }
};
/**
 * 获取gm相关token
 */
NGWBridge.gmflowno = 1; //debug时，在浏览器访问时使用，如果在app中，是由app来提供
NGWBridge.getGMToken = function (callback) {
  var param = {};
  if (NGWBridge.search('debug')) {
    if (callback) {
      NGWBridge.utoken(function (token) {
        param = {
          niuguToken: token,
          tradeToken: '0GYXSTBL6JOOOOH63ASQ',
          flowno: NGWBridge.gmflowno++
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
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'getGMToken',
        methodtype: 'getGMToken'
      });

      if (bridge.send) {
        bridge.send(msg, function (responseData) {
          if (callback) callback(responseData ? JSON.parse(responseData) : {});
        });
      }
    });
  }
};

/**
 * 返回页面的时候是否刷新当前页面
 * type=1，刷新
 * type=0，不刷新
 */
NGWBridge.initRefresh = function (type) {
  if (typeof android != 'undefined') {
    if (android.initRefresh) android.initRefresh(type);
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'initRefresh',
        methodtype: 'initRefresh',
        type: type
      });

      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};

/**
 * 关闭当前页面
 */
NGWBridge.closePage = function () {
  if (typeof android != 'undefined') {
    if (android.closePage) android.closePage();
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'closePage',
        methodtype: 'closePage'
      });

      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};

/*
 * 增加关闭按钮
 * */
NGWBridge.initClose = function (type) {
  if (typeof android != 'undefined') {
    if (android.initClose) android.initClose(type);
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'initClose',
        methodtype: 'initClose',
        type: type
      });
      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};

/**
 * 跳转到登录页面
 */
NGWBridge.login = function () {
  if (typeof android != 'undefined') {
    if (android.login) android.login();
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'login',
        methodtype: 'login'
      });

      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};

/**
 * 跳转到港美股账户页
 */
NGWBridge.toGMDetail = function (fundaccount) {
  if (typeof android != 'undefined') {
    if (android.toGMDetail) android.toGMDetail(fundaccount);
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'toGMDetail',
        methodtype: 'toGMDetail',
        fundaccount: fundaccount
      });

      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};

/**
 * 输入交易密码
 */
NGWBridge.toGMTradepwd = function () {
  if (typeof android != 'undefined') {
    if (android.toGMTradepwd) android.toGMTradepwd();
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'toGMTradepwd',
        methodtype: 'toGMTradepwd'
      });

      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};

/**
 * 常用-绑定手机页面
 */
NGWBridge.bindMobile = function () {
  if (typeof android != 'undefined') {
    if (android.bindMobile) android.bindMobile();
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'bindMobile',
        methodtype: 'bindMobile'
      });

      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};
/**
 * 手机号，验证码登录
 */
NGWBridge.mobileLogin = function (number, code, name, type, sex) {
  if (typeof android !== 'undefined') {
    if (android.mobileLogin) android.mobileLogin(number, code, name, type, sex);
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'mobileLogin',
        methodtype: 'mobileLogin',
        number: number,
        code: code,
        name: name,
        type: type,
        sex: sex,
      });
      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};
/**
* 只有安卓
* type:101多空，102选股
 * 手机号，验证码登录
 */
NGWBridge.autoMobileLogin = function (type, number, code) {
  if (typeof android !== 'undefined') {
    if (android.autoMobileLogin) android.autoMobileLogin(type, number, code);
  }
};

/**
 * goReceive
 * 领取跳转
 */
NGWBridge.goReceive = function () {
  if (typeof android !== 'undefined') {
    if (android.goReceive) android.goReceive();
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'goReceive',
        methodtype: 'goReceive',
      });

      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
}

/**
 * A股-模拟组合页面
 */
NGWBridge.toVirtualAccount = function (accountId, userId) {
  if (typeof android != 'undefined') {
    if (android.toVirtualAccount) android.toVirtualAccount(accountId, userId);
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'toVirtualAccount',
        methodtype: 'toVirtualAccount',
        accountId: accountId,
        userId: userId
      });

      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};


/**
 *  跳转A股模拟买入
 * @param stockMarket
 * @param innerCode
 * @param stockCode
 * @param stockName
 * @param buySellType 0：买入 1：卖出
 */
NGWBridge.toVirtualABuy = function (stockMarket, innerCode, stockCode, stockName, buySellType) {
  if (typeof android != 'undefined') {
    if (android.toVirtualABuy) android.toVirtualABuy(stockMarket, innerCode, stockCode, stockName, buySellType);
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'toVirtualABuy',
        methodtype: 'toVirtualABuy',
        stockMarket: stockMarket,
        innerCode: innerCode,
        stockCode: stockCode,
        stockName: stockName,
        buySellType: buySellType
      });

      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};



/*
 * 跳转基金实盘买入
 * @param innerCode
 * @param fundCode
 * @param fundName
 * @param market
 * */

NGWBridge.toFundPurchase = function (innerCode, fundCode, fundName, market) {
  if (typeof android != 'undefined') {
    if (android.toFundPurchase) android.toFundPurchase(innerCode, fundCode, fundName, market);
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'toFundPurchase',
        methodtype: 'toFundPurchase',
        innerCode: innerCode,
        fundCode: fundCode,
        fundName: fundName,
        market: market
      });

      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};


/*
 * 红包跳转页面
 * */


NGWBridge.toPacketList = function () {
  if (typeof android != 'undefined') {
    if (android.toPacketList) android.toPacketList();
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'toPacketList',
        methodtype: 'toPacketList'
      });

      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};

/**
 * A股-开户券商列表
 */
NGWBridge.toOpenAccount = function () {
  if (typeof android != 'undefined') {
    if (android.toOpenAccount) android.toOpenAccount();
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'toOpenAccount',
        methodtype: 'toOpenAccount'
      });

      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};

/**
 * A股-某一券商开户页面
 */
NGWBridge.openStockAccount = function (bid, burl, bchannel, bpackage, bscheme) {
  if (typeof android != 'undefined') {
    if (android.toOpenOneAccount) android.toOpenOneAccount(bid, burl, bchannel, bpackage, bscheme);
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'openStockAccount',
        methodtype: 'openStockAccount',
        bid: bid
      });

      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};

/*
 * 打开A股券商开户介绍页
 * id  1=> 海通
 * id  2=> 恒泰
 * id  3=> 新时代
 * */
NGWBridge.toOpenStockAccountIntro = function (href, id) {
  if (typeof android != 'undefined') {
    location.href = href;
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'toOpenStockAccountIntro',
        methodtype: 'toOpenStockAccountIntro',
        id: id
      });

      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};


/**
 * 港美股-模拟交易页面
 */
NGWBridge.toVirtualForeignAccount = function (accountId) {
  if (typeof android != 'undefined') {
    if (android.toVirtualForeignAccount) android.toVirtualForeignAccount(accountId);
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'toVirtualForeignAccount',
        methodtype: 'toVirtualForeignAccount',
        accountId: accountId
      });

      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};

/**
 * 港美股-开户方法
 * 调用，无返回
 */
NGWBridge.startToKaihu = function () {
  if (typeof android != 'undefined') {
    if (android.startToKaihu) android.startToKaihu();
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'startToKaihu',
        methodtype: 'startToKaihu'
      });

      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};

/**
 * 港美股-判断是否在交易页面
 * 调用，返回
 */
NGWBridge.loadKaihuInTrade = function (callback) {
  if (typeof android != 'undefined') {
    if (callback && android.loadKaihuInTrade) callback({
      status: android.loadKaihuInTrade()
    });
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'loadKaihuInTrade',
        methodtype: 'loadKaihuInTrade'
      });

      if (bridge.send) {
        bridge.send(msg, function (responseData) {
          if (callback) callback(responseData ? JSON.parse(responseData) : {});
        });
      }
    });
  }
};

/**
 * 港美股-跳转到港美股开户页
 * 仅为 ios 使用
 *
 */
NGWBridge.toOpenForeignAccount = function (close) {
  var CLOSE = close || ''
  NGWBridge.ready(function () {
    var msg = JSON.stringify({
      method: 'toOpenForeignAccount',
      methodtype: 'toOpenForeignAccount',
      close: CLOSE,
    });
    if (bridge.send) bridge.send(msg);
    if (bridge.sendMessage) bridge.sendMessage(msg);
  });
};

/**
 * 港美股-在交易页面开户
 * 调用，无返回
 */
NGWBridge.startKaihuInTrade = function (s) {
  var step = s ? s : 1;
  // var url = 'http://openaccount.huanyingzq.com/embed/views/gmAccountOpen/' + qiaong.url['step' + (step + 1)];
  var url = '';
  if (typeof android != 'undefined') {
    if (android.startKaihuInTrade) android.startKaihuInTrade(url);
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'startKaihuInTrade',
        methodtype: 'startKaihuInTrade',
        url: url
      });

      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};

/**
 * 基金-开户认证页面
 * type 1时 为新手专区开户（成功后不需要进入资产页）
 * type 为其他（成功后需要进入资产页）
 */
NGWBridge.toOpenFundAccount = function (type) {
  if (typeof android != 'undefined') {
    if (android.toOpenFundAccount) android.toOpenFundAccount(type);
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'toOpenFundAccount',
        methodtype: 'toOpenFundAccount',
        type: type
      });

      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};
/**
 * 基金-开户认证页面 新手专区 带有文本提示
 */
NGWBridge.toTipOpenFundAccount = function () {
  if (typeof android != 'undefined') {
    if (android.toOpenFundAccount) android.toOpenFundAccount();
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'toTipOpenFundAccount',
        methodtype: 'toTipOpenFundAccount'
      });

      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};

/**
 * 跳转基金账户页
 */
NGWBridge.toFundAccount = function () {
  if (typeof android != 'undefined') {
    if (android.toFundAccount) android.toFundAccount();
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'toFundAccount',
        methodtype: 'toFundAccount'
      });

      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};


/**
 * 跳转基金资产页(未开户的也可以看资产页)
 */
NGWBridge.toFundAsset = function () {
  if (typeof android != 'undefined') {
    if (android.toFundAsset) android.toFundAsset();
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'toFundAsset',
        methodtype: 'toFundAsset'
      });

      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};



/**
 * 跳转基金模拟组合下单页
 */
NGWBridge.toVirtualFundGroupPurchase = function (groupId) {
  if (typeof android != 'undefined') {
    if (android.toVirtualFundGroupPurchase) android.toVirtualFundGroupPurchase(groupId);
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'toVirtualFundGroupPurchase',
        methodtype: 'toVirtualFundGroupPurchase',
        groupId: groupId
      });

      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};


/**
 * 跳转基金落地页/首页
 */
NGWBridge.toFundLanding = function () {
  if (typeof android != 'undefined') {
    if (android.toFundLanding) android.toFundLanding();
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'toFundLanding',
        methodtype: 'toFundLanding'
      });

      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};

/**
 *
 * 跳转基金模拟组合页
 */
NGWBridge.toVirtualFundGroupDetails = function (accountId, userId, isAuthFundUser, fid) {
  if (typeof android != 'undefined') {
    if (android.toVirtualFundGroupDetails) android.toVirtualFundGroupDetails(accountId, userId, isAuthFundUser, fid);
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'toVirtualFundGroupDetails',
        methodtype: 'toVirtualFundGroupDetails',
        accountId: accountId,
        userId: userId,
        isAuthFundUser: isAuthFundUser,
        fid: fid
      });

      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};



/**
 * 跳转基金现金宝(现金宝账户页/未开户的去开户)
 */
NGWBridge.toFundXianJinBao = function () {
  if (typeof android != 'undefined') {
    if (android.toFundXianJinBao) android.toFundXianJinBao();
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'toFundXianJinBao',
        methodtype: 'toFundXianJinBao'
      });

      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};


/**
 * 基金-模拟交易页面
 */
NGWBridge.toVirtualFundAccount = function (accountId) {
  if (typeof android != 'undefined') {
    if (android.toVirtualFundAccount) android.toVirtualFundAccount(accountId);
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'toVirtualFundAccount',
        methodtype: 'toVirtualFundAccount',
        accountId: accountId
      });

      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};

/**
 * 拨打电话
 */
NGWBridge.telPhone = function (tel) {
  if (tel) {
    if (typeof android != 'undefined') {
      if (android.telPhone) android.telPhone(tel);
    } else {
      location.href = 'tel:' + tel;
    }
  }
};

/**
 * 打开pdf
 */
NGWBridge.openPDF = function (filepath, filename) {
  if (filepath && filename) {
    if (typeof android != 'undefined') {
      if (android.openPDF) android.openPDF(filepath, filename);
    } else {
      location.href = filepath;
    }
  }
};

/**
 * 获取相机相册权限
 */
NGWBridge.getCameraPhoto = function (callback) {
  if (NGWBridge.search('debug')) {
    callback({});
  } else if (typeof android != 'undefined') {
    //      android.getCameraPhoto();
    callback({});
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'getCameraPhoto',
        methodtype: 'getCameraPhoto'
      });

      if (bridge.send) {
        bridge.send(msg, function (responseData) {
          if (callback) callback(responseData ? JSON.parse(responseData) : '');
        });
      }
    });
  }
};

/**
 * 设置标题
 */
NGWBridge.setTitle = function (title) {
  if (title) {
    if (typeof android != 'undefined') {
      if (android.setWebTitle) android.setWebTitle(title);
    } else {
      NGWBridge.ready(function () {
        var msg = JSON.stringify({
          method: 'settitle',
          methodtype: 'settitle',
          title: title
        });

        if (bridge.send) bridge.send(msg);
        if (bridge.sendMessage) bridge.sendMessage(msg);
      });
    }
  }
};

/**
 * 初始化分享
 * title，分享标题
 * content，分享描述
 * url，分享地址
 * type，
 */
NGWBridge.initShare = function (title, content, url, type) {
  if (typeof android != 'undefined') {
    if (android.initShare) android.initShare(title, content, url, type);
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'initShare',
        methodtype: 'initShare',
        shareTitle: title,
        shareContent: content,
        shareUrl: url,
        type: type
      });

      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};

// 是否需要返回按钮
NGWBridge.needBack = function (type) {
  if (typeof android != 'undefined') {
    if (android.needBack) android.needBack(type);
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'needBack',
        methodtype: 'needBack',
        type: type,
      });

      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};


//跳转APP牛人页
NGWBridge.goGenius = function (uid, uname) {
  if (typeof android != 'undefined') {
    if (android.goGenius) android.goGenius(uid, uname);
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'goGenius',
        methodtype: 'goGenius',
        userId: uid,
        userName: uname
      });
      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};

//跳转牛股王APP帖子页
NGWBridge.goTopic = function (mainid) {
  if (typeof android != 'undefined') {
    if (android.goTopic) android.goTopic(mainid);
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'goTopic',
        methodtype: 'goTopic',
        mainId: mainid
      });
      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};

//跳转牛股王APP行情页
NGWBridge.toQuote = function (innerCode, stockCode, stockName, stockMarket) {
  if (typeof android != 'undefined') {
    if (android.toQuote) android.toQuote(innerCode, stockCode, stockName, stockMarket);
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'toQuote',
        innerCode: innerCode,
        stockCode: stockCode,
        stockName: stockName,
        stockMarket: stockMarket
      });
      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};
//跳转到红包排行列表
NGWBridge.toPacketMatchList = function (cseID, type) {
  if (typeof android != 'undefined') {
    if (android.toPacketMatchList) android.toPacketMatchList(cseID, type);
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'toPacketMatchList',
        cseID: cseID,
        type: type
      });
      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};
//跳转新发基金详情页
NGWBridge.toFundDebutDetail = function (innerCode, stockCode, stockName, stockMarket) {
  if (typeof android != 'undefined') {
    if (android.toFundDebutDetail) android.toFundDebutDetail(innerCode, stockCode, stockName, stockMarket);
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'toFundDebutDetail',
        innerCode: innerCode,
        stockCode: stockCode,
        stockName: stockName,
        stockMarket: stockMarket
      });
      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};

//  比赛列表
NGWBridge.goAllMatch = function () {
  if (typeof android != 'undefined') {
    if (android.goAllMatch) android.goAllMatch();
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'goAllMatch',
        methodtype: 'goAllMatch'
      });

      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};

/**
 * 搜索key
 */
NGWBridge.search = function (key) {
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
};
// 判断是不是微信浏览器
NGWBridge.isWeixinBrowser = function () {
  var agent = navigator.userAgent.toLowerCase();
  if (agent.match(/MicroMessenger/i) == 'micromessenger') {
    return true;
  }
  return false;
};
// 判断是不是android端
NGWBridge.isAndroid = function () {
  var u = navigator.userAgent;
  if (u.indexOf('Android') > -1 || u.indexOf('Adr') > -1) {
    return true;
  }
  return false;
};
// 判断是不是iOS端
NGWBridge.isIOS = function () {
  return !NGWBridge.isAndroid();
};
// 判断是不是PC端
NGWBridge.isPC = function () {
  var userAgentInfo = navigator.userAgent.toLowerCase();
  var Agents = ["android", "iphone", "symbianos", "windows phone", "ipad", "ipod"];
  for (var v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) >= 0) {
      return false;
    }
    return true;
  }
};
//  跳转牛人排行
NGWBridge.goGeniusRanking = function (type, rankingText) {
  if (typeof android != 'undefined') {
    if (android.goGeniusRanking) android.goGeniusRanking(type, rankingText);
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'goGeniusRanking',
        methodtype: 'goGeniusRanking',
        type: type,
        rankingText: rankingText
      });
      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};
// 跳转邀请他人
NGWBridge.goInviteFriend = function (title, url) {
  if (typeof android != 'undefined') {
    if (android.goInviteFriend) {
      android.goInviteFriend(title, url);
    }
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'goInviteFriend',
        methodtype: 'goInviteFriend',
        inviteTitle: title,
        inviteUrl: url
      });
      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};
// 跳转发表帖子
NGWBridge.sendTopic = function () {
  if (typeof android != 'undefined') {
    if (android.sendTopic) android.sendTopic();
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'sendTopic',
        methodtype: 'sendTopic'
      });
      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};
// 订阅指定用户
NGWBridge.subscribeGenius = function (userId) {
  if (typeof android != 'undefined') {
    if (android.subscribeGenius) android.subscribeGenius(userId);
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'subscribeGenius',
        methodtype: 'subscribeGenius',
        userId: userId
      });
      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};
// 通知android上传图片完成
NGWBridge.uploadImgFinished = function () {
  if (typeof android != 'undefined') {
    if (android.uploadImgFinished) android.uploadImgFinished();
  }
};
// 分享
NGWBridge.shareUrl = function (shareTitle, shareContent, shareUrl) {
  if (typeof android != 'undefined') {
    if (android.shareUrl) android.shareUrl(shareTitle, shareContent, shareUrl)
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'shareUrl',
        methodtype: 'shareUrl',
        shareTitle: shareTitle,
        shareUrl: shareUrl,
        shareContent: shareContent
      });
      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    })
  }
};
// 分享图片
NGWBridge.shareImage = function (shareTitle, shareContent, shareImage, type) {
  if (typeof android != 'undefined') {
    if (type === 0) {
      // shareImage: base64流
      if (android.shareImageByStream) android.shareImageByStream(shareTitle, shareContent, shareImage);
    } else {
      // shareImage: url
      if (android.shareImage) android.shareImage(shareTitle, shareContent, shareImage);
    }
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'shareImage',
        methodtype: 'shareImage',
        shareTitle: shareTitle,
        shareContent: shareContent,
        shareImage: shareImage
      });
      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    })
  }
};
/*
  * 周报显示‘炫耀一下’按钮
  */
NGWBridge.showShareTag = function (title, shareContent, stream) {
  if (typeof android != "undefined") {
    if (android.showShareTag)
      android.showShareTag(title, shareContent, stream);
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: "showShareTag",
        methodtype: "showShareTag",
        title: title,
        shareContent: shareContent,
        stream: stream,
      });
      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};
/*
  * 开启自选周报
  */
NGWBridge.startMyStockReport = function () {
  if (typeof android != "undefined") {
    if (android.startMyStockReport)
      android.startMyStockReport();
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: "startMyStockReport",
        methodtype: "startMyStockReport",
      });
      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};
// 获取手机相册地址
NGWBridge.selectCameraPhotoPaths = function (callback) {
  NGWBridge.ready(function () {
    var msg = JSON.stringify({
      method: 'selectCameraPhotoPaths',
      methodtype: 'selectCameraPhotoPaths'
    });
    if (bridge.send) {
      bridge.send(msg, function (responseData) {
        if (callback) callback(responseData ? JSON.parse(responseData) : {});
      });
    }
  });
};
// 跳转A股实盘券商列表页面
NGWBridge.toStockSecuritiesList = function () {
  if (typeof android != 'undefined') {
    if (android.toStockSecuritiesList) android.toStockSecuritiesList();
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'toStockSecuritiesList',
        methodtype: 'toStockSecuritiesList'
      });
      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    })
  }
};
// 跳转A股实盘券商登录页面
NGWBridge.toStockSecuritiesLogin = function (bid, url) {
  if (typeof android != 'undefined') {
    if (android.toStockSecuritiesLogin) android.toStockSecuritiesLogin(bid, url);
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'toStockSecuritiesLogin',
        methodtype: 'toStockSecuritiesLogin',
        bid: bid
      });
      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    })
  }
};
NGWBridge.startInviteFriend = function (title, content, url) {
  if (typeof android != 'undefined') {
    if (android.startInviteFriend) android.startInviteFriend(title, content, url);
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'startInviteFriend',
        methodtype: 'startInviteFriend',
        shareTitle: title,
        shareContent: content,
        shareUrl: url
      });
      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    })
  }
};
// 版本号比较
NGWBridge.compareVersion = function (local, cur) {
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
};

/**
 * 打开课程详情
 * courseID: 课程编号
 * callback 可以为空
 */
NGWBridge.openCourseDetail = function (courseID, callback) {
  if (typeof android != 'undefined') {
    if (android.toCourseDetail) android.toCourseDetail(courseID);
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'toCourseDetail',
        methodtype: 'toCourseDetail',
        courseID: courseID
      });

      var sendCallback = function (res) {
        if (typeof res === 'string') {
          res = JSON.parse(res);
        }
        callback && callback(res);
      };
      if (bridge.send) bridge.send(msg, sendCallback);
      if (bridge.sendMessage) bridge.sendMessage(msg, sendCallback);
    });
  }
};

/**
 * 跳转投资列表
 */
NGWBridge.goNoteRankList = function () {
  if (typeof android != 'undefined') {
    if (android.goNoteRankList) android.goNoteRankList();
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'goNoteRankList',
        methodtype: 'goNoteRankList'
      });
      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};

/**
 * 跳转投资列表
 * noteId
 */
NGWBridge.goNoteDetail = function (id) {
  if (typeof android != 'undefined') {
    if (android.goNoteDetail) android.goNoteDetail(id);
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'goNoteDetail',
        methodtype: 'goNoteDetail',
        id: id
      });
      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};

/**
 * 跳转基金智能组合列表页
 *
 */
NGWBridge.toFundSmartGroup = function () {
  if (typeof android != 'undefined') {
    if (android.toFundSmartGroup) android.toFundSmartGroup();
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'toFundSmartGroup',
        methodtype: 'toFundSmartGroup'
      });
      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};

/**
 * 跳转基金排行列表页
 *
 */
NGWBridge.toFundRevenueRanking = function (type) {
  if (typeof android != 'undefined') {
    if (android.toFundRevenueRanking) android.toFundRevenueRanking(type);
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'toFundRevenueRanking',
        methodtype: 'toFundRevenueRanking',
        type: type
      });
      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};

/**
 * 跳转基金主题详情页面
 *
 */
NGWBridge.toFundTopicDetails = function (topicId) {
  if (typeof android != 'undefined') {
    if (android.toFundTopicDetails) android.toFundTopicDetails(topicId);
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'toFundTopicDetails',
        methodtype: 'toFundTopicDetails',
        topicId: topicId
      });
      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};

/**
 * 显示 跳转按钮
 *
 */
NGWBridge.skipTest = function (type) {
  if (typeof android != 'undefined') {
    if (android.skipTest) android.skipTest(type);
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'skipTest',
        methodtype: 'skipTest',
        type: type
      });
      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};

/**
 * 跳转港美股模拟交易个人页
 *
 */
NGWBridge.toMyVirtualForeignAccount = function (virtualId) {
  if (typeof android != 'undefined') {
    if (android.toMyVirtualForeignAccount) android.toMyVirtualForeignAccount(virtualId);
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'toMyVirtualForeignAccount',
        methodtype: 'toMyVirtualForeignAccount'
      });
      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};

/**
 * 增加 ios 他们自己的刷新
 *
 */
NGWBridge.isRiskTest = function () {
  if (typeof android != 'undefined') {
    if (android.isRiskTest) android.isRiskTest();
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'isRiskTest',
        methodtype: 'isRiskTest'
      });
      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};

/**
 * 跳转基金模拟交易个人页
 *
 */
NGWBridge.toMyVirtualFundAccount = function (a, b, c) {
  if (typeof android != 'undefined') {
    if (android.toMyVirtualFundAccount) android.toMyVirtualFundAccount(a, b, c);
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'toMyVirtualFundAccount',
        methodtype: 'toMyVirtualFundAccount'
      });
      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};

/**
 * 跳转视屏直播间
 *
 */
NGWBridge.toOpenScreenLive = function (videoId, roomId, bloggerId, type) {
  if (typeof android != 'undefined') {
    if (android.toOpenScreenLive) android.toOpenScreenLive(videoId, roomId, bloggerId, type);
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'toOpenScreenLive',
        methodtype: 'toOpenScreenLive',
        videoId: videoId,
        roomId: roomId,
        bloggerId: bloggerId,
        type: type
      });
      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};

/**
 * 跳转模拟比赛详情页面（也就是参加比赛页面）
 */
NGWBridge.goMatchDetail = function (matchId) {
  if (typeof android != 'undefined') {
    if (android.goMatchDetail) android.goMatchDetail(matchId);
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'goMatchDetail',
        methodtype: 'goMatchDetail',
        matchId: matchId
      });
      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};

/**
 * 跳转到直播推荐列表
 */
NGWBridge.goLiveHotList = function () {
  if (typeof android != 'undefined') {
    if (android.goLiveHotList) android.goLiveHotList();
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'goLiveHotList',
        methodtype: 'goLiveHotList'
      });
      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};

/**
 * 跳转到原生图文直播
 * ios:3.4.0
 * android:3.6.3
 */
NGWBridge.toOpenNativeLive = function (liveId, userId) {
  if (typeof android != 'undefined') {
    if (android.toOpenNativeLive) android.toOpenNativeLive(liveId, userId);
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'toOpenNativeLive',
        methodtype: 'toOpenNativeLive',
        liveId: liveId,
        userId: userId
      });
      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};

/**
 * 跳转到原生玩转港美股
 * ios:3.4.0
 * android:3.6.3
 */
NGWBridge.toPlayHKUSStock = function () {
  if (typeof android != 'undefined') {
    if (android.toPlayHKUSStock) android.toPlayHKUSStock();
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'toPlayHKUSStock',
        methodtype: 'toPlayHKUSStock'
      });
      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};

/**
 * 唤起原生课程支付
 * ios:3.4.5
 * android:3.6.4
 */
NGWBridge.toCoursePayment = function (classId, tel) {
  if (typeof android != 'undefined') {
    if (android.toCoursePayment) android.toCoursePayment(classId, tel);
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'toCoursePayment',
        methodtype: 'toCoursePayment',
        classId: classId,
        tel: tel
      });
      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};

/**
 * 跳转私信对话页面
 * ios:3.7.0
 * android:3.7.1
 */
NGWBridge.goForDialogue = function (userid, title) {
  if (typeof android != 'undefined') {
    if (android.goForDialogue) android.goForDialogue(userid, title);
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'goForDialogue',
        methodtype: 'goForDialogue',
        userid: userid,
        title: title
      });
      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};

/**
 * 跳转原生策略金榜购后页面
 * ios:3.7.0
 * android:3.8.4
 */
NGWBridge.toStrategyRankPaySuccess = function () {
  if (typeof android != 'undefined') {
    if (android.toStrategyRankPaySuccess) android.toStrategyRankPaySuccess();
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'toStrategyRankPaySuccess',
        methodtype: 'toStrategyRankPaySuccess',
      });
      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};

/**
* 跳转原生策略金榜购后页面
* ios:4.3.5
* android:3.8.5
*/
NGWBridge.isStrategyRankCourse = function () {
  if (typeof android != 'undefined') {
    if (android.isStrategyRankCourse) android.isStrategyRankCourse();
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'isStrategyRankCourse',
        methodtype: 'isStrategyRankCourse',
      });
      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};

/**
 * 获取DK短线宝点击搜索的弹框
 */
NGWBridge.getDKSearchPopup = function () {
  if (typeof android != "undefined") {
    if (android.getDKSearchPopup) android.getDKSearchPopup();
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: "getDKSearchPopup",
        methodtype: "getDKSearchPopup",
      });
      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};
/**
 * 跳转短线宝购后页
 */
NGWBridge.goQuantDK = function () {
  if (typeof android != "undefined") {
    if (android.goQuantDK) android.goQuantDK();
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: "goQuantDK",
        methodtype: "goQuantDK",
      });
      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};

/**
 * 跳转私信对话页面
 * ios:3.7.0
 * android:3.7.1
 */
NGWBridge.toClinicShares = function (stock, user) {
  var stockSymbol = stock.stockSymbol || "";
  var userid = user.userId || "";
  var userName = user.userName || "";
  if (typeof android != "undefined") {
    if (android.toClinicShares)
      android.toClinicShares(stockSymbol, userid, userName);
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: "toClinicShares",
        methodtype: "toClinicShares",
        stock: stock,
        user: user
      });
      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};

/*
全屏view h5调用
*/

NGWBridge.toFullScreen = function (url) {
  if (typeof android != "undefined") {
    if (android.toFullScreen) android.toFullScreen(url);
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: "toFullScreen",
        methodtype: "toFullScreen",
        url: url
      });

      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};

NGWBridge.toChip = function (innerCode) {
  if (typeof android != "undefined") {
    if (android.toChip)
      android.toChip(innerCode);
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: "toChip",
        methodtype: "toChip",
        innerCode: innerCode
      });
      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};
NGWBridge.onQuShiWenYingLogin = function () {
  if (typeof android != "undefined") {
    if (android.onQuShiWenYingLogin)
      android.onQuShiWenYingLogin();
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: "onQuShiWenYingLogin",
        methodtype: "onQuShiWenYingLogin"
      });
      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};

/*
  独立分享
  */
NGWBridge.share = function (shareTitle, shareContent, shareUrl, type) {
  if (typeof android != "undefined") {
    if (android.share)
      android.share(shareTitle, shareContent, shareUrl, type);
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: "share",
        methodtype: "share",
        shareTitle: shareTitle,
        shareContent: shareContent,
        shareUrl: shareUrl,
        type: type
      });
      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};
/**
 * 调用原生支持h5滑动
 */
NGWBridge.getH5ViewPagerInfo = function (offsetLeft, offsetTop, width, height) {
  if (typeof android != 'undefined') {
    if (android.getH5ViewPagerInfo) android.getH5ViewPagerInfo(offsetLeft, offsetTop, width, height);
  }
};
/*
  **跳转股票牛热门话题详情页
*/
NGWBridge.toHotTopicDetails = function (topicId) {
  if (typeof android != 'undefined') {
    if (android.toHotTopicDetails) android.toHotTopicDetails(topicId);
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'toHotTopicDetails',
        methodtype: 'toHotTopicDetails',
        topicId: topicId
      });
      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};
/*
  **跳转股票牛热门话题列表页
*/
NGWBridge.toHotTopic = function () {
  if (typeof android != 'undefined') {
    if (android.toHotTopic) android.toHotTopic();
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'toHotTopic',
        methodtype: 'toHotTopic'
      });
      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};

/*
  **跳转板块
*/
NGWBridge.goToPlate = function (plateId, plateName) {
  if (typeof android != 'undefined') {
    if (android.goToPlate) android.goToPlate(plateId, plateName);
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'goToPlate',
        methodtype: 'goToPlate',
        plateId: plateId,
        plateName: plateName,
      });
      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};

/*
**跳转板块
*/
NGWBridge.toTreasurePage = function () {
  if (typeof android != 'undefined') {
    if (android.toTreasurePage) android.toTreasurePage();
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'toTreasurePage',
        methodtype: 'toTreasurePage',
      });
      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};
/*
**跳行情-自选 股票牛
*/
NGWBridge.toMyStock = function () {
  if (typeof android != 'undefined') {
    if (android.toMyStock) android.toMyStock();
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'toMyStock',
        methodtype: 'toMyStock',
      });
      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};

/**
 * 牛股王投教 龙虎榜 跳转到购后页
 */
NGWBridge.goDragonTigerAfter = function (courseid) {
  if (typeof android != 'undefined') {
    if (android.goDragonTigerAfter) android.goDragonTigerAfter(courseid);
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'goDragonTigerAfter',
        methodtype: 'goDragonTigerAfter',
        courseid: courseid
      });
      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
}

/**
 * 天津 短线宝打开视频直播间
 * @param type
 *  0: Vip直播间
 *  1: 小黑板
 *  2: 习题册
 *  3: 精彩视频
 */
NGWBridge.toOpenDXBLive = function (liveId, userId, type) {
  if (typeof android != 'undefined') {
    if (android.toOpenDXBLive) android.toOpenDXBLive(liveId, userId, type);
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'toOpenDXBLive',
        methodtype: 'toOpenDXBLive',
        liveId: liveId,
        userId: userId,
        type: type
      });
      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
}

/**
 * 天津 切换tab
 * @param type
 *  0: Vip直播间
 *  1: 小黑板
 *  2: 习题册
 *  3: 精彩视频
 */
NGWBridge.changeDXBLiveTab = function (type) {
  if (typeof android != 'undefined') {
    if (android.changeDXBLiveTab) android.changeDXBLiveTab(type);
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'changeDXBLiveTab',
        methodtype: 'changeDXBLiveTab',
        type: type
      });
      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
}
/**
  * 显示认购列表按钮，并跳转认购列表
  * 股票牛
  * ios: 3.5.0
  * android: 1.4.2
*/
NGWBridge.toStocksList = function (listUrl, type) {
  if (typeof android != 'undefined') {
    if (android.toStocksList) android.toStocksList(listUrl, type);
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'toStocksList',
        methodtype: 'toStocksList',
        listUrl: listUrl,
        type: type,
      });
      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};
/**
 * 股票牛
 * 埋点统计
 * ios 3.7.0
 * android 1.7.0
 * @param {*埋点统计key值} eventKey
 */
NGWBridge.TDClickEvent = function (eventKey) {
  if (typeof android != 'undefined') {
    if (android.TDClickEvent) android.TDClickEvent(eventKey);
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'TDClickEvent',
        methodtype: 'TDClickEvent',
        eventKey: eventKey,
      });
      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};
/**
 * 股票牛 牛股王
 * 跳转日内融聚合页
 * ios 3.8.0 4.4.2
 * android 1.8.0 4.1.4
 */
NGWBridge.toDayHarmonyPage = function () {
  if (typeof android != 'undefined') {
    if (android.toDayHarmonyPage) android.toDayHarmonyPage();
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'toDayHarmonyPage',
        methodtype: 'toDayHarmonyPage'
      });
      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
}
/**
 * 股票牛
 * 活动ID
 * ios 线上：3.7.1 内测：3.7.0
 * android 线上：1.7.1 内测：1.7.0
 */
NGWBridge.toActivityID = function (id) {
  if (typeof android != 'undefined') {
    if (android.toActivityID) android.toActivityID(id);
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'toActivityID',
        methodtype: 'toActivityID',
        activityId: id,
      });
      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};
/**
 * 股票牛
 * 告知app此页面需要分享结果
 * ios 线上：3.7.1 内测：3.7.0
 * android 线上：1.7.1 内测：1.7.0
 */
NGWBridge.getShareResult = function () {
  if (typeof android != 'undefined') {
    if (android.getShareResult) android.getShareResult();
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'getShareResult',
        methodtype: 'getShareResult',
      });
      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};
/**
  * 通知APP添加自选
  * ios: 4.4.1
  * android: 4.1.1
*/
NGWBridge.updateMyStockState = function (innerCode, state) {
  if (typeof android != 'undefined') {
    if (android.updateMyStockState) android.updateMyStockState(innerCode, state);
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'updateMyStockState',
        methodtype: 'updateMyStockState',
        innerCode: innerCode,
        state: state,
      });
      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};
/**
 * 股票牛
 * 跳转发现页-选股
 * ios 3.8.0
 * android 1.8.0
 */
NGWBridge.toDiscoStockPage = function () {
  if (typeof android != 'undefined') {
    if (android.toDiscoStockPage) android.toDiscoStockPage();
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'toDiscoStockPage',
        methodtype: 'toDiscoStockPage',
      });
      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
 };
/**
 * 股票牛
 * 跳转资讯-专题详情页（eg:投资教学)
 * ios 3.8.0
 * android 1.8.0
 * @param {*资讯专题id} topicId
 */
NGWBridge.toNewsTopicList = function (topicId) {
  if (typeof android != 'undefined') {
    if (android.toNewsTopicList) android.toNewsTopicList(topicId);
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'toNewsTopicList',
        methodtype: 'toNewsTopicList',
        topicId: topicId,
      });
      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};
  /**
 * 股票牛
 * 跳转发现页-题材选股-相关资讯
 * ios 3.8.0
 * android 1.8.0
 * @param {*热门题材专题id} topicId
 * @param {*是否level2用户} levelId
 * @param {*0: 相关个股 1: 相关资讯} tabType
 */
NGWBridge.toHotTopicNews = function (topicId, levelId, tabType) {
  if (typeof android != 'undefined') {
    if (android.toHotTopicNews) android.toHotTopicNews(topicId, levelId, tabType);
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'toHotTopicNews',
        methodtype: 'toHotTopicNews',
        topicId: topicId,
        levelId: levelId,
        tabType: tabType
      });
      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};
 /**
 * 股票牛
 * 跳转市场-概念板块-XX板块页（eg:酒业)
 * ios 3.8.0
 * android 1.8.0
 * @param {*板块类型 0：HK，1:US，2：AS} plateType
 * @param {*板块id} plateId
 */
NGWBridge.toMarketPlatePage = function (plateType, plateId) {
  if (typeof android != 'undefined') {
    if (android.toMarketPlatePage) android.toMarketPlatePage(plateType, plateId);
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'toMarketPlatePage',
        methodtype: 'toMarketPlatePage',
        plateType: plateType,
        plateId: plateId,
      });
      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};
 /**
 * 股票牛 牛股王
 * 开户审核状态-跳转审核状态页
 * ios 3.8.0 4.4.2
 * android 1.8.0
 */
NGWBridge.toAuditPage = function () {
  if (typeof android != 'undefined') {
    if (android.toAuditPage) android.toAuditPage();
  } else {
    NGWBridge.ready(function () {
      var msg = JSON.stringify({
        method: 'toAuditPage',
        methodtype: 'toAuditPage',
      });
      if (bridge.send) bridge.send(msg);
      if (bridge.sendMessage) bridge.sendMessage(msg);
    });
  }
};
    /**
   * 牛股王
   * android 1.8.0
   * @param {*关闭h5页面} state
   */
  NGWBridge.setCloseSate = function (state) {
    if (typeof android != 'undefined') {
      if (android.setCloseSate) android.setCloseSate(state);
    } else {
      NGWBridge.ready(function () {
        var msg = JSON.stringify({
          method: 'setCloseSate',
          methodtype: 'setCloseSate',
          state: state,
        });
        if (bridge.send) bridge.send(msg);
        if (bridge.sendMessage) bridge.sendMessage(msg);
      });
    }
  };
    /**
   * 牛股王
   * android 4.3.1  ios 4.4.3
   * @param {*跳转牛宝支付} state
   */
  NGWBridge.toNiuBaoPayment = function (cid, cycle) {
    if (typeof android != 'undefined') {
      if (android.toNiuBaoPayment) android.toNiuBaoPayment(cid, cycle);
    } else {
      NGWBridge.ready(function () {
        var msg = JSON.stringify({
          method: 'toNiuBaoPayment',
          methodtype: 'toNiuBaoPayment',
          cid: cid,
          cycle: cycle,
        });
        if (bridge.send) bridge.send(msg);
        if (bridge.sendMessage) bridge.sendMessage(msg);
      });
    }
  };
  /**
     * 去”我的牛宝“页面
     */
  NGWBridge.toNiubaoHome = function () {
    if (typeof android !== 'undefined') {
      if (android.toNiubaoHome) android.toNiubaoHome();
    } else {
      NGWBridge.ready(function() {
        var msg = JSON.stringify({
          method: 'toNiubaoHome',
          methodtype: 'toNiubaoHome',
        });
        if (bridge.send) bridge.send(msg);
        if (bridge.sendMessage) bridge.sendMessage(msg);
      });
    }
  };
    /**
   * 牛股王
   * android 4.3.1  ios 4.4.3
   * innerCode, stockCode, stockName, stockMarket, minuteIndex
   * minuteIndex    分钟索引1,5,15,30,60
   * @param {*跳转到个股页面分钟K线} state
   */
  NGWBridge.toQuoteOnMinuteTab = function (innerCode, stockCode, stockName, stockMarket, minuteIndex) {
    if (typeof android != 'undefined') {
      if (android.toQuoteOnMinuteTab) android.toQuoteOnMinuteTab(innerCode, stockCode, stockName, stockMarket, minuteIndex);
    } else {
      NGWBridge.ready(function () {
        var msg = JSON.stringify({
          method: 'toQuoteOnMinuteTab',
          methodtype: 'toQuoteOnMinuteTab',
          innerCode: innerCode,
          stockCode: stockCode,
          stockName: stockName,
          stockMarket: stockMarket,
          minuteIndex: minuteIndex,
        });
        if (bridge.send) bridge.send(msg);
        if (bridge.sendMessage) bridge.sendMessage(msg);
      });
    }
  };
     /**
   * 牛股王
   * android 4.3.1  ios 4.4.3
   * innerCode, stockCode, stockName, stockMarket
   * @param {*跳转到个股页面分钟K线} state
   */
  NGWBridge.toQuoteOnDkTab = function (innerCode, stockCode, stockName, stockMarket) {
    if (typeof android != 'undefined') {
      if (android.toQuoteOnDkTab) android.toQuoteOnDkTab(innerCode, stockCode, stockName, stockMarket);
    } else {
      NGWBridge.ready(function () {
        var msg = JSON.stringify({
          method: 'toQuoteOnDkTab',
          methodtype: 'toQuoteOnDkTab',
          innerCode: innerCode,
          stockCode: stockCode,
          stockName: stockName,
          stockMarket: stockMarket,
        });
        if (bridge.send) bridge.send(msg);
        if (bridge.sendMessage) bridge.sendMessage(msg);
      });
    }
  };
  /**
   * 海能淘股
   * android 4.3.1  ios 4.4.3
   * @param {*跳转独家资讯} state
   */
  NGWBridge.goInformation = function () {
    if (typeof android != 'undefined') {
      if (android.goInformation) android.goInformation();
    } else {
      NGWBridge.ready(function () {
        var msg = JSON.stringify({
          method: 'goInformation',
          methodtype: 'goInformation',
        });
        if (bridge.send) bridge.send(msg);
        if (bridge.sendMessage) bridge.sendMessage(msg);
      });
    }
  };
export default NGWBridge;
