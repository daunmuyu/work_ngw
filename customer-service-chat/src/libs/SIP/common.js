;
(function (root, factory) {
  // CommonJS、CMD规范检查
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    // AMD规范检查
    typeof define === 'function' && define.amd ? define(factory) : (root.NGSip = factory());
  // root.NGSip = factory();
})(window, function () {
  const wavUrl = 'https://h5.niuguwang.com/sip/call.mp3';
  var serverConfig = {
    clientPort: '5060',
    clientIP: 'testwss.niuguwang.com',
    password: '12345',
    serverIP: 'testwss.niuguwang.com',
    serverPort: '7443',
    prephone: '697',
  };
  // 本地号码段
  var LocalList = [];
  // 铃声设置
  var lingsheng;
  var LSH = {
    init: function () {
      lingsheng = document.createElement('audio');
      lingsheng.src = wavUrl;
      // lingsheng.autoplay = 'autoplay';
      lingsheng.loop = 'loop';
      document.body.appendChild(lingsheng);
    },
    play: function () {
      if (typeof lingsheng !== 'undefined') {
        lingsheng.play();
      }
    },
    stop: function () {
      if (typeof lingsheng !== 'undefined') {
        lingsheng.pause();
      }
    }
  };

  LSH.init();

  function ngSip(optObj) {
    var username = optObj.idCode;
    console.log(optObj, optObj.serverIP);
    console.log(optObj.prephone || serverConfig.prephone);
    console.log(optObj.serverIP || serverConfig.serverIP);
    // sip代理对象事件集合
    var eventsBus = {
      connectedHandlers: [],
      registeredHandlers: [],
      unregisteredHandlers: [],
      inviteHandlers: [],
      calloutHandlers: [],
    };
    var sessionEventsBus = {
      acceptedHandlers: [],
      cancelHandlers: [],
      byeHandlers: [],
      rejectedHandlers: [],
      failedHandlers: [],
      referHandlers: [],
    };
    // 全局变量：sip账号
    var UN;
    // 全局变量：sip代理对象
    var ua;
    // 全局变量：当前通话
    var session;
    // 全局变量：通话渲染Audio
    var SIPAudio;

    // 初始化事件监听
    function initEventHandler() {
      ua.on('connected', function (e) {
        console.log('connected');
        eventsBus.connectedHandlers.forEach(function (handler) {
          handler(e);
        });
      });

      ua.on('registered', function (e) {
        console.log('registered');
        eventsBus.registeredHandlers.forEach(function (handler) {
          handler(e);
        });
      });

      ua.on('unregistered', function (e) {
        console.log('unregistered');
        eventsBus.unregisteredHandlers.forEach(function (handler) {
          handler(e);
        });
      });

      ua.on('newRTCSession', function (e) {
        console.log('new session', e);
        if (e.originator === 'remote') {
          session = e.session;
          if (!lingsheng) {
            LSH.init();
          } else {
            LSH.play();
          }
          initSessionEventHandler(session);
          eventsBus.inviteHandlers.forEach(function (handler) {
            console.log(9999)
            handler(session);
          });
        }
      });
    }
    // 注册用户
    function registerUA(username) {

      var socket = new JsSIP.WebSocketInterface('wss://' + (optObj.serverIP || serverConfig.clientIP) + ':' + serverConfig.serverPort);
      var configuration = {
        sockets: [socket],
        uri: username + '@' + (optObj.serverIP || serverConfig.clientIP) + ':' + serverConfig.clientPort,
        password: serverConfig.password,
        session_timers: false
      };

      ua = new JsSIP.UA(configuration);

      initEventHandler();

      ua.start();
      console.log(123);
    }
    // 注销用户
    function unregisterUA() {
      ua.stop();
    }

    function getUriByPhone(phoneno) {
      var zerono = (optObj.prephone || serverConfig.prephone) + phoneno + '@' + (optObj.serverIP || serverConfig.clientIP) + ':' + serverConfig.clientPort;
      // var zeroyes = (optObj.prephone || serverConfig.prephone) + '0' + phoneno + '@' + (optObj.serverIP || serverConfig.clientIP) + ':' + serverConfig.clientPort;
      // console.log('电话号码拨打线路', zerono, zeroyes);
      return zerono;
      // if (optObj.prephone == '699') return zerono;
      // if (LocalList.length === 0 || LocalList.indexOf(+phoneno.substr(0, 7)) > -1) return zerono;
      // return zeroyes;
    }

    function initSessionEventHandler(session) {
      session.on('accepted', function () {
        // 终止响铃
        LSH.stop();

        if (!SIPAudio) {
          SIPAudio = document.createElement('audio');
          SIPAudio.style.display = 'none';
          SIPAudio.autoplay = 'autoplay';
          document.body.appendChild(SIPAudio);
        }
        session.connection.onaddstream = null;
        const stream = session.connection.getRemoteStreams()[0];
        if (typeof SIPAudio.srcObject !== 'undefined') {
          SIPAudio.srcObject = stream;
        } else if (typeof SIPAudio.mozSrcObject !== 'undefined') {
          SIPAudio.mozSrcObject = stream;
        } else if (typeof SIPAudio.src !== 'undefined') {
          SIPAudio.src = URL.createObjectURL(stream);
        } else {
          console.log('Error attaching stream to element.');
        }

        console.log('session accepted');
        sessionEventsBus.acceptedHandlers.forEach(function (handler) {
          handler(session);
        });
      });


      session.on('ended', function () {
        console.log('session bye');
        sessionEventsBus.byeHandlers.forEach(function (handler) {
          handler(session);
        });
      });


      session.on('failed', function () {
        console.log('session failed');
        // 终止响铃
        LSH.stop();
        sessionEventsBus.failedHandlers.forEach(function (handler) {
          handler(session);
        });
      });

      session.on('refer', function (target) {

        console.log('session refer');
        sessionEventsBus.referHandlers.forEach(function (handler) {
          handler(session);
        });
      });
      // addEventsToMedia(session.mediaHandler);
    }

    function createSession(phoneNo) {

      var uri = getUriByPhone(phoneNo);
      console.log('呼叫：' + phoneNo);
      if (!SIPAudio) {
        SIPAudio = document.createElement('audio');
        SIPAudio.style.display = 'none';
        SIPAudio.autoplay = 'autoplay';
        document.body.appendChild(SIPAudio);
      }

      var options= {
        // eventHandlers: eventHandlers,
        mediaConstraints: {
          audio: true,
          video: false
        }
      };

      session = ua.call(uri, options);
      session.connection.onaddstream = function (e) {
        if (typeof SIPAudio.srcObject !== 'undefined') {
          SIPAudio.srcObject = e.stream;
        } else if (typeof SIPAudio.mozSrcObject !== 'undefined') {
          SIPAudio.mozSrcObject = e.stream;
        } else if (typeof SIPAudio.src !== 'undefined') {
          SIPAudio.src = URL.createObjectURL(e.stream);
        } else {
          console.log('Error attaching stream to element.');
        }
      }

      // 触发拨打电话事件
      eventsBus.calloutHandlers.forEach(function (handler) {
        handler(session);
      });
      initSessionEventHandler(session);

      return session;
    }

    if (username) {
      UN = username;
    }
    // 注册用户
    this.register = function (username) {
      if (username) {
        UN = username;
      }
      registerUA(UN);
    };
    // 注销用户
    this.unregister = function () {
      unregisterUA();
    };
    // 设置本地号码段
    this.setLocal = function (phoneArray) {
      LocalList = phoneArray;
    };
    // 监听连接事件
    this.addConnectedHandler = function (handler) {
      eventsBus.connectedHandlers.push(handler);
    };
    // 监听注册成功事件
    this.addRegisteredHandler = function (handler) {
      eventsBus.registeredHandlers.push(handler);
    };
    // 监听注销成功事件
    this.addUnregisteredHandler = function (handler) {
      eventsBus.unregisteredHandlers.push(handler);
    };
    // 监听来电事件
    this.addInviteHandler = function (handler) {
      eventsBus.inviteHandlers.push(handler);
    };
    // 监听拨打电话事件
    this.addCalloutHandlers = function (handler) {
      eventsBus.calloutHandlers.push(handler);
    };
    // 拨打电话(phoneNo:手机号)
    this.call = function (phoneNo) {
      return createSession(phoneNo);
    };
    // 监听接听电话事件
    this.addSessionAcceptedHandler = function (handler) {
      sessionEventsBus.acceptedHandlers.push(handler);
    };
    // 监听取消拨打事件
    this.addSessionCancelHandler = function (handler) {
      sessionEventsBus.cancelHandlers.push(handler);
    };
    // 监听挂断事件
    this.addSessionByeHandler = function (handler) {
      sessionEventsBus.byeHandlers.push(handler);
    };
    // 监听拒接事件
    this.addSessionRejectedHandler = function (handler) {
      sessionEventsBus.rejectedHandlers.push(handler);
    };
    // 监听拨打失败事件(对方拒接,或当前用户拒接触发)
    this.addSessionFailedHandler = function (handler) {
      sessionEventsBus.failedHandlers.push(handler);
    };
    this.addSessionReferHandler = function (handler) {
      sessionEventsBus.referHandlers.push(handler);
    };
  }

  return function (username) {
    return new ngSip(username);
  };
});