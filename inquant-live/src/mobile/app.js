import Vue from 'vue';
import {
  Navbar,
  TabItem,
  TabContainer,
  TabContainerItem,
  Toast,
} from 'mint-ui';
import imHelper from 'lib/imHelper.js';
import { debug } from 'util';
import VideoPlayer from './components/video';
import Chat from './components/chat';
import LiveInfo from './components/live-info';
import TeacherInfo from './components/teacher-info/index.vue';
import Team from './components/team';
import Notice from './components/notice';
import VideoList from './components/videoList';
import search from '../lib/urlSearch'
import {
  getPlayLive,
  getChatHistoryMsg,
  getUserInfo,
  sendMsg,
  RequestAddr,
  getTeacherList,
  getVideoList,
  getNotice,
  onlineCount,
  getGreatVideo,
  Heartbeat
} from '../live/api';
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

const tabList = [
  '聊天',
  '预告',
  '介绍',
  '精彩视频',
  // '加战队',
];

Vue.component(Navbar.name, Navbar);
Vue.component(TabItem.name, TabItem);
Vue.component(TabContainer.name, TabContainer);
Vue.component(TabContainerItem.name, TabContainerItem);

export default Vue.extend({
  props: ['liveInfo'],
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
      tabList,
      currentTab: 0,
      videoObj: {
        type: 0,
        vedio: '',
      },
      videoList: [],
      teacherList: [],
      messageList: [],
      userInfo: {},
      IMinstance: undefined,
      team: {},
      noticeImg: '',
      goodVideoList: [],
      currentGoodVideo: -1,
      chatID: 0, // 消息id
      numOnline: 0, // 在线人数
      onlineTimer: undefined, // 在线人数定时器
      getTime: '',
    };
  },
  computed: {
    totalHeight() {
      return `${document.body.offsetHeight}px`;
    },
    contentHeight() {
      return `${document.body.offsetHeight - 248}px`;
    }
  },
  watch: {
    liveInfo(nInfo) {
      this.init();
    },
  },
  mounted() { 
      if (this.getTime) {
        window.clearInterval(this.getTime);
      }
      this.getHeat(1);
      this.getTime = setInterval(this.getHeat, 20000);
  },
   destroyed() {
     window.clearInterval(this.getTime);
   },
  methods: {
    getHeat(type = 2) {
      Heartbeat({
        livetoken: this.$root.livetoken,
        userName: this.$root.temName,
        type,
        invitationcode: search('invitationcode'),
        source: 2,
        sessionId: this.sessionId
      }).then(res => {
        this.sessionId = res.data.sessionId;
      })
    },
    init() {
      this.getUserInfoByToken()
        .then(() => {
          if (!this.$root.temName) {
            this.$emit('initTemName', `游客-${Math.floor(Math.random() * 10000)}`);
          }
          this.initIM();
        });
      this.getLiveInfo();
      this.getMessageList();
      this.getTeacherInfo();
      this.getOnlineCount();
      getNotice({
        id: this.$root.roomid,
      }).then((res) => {
        if (res.code === 1) {
          this.noticeImg = res.data.notice;
        }
      });
    },
    /**
     * 获取视频信息
     */
    getOnlineCount() {
      onlineCount({
        roomIds: this.$root.roomid,
      }).then((res) => {
        this.numOnline = res.data[0].onlineUserCount;
      })
      setTimeout(() => {
        this.getOnlineCount();
      }, 60000);
    },
    getLiveInfo() {
      Promise.all([
        getPlayLive({
          roomid: this.$root.roomid,
          livetoken: this.$root.livetoken,
        }),
        getGreatVideo({
          roomId: this.$root.roomid,
        })
      ]).then((results) => {
        if (results[1].code === 0) {
          this.goodVideoList = results[1].data.filter(video => video.bright === 1);
        }
        if (results[0].result === 1 && results[0].data.length > 0) {
          const regFile = /.m3u8$/;
          this.videoList = results[0].data;
          // 判断是否直播
          // if (regFile.test(results[0].data[0].HLSUrl)) {
          const isPc = IsPC(); // 判断是否pc打开的
          if (results[0].data[0].RTMPUrl) { // rtmurl 是flash播放地址
            if (!isPc || !results[0].data[0].RTMPUrl ) {
              this.videoObj = {
                type: 1,
                video: [httpsUrl(results[0].data[0].HLSUrl)], // h5播放url
              }
            } else {
              this.videoObj = {
                type: 1,
                video: [results[0].data[0].RTMPUrl],
              }
            }
          } else {
            this.currentGoodVideo = 0;
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
      /* 获取消息列表 */
      getChatHistoryMsg({
        direction: '-1',
        order: '1',
        id: this.chatID,
        // id: '11196',
        livetoken: this.$root.livetoken,
        roomid: this.$root.roomid,
        // type: 'up',
      }).then((res) => {
        if (res.result === 1) {
          if (callBack) callBack(); // 聊天列表组件传过来的请求到数据刷新状态消失的方法
          if (res.im_data.length === 0) {
            Toast({
              message: '没有更多消息了~',
              duration: '700',
            })
            return;
          }
          this.chatID = res.im_data[0].id;
          this.messageList = [
            ...res.im_data,
            ...this.messageList,
          ]
        }
      });
    },
    /**
     * 获取老师信息
     */
    getTeacherInfo() {
      getTeacherList({
        id: 0,
        roomId: this.$root.roomid
      }).then((res) => {
        this.team = {
          qrcode: res.qrcode,
          slogan: res.slogan,
        };
        if (res.teacherlist && res.teacherlist.length > 0) {
          this.teacherList = res.teacherlist;
        }
      });
    },
    getUserInfoByToken() {
      return Promise.all([
        getUserInfo({
          livetoken: this.$root.livetoken
        }).then((res) => {
          this.userInfo.name = res.name;
          this.userInfo.userId = res.userId;
          this.userInfo.roleId = res.roleId;
        }), RequestAddr({
          livetoken: this.$root.livetoken,
          roomid: this.$root.roomid,
        }).then((res) => {
          this.userInfo.accToken = res.accToken;
          this.userInfo.accId = res.accId;
          this.userInfo.im_addr = res.im_addr;
        })
      ]);
    },
    initIM() {
      /* 初始化聊天室 */
      // const conf = {
      //   account: this.userInfo.accId,
      //   token: this.userInfo.accToken,
      //   chatroomId: this.$root.roomid,
      //   chatroomAddresses: this.userInfo.im_addr,
      // };
      const conf = {
        account: this.$root.isPublic ? '' : this.userInfo.accId,
        token: this.$root.isPublic ? '' : this.userInfo.accToken,
        chatroomId: this.$root.roomid,
        chatroomAddresses: this.userInfo.im_addr,
        isAnonymous: this.$root.isPublic ? true : '',
        chatroomNick: this.$root.isPublic ? this.$root.temName : '',
      };
      // debugger;
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
          /* 此时说明 `SDK` 已经断开连接, 请开发者在界面上提示用户连接已断开, 而且正在重新建立连接 */
          console.log('即将重连', obj);
        },
        ondisconnect: (err) => {
          /* 此时说明 `SDK` 处于断开状态, 开发者此时应该根据错误码提示相应的错误信息, 并且跳转到登录页面 */
          console.log('连接断开', error);
        },
        onmsgs: (msg) => {
          this.handleOnmsgs(msg);
        },
      });
    },
    /**
     * 发送消息
     * @param {*消息内容} content 
     */
    sendMessage(content) {
      const params = {
        content,
        livetoken: this.$root.livetoken,
        roomid: this.$root.roomid,
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
    handleOnmsgs(msgs) {
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
              if (((!this.$root.isPublic && this.userInfo.name === msgItem.fromNick) || (this.$root.isPublic && this.$root.temName === custom.name) || custom.isAudit === 1) && this.messageList.filter((msg) => msg.Id === custom.Id && msg.addtime === custom.addtime).length === 0) {
                this.messageList.push(custom);
              }
              break;
          }
        }
      }
    },
    changeVideo(index) {
      this.videoObj = {
        type: 2,
        video: this.goodVideoList.map(videoItem => videoItem.videoUrl),
      }
      this.currentGoodVideo = index;
    },
  },
});
