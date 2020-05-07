import Vue from 'vue';
import jsCookie from 'js-cookie';
import {
  format
} from 'lib/date.js'
import {
  encode,
  decode
} from 'lib/crypto.js'
import {
  ws
} from 'lib/host.js'
import imHelper from 'lib/imHelper.js';
import search from 'lib/urlSearch.js';
import {
  getLiveList,
  getPlayLive,
  getChatHistoryMsg,
  sendMsg,
  getUserInfo,
  RequestAddr,
  getactiveMan, // 获取直播间人员
  getRoomInfo,
  strategySignal, // 获取策略信号,
  strategySignalList,
  getTeacherList,
  learnlist,
  liveList
} from '../../api/index';
import {
  parseTime
} from '../../../lib/date.js'
import Chat from './components/chat'
import PlayVideo from './components/video'
import template from './index.html'
import Pdf from '../pdf/index.vue'
import './index.scss'
import defaultImg from '../../../images/default.png'

const userInfo = jsCookie.getJSON('userInfo');
const roomInfo = JSON.parse(localStorage.getItem('roomInfo'));
const heartInfo = encode(JSON.stringify({
  msgType: '0',
  content: 'heartbeat'
}));
const isWeb = +search('isWeb');
const isDayMode = +search('skin') === 1 ? 'day' : 'night';

// userToken: bnWCZYk_T35c4QNuZ1kvrQ**
// liveToken: zjA849mJuV92Aj2y7atHbA**

const signType = [
  'msgType',
  'strategyID',
  'strategyName',
  'openClose',
  'signalID',
  'symbol',
  'name',
  'longShort',
  'tradeTime',
  'roomID',
  'openPrice',
  'limitProfitPx',
  'limitLossPx',
  'closePrice',
  'contractID'
];
const reader = new FileReader();
const httpsUrl = (url) => {
  if (url.indexOf('http://') === 0) {
    return url.replace('http://', 'https://')
  }
  return url
}

export default Vue.extend({
  template,
  data() {
    return {
      navTab: 0,
      bg: undefined,
      msg: 'liveHome',
      cover: '',// 老师直播头像
      isLive: 0,
      defaultImg,
      teacherList: [],
      teacherId: undefined,
      lookDescNav: ['所有对话', '只看分析师'],
      chooseFont: ['大', '中', '小'],
      studyList: [],
      dateNav: [{
          title: '最近一周',
          time: 604800000
        },
        {
          title: '最近一个月',
          time: 2592000000
        },
        {
          title: '最近三个月',
          time: 7776000000
        }
      ],
      isPdfListShow: true,
      selectFont: 1,
      selectLook: 1,
      selectDate: 0,
      // defaultBanner,
      httpsUrl, // 替换http链接
      signalTotal: 0, // 信号总数量
      format, // 时间格式化函数
      messageList: [], // 消息列表
      signalList: [], // 信号列表
      roomInfo: {

      }, // 直播间信息
      isDayMode,
      teacherInfo: { // 老师信息
        headImg: '',
      },
      userInfo: {}, // 用户信息
      videoObj: {}, // 视频内容
      lastListId: 0, // 用户消息的最后条的id
      teacherMessageDate: [], // 老师消息事件列表
      activeTeacerDate: undefined, // 当前访问的老师消息时间
      teacherMessageList: [], // 老师消息列表
      lastTeacherId: 0, // 老师消息最后一条
      liveType: 0, // 0为录播  1为直播,
      socket: undefined, // 实例化socket
      socketStatus: true, // 服务端是否返回心跳，false为已经返回，true为暂未返回心跳
      socketNum: 0, // 服务端未返回心跳，客户端已经单向发送的条数
      currentPage: 1, // 当前的页码，用来判断为1是显示信号推送,
      roomName: '',
      pdf: '',
      powerMessages: [],
      startTime: undefined,
      endTime: undefined,
      isWeb: 0,
    }
  },
  components: {
    Chat,
    PlayVideo,
    Pdf
  },
  mounted() {
    this.isWeb = isWeb;
    if (isWeb === 1 ) {
      this.bg = 'background-color:transparent !improtant';
      this.$refs.introduce.style.height = '719px'
      console.log(this.$refs.middle)
      this.$refs.middle.style.position = 'relative';
    } else if (!this.isWeb && this.isDayMode === 'day') {
      this.bg = 'background-color:#f7f7f7;height:1300px';
    } else if (!this.isWeb && this.isDayMode === 'night') {
      this.bg = 'background-color:#141414';
    } 
    
    this._getTeacherList();
    this.init(1);
    this.getRoomList();
    this._learnlist();
    this.pdf = `/live-home/${this.roomId}/pdf`
    // this.initSocket();
    // this.getStrategySignal();
  },
  computed: {
    roomId() {
      return this.$route.params.roomId
    },
    rootUserInfo() {
      return this.$root.userInfo
    },
    userToken() {
      return this.$root.userInfo.userToken;
    },
    defaultToken() {
      return this.$root.userInfo.liveToken;
    }
  },
  filters: {
    chooseFont(index) {
      if (index === 0) {
        return 'bigger'
      } else if (index === 1) {
        return 'normol'
      }
      return 'small'
    }
  },
  watch: {
    rootUserInfo(info) {
      // console.log(info)
      if (!info) {
        this.$Notice.open({
          title: '已经退出，即将进行跳转~~~',
          duration: 2
        });
        setTimeout(() => {
          this.$router.push('/')
        }, 2000);
      }
    },
    teacherId() {
      this.lastTeacherId = 0;
      this.powerMessages = [];
      this.getPowerMessage('', 1, this.startTime, this.endTime, this.teacherId);
    },
    $route() {
      if (this.$route.path.includes('pdf')) {
        this.isPdfListShow = false
      } else {
        this.isPdfListShow = true;
      }
    }

  },
  destroyed() {
    // this.socket.close();
    // this.$Notice.close('sign');
  },
  methods: {
    init(val) {
      this.getUserInfoByToken()
        .then(() => {
          this.initIM();
        });
      this.getLiveInfo();
      this.getMessageList(val);
      this.handleLoadRoomInfo();
      // this.getSignalList();
    },
    changeNav(name) {
      if (name === 'key2') {
        this.powerMessages = []
        this.chooseNav(0, 'date');
      } else if (name === 'key1') {
        this.teacherMessageList = [];
        this.getTeacherMessage(1);
      }
    },
    goLive() {
      if (isWeb === 1) {
        return;
      }
      this.$router.push({
          name: 'Live'
        })
    },
    getPowerPoint() {
      this.getPowerMessage(0, 1, this.startTime, this.endTime, this.teacherId)
    },
    handleLoadRoomInfo() {
      Promise.all([
        getactiveMan({
          roomId: this.roomId
        }).then((res1) => {
          if (res1.data && +res1.result === 1) {
            this.teacherMessageDate = res1.data.latestSendDates;
            if (res1.data.latestSendDates.length > 0) this.activeTeacerDate = res1.data.latestSendDates[0];
            if (res1.data.personnel.length > 0) this.teacherInfo = res1.data.personnel[0]
          }
        }),
        getRoomInfo({
          roomId: this.roomId
        }).then((res2) => {
          if (res2.data) this.roomInfo = res2.data;
        })
      ]).then((res) => {
        this.getTeacherMessage();
      })
    },

    _learnlist() {
      learnlist({
        roomid: this.$route.params.roomId,
        pageSize: 20
      }).then(res => {
        this.studyList = res.data;
      })
    },

    goPdf(item) {
      this.$router.push({
        path: this.pdf,
        query: {
          url: item.pdfUrl
        }
      })
    },

    async getRoomList() {
      const res = await getLiveList({
        livetoken: this.defaultToken,
      })
      this.roomName = res.data.find(v => +v.roomId === +this.$route.params.roomId).Title;
      this.cover = res.data.find(v => +v.roomId === 10517689).cover;
      this.isLive = +res.data.find(v => +v.roomId === 10517689).isLive;
    },

    getLiveInfo() {
      getPlayLive({
        roomid: this.roomId,
        livetoken: this.defaultToken
      }).then((res) => {
        if (res.result === 1 && res.data.length > 0) {
          const regFile = /.m3u8$/;
          this.videoList = res.data;
          // 判断是否直播
          // if (regFile.test(results[0].data[0].HLSUrl)) {
          if (res.data[0].RTMPUrl) {
            this.liveType = 1;
            this.videoObj = {
              type: 1,
              video: [httpsUrl(res.data[0].HLSUrl)],
            }
          } else {
            console.log('录播')
          }
        }
      })
    },
    chooseNav(index, name) {
      if (name === 'look') {
        this.selectLook = index;
      } else if (name === 'date') {
        this.selectDate = index;
        console.log(index)
        const nowTime = new Date().getTime() + 86400000;
        console.log(nowTime)
        const oldTime = nowTime - this.dateNav[index].time;
        const params = {
          startTime: parseTime(oldTime, '{y}-{m}-{d}'),
          endTime: parseTime(nowTime, '{y}-{m}-{d}')
        };
        this.startTime = params.startTime;
        this.endTime = params.endTime;
        this.lastTeacherId = 0;
        this.powerMessages = [];
        this.getPowerMessage('', 1, params.startTime, params.endTime, this.teacherId)
      } else {
        this.selectFont = index;
      }
    },
    getUserInfoByToken() {
      return Promise.all([
        getUserInfo({
          livetoken: this.defaultToken
        }).then((res) => {
          this.userInfo.name = res.name;
          this.userInfo.userId = res.userId;
          this.userInfo.roleId = res.roleId;
        }), RequestAddr({
          livetoken: this.defaultToken,
          roomid: this.roomId,
        }).then((res) => {
          this.userInfo.accToken = res.accToken;
          this.userInfo.accId = res.accId;
          this.userInfo.im_addr = res.im_addr;
          this.userInfo.roomid = res.roomId;
        })
      ]);
    },

    _getTeacherList() {
      getTeacherList({
        id: 0,
        roomId: this.$route.params.roomId
      }).then(res => {
        this.teacherList = res.teacherlist;
      })
    },
    getMessageList() {
      // 获取消息列表
      getChatHistoryMsg({
        direction: '-1',
        dataType: 2,
        order: '1',
        id: this.lastListId,
        livetoken: this.defaultToken,
        roomid: this.roomId,
      }).then((res) => {
        if (res.result === 1) {
          if (+res.im_data.length === 0) {
            this.$Message.error('没有更多消息了~');
            return;
          }
          this.lastListId = res.im_data[0].id;
          const messageList = res.im_data.filter((v) => +v.isAudit === 1 || +v.Id === +this.userInfo.userId)
          this.messageList = [
            ...messageList,
            ...this.messageList,
          ];
        }
      });
    },
    getTeacherMessage(item) {
      if (item) {
        this.activeTeacerDate = item;
      }
      getChatHistoryMsg({
        direction: '-1',
        order: '1',
        // id: this.lastListId,
        id: item ? 0 : this.lastTeacherId,
        livetoken: this.defaultToken,
        roomid: this.roomId,
        // roleId: 3,
        dataType: 1,
      }).then((res) => {
        if (+res.im_data.length === 0) {
          this.$Message.error('没有更多消息了~');
          return;
        }
        console.log(res)
        // this.teacherMessageList = res.im_data
        this.lastTeacherId = res.im_data[0].id;
        if (item) {
          this.teacherMessageList = res.im_data;
          return;
        }
        this.teacherMessageList = [
          ...res.im_data,
          ...this.teacherMessageList,
        ];
      });
    },

    getPowerMessage(item, isViewPoint, startDate, endDate, teacherId) {
      if (item) {
        this.activeTeacerDate = item;
      }
      getChatHistoryMsg({
        direction: '-1',
        order: '1',
        // id: this.lastListId,
        id: item ? 0 : this.lastTeacherId,
        livetoken: this.defaultToken,
        roomid: this.roomId,
        // roleId: 3,
        isViewPoint,
        dataType: 0,
        startDate,
        endDate,
        formUserId: this.teacherId,
      }).then((res) => {
        if (+res.im_data.length === 0) {
          this.$Message.error('没有更多消息了~');
          return;
        }
        console.log(res)
        // this.teacherMessageList = res.im_data
        this.lastTeacherId = res.im_data[0].id;
        if (item) {
          this.teacherMessageList = res.im_data;
          return;
        }
        this.powerMessages = [
          ...res.im_data,
          ...this.powerMessages,
        ];
      });
    },
    initIM() {
      // 初始化聊天室
      const conf = {
        account: this.userInfo.accId,
        token: this.userInfo.accToken,
        chatroomId: this.userInfo.roomid,
        chatroomAddresses: this.userInfo.im_addr,
      };
      console.log(conf)
      // console.log(2222, conf);
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
          console.log('连接断开', err);
        },
        onmsgs: (msg) => {
          this.handleOnmsgs(msg);
        },
      });
    },
    getRoleName(roleId) {
      switch (+roleId) {
        case 1:
          return '观众';
        case 2:
          return '助理';
        case 3:
          return '老师';
        case 4:
          return '高手'
        default:
          return '老师'
      }
    },
    sendMessage(content) {
      const params = {
        content,
        livetoken: this.defaultToken,
        roomid: this.roomId,
      };
      if (typeof this.replyItem !== 'undefined') {
        // const replyMsg = `@${this.replyItem.name}：${content}`;
        // const originMsg = `${this.replyItem.name}：${this.replyItem.attach}`;
        // const maxLength = Math.max(replyMsg.length, Math.min(originMsg.indexOf('\n'),originMsg.length));
        // content = `${replyMsg}
        // ${new Array(maxLength).join('---')}
        // ${originMsg}`;
        params.sourceMsgId = this.replyItem.msgId;
        params.atUserName = this.replyItem.name;
        this.replyItem = undefined;
        this.editorPlaceHolder = '来跟大神聊聊天';
      }
      sendMsg(params).then((res) => {
        if (res.code === 0) {
          console.log(res, '发送消息');
        } else {
          this.$Message.error('发言失败！');
        }
      }).catch(() => {});
    },
    handleOnmsgs(msgs) {
      console.log('收到聊天室消息', msgs);
      for (let i = 0, length = msgs.length; i < length; i += 1) {
        const msgItem = msgs[i];
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
              if (this.messageList.filter((msg) => msg.msgId === custom.oldMsgId).length === 0 &&
                (msgItem.fromNick === this.userInfo.name ||
                  +custom.isAudit === 1)) {
                const roleStatus = +custom.roleId === 3 || +custom.roleId === 2 || +custom.roleId === 4;
                if (roleStatus && +custom.ext.mstype === 3) {
                  this.messageList.push(custom);
                }
                if (roleStatus && format(new Date(this.activeTeacerDate), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')) {
                  this.teacherMessageList.push(custom)
                } else if (!roleStatus) {
                  this.messageList.push(custom); // 管理员显示未审核的逻辑
                }
              }
              break;
          }
        }
      }
    },
    getShowDate(date) {
      // console.log(format(new Date(), 'yyyy-MM-dd') === 'date')
      if (format(new Date(), 'yyyy-MM-dd') === date) {
        return '今天'
      }
      return format(new Date(date), 'MM-dd');
    },
    getMessage(msg) {
      if (!msg) return '暂无数据~~'
      return msg.replace(/\n/g, '<br/>')
    },
  }
})

