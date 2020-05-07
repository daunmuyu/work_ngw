<template>
  <div class="video-pane">
    <div class="video-item" v-for="(video, index) in videoList" :key="index" :class="{'selected': index === currentVideo}" @click="changeVideo(index)">
      <!-- <img class="cover" :src="video.cover" align="left" hspace="5" vspace="5"/> -->
      <div class="img-container" :class="['img-container', {'show-play-icon': showPlayIcon}]">
        <img class="cover" :src="video.cover"/>
        <div class="svg-container">
          <svg class="icon play-icon" t="1532590845362" style="" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3818" xmlns:xlink="http://www.w3.org/1999/xlink" width="37" height="37"><path d="M971.318029 311.269053a497.152 497.152 0 0 0-106.792421-158.423579 496.505263 496.505263 0 0 0-158.450526-106.792421A495.535158 495.535158 0 0 0 512.000135 6.844632 497.152 497.152 0 0 0 159.474661 152.845474a496.505263 496.505263 0 0 0-106.792421 158.450526A495.535158 495.535158 0 0 0 13.473819 505.344a497.152 497.152 0 0 0 146.000842 352.525474 496.505263 496.505263 0 0 0 158.450526 106.765473 495.535158 495.535158 0 0 0 194.074948 39.235369 497.152 497.152 0 0 0 352.525473-146.000842 496.505263 496.505263 0 0 0 106.792421-158.450527A495.535158 495.535158 0 0 0 1010.526451 505.397895c0-67.341474-13.123368-132.554105-39.208422-194.101895zM512.000135 951.915789c-246.191158 0-446.544842-200.353684-446.544842-446.544842 0-246.191158 200.353684-446.544842 446.544842-446.544842 246.191158 0 446.544842 200.353684 446.544842 446.517895 0 246.218105-200.353684 446.571789-446.544842 446.571789z" fill="#AEAFB3" p-id="3819"></path><path d="M705.670872 488.582737l-311.296-208.545684c-13.069474-9.458526-30.585263 0.188632-30.585264 16.78821v417.091369c0 16.599579 17.515789 26.246737 30.585264 16.761263l311.457684-208.518737c11.129263-8.138105 10.967579-25.438316-0.161684-33.576421z" fill="#AEAFB3" p-id="3820"></path></svg>
        </div>
      </div>
      <div class="des-container">
        <p class="video-title">{{video.liveTitle}}</p>
        <p class="video-description">{{video.description || ''}}</p>
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
      type: Number,
    }
  },
  data() {
    return {
      showPlayIcon: true
    }
  },
  methods: {
    changeVideo(index) {
      this.$emit('changeVideo', index);
    }
  }
};
</script>
<style lang="scss" scoped>
.video-pane {
  height: 100%;
  // padding: 20px 15px 0;
  // background: #fff;
  .video-item {
    clear: both;
    overflow: hidden;
    background-color: #f7f7f7;
    // margin-bottom: 10px;
    margin: 10px 14px 0 9px;
    padding: 12px 5px 10px 11px;
    border-radius: 3px;
    display: flex;

    &:hover {
      .svg-container {
        // display: flex !important;
        opacity: 0.51 !important;
        transition: 0.5s;
      }
    }

    font-size: 16px;
    &.selected {
      .svg-container {
        // display: flex !important;
        opacity: 0.51 !important;
        svg {
          transition: 0.5s;
          transform: scale(1.3);
        }
      }
    }
    div.img-container {
      width: 142px;
      margin-right: 6px;
      // height: 75px;
      font-size: 0;
      position: relative;
      // background-color: #000;
      // opacity: 0.51;

      .svg-container {
        // display: none;
        opacity: 0;
        position: absolute;
        background-color: #000;
        width: 100%;
        top: 0;
        left: 0;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
      }
      img.cover {
        width: 142px;
        margin-right: 6px;
        // height: 75px;
        // top: 0;
        font-size: 0;
      }
    }
    
    .video-title{
      font-size: 16px;
      color: #3F424E;
    }
    .video-description{
      margin-top: 9px;
      font-size: 12px;
      color: #6E717E;
    }
  }
}
.night {
  .video-item {
    background: #141414;
    .video-title{
      color: #AEAFB3;
    }
    .video-description{
      color: #818390;
    }
  }
}
</style>
