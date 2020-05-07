<template>
  <div class="chat-main">
    <div class="chat-content" ref="scrollbar">
      <div class="chat-box">
        <div class="chat-content-msg" v-for="(item, index) in chatMsgs" :key="index">
          <div class="msg-role">
            <img class="user-img" :src="'./static/img/flag' + getImg(item) + '.png'" alt="">
          </div>
          <div class="msg-text" :class="item.userIcons[0] === 9 ? 'msg-t': 'msg-text'">
            <div class="user-info">
              <span class="user-name">{{item.userName}}</span>
              <span class="time">{{timeFormat(item.sendTime*1000, 'MM-dd hh:mm:ss')}}</span>
            </div>
            <template v-if="item.contentFormat[0].type === 1">
              <template v-if="item.sourceContent">
                <div class="source-msg" v-html="'<span>' + item.sourceUserName +': </span>'+ text(item.sourceContent)">{{text(item.sourceContent)}}</div>
                <div class="msg-re" v-html="'<span>回复' + item.sourceUserName +': </span>'+ text(item.contentFormat[0].content)">{{text(item.contentFormat[0].content)}}</div>
              </template>
              <template v-else>
                <div :class="item.userIcons[0] === 9 ? 'msg-re': 'msg'" v-html="text(item.contentFormat[0].content)">{{text(item.contentFormat[0].content)}}</div>
              </template>
            </template>
            <template v-else>
              <lightbox :src="item.contentFormat[0].src">
                <img :style="{height:(item.contentFormat[0].height/item.contentFormat[0].width)*100 +'px'}" :src="item.contentFormat[0].src" />
              </lightbox>
            </template>
          </div>
        </div>
      </div>
    </div>
    <div class="chat-edit">
      <div class="chat-edit-bar">
        <img class="pd-20" src="../images/emoji.png" @click="setEmojiShow(!emojiShow)">
        <img class="pd-20" src="../images/img.png" alt="" @click="imgUpload">
        <form enctype="multipart/form-data" method="post" id="form1" class="hidden">
          <input type="file" name="Content" id="file1">
        </form>
        <span class="pd-20" @click="clearScreen">清屏</span>
        <span class="pd-20">
          <input type="checkbox" id="autoScroll" v-model="autoScroll">
          <label for="autoScroll">自动滚屏</label>
        </span>
        <span class="pd-20">
          <input type="checkbox" id="onlyTeacher" v-model="onlyTeacher">
          <label for="onlyTeacher">只看老师</label>
        </span>
      </div>
      <ChatEmoji/>
      <div class="chat-edit-option">
        <div class="chat-edit-input" contentEditable="true" autofocus ref="msgContent" @focus="setEmojiShow(false)" @keyup.enter.prevent="send" id="msg" placeholder="点击与老师聊聊天"></div>
      </div>
      <div class="chat-edit-send" @click="send">发送</div>
    </div>
  </div>
</template>
<script>
  import { mapGetters, mapActions, mapMutations } from 'vuex';
  import Lightbox from 'vue-lightbox';
  import $ from 'jquery';
  import Cookie from 'js-cookie';
  import { faceToImg, contentToSend } from '../util/interaction.js';
  import ChatEmoji from './ChatEmoji'
  import '../static/jquery.from.js';
  export default {
    data () {
      return {
        autoScroll: true,
        onlyTeacher: false,
        msgContent: '',
        clear: false,
        lid: '',
        vid: '',
      }
    },
    components: { Lightbox, ChatEmoji },
    computed: {
      ...mapGetters(['chatMsgs', 'emojiShow', 'currEmoji', 'userInfo'])
    },
    mounted () {
      this.lid = Cookie.get('lid') || this.roomInfo.liveId;
      this.vid = Cookie.get('vid') || this.roomInfo.chatroomId;
      this.getHisMsg(this.vid);
      this.msgDom = document.getElementById('msg');
      this.uploadImg();
    },
    methods: {
      ...mapActions(['getHisMsg', 'getTeacHerMsg', 'sendMsg']),
      ...mapMutations(['watchTeacher', 'clearMsgs', 'setEmojiShow', 'addEmoji', 'CHAT_MSG']),
      clearScreen () {
        this.clearMsgs();
        this.clear = true;
      },
      text (msg) {
        return faceToImg(msg);
      },
      getImg (item) {
        if (item.userIcons.length === 0) return 0;
        return item.userIcons[0] || 0;
      },
      imgUpload () {
        $('#file1').click();
      },
      uploadImg () {
        $('#file1').on('change', () => {
          $('#form1').ajaxSubmit({
            url: "https://live.niuguwang.com/chat/chatroom/SendMsg",
            data: {
              usertoken: this.userInfo.usertoken,
              roomId: this.vid,
            },
            dataType: 'json',
            success: (res) => {
              if (res.code === 0) {
                this.CHAT_MSG(res.im_msg);
              } else {
                this.$Message.error(res.message || '发送失败，请稍后重试');
              }
            },
            error: (err) => {
              console.log(err);
              this.$Message.error('发送失败');
            },
          });
        });
      },
      send (e) {
        e.preventDefault();
        if (!this.msgDom.innerHTML) return;
        this.sendMsg({
          usertoken: this.userInfo.usertoken,
          roomId: this.vid,
          content: contentToSend(this.msgDom.innerHTML).replace(/<[^>]+>/g, ''),
          sourceMsgId: ''
        }).then((res) => {
          if (res.code === 0) {
            this.CHAT_MSG(res.im_msg);
            this.msgDom.innerHTML = '';
          } else {
            this.$Message.error(res.message || '发送失败，请稍后重试');
          }
        });
      },
      timeFormat (t, fmt) {
        const time = new Date(t * 1);
        const o = {
          'M+': time.getMonth() + 1, // 月份
          'd+': time.getDate(), // 日
          'h+': time.getHours(), // 小时
          'm+': time.getMinutes(), // 分
          's+': time.getSeconds(), // 秒
          'q+': Math.floor((time.getMonth() + 3) / 3), // 季度
          S: time.getMilliseconds(), // 毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (`${time.getFullYear()}`).substr(4 - RegExp.$1.length));
        for (const k in o) {
          if (new RegExp(`(${k})`).test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : ((`00${o[k]}`).substr((`${o[k]}`).length)));
          }
        }
        return fmt;
      }
    },
    updated () {
      this.$refs.scrollbar.scrollTop = this.$refs.scrollbar.scrollHeight;
    },
    watch: {
      chatMsgs (val) {
        if (autoScroll) this.$refs.scrollbar.scrollTop = this.$refs.scrollbar.scrollHeight;
      },
      currEmoji (val) {
        if (val.add) {
          this.msgDom.innerHTML += faceToImg(val.cont);
          this.addEmoji({ add: false, cont: '' });
        }
      },
      onlyTeacher (val) {
        if (val) {
          this.watchTeacher();
        } else {
          !this.clear && this.getHisMsg(this.vid);
        };
      }
    }
  }
</script>

<style lang="scss" scoped>
  .chat-main {
    width: 42%;
    height: 100%;
    padding: 0 8px;
    [contenteditable=true]:empty:before {
      content: attr(placeholder);
      display: block;
      color: #fff;
    }
     ::-webkit-scrollbar {
      width: 6px;
    }
     ::-webkit-scrollbar-thumb {
      border-radius: 5px;
      box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      background: rgba(0, 0, 0, 0.2);
    }
    .chat-content {
      width: 100%;
      height: 72%;
      margin: 0 auto;
      background-color: rgb(44, 47, 53);
      color: #fff;
      overflow-y: scroll;
      .chat-content-msg {
        display: flex;
        flex-direction: row;
        align-items: center;
        .msg-role {
          width: 10%;
          text-align: center;
          min-width: 48px;
          .user-img {
            width: 32px;
          }
        }
        .msg-t {
          background-color: rgb(54, 63, 80)!important;
        }
        .msg-text {
          width: 90%;
          background: rgb(55, 60, 70);
          margin: 10px 0;
          margin-right: 20px;
          padding: 8px;
          border-radius: 4px;
          font-size: 14px;
          color: rgb(212, 212, 212);
          overflow: hidden;
          word-wrap: break-word;
          .user-info {
            span {
              padding-right: 5px;
            }
            .user-name {
              color: #fff;
            }
            .time {
              font-size: 12px;
            }
          }
          .source-msg {
            font-size: 12px; // padding-bottom: 2px;
            background-color: rgb(57, 75, 107);
            color: rgb(212, 212, 212);
            padding: 2px 6px;
            margin: 4px 0;
            width: fit-content;
          }
          .msg-re {
            color: rgb(212, 212, 212);
          }
        }
      }
    }
    .chat-edit {
      width: 100%;
      height: 28%;
      position: relative;
      background: #2c2f35;
      input[type="checkbox"] {
        display: none;
        cursor: pointer;
      }
      input[type="checkbox"]+label {
        cursor: pointer;
        &::before {
          content: '';
          display: inline-block;
          width: 14px;
          height: 14px;
          background: url('../images/no.png') no-repeat;
          background-size: 100% 100%;
          margin-right: 4px;
          transition: background ease-in .1s;
        }
      }
      input[type="checkbox"]:checked+label {
        cursor: pointer;
        &::before {
          background: url('../images/ok.png') no-repeat;
          background-size: 100% 100%;
        }
      }
      .chat-edit-bar {
        width: 100%;
        height: 23%;
        vertical-align: middle;
        display: flex;
        align-items: center;
        background: rgb(44, 47, 53);
        border: 1px solid rgb(60, 64, 73);
        border-right: 0;
        border-left: 0;
        cursor: pointer;
        .pd-20 {
          margin: 0 10px;
          height: 26px;
          line-height: 26px;
          font-size: 14px;
          vertical-align: middle;
          cursor: pointer;
          user-select: none;
        }
        @media screen and (max-width: 1000px) {
          .pd-20 {
            margin: 0 4px!important;
          }
        }
        span.pd-20 {
          padding: 0 4px;
          border: 1px solid rgb(255, 198, 0);
          color: rgb(255, 198, 0);
          cursor: pointer;
        }
      }
      .chat-edit-option {
        width: 100%;
        height: 77%;
        background: #2c2f35;
        display: flex;
        align-items: center;
      }
      .chat-edit-input {
        width: calc(100% - 12px);
        height: 90%;
        margin: 0 auto;
        padding: 10px;
        font-size: 16px;
        float: left;
        background-color: #343840;
        color: #fff;
        border: 1px solid #202328;
        overflow-y: visible;
        overflow-x: hidden;
        word-break: break-all;
        &::-webkit-scrollbar {
          width: 0;
        }
        &:focus {
          outline: none;
        }
      }
      .chat-edit-send {
        width: 54px;
        height: 28px;
        line-height: 28px;
        background-color: rgb(254, 214, 65);
        color: rgb(154, 97, 15);
        position: absolute;
        right: 18px;
        bottom: 20px;
        text-align: center;
        font-size: 14px;
        cursor: pointer;
      }
    }
  }
</style>
