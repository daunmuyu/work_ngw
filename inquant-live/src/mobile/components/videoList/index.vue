<template>
  <div class="video-pane">
    <div class="video-item" v-for="(video, index) in videoList" :key="index" :class="{'selected': index === currentVideo}" @click="changeVideo(index)">
      <div class="cover"><img :src="video.cover" /></div>
      <div class="content">
        <p class="title">{{video.liveTitle}}</p>
        <p class="description">{{video.description || ''}}</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    videoList: {
      type: Array,
      required: true
    },
    currentVideo: {
      type: Number
    }
  },
  methods: {
    changeVideo(index) {
      this.$emit("changeVideo", index);
    }
  }
};
</script>
<style lang="scss" scoped>
.video-pane {
  height: 100%;
  padding: 20px 15px 0;
  // background: #666;
  .video-item {
    border: 1px solid #aaa;
    display: flex;
    margin-bottom: 10px;
    &.selected {
      border: 1px solid #b1ad76;
      color: #b1ad76;
    }
    .cover {
      font-size: 0;
      flex: 0 0 100px;
      width: 100px;
      height: 75px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .content {
      flex: 1 1 auto;
      padding-left: 10px;
      .title {
        font-size: 16px;
      }
      .description {
        font-size: 12px;
      }
    }
  }
}
</style>
