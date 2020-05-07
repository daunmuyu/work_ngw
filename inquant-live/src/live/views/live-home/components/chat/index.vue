<template>
  <div class="chat-container" ref="chat">
    <div :class="['message-wraper', {'no-editor': time}]" ref="message">
      <message-list
        :time="time"
        @moreList="content => $emit('moreList', content)"
        :list="messageList"
        :userInfo="userInfo"
      ></message-list>
    </div>
    <div v-if="!time" class="editor-wraper" ref="editor">
      <editor
        @sendMessage="content => $emit('sendMessage', content)"
        @clearMsgList="$emit('clearMsgList')"
        :isLive="isLive"
      ></editor>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import Editor from "./editor";
import MessageList from "./message-list";
import search from '../../../../../lib/urlSearch.js';
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
    isLive:{
      type: Boolean,
    }
  },
  components: {
    Editor,
    MessageList
  },
  data() {
    return {};
  },
  mounted(){
    if(+search('isWeb')=== 1){
      // this.$refs.editor.style.height = '0px';
      // this.$refs.message.style.bottom = '10px';
      // this.$refs.chat.style.height = 'calc(100% - 68px)';
    }
  },
});
</script>
<style scoped lang="scss">
.chat-container {
  position: relative;
  height: 95%;
  .message-wraper {
    position: absolute;
    top: 0;
    bottom: 90px;
    left: 0;
    right: 0;
    overflow-y: auto;

    &.no-editor {
      bottom: 0;
    }
  }
  .editor-wraper {
    position: absolute;
    bottom: -8px;
    width: 100%;
    height: 90px;
    background-color: #fff;
  }
}
.night {
  .editor-wraper {
    background-color: #1e1e22;
  }
}
</style>


