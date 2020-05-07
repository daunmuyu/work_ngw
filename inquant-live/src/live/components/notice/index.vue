// 预告
<template>
  <div class="notice-pane">
    <img :src="noticeImg" />
  </div>
</template>
<script>
export default {
  props: {
    noticeImg: {
      type: String,
      required: true
    }
  }
};
</script>
<style scoped lang="scss">
.notice-pane {
  padding: 20px 15px 0;
  height: 100%;
  background: #666;
  img {
    width: 100%;
  }
}
</style>


