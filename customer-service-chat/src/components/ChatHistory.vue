<template>
  <div
    class="ChatHistoryBg"
    v-if="histShow.isShow"
  >
    <div
      class="ChatHistory"
      :class="{'isCurr': histShow.isCurr}"
    >
      <div
        class="closeImg"
        @click="close"
      ><img
          src="../assets/icon/close-big.png"
          alt=""
        ></div>
      <div
        class="histLeft"
        v-if="histShow.isCurr"
      >
        <div
          class="histUserView"
          ref="histUserView"
          @scroll="userMero"
        >
          <div
            class="histUser"
            v-for="(item, index) in searchUserHist"
            :key="index"
            :class="{'active': item.Id == userInfo.relationID}"
            @click="userHist(item)"
          >
            <div class="headImg"><img
                :src="item.HeadImg"
                alt=""
              ></div>
            <div class="userInfo">
              <h5>{{item.Name}}</h5>
              <p>{{item.Content}}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="histRight">
        <div class="header">
          <h5>{{userInfo.relationName}}</h5>
          <div class="searchPane">
            <el-input
              class="inline-input"
              size="mini"
              prefix-icon="el-icon-search"
              placeholder="搜索"
              v-model="searchVal"
              clearable
              :readonly="isReadonly"
              @input="initSearch(true)"
            ></el-input>
          </div>
          <h6 v-if="searchVal && searchData.length">{{searchCount}}条与“{{searchVal || histShow.isCurr}}”相关的聊天记录</h6>
        </div>
        <template v-if="searchData.length">
          <div class="histCont">
            <div
              class="histTab"
              v-if="tabShow"
            >
              <div class="active tabItem"><span>全部</span></div>
              <div class="tabItem"><span>文件</span></div>
              <div class="tabItem"><span>图片与视频</span></div>
              <div class="tabItem"><span>连接</span></div>
            </div>
            <div
              class="histView"
              ref="histView"
              @scroll="scrollTopMore"
            >
              <div
                class="histCont"
                ref="histCont"
              >
                <div
                  class="histItem"
                  v-for="(item, index) in searchData"
                  :key="index"
                >
                  <div class="phone"><img
                      :src="item.HeadImg"
                      alt=""
                    ></div>
                  <div class="textCont">
                    <h6>
                      <span>{{item.Name}}</span>
                      <time>{{timeFormat(item.PushTime, 'MM-dd hh:mm')}}</time>
                    </h6>
                    <div class="txtPane">
                      <p v-html="searchKey(item.Content)"></p>
                      <span
                        class="moreUpDown"
                        @click="histUpDown(item)"
                      >查看上下文</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="empty">
            <h5>暂无数据~ </h5>
          </div>
        </template>
      </div>
      <div
        class="histDetails"
        v-if="isDetail"
      >
        <div class="headBack">
          <span @click="goBanck"><i class="el-icon-arrow-left"></i>返回</span>
          <h5>对话上下文详情</h5>
        </div>
        <div
          class="detailsView"
          ref="msgView"
          @scroll="msgUpDownMore"
        >
          <div class="histCont">
            <div
              class="histItem"
              v-for="(item, index) in histMsgsData"
              :key="index"
            >
              <div
                class="groupNews"
                v-if="item.attach"
              >{{teamMembers(item.attach)}}</div>
              <div class="phone"><img
                  :src="custom(item.custom).logoUrl"
                  alt=""
                ></div>
              <div class="textCont">
                <h6>
                  <span>{{groupItem(item.from) || custom(item.custom).UserName}}</span>
                  <time>{{timeFormat(item.time, 'MM-dd hh:mm')}}</time>
                </h6>
                <div
                  class="txtPane"
                  v-if="item.type == 'text'"
                >
                  <p v-html="faceToImg(item.text)"></p>
                </div>
                <div
                  class="imgPane"
                  v-if="item.type == 'image'"
                >
                  <viewer>
                    <img
                      :style="{height:(item.file.h/item.file.w)*150 +'px'}"
                      class="chatImg"
                      :src="imgHttp(item.file.url)"
                    />
                  </viewer>
                </div>
                <div
                  class="audioPane"
                  v-if="item.type == 'audio'"
                  @click="playAudio(item)"
                  :style="{width: (Math.floor(item.file.dur/250) + 90) + 'px'}"
                >
                  <div
                    class="voice"
                    :class="{'played': (adUrl === item.file.mp3Url)}"
                  >
                    <div class="voiceImg">
                      <img
                        v-if="(adUrl === item.file.mp3Url)"
                        src="../assets/icon/BrowserPreview_tmp.gif"
                        alt=""
                      >
                      <img
                        v-else
                        src="../assets/icon/yuyin_icon.png"
                        alt=""
                      >
                    </div>
                    <time>{{Math.floor(item.file.dur/1000)}}’’</time>
                  </div>
                </div>
                <div
                  v-if="item.type == 'file'"
                  class="filePane"
                >
                  <a
                    :href="item.file.url"
                    :download="item.file.name"
                    target="_blank"
                  >
                    <div class="chatText">
                      <img
                        src="../assets/icon/wenjian_icon.png"
                        alt=""
                      >
                      <div class="fileInfo">
                        <p>{{item.file.name}}</p>
                        <p><span>{{MKB(item.file.size)}}</span></p>
                      </div>
                    </div>
                  </a>
                </div>
                <div
                  class="videoPane"
                  v-if="item.type == 'video'"
                >
                  <a
                    :href="item.file.url"
                    :download="item.file.name"
                    target="_blank"
                  >
                    <div class="chatText">
                      <video
                        :style="{height:(item.file.h/item.file.w)*150 +'px'}"
                        preload="auto"
                        :src="item.file.url"
                      ></video>
                      <div
                        class="video-time"
                        v-if="item.file.dur > 0"
                      >{{timeFormat(item.file.dur, 'mm:ss')}}</div>
                    </div>
                  </a>
                </div>
                <div
                  class="customPane"
                  v-if="item.type == 'custom'"
                >
                  <a
                    :href="content(item.content).url"
                    target="_blank"
                  >
                    <div class="customCont chatText">
                      <div class="customTitle">
                        <h3 v-html="content(item.content).title"></h3>
                        <p v-html="content(item.content).content"></p>
                      </div>
                      <div class="customImg"><img
                          :src="content(item.content).image"
                          alt=""
                        ></div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <audio id="audioHist" :src="adUrl"></audio>
  </div>
  </div>

</template>
<script>
// import Vue from 'vue';
import { mapGetters, mapMutations } from 'vuex';
// import GarenLoadmore from 'garen-loadmore';

import { delay, faceToImg, timeFormat } from '@/service/utils';
import { IMHostSearch, IMHostChat } from '@/service/api';
import { getCSToken } from '@/store/authToken';

// Vue.use(GarenLoadmore);

export default {
  name: 'ChatHistory',
  computed: {
    ...mapGetters(['userInfo', 'histShow', 'groupList', 'nimSDK']),
  },
  data() {
    return {
      states: '',
      searchData: [],
      searchVal: '',
      tabShow: false,
      searchCount: 0,
      searchUserHist: [],
      tabType: 0,
      page: 1,
      isReadonly: false,
      isDetail: false,
      histMsgsData: [],
      topNum: 0,
      adUrl: '',
      // palyArr: [],
      auDom: '',
    };
  },
  watch: {
    histShow(val) {
      if (val.isShow && val.isCurr) {
        this.searchVal = val.isCurr;
        this.isReadonly = true;
        this.searchData = [];
        this.searchCount = 0;
        // this.serarchChat(true, val.isCurr);
        this.searchChatHist(val.isCurr);
      }
    },
    userInfo() {
      if (this.searchVal) {
        this.serarchChat(true, this.searchVal);
      }
    },
    histMsgs() {
      this.$nextTick(() => {
        this.$refs.msgView.scrollTop = this.$refs.msgView.scrollHeight - this.topNum;
      });
      // return v;
    },
  },
  methods: {
    ...mapMutations(['HIST_SHOW', 'USER_INFO']),
    goBanck() {
      this.isDetail = false;
      if (this.auDom && !this.auDom.paused) {
        this.adUrl = '';
        this.topNum = 0;
        this.auDom.pause();
      }
    },
    msgUpDownMore() {
      const top = this.$refs.msgView.scrollTop;
      const shg = this.$refs.msgView.scrollHeight - this.$refs.msgView.clientHeight - 100;
      const last = this.histMsgsData[this.histMsgsData.length - 1];
      const frist = this.histMsgsData[0];
      if (top > shg) {
        delay(() => {
          this.histMsgs(10, false, last.idServer, last.time);
        }, 250);
      }
      if (top < 100) {
        delay(() => {
          this.histMsgs(10, true, frist.idServer, frist.time);
        }, 250);
      }
      this.topNum = this.$refs.msgView.scrollHeight - top;
    },
    groupItem(id) {
      if (!this.groupList) return false;
      if (!this.groupList.UserList) return false;
      const info = this.groupList.UserList.filter(item => +item.UserID === +id);
      return info.length ? info[0].UserName : false;
    },
    userRole(users) {
      return users.slice(0, -1).map(item => item.nick).join('、');
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
    content(strJson) {
      if (strJson && strJson.length) {
        const res = JSON.parse(strJson);
        return res.data;
      }
      return false;
    },
    playAudio(item) {
      this.adUrl = item.file.mp3Url;
      // if (!this.palyArr.includes(item.file.mp3Url)) this.palyArr.push(item.file.mp3Url);
      this.auDom = document.getElementById('audioHist');
      setTimeout(() => {
        console.log(this.auDom);
        if (this.auDom.paused) {
          this.auDom.play();
          this.auDom.addEventListener('ended', () => {
            this.adUrl = '';
          }, false);
        } else {
          this.auDom.pause();
          this.adUrl = '';
        }
      }, 100);
    },
    MKB(n) {
      if (n > (1024 * 1024)) return `${(n / 1024).toFixed(2)}M`;
      if (n > 1024) return `${(n / 1024).toFixed(2)}K`;
      return `${n}b`;
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
    histUpDown(item) {
      console.log(item);
      this.isDetail = true;
      this.nimSDK.getHistoryMsgs({
        scene: this.userInfo.messageType === '2' ? 'team' : 'p2p',
        to: this.userInfo.relationID,
        limit: 9,
        lastMsgId: item.MsgId,
        endTime: item.PushTime,
        done: (error, obj) => {
          if (error) return;
          console.log(`再次获取云端历史记录${(!error ? '成功' : '失败')}`, error, obj.msgs.length, obj);
          const hist = obj.msgs;
          if (hist.length) {
            this.histMsgsData = hist;
            this.histMsgs(1, true, hist[0].idServer, hist[0].time);
          }
        },
      });
    },
    histMsgs(limit, reverse, lastMsgId, msgTime) {
      const scene = this.userInfo.messageType === '2' ? 'team' : 'p2p';
      const endTime = !reverse ? msgTime : 0;
      const beginTime = reverse ? msgTime : 0;
      this.nimSDK.getHistoryMsgs({
        scene,
        to: this.userInfo.relationID,
        limit,
        reverse,
        lastMsgId,
        endTime,
        beginTime,
        done: (error, obj) => {
          if (error) return;
          console.log(`再次获取云端历史记录${(!error ? '成功' : '失败')}`, error, obj.msgs.length, obj);
          const hist = obj.msgs.reverse();
          if (hist.length) {
            if (reverse) {
              this.histMsgsData = [...hist, ...this.histMsgsData];
            } else {
              this.histMsgsData = [...this.histMsgsData, ...hist];
            }
          }
        },
      });
    },
    userHist(item) {
      const users = {
        messageType: `${item.MessageType}`,
        relationID: item.Id,
        relationLogoUrl: item.HeadImg,
        relationName: item.Name,
      };
      this.USER_INFO(users);
    },
    userMero() {
      const top = this.$refs.histUserView.scrollTop + this.$refs.histUserView.clientHeight;
      const heg = this.$refs.histUserView.scrollHeight - 100;
      if (top > heg) {
        this.page += 1;
        this.searchChatHist();
      }
    },
    timeFormat(t, fmt) {
      return timeFormat(t, fmt);
    },
    searchChatHist(content = '股') {
      IMHostChat({
        content,
        contentType: 0,
        usertoken: getCSToken(),
        size: 10,
        page: this.page,
      }).then((res) => {
        if (+res.result) {
          const reData = res.data;
          this.searchUserHist = [...this.searchUserHist, ...reData];
        }
      });
    },
    close() {
      this.searchVal = '';
      this.searchData = [];
      this.searchCount = 0;
      this.isReadonly = false;
      this.tabType = 0;
      this.page = 1;
      this.searchUserHist = [];
      this.isDetail = false;
      this.HIST_SHOW({
        isShow: false,
        isCurr: '',
      });
    },
    faceToImg(cont) {
      const reg = /\/w+.(\/w+|\/w+\/\/)$/ig;
      return faceToImg(cont.replace(reg, (match, group) => {
        if (group) return `<a href="${this.imgHttp(group)}" target="_blank">${group}</a>`;
        return match;
      }));
    },
    searchKey(content) {
      const reg = new RegExp(this.searchVal, 'g');
      return this.faceToImg(content.replace(reg, `<span style="color: #3D70F6;">${this.searchVal}</span>`));
    },
    scrollTopMore() {
      // console.log(this.$refs.histView.scrollTop, this.$refs.histCont.scrollHeight);
      const top = this.$refs.histView.scrollTop + this.$refs.histView.clientHeight + 100;
      if (top > this.$refs.histCont.scrollHeight) {
        console.log(top, this.$refs.histCont.scrollHeight);
        if (this.searchCount > this.searchData.length) this.serarchChat(false, this.searchVal);
      }
    },
    initSearch(type, content = this.searchVal) {
      if (!content) {
        this.searchData = [];
        return;
      }
      delay(() => {
        this.serarchChat(type, content = this.searchVal);
      }, 300);
    },
    reduceObj(arr) {
      const obj = {};
      return arr.reduce((item, next) => {
        if (!obj[next.PushTime]) (obj[next.PushTime] = true && item.push(next));
        return item;
      }, []);
    },
    serarchChat(type, content = this.searchVal) {
      if (type) this.searchData = [];
      const Addtime = this.searchData.length ? this.searchData[this.searchData.length - 1].PushTime : '';
      IMHostSearch({
        content,
        userToken: getCSToken(),
        RelationID: this.userInfo.relationID,
        MsgType: this.userInfo.messageType,
        ContentType: this.tabType,
        PageSize: 10,
        Addtime,
      }).then((result) => {
        if (+result.result) {
          const reData = result.data.Data.reverse();
          this.searchData = this.reduceObj([...this.searchData, ...reData]);
          this.searchCount = result.data.Total;
        } else {
          this.searchData = [];
          this.searchCount = 0;
        }
      }).catch(() => {
        this.searchData = [];
        this.searchCount = 0;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../styles/base.scss";

.ChatHistoryBg {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;
  background-color: rgba($color: #000000, $alpha: 0.7);
}

.ChatHistory {
  display: flex;
  position: fixed;
  height: 70%;
  background-color: #fff;
  border-radius: 5px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  .closeImg {
    width: 28px;
    height: 28px;
    margin-top: -18px;
    margin-right: -18px;
    cursor: pointer;
    position: absolute;
    top: 0;
    right: 0;
    z-index: 9;
    img {
      width: 28px;
    }
  }
  .histLeft {
    width: 240px;
    height: 100%;
    border-right: 1px solid #e8e8e8;
    padding: 15px 0;
    box-sizing: border-box;
    .histUserView {
      height: 100%;
      overflow-y: scroll;
      // overflow: hidden;
      .histUser {
        @include flexBox;
        padding: 15px;
        border-bottom: 1px solid #e8e8e8;
        cursor: pointer;
        &.active {
          background: #f2f7f7;
        }
        .headImg {
          width: 60px;
          img {
            display: block;
            @include photoImg(44px);
          }
        }
        .userInfo {
          flex: 1;
          width: calc(100% - 60px);
          p {
            text-align: left;
            font-size: 12px;
            color: $bg-6A7681;
            width: 100%;
            @include lineOne;
          }
          h5 {
            width: 100%;
            @include lineOne;
            text-align: left;
            width: 100%;
            flex: 1;
            font-size: 16px;
            color: $bg-2A4159;
          }
        }
      }
    }
  }
}
.histDetails {
  width: 480px;
  height: 100%;
  padding: 15px 0;
  background-color: #fff;
  border-radius: 5px;
  position: absolute;
  top: 0;
  right: 0;
  .detailsView {
    height: calc(100% - 50px);
    overflow-y: scroll;
  }
  .headBack {
    line-height: 1.6;
    font-size: 16px;
    border-bottom: 1px solid #e8e8e8;
    width: 100%;
    padding-bottom: 10px;
    position: relative;
    h5 {
      font-size: 18px;
      text-align: center;
    }
    span {
      cursor: pointer;
      position: absolute;
      left: 15px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
.videoPane {
  .chatText {
    position: relative;
    display: inline-block;
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
.audioPane {
  .voice {
    border: 1px solid #e8e8e8;
    padding: 3px 5px;
    border-radius: 3px;
    @include flexAic;
    max-width: 360px;
    min-width: 60px;
    font-size: 14px;
    time {
      padding-left: 15px;
    }
  }
}

.customPane .customCont {
  border: 1px solid #e8e8e8;
  padding: 3px 5px;
  border-radius: 3px;
  @include flexBox;
  width: 300px;
  .customTitle {
    flex: 1;
    h3,
    p {
      display: -webkit-box; //对象作为弹性伸缩盒子模型显示
      -webkit-box-orient: vertical; //设置或检索伸缩盒对象的子元素的排列方式
      -webkit-line-clamp: 2; //溢出省略的界限
      overflow: hidden; //设置隐藏溢出元素
    }
  }
  .customImg {
    width: 50px;
    img {
      width: 48px;
    }
  }
}
.histRight {
  width: 480px;
  height: 100%;
  display: flex;
  flex-direction: column;
  .empty {
    padding: 60px;
    margin: 0 auto;
    text-align: center;
    font-size: 16px;
    color: $bg-6A7681;
  }
  .header {
    padding: 15px;
    height: 128px;
    border-bottom: 1px solid #e8e8e8;
    h5 {
      color: $bg-2A4159;
      font-size: 16px;
    }
    h6 {
      font-size: 14px;
      color: $bg-404953;
      padding-top: 12px;
    }
    .searchPane {
      width: 100%;
      padding-top: 15px;
      .el-input {
        width: 100%;
        height: 100%;
        .el-input__inner {
          background-color: #e8e8e8;
        }
      }
    }
  }
}
.histCont {
  flex: 1;
  height: calc(100% - 100px);
  padding-bottom: 15px;
  .histTab {
    @include flexBox;
    padding: 15px;
    font-size: 14px;
    color: $bg-2A4159;
    .tabItem {
      span {
        background-size: contain;
        background-repeat: no-repeat;
        padding-left: 25px;
      }
      &:nth-child(1) {
        span {
          background-image: url("../assets/icon/icon_lishi_all.png");
        }
        &.active > span {
          background-image: url("../assets/icon/icon_lishi_all_click.png");
        }
      }
      &:nth-child(2) {
        span {
          background-image: url("../assets/icon/icon_lishi_paper.png");
        }
        &.active > span {
          background-image: url("../assets/icon/icon_lishi_paper_click.png");
        }
      }
      &:nth-child(3) {
        span {
          background-image: url("../assets/icon/icon_lishi_picture.png");
        }
        &.active > span {
          background-image: url("../assets/icon/icon_lishi_picture_click.png");
        }
      }
      &:nth-child(4) {
        span {
          background-image: url("../assets/icon/icon_lishi_lianjie.png");
        }
        &.active > span {
          background-image: url("../assets/icon/icon_lishi_lianjie_click.png");
        }
      }
    }
    .active {
      color: $bg-3D70F6;
    }
  }
  .histView {
    height: calc(100% - 50px);
    width: 100%;
    overflow-y: scroll;
  }
}

.histItem {
  padding: 15px 0;
  margin: 0 15px;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  font-size: 14px;
  color: $bg-2A4159;
  line-height: 1.5;
  .phone {
    padding-right: 15px;
    img {
      @include photoImg(36px);
    }
  }
  .textCont {
    flex: 1;
    .moreUpDown {
      font-size: 12px;
      display: block;
      text-align: right;
      padding-top: 5px;
      color: $bg-3D70F6;
      cursor: pointer;
    }
    h6 {
      color: $bg-6A7681;
      font-weight: 400;
      @include flexBox;
      font-size: 14px;
      time {
        font-size: 12px;
      }
      span,
      time {
        display: block;
      }
    }
    .txtPane {
      padding-top: 5px;
      p {
        word-break: break-all;
      }
    }
    .filePane {
      @include flexBox;
      padding: 10px;
      border: 1px solid #e8e8e8;
      width: 220px;
      color: $bg-2A4159;
      .fileInfo {
        span {
          font-size: 12px;
          color: $bg-6A7681;
        }
      }
    }
  }
}
</style>
