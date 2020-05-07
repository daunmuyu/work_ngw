'use strict';
var readyBoolean = false;
var readyCallbacks = [];
var bridge;
var NGWBridge = {};

/**
 * ready
 * bridge就位后开始执行
 */
NGWBridge.ready = (callback) => {
  if (readyBoolean) {
    return callback();
  } else {
    readyCallbacks.push(callback);
  }
};
NGWBridge.initCallback = (b) => {
  readyBoolean = true;

  bridge = b;
  if (bridge.init) bridge.init((message, responseCallback) => {});

  readyCallbacks.forEach((callback) => {
    callback();
  });
};
/**
 * 初始化
 * 需要在每个页面初始化时调用
 */
const bridgeInit = NGWBridge.init = () => {
  if (window.WebViewJavascriptBridge) {
    NGWBridge.initCallback(window.WebViewJavascriptBridge);
  } else {
    document.addEventListener('WebViewJavascriptBridgeReady', () => {
      NGWBridge.initCallback(window.WebViewJavascriptBridge);
    }, false);
  }
};

/**
 * 获取usertoken
 */
const bridgeUtoken = NGWBridge.utoken = (callback) => {
  var usertoken = NGWBridge.search('usertoken');
  if (usertoken) {
    if (callback) callback(usertoken);
  } else if (typeof android != 'undefined') {
    if (callback && android.getUserToken) callback(android.getUserToken());
  } else {
    NGWBridge.ready(() => {
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
const bridgeVersion = NGWBridge.getVersion = function (callback) {
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
const bridgeGMToken = NGWBridge.getGMToken = function (callback) {
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
const bridgeRefresh =  NGWBridge.initRefresh = function (type) {
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
const bridgeClosepage =  NGWBridge.closePage = function () {
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
const bridgeInitClose = NGWBridge.initClose = function (type) {
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
const bridgeLogin = NGWBridge.login = function () {
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
const bridgeGMDetail = NGWBridge.toGMDetail = function (fundaccount) {
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
const bridgeGMTradepwd = NGWBridge.toGMTradepwd = function () {
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
const bridgeBindMobile = NGWBridge.bindMobile = function () {
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
 * A股-模拟组合页面
 */
const bridgeVirtualAccount = NGWBridge.toVirtualAccount = function (accountId, userId) {
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
const bridgeVirtualAbuy = NGWBridge.toVirtualABuy = function (stockMarket, innerCode, stockCode, stockName, buySellType) {
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

const bridgeFundPurchase = NGWBridge.toFundPurchase = function (innerCode, fundCode, fundName, market) {
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


const bridgePacketList = NGWBridge.toPacketList = function () {
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
const bridgeOpenAccount = NGWBridge.toOpenAccount = function () {
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
const bridgeStockAccount = NGWBridge.openStockAccount = function (bid, burl, bchannel, bpackage, bscheme) {
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
const bridgeStockAccountIntro = NGWBridge.toOpenStockAccountIntro = function (href, id) {
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
const bridgeVirtualForeignAccount = NGWBridge.toVirtualForeignAccount = function (accountId) {
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
const bridgeToKaihu = NGWBridge.startToKaihu = function () {
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
const bridgeLoadKaihuInTrade= NGWBridge.loadKaihuInTrade = function (callback) {
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
const bridgeForeignAccount = NGWBridge.toOpenForeignAccount = function (close) {
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
const bridgeKaihuInTrade = NGWBridge.startKaihuInTrade = function (s) {
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
const bridgeOpenFundAccount = NGWBridge.toOpenFundAccount = function (type) {
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
const bridgeTipOpenFundAccount = NGWBridge.toTipOpenFundAccount = function () {
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
const bridgeFundAccount = NGWBridge.toFundAccount = function () {
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
const bridgeFundAsset = NGWBridge.toFundAsset = function () {
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
const bridgeVirtualFundGroupPurchase = NGWBridge.toVirtualFundGroupPurchase = function (groupId) {
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
const bridgeFundLanding = NGWBridge.toFundLanding = function () {
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
const bridgeVirtualFundGroupDetails = NGWBridge.toVirtualFundGroupDetails = function (accountId, userId, isAuthFundUser, fid) {
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
const bridgeFundXianJinBao = NGWBridge.toFundXianJinBao = function () {
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
const bridgeVirtualFundAccount = NGWBridge.toVirtualFundAccount = function (accountId) {
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
const bridgeTelPhone = NGWBridge.telPhone = function (tel) {
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
const bridgeOpenPDF = NGWBridge.openPDF = function (filepath, filename) {
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
const bridgeCameraPhoto = NGWBridge.getCameraPhoto = function (callback) {
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
const bridgeSetTitle = NGWBridge.setTitle = function (title) {
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
const bridgeInitShare = NGWBridge.initShare = function (title, content, url, type) {
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


//跳转APP牛人页
const bridgeGenius = NGWBridge.goGenius = function (uid, uname) {
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
const bridgeToppic = NGWBridge.goTopic = function (mainid) {
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
const bridgeQuote = NGWBridge.toQuote = function (innerCode, stockCode, stockName, stockMarket) {
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
const bridgePacketMatchList = NGWBridge.toPacketMatchList = function (cseID, type) {
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
const bridgeFundDebutDetail = NGWBridge.toFundDebutDetail = function (innerCode, stockCode, stockName, stockMarket) {
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
const bridgeAllMatch = NGWBridge.goAllMatch = function () {
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
const bridgeSearch = NGWBridge.search = function (key) {
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
//  跳转牛人排行
const bridgeGeniusRanking = NGWBridge.goGeniusRanking = function (type, rankingText) {
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
const bridgeInviteFriend = NGWBridge.goInviteFriend = function (title, url) {
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
const bridgeSendTopic = NGWBridge.sendTopic = function () {
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
const bridgeSubscribeGenius = NGWBridge.subscribeGenius = function (userId) {
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
const bridgeUploadImgFinished = NGWBridge.uploadImgFinished = function () {
  if (typeof android != 'undefined') {
    if (android.uploadImgFinished) android.uploadImgFinished();
  }
};
// 分享
const bridgeShareUrl = NGWBridge.shareUrl = function (shareTitle, shareContent, shareUrl) {
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
// 获取手机相册地址
const bridgeCameraPhotoPaths =  NGWBridge.selectCameraPhotoPaths = function (callback) {
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
const bridgeStockSecuritiesList = NGWBridge.toStockSecuritiesList = function () {
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
const bridgeStockSecuritiesLogin = NGWBridge.toStockSecuritiesLogin = function (bid, url) {
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
// 跳转邀请他人
const bridgeStartInviteFriend = NGWBridge.startInviteFriend = function (title, content, url) {
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
const bridgeCompareVersion = NGWBridge.compareVersion = function (local, cur) {
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
const bridgeCourseDetail = NGWBridge.openCourseDetail = function (courseID, callback) {
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
const bridgeNoteRankList = NGWBridge.goNoteRankList = function () {
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
const bridgeNoteDetail = NGWBridge.goNoteDetail = function (id) {
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
const bridgeFundSmartGroup = NGWBridge.toFundSmartGroup = function () {
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
const bridgeFundRevenueRanking = NGWBridge.toFundRevenueRanking = function (type) {
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
const bridgeFundTopicDetails = NGWBridge.toFundTopicDetails = function (topicId) {
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
const bridgeSkipTest = NGWBridge.skipTest = function (type) {
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
const bridgeMyVirtualForeignAccount = NGWBridge.toMyVirtualForeignAccount = function (virtualId) {
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
const bridgeIsRiskTest = NGWBridge.isRiskTest = function () {
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
const bridgeMyVirtualFundAccoun = NGWBridge.toMyVirtualFundAccount = function (a, b, c) {
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
const bridgeOpenScreenLive = NGWBridge.toOpenScreenLive = function (videoId, roomId, bloggerId, type) {
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
const bridgeMatchDetail = NGWBridge.goMatchDetail = function (matchId) {
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
const bridgeLiveHotList = NGWBridge.goLiveHotList = function () {
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
const bridgeOpenNativeLive = NGWBridge.toOpenNativeLive = function (liveId, userId) {
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
const bridgePlayHKUSStock = NGWBridge.toPlayHKUSStock = function () {
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
const bridgeCoursePayment = NGWBridge.toCoursePayment = function (classId, tel) {
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
const bridgeForDialogue = NGWBridge.goForDialogue = function (userid, title) {
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
const bridgeStrategyRankPaySuccess = NGWBridge.toStrategyRankPaySuccess = function () {
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
const bridgeStrategyRankCourse = NGWBridge.isStrategyRankCourse = function () {
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
const bridgeDKSearchPopup = NGWBridge.getDKSearchPopup = function() {
  if (typeof android != "undefined") {
    if (android.getDKSearchPopup) android.getDKSearchPopup();
  } else {
    NGWBridge.ready(function() {
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
 * 跳转私信对话页面
 * ios:3.7.0
 * android:3.7.1
 */
const bridgeClinicShares = NGWBridge.toClinicShares = function(stock, user) {
  var stockSymbol = stock.stockSymbol || "";
  var userid = user.userId || "";
  var userName = user.userName || "";
  if (typeof android != "undefined") {
    if (android.toClinicShares)
      android.toClinicShares(stockSymbol, userid, userName);
  } else {
    NGWBridge.ready(function() {
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

const bridgeFullScreen = NGWBridge.toFullScreen = function(url) {
  if (typeof android != "undefined") {
    if (android.toFullScreen) android.toFullScreen(url);
  } else {
    NGWBridge.ready(function() {
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

// 跳转筹码
const bridgeChip = NGWBridge.toChip = function(innerCode) {
  if (typeof android != "undefined") {
    if (android.toChip)
      android.toChip(innerCode);
  } else {
    NGWBridge.ready(function() {
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

// 趋势稳盈登录 （断点登录）
const bridgeQuShiWenYingLogin = NGWBridge.onQuShiWenYingLogin = function() {
  if (typeof android != "undefined") {
    if (android.onQuShiWenYingLogin)
      android.onQuShiWenYingLogin();
  } else {
    NGWBridge.ready(function() {
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
const bridgeShare = NGWBridge.share = function(shareTitle, shareContent, shareUrl, type) {
  if (typeof android != "undefined") {
    if (android.share)
      android.share(shareTitle, shareContent, shareUrl, type);
  } else {
    NGWBridge.ready(function() {
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
const bridgeH5ViewPagerInfo = NGWBridge.getH5ViewPagerInfo = function(offsetLeft,offsetTop,width,height) {
  if (typeof android != 'undefined') {
    if (android.getH5ViewPagerInfo) android.getH5ViewPagerInfo(offsetLeft,offsetTop,width,height);
  }
};
/* 
**跳转股票牛热门话题详情页
*/
const bridgeHotTopicDetails = NGWBridge.toHotTopicDetails = function (topicId) {
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
const bridgeHotTopic = NGWBridge.toHotTopic = function () {
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
const bridgeToPlate = NGWBridge.goToPlate = function (plateId, plateName) {
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

module.exports = {
  NGWBridge, // 全部模块
  bridgeInit, // 初始化 需要在每个页面初始化时调用
  bridgeUtoken, // 获取usertoken
  bridgeVersion, // 获取version
  bridgeGMToken, // 获取gm相关token
  bridgeRefresh, // 返回页面的时候是否刷新当前页面 type=1，刷新 type=0，不刷新
  bridgeClosepage, // 关闭当前页面
  bridgeInitClose, // 增加关闭按钮
  bridgeLogin, // 跳转到登录页面
  bridgeGMDetail, // 跳转到港美股账户页
  bridgeGMTradepwd, // 输入交易密码
  bridgeBindMobile, // 常用-绑定手机页面
  bridgeVirtualAccount, // A股-模拟组合页面
  bridgeVirtualAbuy, // 跳转A股模拟买入
  bridgeFundPurchase, // 跳转基金实盘买入
  bridgePacketList, // 红包跳转页面
  bridgeOpenAccount, // A股-开户券商列表
  bridgeStockAccount, // A股-某一券商开户页面
  bridgeStockAccountIntro, // 打开A股券商开户介绍页
  bridgeVirtualForeignAccount, // 港美股-模拟交易页面
  bridgeToKaihu, // 港美股-开户方法
  bridgeLoadKaihuInTrade, // 港美股-判断是否在交易页面
  bridgeForeignAccount, // 港美股-跳转到港美股开户页
  bridgeKaihuInTrade, // 港美股-在交易页面开户
  bridgeOpenFundAccount, // 基金-开户认证页面
  bridgeTipOpenFundAccount, // 基金-开户认证页面 新手专区 带有文本提示
  bridgeFundAccount, // 跳转基金账户页
  bridgeFundAsset, // 跳转基金资产页(未开户的也可以看资产页)
  bridgeVirtualFundGroupPurchase, // 跳转基金模拟组合下单页
  bridgeFundLanding, // 跳转基金落地页/首页
  bridgeVirtualFundGroupDetails, // 跳转基金模拟组合页
  bridgeFundXianJinBao, // 跳转基金现金宝(现金宝账户页/未开户的去开户)
  bridgeVirtualFundAccount, // 基金-模拟交易页面
  bridgeTelPhone, // 拨打电话
  bridgeOpenPDF, // 打开pdf
  bridgeCameraPhoto, // 获取相机相册权限
  bridgeSetTitle, // 设置标题
  bridgeInitShare, // 初始化分享
  bridgeGenius, // 跳转APP牛人页
  bridgeToppic, // 跳转牛股王APP帖子页
  bridgeQuote, // 跳转牛股王APP行情页
  bridgePacketMatchList, // 跳转到红包排行列表
  bridgeFundDebutDetail, // 跳转新发基金详情页
  bridgeAllMatch, // 比赛列表
  bridgeSearch, // 搜索key
  bridgeGeniusRanking, // 跳转牛人排行
  bridgeInviteFriend, // 跳转邀请他人
  bridgeSendTopic, // 跳转发表帖子
  bridgeSubscribeGenius, // 订阅指定用户
  bridgeUploadImgFinished, // 通知android上传图片完成
  bridgeShareUrl, // 分享
  bridgeCameraPhotoPaths, // 获取手机相册地址
  bridgeStockSecuritiesList, // 跳转A股实盘券商列表页面
  bridgeStockSecuritiesLogin, // 跳转A股实盘券商登录页面
  bridgeStartInviteFriend, // 跳转邀请她人
  bridgeCompareVersion, // 版本号比较
  bridgeCourseDetail, // 打开课程详情
  bridgeNoteRankList, // 跳转投资列表
  bridgeNoteDetail, // 跳转投资列表
  bridgeFundSmartGroup, // 跳转基金智能组合列表页
  bridgeFundRevenueRanking, // 跳转基金排行列表页
  bridgeFundTopicDetails, // 跳转基金主题详情页面
  bridgeSkipTest, // 显示 跳转按钮
  bridgeMyVirtualForeignAccount, // 跳转港美股模拟交易个人页
  bridgeIsRiskTest, // 增加 ios 他们自己的刷新
  bridgeMyVirtualFundAccoun, // 跳转基金模拟交易个人页
  bridgeOpenScreenLive, // 跳转视屏直播间
  bridgeMatchDetail, // 跳转模拟比赛详情页面（也就是参加比赛页面）
  bridgeLiveHotList, // 跳转到直播推荐列表
  bridgeOpenNativeLive, // 跳转到原生图文直播
  bridgePlayHKUSStock, // 跳转到原生玩转港美股
  bridgeCoursePayment, // 唤起原生课程支付
  bridgeForDialogue, // 跳转私信对话页面
  bridgeStrategyRankPaySuccess, // 跳转原生策略金榜购后页面
  bridgeDKSearchPopup, // 获取DK短线宝点击搜索的弹框
  bridgeClinicShares, // 跳转私信对话页面
  bridgeFullScreen, // 全屏view h5调用
  bridgeChip, // 跳转筹码
  bridgeQuShiWenYingLogin, // 趋势稳盈登录 （断点登录）
  bridgeShare, // 独立分享
  bridgeH5ViewPagerInfo, // 调用原生支持h5滑动
  bridgeHotTopicDetails, // 跳转股票牛热门话题详情页
  bridgeHotTopic, // 跳转股票牛热门话题列表页
  bridgeToPlate, // 跳转板块
}

