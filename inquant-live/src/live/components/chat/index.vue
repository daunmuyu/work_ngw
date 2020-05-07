<template>
  <div class="chat-container">
    <div :class="['message-wraper', {'no-editor': time}]">
      <message-list
        :time="time"
        @moreList="content => $emit('moreList', content)"
        :list="messageList"
        :userInfo="userInfo"
      ></message-list>
    </div>
    <div v-if="!time" class="editor-wraper">
      <editor
        @sendMessage="content => $emit('sendMessage', content)"
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
    time: {
      type: Boolean
    },
    userInfo: {
      type: Object
    },
    clearMsgList: {
      type: Function
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
  .message-wraper {
    position: absolute;
    top: 0;
    bottom: 143px;
    left: 0;
    right: 0;
    overflow-y: auto;

    &.no-editor {
      bottom: 0;
    }
  }
  .editor-wraper {
    position: absolute;
    bottom: 34px;
    width: 100%;
    height: 143px;
    background-color: #fff;
    
  }
}
.night {
  .editor-wraper {
    background-color: #1e1e22;
  }
}
</style>


