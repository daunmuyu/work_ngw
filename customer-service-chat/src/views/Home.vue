<template>
  <div class="home">
    <div class="leftView">
      <div class="LVleft" v-if="info">
        <div class="userImg" :class="{'lk': radio == 2}">
          <el-popover
            placement="right"
            width="100"
            trigger="hover">
            <p>{{info.UserName}}</p>
            <p>ID：<span>{{info.UserID}}</span></p>
            <p><el-radio @change="userState(1)" v-model="radio" label="1">在线</el-radio></p>
            <p><el-radio @change="userState(2)" v-model="radio" label="2">离开</el-radio></p>
          <img :src="info.UserLogoUrl"  slot="reference" alt="">
          </el-popover>
        </div>
        <div class="tabView">
          <div class="tabItem" v-for="(item, index) in navTab"
          :key="index" :class="{active: index == sectId}" @click="tabSected(item.id)">
          <!-- <router-link  :to="{name: item.link}"  :class="{active: $route.path.indexOf(item.link) > -1}"> -->
            <div class="tabIcon">
              <img :src="item.icon" alt="">
            </div>
            <p>{{item.text}}</p>
            <div v-if="index < 1 && msgCount != 0" class="msgCount">{{msgCount}}</div>
          <!-- </router-link> -->
          </div>
        </div>
      </div>
      <div class="signOut" @click="signOut">
        <img src="../assets/icon/icon-退出.png" alt="">
      </div>
    </div>
    <chat-view></chat-view>
    <chat-home v-show="!kehuShow"></chat-home>
    <chat-manage v-if="kehuShow"></chat-manage>
    <group-send v-if="sectId == 2"></group-send>
    <!-- <router-view></router-view> -->
  </div>
</template>
<script>
import { mapMutations, mapGetters } from 'vuex';
import { IMUserState, IMInfo, IMUserAutoMsg } from '@/service/api.js';
import { getCSToken, removeIMInfo, vuelsChange } from '@/store/authToken.js';
import ChatView from '@/components/ChatList';
import ChatHome from './Home/index';
import ChatManage from './Home/manage';
import GroupSend from './Home/groupSend';
import msgIcon from '../assets/icon/icon-chat.png';
import perIcon from '../assets/icon/icon-persons.png';
import gruIcon from '../assets/icon/icon-qunfa.png';
import telIcon from '../assets/icon/privateletter_phone_icon.png';
import setIcon from '../assets/icon/icon-set.png';

// 拨打电话js
import '../libs/SIP/sip-0.7.7.js';
import SHTELNUM from '../libs/SIP/shanghai.js';
import '../libs/SIP/common.js';
import '../libs/SIP/sip-ui.js';

export default {
  name: 'Home',
  components: {
    ChatView,
    ChatHome,
    ChatManage,
    GroupSend,
  },
  computed: {
    ...mapGetters(['chatMsgs', 'kehuShow', 'sipTel', 'setShow', 'groupShow', 'telShow', 'interShow', 'userInfo', 'msgCount']),
  },
  data() {
    return {
      info: null,
      radio: '1',
      sectId: 0,
      MsgContent: '',
      navTab: [
        {
          icon: msgIcon,
          text: '消息',
          id: 0,
          link: 'index',
        },
        {
          icon: perIcon,
          text: '感兴趣',
          id: 1,
          link: 'message',
        },
        {
          icon: gruIcon,
          text: '群发',
          id: 2,
          link: 'manage',
        },
        {
          icon: telIcon,
          text: '电话',
          id: 3,
          link: 'tellink',
        },
        {
          icon: setIcon,
          text: '设置',
          id: 4,
          link: 'setlink',
        },
      ],
      nim: null,
    };
  },
  created() {
    this.init();
  },
  watch: {
    setShow(val) {
      if (val) return;
      if (this.kehuShow) return;
      if (!+this.interShow) this.sectId = 0;
      if (this.interShow) this.sectId = 1;
    },
    telShow(val) {
      if (val) return;
      if (this.kehuShow) return;
      if (!+this.interShow) this.sectId = 0;
      if (this.interShow) this.sectId = 1;
    },
    groupShow(val) {
      if (val) return;
      if (this.kehuShow) return;
      if (!+this.interShow) this.sectId = 0;
      if (this.interShow) this.sectId = 1;
    },
    interShow(val) {
      if (val) return;
      if (!this.interShow) this.sectId = 0;
    },
    userInfo(val) {
      console.log('home=>', val);
    },
  },
  methods: {
    ...mapMutations(['KEHU_SHOW', 'GROUP_SHOW', 'SET_SHOW', 'TEL_SHOW', 'INTER_SHOW', 'SIP_TEL']),
    init() {
      IMInfo({
        usertoken: getCSToken(),
      }).then((res) => {
        if (+res.result) {
          this.info = res.data[0];
          this.radio = `${res.data[0].LoginState}`;
          this.MsgContent = this.info.MsgContent;
          this.sipTelInit(`${this.info.KFCode}`, this.info.PreCode);
        } else {
          this.$message({
            message: res.message || '信息错误',
            type: 'warning',
          });
        }
      });
      vuelsChange(() => {
        this.$alert('由于用户信息变更，请重新载入页面', '信息提示', {
          confirmButtonText: '重新载入',
          type: 'warning',
          center: true,
          showClose: false,
          callback: () => {
            location.reload();
          },
        });
      });
    },
    sipTelInit(code, prephone) {
      // const prephone = (+getCSUserid() === 13172298 || +getCSUserid() === 13161449) ? '699' : '698';
      // console.log('拨打电话=》', getCSUserid(), code, prephone);
      const sipObj = window.NGSip({
        idCode: code,
        prephone,
      }); // 生成sip实例
      sipObj.setLocal(SHTELNUM); // 设置本地号码段
      window.NGSipUI(sipObj); // 使用NGSipUI
      sipObj.register(); // 注册用户
      if (+code) this.SIP_TEL(sipObj);
    },
    openPrompt() {
      this.$prompt('自动回复', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        center: true,
        inputType: 'textarea',
        inputPlaceholder: '自动回复内容',
        inputValue: this.MsgContent,
      }).then(({ value }) => {
        // this.MsgContent = value || this.MsgContent;
        this.autoMsg(value);
        this.SET_SHOW(false);
      }).catch(() => {
        this.SET_SHOW(false);
        this.$message({
          type: 'info',
          message: '取消输入',
        });
      });
    },
    autoMsg(msgContent) {
      IMUserAutoMsg({
        usertoken: getCSToken(),
        msgContent,
      }).then((res) => {
        if (+res.result) {
          this.MsgContent = msgContent;
          this.$message({
            message: res.message || '设置成功',
            type: 'success',
          });
        } else {
          this.$message({
            message: res.message || '设置失败',
            type: 'warning',
          });
        }
      });
    },
    openTelAlert() {
      this.$prompt('请输入正确电话号码！', '拨打电话', {
        confirmButtonText: '拨打',
        cancelButtonText: '取消',
        center: true,
        inputType: 'tel',
        inputPlaceholder: '请输入电话号码',
        inputPattern: /^((\d{2,3}-?\d{7,8})|(1[3456789]\d{9}))$/,
        inputErrorMessage: '请输入正确号码~',
      }).then(({ value }) => {
        this.TEL_SHOW(false);
        this.sipTel.call(value);
      }).catch(() => {
        this.TEL_SHOW(false);
        this.$message({
          type: 'info',
          message: '取消拨号',
        });
      });
    },
    tabSected(idx) {
      this.sectId = idx;
      if (!+idx) {
        this.KEHU_SHOW(false);
        this.INTER_SHOW(false);
        this.GROUP_SHOW(false);
        this.SET_SHOW(false);
      }
      if (+idx === 1) this.INTER_SHOW(true);
      if (+idx === 2) this.GROUP_SHOW(true);
      if (+idx === 3) {
        this.TEL_SHOW(true);
        this.openTelAlert();
      }
      if (+idx === 4) {
        this.SET_SHOW(true);
        this.openPrompt();
      }
    },
    userState(loginState) {
      IMUserState({
        usertoken: getCSToken(),
        loginState,
      }).then((res) => {
        if (+res.result) {
          this.$message({
            message: res.message || '跟新成功',
            type: 'success',
          });
        } else {
          this.radio = (loginState - 1) ? '1' : '2';
          this.$message({
            message: res.message || '信息错误',
            type: 'warning',
          });
        }
      });
    },
    signOut() {
      this.$confirm('确认退出么?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
        closeOnClickModal: false,
        showClose: false,
      }).then(() => {
        removeIMInfo();
        location.href = location.origin;
        this.$router.push({ name: 'login' });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出',
        });
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import '../styles/base.scss';
.home {
  width: 1240px;
  height: 80%;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  position: absolute;
  // top: 50%;
  // left: 50%;
  // transform: translate(-50%, -50%);
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  .leftView {
    width: 80px;
    background: $bg-303841;
    position: relative;
    .LVleft {
      color: $bg-FFFFFF;
      font-size: 14px;
      text-align: center;
      position: relative;
      a {
        color: $bg-FFFFFF;
      }
      & > div {
        cursor: pointer;
      }
      .userImg {
        width: 100%;
        height: 80px;
        position: relative;
        padding: 15px;
        &::before {
          content: "";
          position: absolute;
          bottom: 15px;
          right: 15px;
          width: 10px;
          height: 10px;
          background-color: $bg-55D48B;
          overflow: hidden;
          border-radius: 50%;
        }
        &.lk::before {
          background-image: url('../assets/icon/lk.png');
        }
        img {
          width: 50px;
          height: 50px;
          overflow: hidden;
          border-radius: 50%;
        }
      }
      .tabItem {
        position: relative;
        text-align: center;
        padding-top: 15px;
        height: 80px;
        .msgCount {
          @include position(absolute, 50%, 6px);
          font-size: 12px;
          line-height: 16px;
          padding: 0 4.5px;
          border-radius: 8px;
          overflow: hidden;
          background-color: $bg-F36060;
          color: $bg-FFFFFF;
        }
        .tabIcon {
          width: 30px;
          height: 30px;
          margin: 0 auto;
          overflow: hidden;
        }
        &.active {
          background-color: $bg-363E47;
          position: relative;
          &::before {
            content: "";
            height: 100%;
            width: 4px;
            background-color: $bg-3D70F6;
            position: absolute;
            top: 0;
            left: 0;
          }
          .tabIcon {
            position: relative;
            img {
              position: absolute;
              bottom: 0;
              right: 0;
            }
            p {
              line-height: 1.6;
            }
          }
        }
      }
    }
    .signOut {
      position: absolute;
      left: 0;
      right: 0;
      margin: 0 auto;
      cursor: pointer;
      bottom: 15px;
    }
  }
}
</style>
