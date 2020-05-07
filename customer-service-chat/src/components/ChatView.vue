<template>
  <div class="chatView">
    <div class="header">
      <el-tooltip v-if="userInfo" class="persnName" effect="dark" :content="userInfo.relationName" placement="top-start">
      <h5>{{userInfo.relationName}}</h5>
      </el-tooltip>
    </div>
    <div class="chatMain" ref="scrollView" @scroll="scrollTopMore" @contextmenu="showMenu">
      <div class="chatContView" v-if="chatMsgs" ref="scrollbar">
        <template v-for="(item, index) in chatMsgs">
        <time class="userUpTime">{{timeFormat(item.time, 'MM-dd hh:mm')}}</time>
        <div class="groupNews" v-if="item.attach">{{teamMembers(item.attach)}}</div>
        <div class="chatItem" :key="index"
        :class="{'acuntItem': item.from == userid, 'teamItem': item.scene == 'team', 'read': index < chatMsgs.length - count}">
          <div class="userIcon" v-if="custom(item.custom)">
            <img :src="custom(item.custom).logoUrl" alt="">
          </div>
          <div class="chatMsg" v-if="item.type == 'text'">
            <div v-if="showRecall(item) || (groupList && groupList.CurrentRoleType > 0)" class="withdraw" @click="recallConfirm(item)"><span>撤回</span></div>
            <div class="forward" @click="forward(JSON.parse(item.custom).cID)">转发</div>
            <h6 v-if="item.scene == 'team' && item.from != userid">
              {{groupItem(item.from) || custom(item.custom).UserName}}
              <span @click="atEvent(custom(item.custom))">@</span>
              <span v-if="groupList && groupList.CurrentRoleType > 0"
                @click="talkType(groupMember(item.from))"
                :class="{'fontRed': +groupMember(item.from).TalkState}">{{+groupMember(item.from).TalkState ? '解禁' : '禁言'}}</span>
            </h6>
            <div class="chatText">
              <p v-html="faceToImg(item.text)"></p>
            </div>
          </div>
          <div class="chatMsg imgPane" v-if="item.type == 'image'">
            <div v-if="showRecall(item) || (groupList && groupList.CurrentRoleType > 0)" class="withdraw" @click="recallConfirm(item)"><span>撤回</span></div>
            <div class="forward" @click="forward(JSON.parse(item.custom).cID)">转发</div>
            <h6 v-if="item.scene == 'team' && item.from != userid">
              {{groupItem(item.from) || custom(item.custom).UserName}}
              <span @click="atEvent(custom(item.custom))">@</span>
              <span v-if="groupList && groupList.CurrentRoleType > 0"
                @click="talkType(groupMember(item.from))"
                :class="{'fontRed': +groupMember(item.from).TalkState}">{{+groupMember(item.from).TalkState ? '解禁' : '禁言'}}</span>
              </h6>
            <div class="chatText">
              <viewer>
                <img :style="{height:(item.file.h/item.file.w)*150 +'px'}" class="chatImg" :src="imgHttp(item.file.url)" />
              </viewer>
            </div>
          </div>
          <div class="chatMsg voicePane" :class="{'need': item.localCustom || palyArr.includes(item.file.mp3Url)}"
          v-if="item.type == 'audio'" @click="playAudio(item, index + 1)">
            <div v-if="showRecall(item) || (groupList && groupList.CurrentRoleType > 0)" class="withdraw" @click="recallConfirm(item)"><span>撤回</span></div>
            <div class="forward" @click="forward(JSON.parse(item.custom).cID)">转发</div>
            <h6 v-if="item.scene == 'team' && item.from != userid">
              {{groupItem(item.from) || custom(item.custom).UserName}}
              <span @click="atEvent(custom(item.custom))">@</span>
              <span v-if="groupList && groupList.CurrentRoleType > 0"
                @click="talkType(groupMember(item.from))"
                :class="{'fontRed': +groupMember(item.from).TalkState}">{{+groupMember(item.from).TalkState ? '解禁' : '禁言'}}</span>
            </h6>
            <div class="chatText" :style="{width: (Math.floor(item.file.dur/250) + 90) + 'px'}">
              <div class="voice" :class="{'played': (adUrl === item.file.mp3Url)}">
                <div class="voiceImg">
                  <template v-if="item.from == userid">
                  <img v-if="(adUrl === item.file.mp3Url)" src="../assets/icon/BrowserPreview_tmp_r.gif" alt="">
                  <img v-else src="../assets/icon/yuyindongxiao_right.png" alt="">
                  </template>
                  <template v-else>
                  <img v-if="(adUrl === item.file.mp3Url)" src="../assets/icon/BrowserPreview_tmp.gif" alt="">
                  <img v-else src="../assets/icon/yuyin_icon.png" alt="">
                  </template>
                </div>
                <time>{{Math.floor(item.file.dur/1000)}}’’</time>
              </div>
            </div>
          </div>
          <div class="chatMsg filePane" v-if="item.type == 'file'">
            <div v-if="showRecall(item) || (groupList && groupList.CurrentRoleType > 0)" class="withdraw" @click="recallConfirm(item)"><span>撤回</span></div>
            <div class="forward" @click="forward(JSON.parse(item.custom).cID)">转发</div>
            <a :href="item.file.url" :download="item.file.name" target="_blank">
              <div class="chatText">
                <img src="../assets/icon/wenjian_icon.png" alt="">
                <div class="fileInfo">
                  <p>{{item.file.name}}</p>
                  <p><span>{{MKB(item.file.size)}}</span></p>
                </div>
              </div>
            </a>
          </div>
          <div class="chatMsg videoPane" v-if="item.type == 'video'">
            <div v-if="showRecall(item) || (groupList && groupList.CurrentRoleType > 0)" class="withdraw" @click="recallConfirm(item)"><span>撤回</span></div>
            <div class="forward" @click="forward(JSON.parse(item.custom).cID)">转发</div>
            <h6 v-if="item.scene == 'team' && item.from != userid">
              {{groupItem(item.from) || custom(item.custom).UserName}}
              <span @click="atEvent(custom(item.custom))">@</span>
              <span v-if="groupList && groupList.CurrentRoleType > 0"
                @click="talkType(groupMember(item.from))"
                :class="{'fontRed': +groupMember(item.from).TalkState}">{{+groupMember(item.from).TalkState ? '解禁' : '禁言'}}</span>
            </h6>
            <a :href="item.file.url" :download="item.file.name" target="_blank">
              <div class="chatText">
                <!-- <img :src="item.file.url" alt=""> -->
                <video :style="{height:(item.file.h/item.file.w)*150 +'px'}" preload="auto" :src="item.file.url"></video>
                <div class="video-time" v-if="item.file.dur > 0">{{timeFormat(item.file.dur, 'mm:ss')}}</div>
              </div>
            </a>
          </div>
          <div class="chatMsg customPane" v-if="item.type == 'custom'">
            <div v-if="showRecall(item) || (groupList && groupList.CurrentRoleType > 0)" class="withdraw" @click="recallConfirm(item)"><span>撤回</span></div>
            <div class="forward" @click="forward(JSON.parse(item.custom).cID)">转发</div>
            <h6 v-if="item.scene == 'team' && item.from != userid">
              {{groupItem(item.from) || custom(item.custom).UserName}}
              <span @click="atEvent(custom(item.custom))">@</span>
              <span v-if="groupList && groupList.CurrentRoleType > 0"
                @click="talkType(groupMember(item.from))"
                :class="{'fontRed': +groupMember(item.from).TalkState}">{{+groupMember(item.from).TalkState ? '解禁' : '禁言'}}</span>
            </h6>
            <a :href="content(item.content).url" target="_blank">
            <div class="customCont chatText">
              <div class="customTitle">
                <h3 v-html="content(item.content).title"></h3>
                <p v-html="content(item.content).content"></p>
              </div>
              <div class="customImg"><img :src="content(item.content).image" alt=""></div>
            </div>
            </a>
          </div>
        </div>
        </template>
        <audio id="audio" :src="adUrl"></audio>
      </div>
    </div>
    <div class="footer">
      <chat-msg :at-user="atUser"></chat-msg>
    </div>
    <chat-mail></chat-mail>
    <!-- <vue-context-menu :contextMenuData="contextMenuData"
        @savedata="savedata"
        @newdata="newdata">
    </vue-context-menu> -->
    <!-- <context-menu class="right-menu" 
        :target="contextMenuTarget" 
        :show="contextMenuVisible" 
        @update:show="(show) => contextMenuVisible = show">
        <a href="javascript:;">复制</a>
        <a href="javascript:;">引用</a>
        <a href="javascript:;">删除</a>
    </context-menu> -->
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex';
// import InfiniteLoading from 'vue-infinite-loading';
import { getCSUserid, getCSToken } from '@/store/authToken.js';
import { IMReadCount, IMMSGRecall } from '@/service/api.js';
import { faceToImg, timeFormat } from '@/service/utils.js';
import ChatMsg from './ChatMsg';
import ChatMail from './ChatMail';

export default {
  name: 'ChatView',
  props: ['nimSdk'],
  data() {
    return {
      userid: '',
      auDom: '',
      adUrl: '',
      palyArr: [],
      count: 0,
      topNum: 0,
      atUser: null,
      contextMenuTarget: null,
      contextMenuVisible: false,
      contextMenuData: {
        menuName: 'demo',
        axis: {
          x: null,
          y: null,
        },
        menulists: [
          {
            fnHandler: 'savedata', // Binding events(绑定事件)
            icoName: 'fa fa-home fa-fw', // icon (icon图标 )
            btnName: 'Save', // The name of the menu option (菜单名称)
          }, {
            fnHandler: 'newdata',
            icoName: 'fa fa-home fa-fw',
            btnName: 'New',
          },
        ],
      },
    };
  },
  components: {
    ChatMsg,
    ChatMail,
    // InfiniteLoading,
  },
  computed: {
    ...mapGetters(['chatMsgs', 'userInfo', 'msgReceipt', 'groupList', 'updateSession']),
  },
  watch: {
    msgReceipt() {
      this.readcount();
    },
    updateSession(v) {
      // console.log(v, v.from, this.userid);
      if (+v.from === +this.userid) {
        this.topNum = 0;
      }
    },
    chatMsgs(v) {
      this.$nextTick(() => {
        this.$refs.scrollView.scrollTop = this.$refs.scrollView.scrollHeight - this.topNum;
        this.readcount();
      });
      return v;
    },
    userInfo() {
      console.log(3333);
      if (this.auDom && !this.auDom.paused) {
        this.adUrl = '';
        this.topNum = 0;
        this.auDom.pause();
      }
      this.$refs.scrollView.scrollTop = this.$refs.scrollView.scrollHeight;
    },
  },
  mounted() {
    this.userid = getCSUserid();
    this.auDom = document.getElementById('audio');
    this.$nextTick(() => {
      this.$refs.scrollView.scrollTop = this.$refs.scrollView.scrollHeight;
      this.contextMenuTarget = this.$refs.scrollView;
    });
  },
  methods: {
    ...mapMutations(['HIST_ID_SER', 'FORBIDDEN_WORDS', 'HISTORY_MSG', 'MAIL_LIST']),
    showMenu(e) {
      const event = e || window.event;
      event.preventDefault();
      const x = event.clientX;
      const y = event.clientY;
      console.log(x, y);
      this.contextMenuData.axis = { x, y };
    },
    savedata() {
      console.log('点击右键菜单');
    },
    newdata() {
      console.log('newdata!');
    },
    forward(msgId) {
      // console.log(id);
      this.MAIL_LIST({
        isShow: true,
        msgId,
      });
    },
    showRecall(item) {
      // console.log(date);
      if (item.scene === 'p2p') return true;
      return false;
    },
    content(strJson) {
      if (strJson && strJson.length) {
        const res = JSON.parse(strJson);
        return res.data;
      }
      return false;
    },
    recallConfirm(item) {
      this.$confirm('确认撤回这条消息吗？', '撤回提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
        closeOnClickModal: false,
        showClose: false,
      }).then(() => {
        this.msgRecall(item);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '您取消了撤回这条消息',
        });
      });
    },
    msgRecall(item) {
      const msgID = JSON.parse(item.custom).msgID;
      IMMSGRecall({
        usertoken: getCSToken(),
        msgID,
      }).then((res) => {
        const msgType = +res.code === 0 ? 'success' : 'warning';
        const msgCont = +res.code === 0 ? '撤回成功' : '撤回失败';
        if (+res.code === 0) {
          // this.HISTORY_MSG(this.chatMsgs.splice(this.chatMsgs.indexOf(item), 1));
        }
        this.$message({
          message: res.message || msgCont,
          type: msgType,
        });
      });
    },
    talkType(item) {
      const date = new Date().getTime();
      this.FORBIDDEN_WORDS({ date, ...item });
    },
    atEvent(item) {
      const date = new Date().getTime();
      this.atUser = { date, ...item };
    },
    scrollTopMore() {
      if (this.$refs.scrollView.scrollTop < 100) {
        console.log(this.$refs.scrollView.scrollTop, this.chatMsgs[0]);
        this.HIST_ID_SER(this.chatMsgs[0]);
      } else {
        this.topNum = this.$refs.scrollView.scrollHeight - this.$refs.scrollView.scrollTop;
      }
    },
    readcount() {
      IMReadCount({
        relationID: this.userInfo.relationID,
        usertoken: getCSToken(),
      }).then((res) => {
        this.count = res.count;
      });
    },
    teamMembers(attach) {
      if (attach.type === 'updateTeam') return `${this.userRole(attach.users)} 更新群`;
      if (attach.type === 'addTeamMembers') return `${this.userRole(attach.users)} 加入群`;
      if (attach.type === 'removeTeamMembers') return `${this.userRole(attach.users)} 被群主移除群`;
      if (attach.type === 'acceptTeamInvite') return `${this.userRole(attach.users)} 接受入群邀请`;
      if (attach.type === 'passTeamApply') return `${this.userRole(attach.users)} 通过入群申请`;
      if (attach.type === 'addTeamManagers') return `${this.userRole(attach.users)} 提升为群管理`;
      if (attach.type === 'removeTeamManagers') return `${this.userRole(attach.users)} 移除群管理员`;
      if (attach.type === 'leaveTeam') return `${this.userRole(attach.users)} 退出群`;
      if (attach.type === 'dismissTeam') return `${this.userRole(attach.users)} 解散群`;
      if (attach.type === 'updateTeamMute') return `${this.userRole(attach.users)} 更新群成员禁言状态`;
      return '';
    },
    userRole(users) {
      return users.slice(0, -1).map(item => item.nick).join('、');
    },
    playAudio(item, idx) {
      this.adUrl = item.file.mp3Url;
      if (!this.palyArr.includes(item.file.mp3Url)) this.palyArr.push(item.file.mp3Url);
      setTimeout(() => {
        if (this.auDom.paused) {
          if (!item.localCustom) {
            this.nimSdk.updateLocalMsg({
              idClient: item.idClient,
              localCustom: '{"audio": "played"}',
              // done: (error, obj) => {
              //   console.log(obj);
              //   console.log(`更新本地消息${(!error ? '成功' : '失败')}`);
              // },
            });
          }
          if (!this.auDom) return;
          this.auDom.play();
          this.auDom.addEventListener('ended', () => {
            this.adUrl = '';
            if ((this.chatMsgs[idx]) && (this.chatMsgs[idx].type === 'audio') && !this.chatMsgs[idx].localCustom) {
              // this.adUrl = this.chatMsgs[idx].file.mp3Url;
              this.playAudio(this.chatMsgs[idx], idx);
            }
          }, false);
        } else {
          this.auDom.pause();
          this.adUrl = '';
        }
      }, 100);
    },
    openFile(fl) {
      window.open(fl.url, '_blank');
    },
    faceToImg(cont) {
      // const reg = /((((https?|ftp?|http?):(?:(&#x2F;)(&#x2F;))?)(?:[-;:(&amp;)=+$]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:=+$]+@)[A-Za-z0-9.-]+)((?:(&#x2F;)[+~%(&#x2F;).\w-_]*)?\??(?:[-?+=(&amp;);:%!(&#x2F;)@.\w_]*)#?(?:[-?+=(&amp;);%!(&#x2F;)@.\w_]*))?)/ig;
      const reg = /\/w+.(\/w+|\/w+\/\/)$/ig;
      // if (reg.test(cont)) {
      //   return `<a href="${this.imgHttp(cont)}" target="_blank">${cont}</a>`;
      // }
      return faceToImg(cont.replace(reg, (match, group) => {
        if (group) return `<a href="${this.imgHttp(group)}" target="_blank">${group}</a>`;
        return match;
      }));
    },
    timeFormat(t, fmt) {
      return timeFormat(t, fmt);
    },
    imgHttp(str) {
      const strp = str.substring(0, 4);
      if (strp === 'http') return str;
      return `https://${str}`;
    },
    custom(strJson) {
      if (strJson && strJson.length) {
        const info = JSON.parse(strJson);
        return info.userInfo;
      }
      return false;
    },
    groupItem(id) {
      if (!this.groupList) return false;
      if (!this.groupList.UserList) return false;
      const info = this.groupList.UserList.filter(item => +item.UserID === +id);
      return info.length ? info[0].UserName : false;
    },
    groupMember(id) {
      if (this.groupList && this.groupList.UserList) {
        const info = this.groupList.UserList.filter(item => +item.UserID === +id);
        return info.length && info[0];
      }
      return false;
    },
    MKB(n) {
      if (n > (1024 * 1024)) return `${(n / 1024).toFixed(2)}M`;
      if (n > 1024) return `${(n / 1024).toFixed(2)}K`;
      return `${n}b`;
    },
  },
};
</script>
<style lang="scss" scoped>
@import '../styles/base.scss';
#audio {
  display: none;
}
.chatView {
  width: 600px;
  height: 100%;
  background-color: $bg-F2F7F7;
  @include flexBetween;
  flex-direction: column;
  .header {
    height: 80px;
    border-bottom: 1px solid $bg-E3E7E7;
    h5 {
      text-align: left;
      font-size: 24px;
      padding-left: 15px;
      line-height: 80px;
      font-weight: 400;
      @include lineOne;
    }
  }
  .footer {
    height: 150px;
  }
  .chatMain {
    flex: 1;
    overflow-x: hidden;
    overflow-y: auto;
    .userUpTime {
      padding-top: 25px;
      padding-bottom: 15px;
      font-size: 14px;
      color: $bg-99A8B4;
    }
  }
  .chatContView {
    padding: 15px;
    .chatItem {
      display: flex;
      margin: 15px 0;
      .userIcon {
        img {
          @include photoImg(44px);
        }
      }
      .chatMsg {
        text-align: left;
        padding: 0 15px;
        max-width: 360px;
        position: relative;
        &.customPane {
          .customCont {
            @include flexBox;
            width: 300px;
            .customTitle {
              flex: 1;
              h3, p {
                display: -webkit-box;//对象作为弹性伸缩盒子模型显示 
                -webkit-box-orient: vertical;//设置或检索伸缩盒对象的子元素的排列方式 
                -webkit-line-clamp: 2;//溢出省略的界限
                overflow:hidden;//设置隐藏溢出元素
              }
            }
            .customImg {
              width: 50px;
              img {
                width: 48px;
              }
            }
          }
        }
        &.imgPane {
          img.chatImg {
            max-width: 100%;
          }
        }
        &.videoPane {
          .chatText {
            position: relative;
            &::after {
              content: "";
              border: 16px solid #fff;
              border-right-color: transparent;
              border-top-color: transparent;
              border-top-width: 10px;
              border-bottom-width: 10px;
              border-bottom-color: transparent;
              @include position(absolute, 50%, 50%);
              margin: 8px 0 0 8px;
              transform: translate(-50%, -50%);
            }
          }
          .video-time {
            text-align: right;
            position: absolute;
            bottom: 20px;
            right: 20px;
          }
          video {
            max-width: 200px;
            display: block;
          }
        }
        &.voicePane {
          position: relative;
          cursor: pointer;
          &::before {
            content: "";
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background-color: $bg-F36060;
            @include position(absolute, 100%, 17px);
          }
          &.need::before {
            display: none;
          }
          .voice {
            @include flexAic;
            max-width: 360px;
            min-width: 60px;
            font-size: 14px;
            time {
              padding-left: 15px;
            }
          }
        }
        &.filePane {
          .chatText {
            @include flexAic;
            .fileInfo {
              padding: 0 15px;
              // width: calc(100% - 80px);
              p {
                width: 100%;
                word-wrap:break-word
              }
              span {
                color: $bg-8997A5;
                font-size: 12px;
              }
            }
          }
        }
        h6 {
          color: $bg-8997A5;
          font-size: 14px;
          line-height: 1.6;
          font-weight: 400;
          span {
            color: $bg-3D70F6;
            padding-left: 10px;
            display: inline-block;
            margin-left: 5px;
            cursor: pointer;
            &.fontRed {
              color: $bg-F36060;
            }
          }
        }
        .chatText {
          position: relative;
          display: inline-block;
          border-radius: 22px;
          background-color: $bg-FFFFFF;
          padding: 12px 15px;
          p {
            width: 100%;
            // word-wrap:break-word;
            word-break: break-all
          }
          &::before {
            content: "";
            background-image: url('../assets/icon/white_bubble.png');
            width: 7px;
            height: 9px;
            @include position(absolute, -6px, 10px);
            @include bgRSP;
          }
        }
      }

      .forward {
        cursor: pointer;
        position: absolute;
        font-size: 12px;
        color: $bg-3D70F6;
        text-align: center;
        transform: translateY(-50%);
      }
      .withdraw {
        width: 60px;
        display: none;
        cursor: pointer;
        transform: translateY(-50%);
        font-size: 12px;
        text-align: center;
        span {
          color: $bg-3D70F6;
        }
      }

      .forward {
        width: 60px;
        @include position(absolute, calc(100% - 10px), calc(50% - 15px));
      }
      &.teamItem {
        .chatMsg {
          position: relative;
        }
        // .forward {
        //   width: 60px;
        //   @include position(absolute, calc(100% - 10px), calc(50% - 15px));
        // }
        .withdraw {
          display: block;
          width: 60px;
          @include position(absolute, calc(100% - 10px), calc(50% + 15px));
        }
        .chatMsg::after {
          display: none;
        }
        .voicePane::before {
          display: none;
        }
      }
      &.acuntItem {
        flex-direction: row-reverse;
        position: relative;
        .forward {
          @include position(absolute, -50px, calc(50% - 15px));
        }
        .withdraw {
          display: block;
          @include position(absolute, -50px, calc(50% + 15px));
        }
        .chatMsg {
          position: relative;
          &::after {
            content: '未读';
            @include position(absolute, -20px, 50%);
            transform: translateY(-50%);
            font-size: 12px;
            color: $bg-F36060;
          }
        }
        &.read > .chatMsg::after {
          content: '已读';
          color: $bg-6A7681;
        }
        .chatText {
          // background-color: $bg-3D70F6;
          display: inline-block;
          background-color: $bg-3598db;
          color: $bg-FFFFFF;
          &::before {
            background-image: url('../assets/icon/blue_bubble1.png');
            @include position(absolute, 100%, 15px);
          }
        }
        .voicePane {
          &::before {
            display: none;
          }
          .voice {
            @include flexAic;
            flex-direction: row-reverse;
            max-width: 360px;
            min-width: 60px;
            font-size: 14px;
            time {
              padding-right: 15px;
            }
          }
        }
      }
    }
  }
}
</style>
