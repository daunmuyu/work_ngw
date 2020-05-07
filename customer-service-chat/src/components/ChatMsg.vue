<template>
  <div class="chatMsg" id="chatMsg">
    <div class="chat-edit" v-show="!isVoice">
      <div contentEditable="true" id="msg" autofocus
        class="chat-edit-input" placeholder="请输入要发送的内容~ 回车键(enter)发送信息，ctrl+enter换行"
        ref="edit" @keydown="keydownEnter($event)"></div>
        <!-- @keyup.enter.prevent="send" -->
    </div>
    <div class="chat-voice" v-show="isVoice">
      <div class="voice-time">
        <img v-if="recordType == 0" src="../assets/icon/shichang_icon.png" alt="">
        <img v-if="recordType == 1" src="../assets/icon/shichang_jinxing_icon.png" alt="">
        <img v-if="recordType == 2" src="../assets/icon/shichang_end_icon.png" alt="">
        <span v-if="recordType != 1" :class="{'fontBl': recordDur}">时长 {{recordDur}}’’</span>
        <span v-if="recordType == 1" class="fontRd">录制中...</span>
      </div>
      <div class="voice-btn" @click="recording">
        <img  v-if="recordType != 1" src="../assets/icon/luzhi_icon.png" alt="">
        <img  v-if="recordType == 1" src="../assets/icon/zanting_icon.png" alt="">
      </div>
      <div class="voice-re" @click="reRecord">重录</div>
    </div>
    <div class="chat-btn-pane">
      <div class="chat-send">
        <button @click="send" ref="send">发送</button>
      </div>
      <template v-if="!isVoice">
        <el-dropdown placement="top" @command="handleCommand">
          <span class="el-dropdown-link">
            <div class="chat-file chaticon"></div>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="3">发送文件</el-dropdown-item>
            <el-dropdown-item command="4">发送视频</el-dropdown-item>
            <el-dropdown-item command="1">发送图片</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <div class="chat-url chaticon" @click="openUrl"></div>
        <el-popover placement="top" v-model="showEJ">
        <div class="chatEmoji">
          <div class="imgemoji" v-for="item in 68" :key="item" @click.stop="clickEmoji(item)">
            <img :src='"../assets/emoji/"+item+".png"' alt="">
          </div>
        </div>
        <div slot="reference" class="chat-emjio chaticon"></div>
        </el-popover>
        <div class="chat-zixun chaticon" @click="openZxun"></div>
        <div class="chat-history chaticon" @click="openHist"></div>
      </template>
      <div class="phoneticWriting">
        <div :class="{'active': !isVoice}" @click="isVoiceClick">文字</div>
        <div :class="{'active': isVoice}" @click="isVoiceClick">语音</div>
      </div>
    </div>
    <chat-zixun></chat-zixun>
    <chat-history></chat-history>
  </div>
</template>
<script>
import $ from 'jquery';
import qs from 'qs';
import 'jquery-form';
import { mapGetters, mapMutations } from 'vuex';
import '@/libs/Recorder/recorder,mp3.min.js';
import { getCSToken } from '@/store/authToken.js';
import { IMAddMsg } from '@/service/api.js';
import { contentToSend, emojiCode, faceToImg, delay, useridArr } from '@/service/utils.js';

import ChatZixun from './ChatZixun';
import ChatHistory from './ChatHistory';

// const recorder = new Recorder();
const rec = window.Recorder();

export default {
  name: 'ChatMsg',
  props: ['atUser'],
  data() {
    return {
      uInfo: null,
      showEJ: false,
      ctrlKey: false,
      userIDs: [],
      isVoice: false,
      recordType: 0,
      recordDur: 0,
      recBlob: null,
      rstart: 0,
      rend: 0,
    };
  },
  components: {
    ChatZixun,
    ChatHistory,
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  mounted() {
    document.addEventListener('paste', (event) => {
      console.log(event);
      let isChrome = false;
      if (event.clipboardData || event.originalEvent) {
        // 某些chrome版本使用的是event.originalEvent
        const clipboardData = (event.clipboardData || event.originalEvent.clipboardData);
        if (clipboardData.items) {
          // for chrome
          const items = clipboardData.items;
          const len = items.length;
          let blob = null;
          isChrome = true;
          for (let i = 0; i < len; i += 1) {
            console.log(items[i]);
            if (items[i].type.indexOf('image') !== -1) {
              // getAsFile() 此方法只是living standard firefox ie11 并不支持
              blob = items[i].getAsFile();
              console.log(blob, isChrome);
              this.imgUpdate(blob);
            }
          }
        }
      }
    });
  },
  watch: {
    userInfo(val) {
      this.uInfo = val;
      if (this.isVoice) {
        this.reRecord();
        this.isVoice = false;
      }
      if (!this.isVoice) document.getElementById('msg').innerHTML = '';
    },
    atUser(val) {
      this.userIDs.push(val);
      document.getElementById('msg').innerHTML += ` @${val.userName}&nbsp;&nbsp; `;
    },
  },
  methods: {
    ...mapMutations(['ZXUN_SHOW', 'HIST_SHOW']),
    isVoiceClick() {
      this.isVoice = !this.isVoice;
      this.reRecord();
    },
    reRecord() {
      rec.close();
      this.recordType = 0;
      this.recordDur = 0;
      this.recBlob = null;
      // document.body.removeChild(document.getElementById('audioVicoe'));
    },
    recording() {
      this.recordType += 1;
      if (this.recordType > 2) {
        this.recordType = 2;
        return;
      }
      if (this.recordType === 1) {
        rec.open(() => {
          rec.start();
        });
      } else {
        rec.stop((blob, duration) => {
          console.log(URL.createObjectURL(blob), duration);
          this.recordDur = Math.round(duration / 1000);
          this.recBlob = blob;
        }, (err) => {
          console.log('stop=>', err);
        });
      }
    },
    recordTypeKey() {
      if (this.recordType < 2) {
        rec.stop((blob, duration) => {
          this.recordDur = Math.round(duration / 1000);
          this.recBlob = blob;
          this.recordSend(2);
        }, (err) => {
          console.log('stop=>', err);
        });
      } else {
        this.recordSend(2);
      }
    },
    recordSend(cType, imgUrl) {
      const msgArr = ['消息文本', '图片信息', '语音信息', '文件文本', '视频文件'];
      const fileName = cType === 2 ? 'recorder.mp3' : 'image.png';
      const blob = cType === 2 ? this.recBlob : imgUrl;
      const data = new FormData();
      console.log(imgUrl, blob);
      data.append('Content', blob, fileName);
      const notify = this.$notify({
        title: '提示',
        message: `${msgArr[cType]}正在上传中请稍等~ `,
        duration: 0,
        showClose: false,
      });
      const params = {
        usertoken: getCSToken(),
        toID: this.uInfo.relationID,
        messageType: this.uInfo.messageType,
        contentType: cType,
        dur: this.recordDur * 1000,
      };
      $.ajax({
        url: `https://imapi.stockhn.com/api/AddMessage.ashx?${qs.stringify(params)}`,
        type: 'POST',
        contentType: false, // 让xhr自动处理Content-Type header，multipart/form-data需要生成随机的boundary
        processData: false, // 不要处理data，让xhr自动处理
        data,
        success: (res) => {
          notify.close();
          const rs = JSON.parse(res);
          if (!+rs.code) this.reRecord();
          if (+rs.code !== 0) {
            this.$message({
              message: rs.message,
              type: 'error',
            });
          }
        },
        error: (err) => {
          notify.close();
          this.$message({
            message: err || '发送失败，请稍后重试',
            type: 'error',
          });
        },
      });
    },
    openHist() {
      this.HIST_SHOW({
        isShow: true,
        isCurr: '',
      });
    },
    openZxun() {
      this.ZXUN_SHOW(true);
    },
    editChange() {
      const text = $('#msg').text().trim();
      if (!text) {
        $('#msg').html('');
      } else {
        $('#msg').html($('#msg').html());
      }
    },
    imgUpdate(imgUrl) {
      this.$confirm(`<img src="${URL.createObjectURL(imgUrl)}">`, '发送图片', {
        confirmButtonText: '发送',
        cancelButtonText: '取消',
        type: 'info',
        center: true,
        dangerouslyUseHTMLString: true,
      }).then(() => {
        console.log(imgUrl);
        this.recordSend(1, imgUrl);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消发送',
        });
      });
    },
    insertInputTxt(range, brdiv) {
      const newrange = document.createRange();
      // 设置新的range的位置，也是插入元素的位置
      newrange.setStart(range.startContainer, this.rstart);
      newrange.setEnd(range.startContainer, this.rend);
      newrange.insertNode(brdiv);
      // 去掉旧的range对象，用新的range对象替换
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
      // 将光标的位置向后移动一个偏移量，
      range.setStartAfter(brdiv, 1);
    },
    keydownEnter(e) {
      const range = window.getSelection().getRangeAt(0);
      this.rstart = range.startOffset;
      this.rend = range.endOffset;
      if ((e.ctrlKey || e.altKey || e.shiftKey) && +e.keyCode === 13) {
        // this.insertInputTxt('<br>');
        // 获取光标的range对象 event.view 是一个window对象
        // 新建一个换行div元素
        const brdiv = document.createElement('br');
        console.log(brdiv);
        // 创建一个新的range对象
        if (!/<br>$/.test(document.getElementById('msg').innerHTML.substring(this.rend))) {
          console.log(document.getElementById('msg').innerHTML.substring(this.rend));
          // const br = document.createElement('br');
          // newrange.insertNode(br);
          $('#msg').append('<br>');
        }
        this.insertInputTxt(range, brdiv);
      } else if (+e.keyCode === 13) {
        e.cancelBubble = true;
        e.preventDefault();
        e.stopPropagation();
        this.send();
      }
      // document.getElementById('msg').innerHTML += document.getElementById('msg').innerHTML;
    },
    clickEmoji(idx) {
      console.log(this.rstart, this.rend);
      this.showEJ = false;
      const curremojicode = `[${emojiCode[idx - 1]}]`;
      document.getElementById('msg').innerHTML += faceToImg(curremojicode);
    },
    handleCommand(contentType) {
      const num = new Date().getTime();
      const msgArr = ['消息文本', '图片信息', '语音信息', '文件文本', '视频文件'];
      $('#chatMsg').append(`<form enctype="multipart/form-data" method="post" id="form${num}" class="hidden"><input type="file" name="Content" id="file${num}"></form>`);
      $(`#file${num}`).click();
      $(`#file${num}`).on('change', () => {
        delay(() => {
          const notify = this.$notify({
            title: '提示',
            message: `${msgArr[contentType]}正在上传中请稍等~ `,
            duration: 0,
            showClose: false,
          });
          if (+contentType === 4) { // 发送视频
            const file = $(`#file${num}`)[0].files[0];
            const reader = new FileReader();
            let width;
            let height;
            let dur;
            reader.addEventListener('load', () => {
              const $videoEl = $(`<video id="videoMain" src="${reader.result}"></video>`);
              $('body').append($videoEl);
              $videoEl[0].addEventListener('loadedmetadata', () => {
                width = $videoEl[0].videoWidth;
                height = $videoEl[0].videoHeight;
                dur = parseInt($videoEl[0].duration * 1000, 10);
                console.log(width, height, dur, contentType);
                this.ajaxFrom(num, { width, height, dur, contentType }, notify);
                // $('body').remove($videoEl[0]);
                $('#videoMain').remove();
              });
            }, false);
            if (file) reader.readAsDataURL(file);
          } else {
            this.ajaxFrom(num, { contentType }, notify);
          }
        }, 300);
      });
    },
    ajaxFrom(num, data, notify) {
      $(`#form${num}`).ajaxSubmit({
        url: 'https://imapi.stockhn.com/api/AddMessage.ashx',
        data: {
          usertoken: getCSToken(),
          toID: this.uInfo.relationID,
          messageType: this.uInfo.messageType,
          ...data,
        },
        dataType: 'json',
        success: (res) => {
          notify.close();
          if (+res.result !== 1) {
            this.$message({
              message: res.message || '发送失败，请稍后重试',
              type: 'error',
            });
          }
          $(`#form${num}`).remove();
        },
        error: (err) => {
          notify.close();
          this.$message({
            message: err || '发送失败，请稍后重试',
            type: 'error',
          });
          $(`#form${num}`).remove();
        },
      });
    },
    send(contentType = 0, val) {
      const atUserIDs = useridArr(this.userIDs);
      if (this.isVoice) {
        delay(() => {
          this.recordTypeKey();
        }, 300);
        return;
      }
      delay(() => {
        const html = document.getElementById('msg').innerHTML;
        const content = val || contentToSend(html).replace(/<[^>]+>/g, '');
        IMAddMsg({
          usertoken: getCSToken(),
          toID: this.uInfo.relationID,
          atUserIDs,
          messageType: this.uInfo.messageType,
          contentType,
          content,
        }).then((res) => {
          if (+res.result) {
            document.getElementById('msg').innerHTML = '';
            this.userIDs = [];
          } else {
            this.$message({
              message: res.message || '信息错误',
              type: 'warning',
            });
          }
        });
      }, 300);
    },
    openUrl() {
      this.$prompt('请输入链接地址', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        // inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
        // inputErrorMessage: '邮箱格式不正确'
      }).then(({ value }) => {
        this.send(0, value);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入',
        });
      });
    },
    tab(event) {
      // 阻止默认切换元素的行为
      if (event && event.preventDefault) {
        event.preventDefault();
      } else {
        window.event.returnValue = false;
      }
      // 获取光标的range对象 event.view 是一个window对象
      const range = event.view.getSelection().getRangeAt(0);
      // 光标的偏移位置
      const offset = range.startOffset;
      // 新建一个span元素
      const span = document.createElement('span');
      // 四个-表示四个空格
      span.innerHTML = '    ';
      // 创建一个新的range对象
      const newrange = document.createRange();
      // 设置新的range的位置，也是插入元素的位置
      newrange.setStart(range.startContainer, offset);
      newrange.setEnd(range.startContainer, offset);
      newrange.collapse(true);
      newrange.insertNode(span);
      // 去掉旧的range对象，用新的range对象替换
      event.view.getSelection().removeAllRanges();
      event.view.getSelection().addRange(range);
      // 将光标的位置向后移动一个偏移量，放到加入的四个空格后面
      range.setStart(span, 1);
      range.setEnd(span, 1);
    },
  },
};
</script>
<style lang="scss" scoped>
@import '../styles/chat-msg.scss';
</style>
