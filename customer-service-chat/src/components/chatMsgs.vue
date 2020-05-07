<template>
  <div class="chatMsg" id="chatMsgs">
    <div class="chat-edit">
      <div contentEditable="true" id="msgs" autofocus
        class="chat-edit-input" placeholder="请输入信息..."
        ref="edits" @keydown="keydownEnter($event)"></div>
    </div>
    <div class="chat-btn-pane">
      <div class="chat-send">
        <button @click="send" ref="send">发送</button>
      </div>
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
      <!-- <div><p>回车键(enter)发送信息，ctrl+enter换行</p></div> -->
    </div>
  </div>
</template>
<script>
import $ from 'jquery';
import 'jquery-form';
import { mapGetters } from 'vuex';
import { getCSToken } from '../store/authToken.js';
import { IMAddMsgBatch } from '../service/api.js';
import { contentToSend, emojiCode, faceToImg, delay } from '../service/utils.js';

export default {
  name: 'ChatMsg',
  props: ['userids'],
  data() {
    return {
      uInfo: null,
      showEJ: false,
      isVoice: false,
      recordType: 0,
      recordDur: 0,
      recBlob: null,
      rstart: 0,
      rend: 0,
    };
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  mounted() {
  },
  watch: {
    userInfo(val) {
      this.uInfo = val;
    },
  },
  methods: {
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
      if (e.ctrlKey && +e.keyCode === 13) {
        const brdiv = document.createElement('br');
        if (!/<br>$/.test(document.getElementById('msg').innerHTML.substring(this.rend))) {
          $('#msg').append('<br>');
        }
        this.insertInputTxt(range, brdiv);
      } else if (+e.keyCode === 13) {
        e.cancelBubble = true;
        e.preventDefault();
        e.stopPropagation();
        this.send();
      }
    },
    clickEmoji(idx) {
      this.showEJ = false;
      const curremojicode = `[${emojiCode[idx - 1]}]`;
      document.getElementById('msgs').innerHTML += faceToImg(curremojicode);
    },
    handleCommand(contentType) {
      const num = new Date().getTime();
      $('#chatMsgs').append(`<form enctype="multipart/form-data" method="post" id="forms${num}" class="hidden"><input type="file" name="Content" id="files${num}"></form>`);
      $(`#files${num}`).click();
      $(`#files${num}`).on('change', () => {
        delay(() => {
          const notify = this.$notify({
            title: '提示',
            message: '文件正在上传中请稍等~ ',
            duration: 0,
            showClose: false,
          });
          if (+contentType === 4) { // 发送视频
            console.log($(`#files${num}`));
            const file = $(`#files${num}`)[0].files[0];
            const reader = new FileReader();
            let width;
            let height;
            reader.addEventListener('load', () => {
              const $videoEl = $(`<video id="videoMain" src="${reader.result}"></video>`);
              $('body').append($videoEl);
              $videoEl[0].addEventListener('loadedmetadata', () => {
                console.log($videoEl[0].videoWidth, $videoEl[0].videoHeight, contentType);
                width = $videoEl[0].videoWidth;
                height = $videoEl[0].videoHeight;
                this.ajaxFrom(num, { width, height, contentType }, notify);
              });
            }, false);
            if (file) reader.readAsDataURL(file);
          } else {
            this.ajaxFrom(num, { contentType }, notify);
          }
        });
      });
    },
    ajaxFrom(num, data, notify) {
      $(`#forms${num}`).ajaxSubmit({
        url: 'https://imapi.stockhn.com/api/AddMessageBatch.ashx',
        data: {
          usertoken: getCSToken(),
          toIDs: this.userids,
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
        },
      });
    },
    send(contentType = 0, val) {
      delay(() => {
        const html = document.getElementById('msgs').innerHTML;
        const content = val || contentToSend(html).replace(/<[^>]+>/g, '');
        IMAddMsgBatch({
          usertoken: getCSToken(),
          toIDs: this.userids,
          contentType,
          content,
        }).then((res) => {
          if (+res.result) {
            document.getElementById('msgs').innerHTML = '';
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
      }).then(({ value }) => {
        this.send(0, value);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入',
        });
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import '../styles/chat-msg.scss';
</style>
