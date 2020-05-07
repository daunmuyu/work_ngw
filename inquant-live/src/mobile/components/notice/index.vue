<template>
  <div class="" :class="['notice-pane', {'show-img': fullImg}]">
    <img ref="imgAnimation" :src="noticeImg"/>
  </div>
</template>
<script>
export default {
  data() {
    return {
      fullImg: false,
    }
  },
  props: {
    noticeImg: {
      type: String,
      required: true
    }
  },
  methods: {
    // showImg() {
    //   this.fullImg = this.fullImg ? false : true;
    // }
  }
};
</script>
<style scoped lang="scss">
.notice-pane {
  transition: 1s;
  padding: 20px 15px 0;
  // -webkit-overflow-scrolling: touch;
  overflow-y: scroll;
  // height: 100%;
  img {
    width: 100%;
  }
  &.show-img {
      position: fixed;
      background-color: rgba($color: #000000, $alpha: 0.5);
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      // z-index: 200000;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 80%;
      }
    }
}
</style>
