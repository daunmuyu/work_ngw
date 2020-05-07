<template>
  <div class="live-wrapper" id="after-top-pane" v-if="liveData">
    <div class="section-title">VIP直播室</div>
    <div class="after-video-pane" @click="toLive">
      <div class="video-icon">
        <img src="../images/video_bg.png" alt="">
      </div>
      <div class="video-content">
        <div class="brief-pane">
          <p>{{liveData.title}}</p>
        </div>
        <div class="vider-type">
          <img src="../images/after/clock.png">
          <template v-if="liveType == 2">
            <span>直播进行中></span>
          </template>
          <template v-else>
            <span>视频结束 进入图文直播间></span>
          </template>
        </div>
      </div>
    </div>
    <!-- <div class="trailer-pane">
      <div class="trailer-icon">
        <span>预告</span>
      </div>
      <div class="trailer-list border-ios" v-for="(item,index) in courseData" :key="index">
        <h5>{{item.title}}</h5>
        <p>{{item.timeLine}}</p>
        <p>{{item.intro}}</p>
      </div>
    </div> -->
    <router-link class="box-more right border-ios" to="/live-list">
      <span>点击查看更多视频</span>
    </router-link>
    <!-- <a 
      class="box-more right border-ios" :href="'https://h5.niuguwang.com/huodong/base/list/directory.html?usertoken=' + usertoken"
    >
      <span>点击查看更多视频</span>
    </a> -->
  </div>
</template>
<script type="text/ecmascript-6">
import Vue from "vue";
import bridge from 'ng-bridge';
import { Toast } from "mint-ui";
import { mapState } from 'vuex';
import { getLive, getCourse, COURSE_ID, LIVE_ROOM_ID } from "../api/index";

export default {
  data() {
    return {
      liveData: null,
      liveType: '-1',
      courseData: null
    };
  },
  computed: {
    ...mapState([
      'usertoken',
      'isH5',
      "isLive"
    ])
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      getLive({
        id: LIVE_ROOM_ID[COURSE_ID],
      }).then(res => {
        if (+res.code === 0) {
          this.liveData = res.data.video;
          this.liveType = res.data.video.liveType;
        }
      });
      getCourse().then(res => {
        if (+res.code === 0) {
          this.courseData = res.feedata;
        }
      });
    },
    // 去直播间
    toLive() {
      const { liveType, liveId, userId, videoId } = this.liveData;
      let applive = 0;
      if (this.isLive) {
        applive = 1;
      }
      if (this.isH5) {
        // 外链
        // location.href = `https://h5.niuguwang.com/public/live/index.html?applive=${applive}&isH5=1&liveid=${liveId}`;
        location.href = `/public/live/index.html?applive=${applive}&isH5=1&liveid=${liveId}`;
      } else {
        // app内
        const tys = Number(this.liveType) === 2 ? 1 : 0;
        if (liveType !== '2') {
          bridge.toOpenNativeLive(liveId, userId);
        } else {
          bridge.toOpenScreenLive(videoId, liveId, userId, tys);
        }
      }
    },
  }
};
</script>
<style rel="stylesheet/sass" lang="scss" type="text/sass">
@import "../lib/common.scss";

.live-wrapper {
  background-color: #fff;
  margin-bottom: pxToRem(12px);
  .after-video-pane {
    height: pxToRem(90px);
    display: flex;
    .video-icon {
      flex: 3;
      margin: pxToRem(14px);
      img {
        width: 100%;
      }
    }
    .video-content {
      flex: 7;
      .brief-pane {
        margin: pxToRem(16px) 0 0;
        margin-right: pxToRem(12px);
        font-size: 16px;
        line-height: pxToRem(21px);
        p {
          height: auto;
          word-wrap: break-word;
          word-break: break-all;
          overflow: hidden;
        }
      }
      .vider-type {
        margin-top: pxToRem(7px);
        display: flex;
        img {
          width: pxToRem(14px);
          height: pxToRem(14px);
          display: inline-block;
        }
        span {
          color: rgb(255, 76, 81);
          display: inline-block;
          padding-left: pxToRem(5px);
          line-height: pxToRem(18px);
          font-size: 12px;
        }
      }
    }
  }
  .trailer-pane {
    margin: 0 pxToRem(13px);
    .trailer-icon {
      height: pxToRem(42px);
      overflow: hidden;
      line-height: pxToRem(52px);
      clear: both;
      span {
        background-image: url("../images/after/icon.png");
        background-size: pxToRem(14.5px) pxToRem(12px);
        background-repeat: no-repeat;
        background-position: left center;
        padding-left: pxToRem(20px);
        font-size: 12px;
        color: rgb(51, 51, 51);
      }
    }
    .trailer-list {
      padding: pxToRem(10px);
      & + .trailer-list {
        border-bottom: 1px solid rgb(232, 232, 232);
      }
      &:last-child {
        border: none;
      }
      h5 {
        font-size: 16px;
        line-height: pxToRem(24px);
        color: RGB(51, 51, 51);
      }
      p {
        color: #333;
        font-size: 14px;
        line-height: 1.5;
      }
    }
  }
}
</style>
