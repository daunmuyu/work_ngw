<template>
  <div class="chat-container">
    <div class="message-wraper">
      <message-list @getList="getList" :list="messageList"></message-list>
    </div>
    <div class="editor-wraper">
      <editor
      @sendMessage="content => $emit('sendMessage', content)"
      @clearMsgList="$emit('clearMsgList')"
      ></editor>
    </div>
  </div>
</template>
<script>
import Vue from 'vue';
import Editor from './editor';
import MessageList from './message-list';

export default Vue.extend({
  props: {
    messageList: {
      type: Array,
    },
  },
  components: {
    Editor,
    MessageList,
  },
  methods: {
    getList(callBack) {
      this.$emit('getList', callBack)
    }
  },
  data() {
    return {};
  },
});
</script>
<style scoped lang="scss">
.chat-container {
  position: relative;
  height: 100%;
  // background: #666;
  // padding-top: 20px;
  .message-wraper{
    position: absolute;
    top: 0;
    bottom: 42px;
    left: 0;
    right: 0;
    overflow-y: auto;
  }
  .editor-wraper{
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 42px;
  }
}
</style>


