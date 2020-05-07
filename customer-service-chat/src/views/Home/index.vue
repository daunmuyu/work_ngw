<template>
  <div class="homeIndex">
    <chat-view :nim-sdk="nim"></chat-view>
    <personal v-if="msgType== 'p2p'"></personal>
    <grount-info v-else></grount-info>
  </div>
</template>
<script>
import { mapMutations, mapGetters } from 'vuex';
import { appKey, getIMToken, getCSUserid, getCSToken, removeIMInfo } from '@/store/authToken.js';
import { IMLoginState } from '@/service/api.js';
import { isToday, delay } from '@/service/utils.js';
import SDK from '@/libs/NIM/NIM_Web_SDK_v6.5.5.js';
import ChatView from '@/components/ChatView';
import Personal from '@/components/Personal';
import GrountInfo from '@/components/GroupInfo';

export default {
  name: 'HomeIndex',
  components: {
    ChatView,
    Personal,
    GrountInfo,
  },
  computed: {
    ...mapGetters(['userInfo', 'histIdSer', 'chatMsgs']),
  },
  watch: {
    userInfo(v) {
      if (!v) return;
      console.log(v);
      this.msgType = v.messageType === '2' ? 'team' : 'p2p';
      this.nimLocalMsg(this.msgType, v.relationID);
    },
    histIdSer(v) {
      if (v) this.getLocalMsgs(v);
    },
    chatMsgs(v) {
      return v;
    },
  },
  data() {
    return {
      index: 'homeIndex',
      msgType: 'p2p',
      nim: null,
      time: '',
      notify: null,
    };
  },
  created() {
    this.initNIM();
  },
  methods: {
    ...mapMutations(['CHAT_LIST', 'HISTORY_MSG', 'CHAT_MSG', 'UPDATE_SESSION', 'MSG_EVENTS', 'MSG_RECEIPT', 'NIM_SDK']),
    initNIM() {
      const seft = this;
      // console.log('浏览器兼容性', SDK.NIM.support.db);
      this.nim = SDK.NIM.getInstance({
        // debug: false,
        // db: true,
        appKey,
        autoMarkRead: false,
        syncSessionUnread: true, // 同步会话未读数
        account: getCSUserid(),
        token: getIMToken(),
        onconnect: (opt) => { // 连接建立后的回调
          console.log('进入聊天室', opt);
        },
        onsessions: (opt) => { // 同步最近会话列表回调
          this.CHAT_LIST(opt);
          const info = this.userInfo && this.userInfo.messageType;
          if (info) this.msgType = this.userInfo.messageType === '2' ? 'team' : 'p2p';
          if (this.userInfo && this.userInfo.relationID) seft.nimLocalMsg(this.msgType, this.userInfo.relationID);
        },
        onupdatesession: (opt) => { // 更新会话的回调, 会传入
          console.log('更新会话的回调', opt.lastMsg);
          this.UPDATE_SESSION(opt.lastMsg);
          console.log(this.nim.isMsgRemoteRead(opt.lastMsg));
          if (this.msgType === opt.scene && `${this.userInfo.relationID}` === opt.to) {
            this.nim.sendMsgReceipt({
              msg: opt.lastMsg,
              done: (error, obj) => {
                this.MSG_RECEIPT(obj);
                console.log(`发送消息已读回执${(!error ? '成功' : '失败')}`, error, obj);
              },
            });
          }
          if (this.msgType === opt.scene && `${this.userInfo.relationID}` === opt.to && this.time !== opt.lastMsg.time) {
            this.time = opt.lastMsg.time;
            this.CHAT_MSG(opt.lastMsg);
          }
        },
        onerror: (err, obj) => { // 发生错误的回调
          console.log('发生错误', err, obj);
          if (this.notify) this.notify.close();
          this.$confirm(`云信连接发生错误，${err.message}` || '云信连接发生错误，请重新加载页面，或者重新登录账号', '云信连接', {
            confirmButtonText: '重新载入',
            cancelButtonText: '退出登录',
            type: 'warning',
            center: true,
            showClose: false,
          }).then(() => {
            location.reload();
          }).catch(() => {
            removeIMInfo();
            location.reload();
          });
        },
        onwillreconnect: (obj) => { // 即将重连的回调
          console.log('即将重连', obj);
          if (this.notify) this.notify.close();
          this.$notify({
            title: '云信重新连接',
            message: '网易云信正在重新连接~',
            showClose: false,
          });
        },
        ondisconnect: (err) => { // 断开连接后的回调
          let msg = '';
          if (err) {
            switch (err.code) {
              // 账号或者密码错误, 请跳转到登录页面并提示错误
              case 302:
                msg = '账号或者密码错误, 您可以等待连接也可以刷新页面尝试重连~';
                break;
              // 重复登录, 已经在其它端登录了, 请跳转到登录页面并提示错误
              case 417:
                msg = '重复登录, 已经在其它端登录了, 您可以等待连接也可以刷新页面尝试重连~';
                break;
              // 被踢, 请提示错误后跳转到登录页面
              case 'kicked':
                msg = '被踢, 您可以等待连接也可以刷新页面尝试重连~';
                break;
              default:
                msg = '网易云信断开连接，您可以等待连接也可以刷新页面尝试重连~';
                break;
            }
          }
          this.notify = this.$notify({
            title: '云信断开连接',
            message: msg || err.message || '网易云信断开连接，你可以刷新页面尝试重连~',
            duration: 0,
            showClose: false,
          });
        },
        onmsgs: (msg) => {
          console.log(' 收到消息对象的回调', msg);
        },
        onfriends: (param) => {
          console.log('订阅朋友事件', param);
        },
        onpushevents: (param) => {
          // console.log('订阅事件', param);
          delay(() => {
            if (this.filterArr(param.msgEvents, '1').length) {
              this.loginState(this.filterArr(param.msgEvents, '1'), '1', param.msgEvents);
            }
            if (this.filterArr(param.msgEvents, '2').length) {
              this.loginState(this.filterArr(param.msgEvents, '2'), '2', param.msgEvents);
            }
            if (this.filterArr(param.msgEvents, '3').length) {
              this.loginState(this.filterArr(param.msgEvents, '3'), '3', param.msgEvents);
            }
          }, 500);
        },
      });
      this.NIM_SDK(this.nim);
    },
    nimLocalMsg(scene, to) {
      this.nim.getHistoryMsgs({
        scene,
        to,
        limit: 20,
        done: (error, obj) => {
          if (error) return;
          console.log(`获取云端历史记录${(!error ? '成功' : '失败')}`, error, obj);
          this.HISTORY_MSG(obj.msgs.reverse());
        },
      });
    },
    getLocalMsgs(item) {
      this.nim.getHistoryMsgs({
        scene: item.scene,
        to: item.target,
        limit: 20,
        lastMsgId: item.idServer,
        endTime: item.time,
        done: (error, obj) => {
          if (error) return;
          console.log(`再次获取云端历史记录${(!error ? '成功' : '失败')}`, error, obj.msgs.length, obj);
          const hist = obj.msgs.reverse();
          if (hist.length) this.HISTORY_MSG([...hist, ...this.chatMsgs]);
        },
      });
    },
    timeData(tr) {
      if (isToday(tr)) return tr.substring(10);
      return tr.substring(0, 10);
    },
    filterArr(arr, str) {
      return arr.filter(item => item.value === str).map((item) => {
        return item.account;
      }).join(',');
    },
    loginState(userIDs, loginState, msgEvents) {
      IMLoginState({
        usertoken: getCSToken(),
        userIDs,
        loginState,
      }).then(() => {
        this.MSG_EVENTS(msgEvents);
        // console.log(res);
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import '../../styles/base.scss';
.homeIndex {
  color: $bg-2A4159;
  display: flex;
}
</style>
