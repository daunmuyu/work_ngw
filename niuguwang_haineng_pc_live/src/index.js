import Vue from 'vue';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import Cookie from 'js-cookie';
import iView from 'iview';
import 'babel-polyfill';
import 'iview/dist/styles/iview.css';
import { getUrlParam } from './util/interaction';
import store from './store';
import App from './components/App.vue';
// import { getUrlParam } from './util/interaction';
import './index.scss';

Vue.use(iView);

new Vue({
  el: '#app',
  store,
  components: {
    App,
  },
  data() {
    return {
      lid: '',
      userStatus: false,
      times: '',
    };
  },
  mounted() {
    // this.checkLogin();
    this.roomInfo.liveId = Cookie.get('lid') || this.roomInfo.liveId;
    this.roomInfo.chatroomId = Cookie.get('vid') || this.roomInfo.chatroomId;
    const that = this;
    const Interval = setInterval(() => {
      console.log(this.roomInfo.liveId);
      if (this.roomInfo.liveId === '568') {
        that.statu(Interval);
      }
    }, 3000);
  },
  computed: {
    ...mapGetters(['userInfo', 'roomInfo', 'error']),
  },
  methods: {
    ...mapActions(['guestReg', 'getUserInfo', 'getPlayLive', 'getPwdStatus', 'loginStatus']),
    ...mapMutations(['showLogin', 'setLogin', 'CHAT_MSG', 'setLiveType']),
    // checkLogin() {
    //   const usertoken = getUrlParam('t') || Cookie.get('hn-token');
    //   if (usertoken) {
    //     this.setLogin(true);
    //     this.getUserInfo({ usertoken });
    //   } else {
    //     const tmp = Cookie.get('hn-tmptoken');
    //     if (tmp) {
    //       this.getUserInfo({ usertoken: tmp });
    //     } else {
    //       this.guestReg().then((res) => {
    //         if (res.code === 0) {
    //           const ut = res.userInfo.userToken;
    //           Cookie.set('hn-tmptoken', ut);
    //           this.getUserInfo({ usertoken: ut });
    //         }
    //       });
    //     }
    //   }
    //   this.videoInit();
    // },
    chatinit(payload) {
      // 初始化聊天室
      if (window.chatroomInstance) {
        window.chatroomInstance.disconnect();
      }
      window.chatroomInstance = window.Chatroom.getInstance({
        ...payload,
        onconnect: (chatroom) => {
          console.log('进入聊天室', chatroom);
        },
        onerror: (err, obj) => {
          console.log('发生错误', err, obj);
        },
        onwillreconnect: (obj) => {
          console.log('即将重连', obj);
        },
        ondisconnect: (err) => {
          console.log('连接断开', err);
        },
        onmsgs: (msg) => {
          this.handleOnmsgs(msg);
        },
      });
    },
    // videoInit() {
    //   const token = getUrlParam('t') || Cookie.get('hn-token');
    //   this.getPlayLive({ liveid: this.roomInfo.liveId, usertoken: token }).then((res) => {
    //     if (res.code === 0) {
    //       if (res.data.m3u8 !== '') {
    //         this.setLiveType('live');
    //       } else {
    //         this.setLiveType('record');
    //       }
    //     } else {
    //       this.$Message.error(res.message || '网络错误，请重试！');
    //     }
    //   });
    // },
    handleOnmsgs(msgs) {
      if (msgs.length === 0) return;
      console.log(msgs);
      msgs.forEach((msg) => {
        if (msg.custom && msg.type === 'tip') {
          this.setLiveType('record');
        }
        if (msg.type === '11') {
          const { status } = JSON.parse(msg.custom);
          if (status === '1') {
            location.href = './lock.html';
          }
        }
        if (msg.custom) {
          const json = JSON.parse(msg.custom);
          // 自己的消息不显示
          if (json.userId === this.userInfo.userId) return;
          // 被禁言不显示
          if (msg.auditSign === '2') return;
          this.CHAT_MSG(json);
        }
        return;
      }, this);
    },
    statu(Interval) {
      const usertoken = Cookie.get('hn-token');
      const uuid = Cookie.get('uuid');
      // console.log(usertoken, uuid);
      if (usertoken) {
        this.loginStatus({
          usertoken,
          uuid,
        }).then((res) => {
          console.log(res.userInfo);
          if (res.userInfo.isRelogin === 1) {
            this.userStatus = true;
            this.times = this.getNowFormatDate();
            clearInterval(Interval);
          }
        });
      }
    },
    getNowFormatDate() {
      const date = new Date();
      const seperator1 = '-';
      const seperator2 = ':';
      let month = date.getMonth() + 1;
      let strDate = date.getDate();
      let hours = date.getHours();
      let minutes = date.getMinutes();
      let seconds = date.getSeconds();
      if (month >= 1 && month <= 9) {
        month = `0${month}`;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = `0${strDate}`;
      }
      if (hours >= 0 && hours <= 9) {
        hours = `0${hours}`;
      }
      if (minutes >= 0 && minutes <= 9) {
        minutes = `0${minutes}`;
      }
      if (seconds >= 0 && seconds <= 9) {
        seconds = `0${seconds}`;
      }

      const currentdate = `${date.getFullYear() + seperator1 + month + seperator1 + strDate
               } ${hours + seperator2 + minutes + seperator2 + seconds}`;
      return currentdate;
    },
    userClose() {
      this.userStatus = false;
      this.showLogin(true);
      Cookie.set('hn-token', '');
      Cookie.set('mark', 'lock');
      Cookie.set('vid', '9659068');
      Cookie.set('lid', '570');
      Cookie.set('uuid', '');
      this.setLogin(false);
      const tmp = Cookie.get('hn-tmptoken');
      if (getUrlParam('t')) location.search = '';
      if (tmp) {
        this.getUserInfo({ usertoken: tmp });
      } else {
        this.guestReg().then((res) => {
          if (res.code === 0) {
            const ut = res.userInfo.userToken;
            Cookie.set('hn-tmptoken', ut);
            this.getUserInfo({ usertoken: ut });
          }
        });
      }
    },
  },
  watch: {
    userInfo(val) {
      // 判断访问权限
      this.getPwdStatus({
        liveID: this.roomInfo.liveId,
        usertoken: val.usertoken,
      }).then((res) => {
        if (res.isHavePwd === 1) {
          if (Cookie.get('mark') !== '1') {
            location.href = './lock.html';
          }
        }
      });
      //
      if (this.roomInfo.chatroomAddresses.length > 0) {
        this.chatinit(this.roomInfo);
      } else {
        this.checkLogin();
      }
    },
    error(val) {
      this.$Message.error(val);
    },
  },
});
