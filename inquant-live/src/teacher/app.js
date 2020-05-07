import Vue from 'vue';
import imHelper from 'lib/imHelper.js';
import {
  format
} from 'lib/date.js'
import {
  arrRemove,
} from 'lib/arrayExtend.js';
import VideoPlayer from '../live/components/video';
import Chat from './components/chat';
import LiveInfo from '../live/components/live-info';
import TeacherInfo from '../live/components/teacher-info';
import Navigate from './components/navigate';
import Notice from '../live/components/notice';
import VideoList from '../live/components/videoList';
import MessageList from './components/chat/message-list'
import {
  getPlayLive,
  getChatHistoryMsg,
  GetLiveTeacherList,
  getUserInfo,
  getGreatVideo,
  sendMsg,
  RequestAddr,
  getRooms,
  del,
  blockUser,
  audit,
  getRoomBlockUser,
  removeBlockUser,
  getTeacherList,
  getVideoList,
  getNotice,
} from '../live/api';
import template from './layout.html';
import './layout.scss';

const httpsUrl = (url) => {
  if (url.indexOf('http://') === 0) {
    return url.replace('http://', 'https://')
  }
  return url
}
const nowDate = new Date();
export default Vue.extend({
  template,
  components: {
    VideoPlayer,
    Chat,
    LiveInfo,
    TeacherInfo,
    Navigate,
    Notice,
    VideoList,
    MessageList
  },
  data() {
    return {
      videoObj: {
        type: 0,
        vedio: '',
      },
      options: {
        disabledDate(date) {
          return date && date.valueOf() > Date.now();
        }
      },
      format,
      videoList: [],
      // videoIndex: 0,
      teacherInfo: {},
      teacherList: [],
      messageList: [],
      userInfo: {},
      IMinstance: undefined,
      roomList: [],
      curRoom: {
        roomName: '',
        liveDesc: '',
      },
      jinyanList: [],
      strategyUrl: '//h5.inquant.cn/future/background/tradeBack/index.html',
      editorPlaceHolder: '来跟大神聊聊天',
      replyItem: undefined,
      noticeImg: '',
      goodVideoList: [],
      currentGoodVideo: -1,
      lastListId: 0,
      lastTeacherId: 0, // 老师最后的消息id
      activeTeacerDate: nowDate, // 当前访问的时间
      teacherMessageList: [],
      selectDate: nowDate,
    };
  },
  watch: {
    curRoom(nRoom, oRoom) {
      if (nRoom && nRoom !== oRoom) {
        window.Bus.$emit('roomSelected', nRoom.roomId);
        this.$nextTick(() => {
          this.init();
        });
      }
    }
  },
  mounted() {
    this.getRoomList();
  },
  methods: {
    init() {
      const initStatus = {
        date: '',
        type: 'init'
      }
      this.getUserInfoByToken()
        .then(() => {
          this.initIM();
        });
      this.getLiveInfo();
      this.getJinyanList();
      this.getMessageList(initStatus);
      this.getTeacherMessage(initStatus);
      this.getTeacherInfo();
      getNotice({
        id: this.$root.roomid,
      }).then((res) => {
        if (res.code === 1) {
          this.noticeImg = res.data.notice;
        }
      });
    },
    /**
     * 获取直播间列表
     */
    getRoomList() {
      return getRooms({
        livetoken: this.$root.livetoken,
      }).then((res) => {
        if (res.result === 1 && res.data.length > 0) {
          this.roomList = res.data;
          if (+this.$route.params.roomid !== 0) {
            this.curRoom = res.data.find((v) => +v.roomId === +this.$route.params.roomid);
            console.log(this.curRoom)
          } else {
            this.curRoom = res.data[0];
          }
          // this.curRoom = res.data[0];
          localStorage.setItem('roomList', JSON.stringify(res.data));
        }
      });
    },
    /**
     * 获取视频信息
     */
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
          if (results[0].data[0].RTMPUrl) {
            this.videoObj = {
              type: 1,
              video: [results[0].data[0].RTMPUrl],
            }
          } else {
            this.videoObj = {
              type: 2,
              video: results[1].data.map(videoItem => httpsUrl(videoItem.videoUrl)),
            }
            // this.currentGoodVideo = 0;
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
    getMessageList(item = {
      date: '',
      type: false
    }) {
      const {
        date,
        type
      } = item;
      // debugger;
      // 获取消息列表
      getChatHistoryMsg({
        direction: '-1',
        dataType: 2,
        order: '1',
        id: type === 'init' ? 0 : this.lastListId,
        livetoken: this.$root.livetoken,
        roomid: this.$root.roomid,
      }).then((res) => {
        if (res.result === 1) {
          if (type === 'init') {
            this.messageList = res.im_data
            if (+res.im_data.length <= 0) {
              this.$Message.error('没有更多消息了~');
            } else {
              this.lastListId = res.im_data[0].id;
            }
            return;
          }
          if (+res.im_data.length === 0) {
            this.$Message.error('没有更多消息了~');
            return;
          }
          this.lastListId = res.im_data[0].id;
          this.messageList = [
            ...res.im_data,
            ...this.messageList,
          ];
        }
      });
    },
    /**
     * 获取老师消息列表
     */
    getTeacherMessage(item = {
      date: '',
      type: false
    }) {
      const {
        date,
        type
      } = item;
      let msgDate = '';
      let id = 0;
      if (type === 'init') {
        msgDate = undefined
      } else if (date) {
        msgDate = this.formatDate(date)
      } else {
        msgDate = this.formatDate(this.activeTeacerDate)
        id = this.lastTeacherId;
      }
      getChatHistoryMsg({
        direction: '-1',
        order: '1',
        id,
        livetoken: this.$root.livetoken,
        roomid: this.$root.roomid,
        dataType: 1,
        msgDate,
      }).then((res) => {
        if (type === 'init') {
          this.teacherMessageList = res.im_data;
          this.lastTeacherId = res.im_data[0].id;
          if (+res.im_data.length === 0) {
            this.$Message.error('没有更多消息了~');
            return;
          }
          this.lastTeacherId = res.im_data[0].id;
          return;
        }
        if (+res.im_data.length === 0) {
          this.$Message.error('没有更多消息了~');
          return;
        }
        this.lastTeacherId = res.im_data[0].id;
        if (!date) {
          this.activeTeacerDate = this.selectDate;
        } else {
          this.activeTeacerDate = this.selectDate;
          this.teacherMessageList = res.im_data;
          return;
        }
        this.teacherMessageList = [
          ...res.im_data,
          ...this.teacherMessageList,
        ];
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
        if (res.teacherlist && res.teacherlist.length > 0) {
          this.teacherList = res.teacherlist;
        }
      });
      // GetLiveTeacherList().then((res) => {
      //   if ((res.result === 1 || res.result === '1') && res.list.length > 0) {
      //     this.teacherInfo = res.list[0];
      //   }
      // });
    },
    /**
     * 根据livetoken获取用户信息
     */
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
          this.userInfo.roomid = res.roomId;
        })
      ]);
    },
    /**
     * 初始化IM
     */
    initIM() {
      // 初始化聊天室
      const conf = {
        account: this.userInfo.accId,
        token: this.userInfo.accToken,
        chatroomId: this.userInfo.roomid,
        chatroomAddresses: this.userInfo.im_addr,
      };
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
    /**
     * 获取禁言列表
     */
    getJinyanList() { // 老师的逻辑 此处往后
      getRoomBlockUser({
        livetoken: this.$root.livetoken,
        roomid: this.$root.roomid,
      }).then((res) => {
        if (res.result === 1) {
          this.jinyanList = res.data;
        }
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
    sendMessage(content, isViewPoint) {
      isViewPoint = isViewPoint ? 1 : 0;
      const params = {
        content,
        livetoken: this.$root.livetoken,
        roomid: this.$root.roomid,
        isViewPoint
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
    // 情况消息列表
    clearMsgList() {
      this.messageList = [];
    },
    /**
     * 接收消息处理函数
     * @param {*消息体} msgs 
     */
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
              // debugger;
              //  显示自己的消息(未审核)或显示审核后的消息
              if (this.messageList.filter((msg) => msg.msgId === custom.msgId).length === 0) {
                const roleStatus = +custom.roleId === 3 || +custom.roleId === 2 || +custom.roleId === 4;
                if (roleStatus && +custom.ext.mstype === 3) {
                  this.messageList.push(custom);
                }
                console.log(this.activeTeacerDate);
                if (roleStatus && format(new Date(this.activeTeacerDate), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')) {
                  this.teacherMessageList.push(custom)
                } else if (!roleStatus) {
                  this.messageList.push(custom);
                }
                // 管理员显示未审核的逻辑
              }
              break;
          }
        }
      }
    },
    /**
     * 选择直播间处理函数
     * @param {*选中直播间} room 
     */
    roomSelected(room) {
      console.log(321, room);
      this.curRoom = room;
    },
    /**
     * 登出
     */
    logout() {
      window.Bus.$emit('logout', () => {
        this.$router.push({
          path: '/login'
        });
      });
    },
    /**
     * 删除消息
     * @param {*消息体} msg 
     */
    delMsg(msg) {
      del({
        livetoken: this.$root.livetoken,
        msgid: msg.msgId,
        roomid: this.$root.roomid,
      }).then((res) => {
        if (res && res.result === 1) {
          arrRemove(this.messageList, msg);
        } else {
          this.$Message.error('删除失败，请刷新后重试~');
        }
      });
    },
    delTeacerMsg(msg) {
      del({
        livetoken: this.$root.livetoken,
        msgid: msg.msgId,
        roomid: this.$root.roomid,
      }).then((res) => {
        if (res && res.result === 1) {
          arrRemove(this.teacherMessageList, msg);
          // debugger;
        } else {
          this.$Message.error('删除失败，请刷新后重试~');
        }
      });
    },
    /**
     * 禁言
     * @param {*目标消息体} msg 
     */
    jinyan(msg) {
      console.log(msg)
      blockUser({
        livetoken: this.$root.livetoken,
        target: msg.Id,
        roomid: this.$root.roomid,
      }).then((res) => {
        if (res && res.result === 1) {
          this.getJinyanList();
        }
      });
    },
    /**
     * 审核消息
     * @param {*消息体} msg 
     */
    checkMsg(msg) {
      if (msg.isAudit !== 1) {
        audit({
          livetoken: this.$root.livetoken,
          msgid: msg.msgId,
          roomid: this.$root.roomid,
          flag: msg.flag || 0
        }).then((res) => {
          if (res && res.result === 1) {
            this.tgtxt = '已通过';
            msg.isAudit = 1;
            // msg.oldMsgId = msg.msgId;
            msg.msgId = res.newmsgid;
            // msg.aaa = 'bbb';
            // console.log(this.messageList)

            this.$Message.success(res.message || '操作成功');
          } else {
            this.$Message.error(res.message || '出错了');
          }
        });
      } else {
        this.$Message.error('已审核');
      }
    },
    /**
     * 取消禁言
     * @param {*
     * 目标消息体
     * } target 
     */
    cancelJY(target) {
      removeBlockUser({
        livetoken: this.$root.livetoken,
        roomid: this.$root.roomid,
        target,
      }).then(res => {
        if (res.code === 0) {
          this.$Message.success('解除成功');
        } else {
          this.$Message.error(res.message);
        }
        this.getJinyanList();
      });
    },
    /**
     * 跳转策略页
     */
    toStrategy() {
      window.location.href = `${this.strategyUrl}?roomindex=${this.$root.roomid}&roomid=${this.userInfo.roomid}&usertoken=${this.$root.loginInfo.userToken}&strname=${this.curRoom.strname}&strnumber=${this.curRoom.strnumber}`;
    },
    /**
     * 跳转管理页面
     */
    toSpeak() {
      this.$router.push({
        path: `/manage/speak/${this.$root.roomid}`
      })
    },
    /**
     * 设置回复消息
     * @param {*} msgItem 
     */
    setReply(msgItem) {
      console.log(msgItem)
      // 需回复的消息
      this.replyItem = msgItem;
      // 修改编辑器placeholder
      this.editorPlaceHolder = `@${msgItem.name}`;
    },
    // 切换视频
    changeVideo(index) {
      this.videoObj = {
        type: 2,
        video: this.goodVideoList.map(videoItem => videoItem.videoUrl),
      }
      this.currentGoodVideo = index;
    },
    formatDate(date) {
      return this.format(new Date(date), 'yyyy-MM-dd')
    }
  },
});
