<template>
  <div class="chat-container">
    <div class="message-wraper">
      <message-list
        :list="messageList"
        @moreList="content => $emit('moreList', content)"
        :jinyan-list="jinyanList"
        @delMsg="(msg) => $emit('delMsg', msg)"
        @jinyan="(msg) => $emit('jinyan', msg)"
        @checkMsg="(msg) => $emit('checkMsg', msg)"
        @setReply="(msgItem) => $emit('setReply', msgItem)"
      ></message-list>
    </div>
    <div class="editor-wraper">
      <editor
        :placeholder="editorPlaceHolder"
        @sendMessage="(content,isViewPoint) => $emit('sendMessage', content,isViewPoint)"
        @clearMsgList="$emit('clearMsgList')"
      ></editor>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import Editor from "./editor";
import MessageList from "./message-list";

export default Vue.extend({
  props: {
    messageList: {
      type: Array
    },
    jinyanList: {
      type: Array
    },
    editorPlaceHolder: {
      type: String,
      default: "来跟大神聊聊天"
    }
  },
  components: {
    Editor,
    MessageList
  },
  data() {
    return {};
  }
});
</script>
<style scoped lang="scss">
.chat-container {
  // position: relative;
  height: 100%;
  background: #666;
  // padding-top: 20px;
  .message-wraper {
    position: absolute;
    top: 0;
    bottom: 300px;
    left: 0;
    right: 0;
    overflow-y: auto;
  }
  .editor-wraper {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 300px;
  }
}
</style>


