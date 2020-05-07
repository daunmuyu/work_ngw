import Vue from 'vue';
import imHelper from 'lib/imHelper.js';
import search from 'lib/urlSearch.js';
import VideoPlayer from './components/video';
import Chat from './components/chat';
import LiveInfo from './components/live-info';
import TeacherInfo from './components/teacher-info';
import Team from './components/team';
import Notice from './components/notice';
import VideoList from './components/videoList';

import {
  getPlayLive,
  getLiveList,
  getChatHistoryMsg,
  // GetLiveTeacherList,
  getUserInfo,
  sendMsg,
  RequestAddr,
  getTeacherList,
  getVideoList,
  getNotice,
  getGreatVideo,
  roomName,
  Heartbeat
} from './api';
import template from './layout.html';
import './layout.scss';

const httpsUrl = (url) => {
  if (url.indexOf('http://') === 0) {
    return url.replace('http://', 'https://')
  }
  return url
}

function IsPC() {
  const userAgentInfo = navigator.userAgent;
  const Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'];
  let flag = true;
  for (let v = 0; v < Agents.length; v += 1) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      flag = false;
      break;
    }
  }
  return flag;
}
const roomId = 10517689;
const livetoken = search('livetoken');
const skinType = +search('skin') === 1 ? 1 : 0;

export default Vue.extend({
  template,
  components: {
    VideoPlayer,
    Chat,
    LiveInfo,
    TeacherInfo,
    Team,
    Notice,
    VideoList,
  },
  data() {
    return {
      videoObj: {
        type: 0,
        vedio: '',
      },
      roomN: '',
      videoList: [],
      teacherList: [],
      messageList: [],
      userInfo: {},
      IMinstance: undefined,
      team: {},
      noticeImg: '',
      goodVideoList: [],
      currentGoodVideo: -1,
      showList: true,
      lastListId: 0, // 消息列表的最后一个id
      hideLeft: false,
      showTottleButton: true,
      skinType, // 皮肤模式，白色为1 其他为黑色
      getAuthInit: '',
      getTime: '',
      sessionId: '',
    };
  },

  mounted() {
    if (!this.$root.temName) {
      this.$emit('initTemName', `游客-${Math.floor(Math.random() * 10000)}`);
    }
    if (this.getAuthInit) {
      window.clearInterval(this.getAuthInit);
    }
    this.getAuthInit = setInterval(this.getAuth, 60000);
    if (this.getTime) {
      window.clearInterval(this.getTime);
    }
    this.getHeat(1);
    this.getTime = setInterval(this.getHeat, 20000);
    // this.getAuth();
    this.init();
    setTimeout(() => {
      this.showList = false;
    }, 1500);
    // setTimeout(() => {
    //   console.log(1232);
    //   this.videoObj = {
    //     type: 2,
    //     video: ['http://vjs.zencdn.net/v/oceans.mp4'],
    //   }
    // }, 3000);
    this._roomName();
  },
  destroyed() {
    window.clearInterval(this.getAuthInit);
    window.clearInterval(this.getTime);
  },
  methods: {
    getHeat(type = 2) {
      Heartbeat({
        livetoken,
        userName: this.$root.temName,
        type,
        invitationcode: search('invitationcode'),
        source: 2,
        sessionId: this.sessionId
      }).then(res => {
          this.sessionId = res.data.sessionId;
      })
    },
    _roomName() {
      roomName({
        roomid: 10517689
      }).then((res) => {
        this.roomN = res.data.liveTitle
      })
    },
    init() { // 获取初始信息
      this.getUserInfoByToken()
        .then(() => {
          this.initIM();
        });
      this.getLiveInfo();
      this.getMessageList();
      this.getTeacherInfo();
      getNotice({
        id: roomId,
      }).then((res) => {
        if (res.code === 1) {
          this.noticeImg = res.data.notice;
        }
      });
    },
    toList() {
      window.location.reload();
    },
    /**
     * 获取视频信息
     */
    getLiveInfo() {
      Promise.all([
        getPlayLive({
          roomId,
          livetoken,
        }),
        getGreatVideo({
          roomId,
        })
      ]).then((results) => {
        if (results[1].code === 0) { // 精彩视频保存
          this.goodVideoList = results[1].data.filter(video => video.bright === 1);
        }
        if (results[0].result === 1 && results[0].data.length > 0) {
          const regFile = /.m3u8$/;
          this.videoList = results[0].data;
          // 判断是否直播
          // if (regFile.test(results[0].data[0].HLSUrl)) {
          /** 
           * rtmpurl: 一种视频协议,Adobe公司提出
           * hlsurl: flv格式
           */
          const isPc = IsPC();
          if (results[0].data[0].RTMPUrl) {
            this.videoObj = {
              type: 1,
              video: [httpsUrl(results[0].data[0].HLSUrl)],
            }
            // if (!isPc || !results[0].data[0].RTMPUrl) {
            //   this.videoObj = {
            //     type: 1,
            //     video: [httpsUrl(results[0].data[0].HLSUrl)],
            //   }
            // } else {
            //   this.videoObj = {
            //     type: 1,
            //     video: [results[0].data[0].RTMPUrl],
            //   }
            // }
          } else {
            // console.log('****************************')
            // this.currentGoodVideo = 0; // 取消自动播放录播视频
            this.videoObj = {
              type: 2,
              video: results[1].data.map(videoItem => httpsUrl(videoItem.videoUrl)),
            }
            // this.videoObj = {
            //   type: 2,
            //   video: results[0].data.map(liveItem => liveItem.HLSUrl),
            // }
          }
        }
      });
    },
    /**
     * 获取历史消息
     */
    getMessageList(callBack) {
      // 获取消息列表
      getChatHistoryMsg({
        direction: '-1',
        order: '1',
        id: this.lastListId,
        // id: '29520',
        livetoken,
        roomId,
        // type: 'up',
      }).then((res) => {
        if (res.result === 1) {
          if (+res.im_data.length === 0) {
            this.$Message.error('没有更多消息了~');
            return;
          }
          this.lastListId = res.im_data[0].id;
          this.messageList = [
            ...res.im_data,
            ...this.messageList,
          ];
          if (callBack) callBack();
        }
      });
    },
    /**
     *  获取老师聊天记录
     */
    // getTeacherMessage(item) {
    //   if (item) {
    //     this.activeTeacerDate = item;
    //   }
    //   getChatHistoryMsg({
    //     direction: '-1',
    //     order: '1',
    //     // id: this.lastListId,
    //     id: item ? 0 : this.lastTeacherId,
    //     livetoken: this.defaultToken,
    //     roomid: this.roomId,
    //     roleId: 3,
    //     msgDate: item || this.activeTeacerDate
    //   }).then((res) => {
    //     if (+res.im_data.length === 0) {
    //       this.$Message.error('没有更多消息了~');
    //       return;
    //     }
    //     this.lastTeacherId = res.im_data[0].id;
    //     if (item) {
    //       this.teacherMessageList = res.im_data;
    //       return;
    //     }
    //     this.teacherMessageList = [
    //       ...res.im_data,
    //       ...this.teacherMessageList,
    //     ];
    //   });
    // },
    /**
     * 获取老师信息
     */
    getTeacherInfo() {
      const stringTeacherList = sessionStorage.getItem('teacherList');
      const teacherList = stringTeacherList ? JSON.parse(stringTeacherList) : '';
      if (teacherList && teacherList.length > 0) {
        this.teacherList = teacherList;
        return;
      }
      getLiveList({
        livetoken
      }).then((res) => {
        if (res.data && res.data.length > 0) {
          this.teacherList = res.data;
          sessionStorage.setItem('teacherList', JSON.stringify(res.data));
        }
      });
    },
    // 获得权限问题
    getAuth() {
      getLiveList({
        livetoken
      }).then((res) => {
        this.auth = res.data;
        this.auth.forEach(item => {
          if (item.isVideo === '1' && item.auth === '0' && item.isEncryptTime === '1') {
            this.$Modal.error({
              title: '提示',
              content: '暂时没有此直播间权限',
              okText: '知道了'
            });
            this.$router.push('/');
          }
        });
      });
    },
    getUserInfoByToken() {
      return Promise.all([
        getUserInfo({
          livetoken
        }).then((res) => {
          this.userInfo.name = res.name;
          this.userInfo.userId = res.userId;
          this.userInfo.roleId = res.roleId;
        }), RequestAddr({
          livetoken,
          roomId,
        }).then((res) => {
          this.userInfo.accToken = res.accToken;
          this.userInfo.accId = res.accId;
          this.userInfo.im_addr = res.im_addr;
        })
      ]);
    },
    initIM() {
      // 初始化聊天室
      const conf = {
        account: this.$root.isPublic ? '' : this.userInfo.accId,
        token: this.$root.isPublic ? '' : this.userInfo.accToken,
        chatroomId: roomId,
        chatroomAddresses: this.userInfo.im_addr,
        isAnonymous: this.$root.isPublic ? true : '',
        chatroomNick: this.$root.isPublic ? this.$root.temName : '',
      };
      console.log(2222, conf);
      this.IMinstance = imHelper({
        ...conf,
        onconnect: (chatroom) => {
          console.log('进入聊天室', chatroom);
        },
        onerror: (err, obj) => {
          console.log('发生错误', error, obj);
        },
        onwillreconnect: (obj) => {
          // 此时说明 `SDK` 已经断开连接, 请开发者在界面上提示用户连接已断开, 而且正在重新建立连接
          console.log('即将重连', obj);
        },
        ondisconnect: (err) => {
          // 此时说明 `SDK` 处于断开状态, 开发者此时应该根据错误码提示相应的错误信息, 并且跳转到登录页面
          console.log('连接断开', error);
        },
        onmsgs: (msg) => {
          this.handleOnmsgs(msg);
        },
      });
    },
    /**
     * 播放视频变更
     * @param {*视频index} curIndex 
     */
    // videoChanged(curIndex) {
    //   this.videoIndex = curIndex;
    // },
    /**
     * 发送消息
     * @param {*消息内容} content 
     */
    sendMessage(content) {
      const params = {
        content,
        livetoken,
        roomId,
        // userName: ''
      };
      if (this.$root.isPublic) {
        if (!this.$root.temName) {
          this.$emit('initTemName', `游客-${Math.floor(Math.random() * 10000)}`);
        }
        params.username = this.$root.temName;
      }
      sendMsg(params).then((res) => {
        if (res.code === 0) {
          console.log(res, '发送消息');
        } else {
          this.$Message.error('您已被禁言！！');
        }
      }).catch(() => {});
    },
    // 情况消息列表
    clearMsgList() {
      this.messageList = [];
    },
    handleOnmsgs(msgs) { // 接收消息
      console.log('收到聊天室消息', msgs);
      if (msgs.length > 0) {
        const msgItem = msgs[0];
        if (msgItem.type === 'custom') {
          const custom = JSON.parse(msgItem.custom);
          switch (custom.ext.mstype) {
            case 10:
              console.log('直播结束 播放录播！');
              this.getLiveInfo();
              break;
            case 9:
              console.log('直播开始 开始直播！');
              this.getLiveInfo();
              break;
            default:
              //  显示自己的消息(未审核)或显示审核后的消息
              console.log(1111, this.userInfo);
              if (((!this.$root.isPublic && this.userInfo.name === msgItem.fromNick) ||
                  (this.$root.isPublic && this.$root.temName === custom.name) || custom.isAudit === 1) &&
                this.messageList.filter((msg) => msg.msgId === custom.oldMsgId).length === 0) {
                this.messageList.push(custom); // 判断消息的显示的逻辑，用户自己发出的消息没有审核也可以看到
              }
              break;
          }
        }
      }
    },
    changeVideo(index) {
      // console.log('****************************')
      // if (this.videoObj.type !== 2) {
      //   this.videoObj = {
      //     type: 2,
      //     video: this.goodVideoList.map(videoItem => videoItem.videoUrl),
      //   }
      // }
      this.videoObj = {
        type: 2,
        video: this.goodVideoList.map(videoItem => videoItem.videoUrl),
      }
      this.currentGoodVideo = index;
    },
    handelToggleTabs() {
      this.hideLeft = !this.hideLeft;
      // console.log(this.$refs.leftMenu);
      // this.$refs.
    },
    toggleButtonShow(status) {
      // console.log('触发');
      this.showTottleButton = status;
    }
  },
});
