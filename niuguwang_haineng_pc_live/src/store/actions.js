import $ from 'jquery';
import Cookie from 'js-cookie';

const liveHost = 'https://live.niuguwang.com';
const userHost = 'https://user.niuguwang.com';
const apiHost = 'https://api.niuguwang.com';

function get(url, data) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url,
      data,
      type: 'get',
    }).done((res) => {
      resolve(res);
    }).fail((err) => {
      reject(err);
    });
  });
}

function post(url, data) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url,
      data,
      type: 'post',
    }).success((res) => {
      resolve(res);
    }).error((err) => {
      reject(err);
    });
  });
}

function promiseto(commit, arg, rid) {
  Promise.all([
    post(`${liveHost}/chat/user/login`, arg),
    post(`${liveHost}/chat/chatroom/RequestAddr?roomId=${rid}`, arg),
  ]).then((res) => {
    if (res[0].code === res[1].code) {
      commit('CHATROOM_INFO', {
        chatroomAddresses: res[1].im_addr,
        token: res[0].im_user.token,
        account: res[0].im_user.userId,
      });
      commit('USER_INFO', { ...res[0].im_user,
        ...arg,
      });
    } else {
      commit('ERROR_MSG', res.message || '网络错误');
      location.search = '';
    }
  });
}

export default {
  // 获取直播老师
  getTeachers({
    commit,
  }, args) {
    post(`${liveHost}/chat/ChatroomH5/HaiNengNiu`, args).then((res) => {
      if (res.code === 0) {
        commit('TEACHER_LIST', res.HaiNengNiuList);
      } else {
        commit('ERROR_MSG', res.message || '网络错误');
      }
    });
  },
  // 获取直播描述
  getMajor({
    commit,
  }, arg) {
    post(`${liveHost}/chat/ChatroomH5/GetMajor`, arg).then((res) => {
      if (res.code === 0) {
        commit('MAJOR', res.GetMajorList[0]);
      }
    });
  },
  // 游客注册
  guestReg({
    commit,
  }, arg) {
    return get(`${userHost}/api_wap/ngw/anonymousreg.ashx`, arg);
  },
  // 登录用户信息, 获取聊天室信息
  getUserInfo({
    commit,
  }, arg) {
    get(`${apiHost}/subscribe/Denver.ashx?action=isbuy&courseid=3926`, arg).then((s) => {
      const sr = JSON.parse(s);
      if (sr && sr.code === 0 && sr.result === 1) {
        Cookie.set('vid', '9651519');
        Cookie.set('lid', '568');
        promiseto(commit, arg, '9651519', '568');
      } else {
        Cookie.set('vid', '9659068');
        Cookie.set('lid', '570');
        promiseto(commit, arg, '9659068', '570');
      }
    });
  },

  // 是否购买课程
  getIsBuy({
    commit,
  }, arg) {
    return get(`${apiHost}/subscribe/Denver.ashx?action=isbuy`, arg);
  },
  // 获取直播流
  getPlayLive({
    commit,
  }, arg) {
    return get(`${liveHost}/video/Live/PlayLive`, arg);
  },
  // 视频列表
  getVideo({
    commit,
  }, arg) {
    // return post(`${liveHost}/chat/ChatroomH5/GetVidoe`, arg);
    return post(`${userHost}/api_wap/ngw/getUserOpinion.ashx`, arg);
  },
  // 手机登录
  mobileLogin({
    commit,
  }, arg) {
    return post(`${userHost}/api_wap/ngw/mobileLogin.ashx?packtype=1101`, arg);
  },
  // 登陆验证
  loginCheck({
    commit,
  }, arg) {
    return post(`${userHost}/api_wap/ngw/logincheck.ashx`, arg);
  },
  // 账户登录
  userLogin({
    commit,
  }, arg) {
    return post(`${userHost}/api_wap/ngw/login.ashx?packtype=1101`, arg);
  },
  // 获取验证码
  getVerify({
    commit,
  }, arg) {
    return post(`${userHost}/api_wap/ngw/getverifycode.ashx`, arg);
  },
  // 获取历史消息
  getHisMsg({
    commit,
  }, arg) {
    post(`${liveHost}/chat/ChatroomH5/detail`, {
      roomId: arg,
      direction: '-1',
      order: '1',
    }).then((res) => {
      if (res.code === 0) {
        commit('HISTORY_MSG', res.im_data);
      } else {
        commit('ERROR_MSG', res.message || '网络错误');
      }
    });
  },
  // 发送消息
  sendMsg({
    commit,
  }, arg) {
    return post(`${liveHost}/chat/chatroom/SendMsg`, arg);
  },
  // 运营bananer
  getBanner({ commit }, arg) {
    return post(`${liveHost}/chat/ChatroomH5/HaiNengCourseBanner`, arg);
  },
  // 课程介绍
  getClass({ commit }, arg) {
    return post(`${liveHost}/chat/ChatroomH5/HaiNengCourseBanner`, arg);
  },
  // 课程表
  getSchedule({ commit }, arg) {
    return post(`${liveHost}/chat/ChatroomH5/HaiNengSchedule`, arg);
  },
  // 获取密码
  getPwdStatus({ commit }, arg) {
    return post(`${liveHost}/chat/ChatroomH5/HaiNengIsHavePassword`, arg);
  },
  // 获取公告
  getNotice({ commit }, arg) {
    return post(`${liveHost}/chat/ChatroomH5/HaiNengNotice`, arg);
  },
  // 检查用户的登录状态
  loginStatus({ commit }, arg) {
    return post(`${userHost}/api_wap/ngw/checkUserStatus.ashx`, arg);
  },
  // 用户登出接口
  logout({ commit }, arg) {
    return post(`${userHost}/api_wap/ngw/logout.ashx`, arg);
  },
};
