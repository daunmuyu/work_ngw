;
(function (root, factory) {
  // CommonJS、CMD规范检查
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    // AMD规范检查
    typeof define === 'function' && define.amd ? define(factory) : (root.NGSipUI = factory());
  // root.NGSipUI = factory();
})(window, function () {
  var host = 'https://h5.niuguwang.com/sip';
  var sipRoot;
  var callingList;

  function getAjax(phoneNum) {
    var utoken = '&usertoken=' + JSON.parse(localStorage.getItem('vuejs__CS-TOKEN')).value;
    var url = 'https://imapi.stockhn.com/api/GetUserInfoByMobile.ashx?mobile=';
    var ajax = new XMLHttpRequest();
    var res;
    ajax.open('get', url + phoneNum + utoken, false);
    ajax.onreadystatechange = function() {
      if (ajax.readyState == 4 && ajax.status == 200) {
        console.log(JSON.parse(ajax.responseText));
        res = JSON.parse(ajax.responseText);
      }
    }
    ajax.send(null);
    return res;
    // console.log(ajax.onreadystatechange());
    // return ajax.onreadystatechange();
  }

  function bindEvent(dom, event, handler) {
    if (dom.addEventListener) {
      dom.addEventListener(event, function(e) {
        e.preventDefault();
        e.stopPropagation();
        handler(e);
      }, true);
    } else {
      dom.attachEvent('on' + event, function(e) {
        e.preventDefault();
        e.stopPropagation();
        handler(e);
      });
    }
  }
  function sipPanel() {
    function panel() {
      var sipMask = document.createElement('div');
      sipMask.className = 'sip-mask';
      sipMask.style.display = 'none';

      var sipContainer = document.createElement('div');
      sipContainer.className = "sip-container";
      sipContainer.style.display = 'none';

      var sipContent = document.createElement('div');
      sipContent.className = "sip-content";

      var sipFooter = document.createElement('div');
      sipFooter.className = "sip-footer";

      var sipReject = document.createElement('div');
      sipReject.className = "sip-red-btn";
      sipReject.innerHTML = '<span>挂断</span>';

      var sipAccept = document.createElement('div');
      sipAccept.className = "sip-blue-btn";
      sipReject.innerHTML = '<span>接听</span>';
      
      sipContainer.appendChild(sipContent);
      sipContainer.appendChild(sipFooter);
      document.body.appendChild(sipContainer);
      document.body.appendChild(sipMask);

      this.show = function(content, buttons) {
        sipContent.innerHTML = content;
        sipFooter.innerHTML = '';
        var len = (100.0 / buttons.length).toFixed(2);
        buttons.map(function(button) {
          var opt = document.createElement('div');
          opt.className = 'sip-' + button.color + '-btn';
          if (button.icon) {
            opt.innerHTML = '<img src="' + button.icon + '" /><span>' + button.text + '</span>';
          } else {
            opt.innerHTML = '<span>' + button.text + '</span>';
          }

          opt.style.width = len + '%';
          bindEvent(opt, 'click', button.clickHandler);
          sipFooter.appendChild(opt);
        });
        sipContainer.style.display = 'block';
        sipMask.style.display = 'block';
      };

      this.hide = function() {
        sipContainer.style.display = 'none';
        sipContent.innerHTML = '';
        sipFooter.innerHTML = '';
        sipContainer.style.display = 'none';
        sipMask.style.display = 'none';
      };
    }
    return new panel();
  }
  function getDisplayNameByUri(uri) {
    console.log(getAjax(uri.user.substr(-11)));
    var res = getAjax(uri.user.substr(-11));
    var remark = (res.data && res.data.remark) ? '<p>备注：' +res.data.remark+ '</p>' : '';
    var name = (res.data && res.data.name) ? '<p>用户名:' + res.data.name +'</p>' : '';
    if (uri.user.indexOf('588') > -1) {
      var displayName = uri.user.substr(uri.user.indexOf('1'));
      return '****' + displayName.substr(-4) + remark + name;
    } else {
      return '****' + uri.user.substr(-4) + remark + name;
    }
  }

  function acceptCalling(session) {
    if (session.answer && !session.start_time) {
      session.answer({
        mediaConstraints: {
            audio: true,
            video: false
          }
      });
    }
  }

  function removeCallUI(sessionId) {
    setTimeout(function () {
      if (sipRoot) {
        sipRoot.hide();
      }
    }, 1000);
  }

  function addCallUI(content, buttons) {
    if (!sipRoot) {
      sipRoot = sipPanel();
    }
    sipRoot.show(content, buttons);
  }

  function createCallinUI(session) {
    var displayName = getDisplayNameByUri(session.remote_identity.uri);
    addCallUI('来电：' + displayName, [{
      text: '拒接',
      icon: host + '/img/1.png',
      color: 'red',
      clickHandler() {
        session.terminate();
      }
    }, {
      text: '接听',
      icon: host + '/img/2.png',
      color: 'blue',
      clickHandler: function() {
        acceptCalling(session);
      }
    }]);
  }

  function createCalloutUI(session) {
    var displayName = getDisplayNameByUri(session.remote_identity.uri);

    addCallUI('呼叫：' + displayName, [{
      text: '取消',
      color: 'gray',
      clickHandler: function () {
        session.terminate();
      }
    }]);
  }

  function createCallingUI(session) {
    var displayName = getDisplayNameByUri(session.remote_identity.uri);
    function switchHold(e) {
      if (e.currentTarget.innerHTML.indexOf('取消') > -1) {
        session.unhold();
        e.currentTarget.innerHTML = '<img src="' + host + '/img/3.png" /> <span>呼叫保持</span>';
      } else {
        session.hold();
        e.currentTarget.innerHTML = '<img src="' + host + '/img/4.png" /> <span>取消呼叫保持</span>';
      }
    }
    addCallUI('通话中：' + displayName, [{
      text: '挂断',
      icon: host + '/img/1.png',
      color: 'red',
      clickHandler: function () {
        session.terminate();
      }
    }, {
      text: '呼叫保持',
      icon: host + '/img/3.png',
      color: 'blue',
      clickHandler: switchHold
    }]);
  }
  return function (sipObj) {
    // 来电时，创建来电UI
    sipObj.addInviteHandler(function (session) {
      console.log('来电时，创建来电UI', session);
      createCallinUI(session);
    });
    // 拨打电话时，创建拨打UI
    sipObj.addCalloutHandlers(function (session) {
      console.log('拨打电话时，创建拨打UI', session);
      createCalloutUI(session);
    });
    // 接听时，创建接听UI
    sipObj.addSessionAcceptedHandler(function (session) {
      console.log('接听时，创建接听UI', session);
      createCallingUI(session);
    });
    // 拒接时，删除UI
    sipObj.addSessionFailedHandler(function (session) {
      console.log('拒接时，删除UI', session);
      removeCallUI(session.id);
    });
    // 挂断时，删除UI
    sipObj.addSessionByeHandler(function (session) {
      console.log('挂断时，删除UI', session);
      removeCallUI(session.id);
    })
  };
});
