<template>
  <div class="wrapper">
    <div class="video-wrapper">
      <video id="liveVideo" class="video-js vjs-big-play-centered" autoplay preload="auto" :poster="videoInfo.cover" controls controlslist="nodownload" width="100%" data-setup="{}" x5-video-player-type="h5">
        <source :src="videoInfo.url" type="video/mp4" id="videoSource"></source>
      </video>
    </div>
    <section class="fixed">
      <div class="video-name">
        {{ videoInfo.title }}
      </div>
      <div class="list-wrapper">
        <h5>更多精彩视频</h5>
        <ul class="list-content">
          <li class="border-bottom-1px" v-for="(item, index) in roomList" :key="index" @click="tabVideo(index)">
            <img :src="item.img" alt="video-list-banner" class="item-img" />
            <div class="item-text">
              <p class="title">{{ item.title }}</p>
              <p class="label">
                <span>
                  {{item.date}} {{item.totalTime}}
                </span>
              </p>
            </div>
          </li>
        </ul>
        <p class="more" v-show="hasMore" @click="loadMore">点击查看更多
          <i class="arrow-down"></i>
        </p>
      </div>
    </section>
  </div>
</template>

<script>
import Vue from "vue";
import { mapState } from "vuex";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import { fetchLiveList } from "../api/index.js";

let currentPage = 1;

export default {
  data() {
    return {
      hasMore: true,
      // 当前在播放的视频的信息
      videoInfo: {},
      // video 的 dom对象
      videoDom: {},
      // 视频原始数据
      dataList: [],
      // 视频列表展示数据
      roomList: []
    };
  },
  computed: {
    ...mapState(["usertoken", "videoData"])
  },
  created() {
    this.init();
  },
  mounted() {
    this.$nextTick(() => {
      this.videoDom = document.getElementById("liveVideo");
    });
  },
  beforeDestroy() {
    this.videoDom.dispose();
  },
  methods: {
    init() {
      const videoData = this.videoData;
      this.listID = videoData.listID;
      this.videoInfo = { ...this.videoData };
      this.fetchData();
    },
    tabVideo(index) {
      this.videoInfo = this.roomList[index];
      this.filterList();
      this.videoDom.src = this.videoInfo.url;
      this.videoDom.pause();
      setTimeout(() => {
        this.videoDom.load();
        this.videoDom.controls = "controls";
      }, 1500);
      this.videoDom.play();
    },
    fetchData() {
      fetchLiveList({
        usertoken: this.usertoken,
        exid: this.listID,
        action: "getpartvideolist",
        curpage: currentPage,
        pagesize: 10
      }).then(res => {
        if (res && +res.code === 0) {
          if (Number(res.totalcount) <= this.dataList.length + 10) {
            this.hasMore = false;
          } else {
            this.hasMore = true;
          }
          const data = res.data.map(item => {
            return {
              img: item.cover,
              totalTime: item.dateDiff,
              title: item.title,
              date: item.addTime,
              url: item.replayurl,
              vid: item.vid,
            };
          });
          this.dataList = [...this.dataList].concat(data);
          this.filterList();
        }
      });
    },
    // roomList 数据展示的数据会变
    filterList() {
      const index = this.dataList.findIndex(item => {
        return item.vid === this.videoInfo.vid;
      });
      this.roomList = [...this.dataList];
      this.roomList.splice(index, 1);
    },
    loadMore() {
      currentPage += 1;
      this.fetchData();
    }
  }
};
</script>

<style rel="stylesheet/sass" lang="scss" type="text/sass" scoped>
@import "../lib/common.scss";
/*
	px 转换 rem
*/
@function px2Rem($px) {
  //$px为需要转换的字号
  @return $px / 37.5px * 1rem;
}

@function size($px) {
  //$px为需要转换的字号
  @return $px / 75 * 1rem;
}
.wrapper {
  color: #999;
  font-size: 12px;
  padding-bottom: 15px;
  display: flex;
  flex-direction: column;
  height: 100vh;
  .video-wrapper {
    flex: 0 0 auto;
    background: #000;
    width: 100%;
    height: px2Rem(211px);
    .video-js {
      width: 100%;
      height: px2Rem(211px);
      .vjs-big-play-button {
        height: 2em;
        width: 2em;
        line-height: 1.9em;
        border-radius: 2em;
        margin-left: -1em;
      }
    }
  }
  .fixed {
    flex: 1;
    -webkit-overflow-scrolling: touch;
    overflow-y: scroll;
  }
  .video-name {
    height: px2Rem(100px);
    text-align: center;
    line-height: px2Rem(100px);
    font-weight: bold;
    font-size: px2Rem(20px);
    color: #333;
  }
  .list-wrapper {
    color: #999;
    font-size: 12px;
    padding-bottom: 15px;
    h5 {
      text-indent: px2Rem(20px);
    }
    .video-list-banner {
      display: block;
      width: 100%;
      height: size(290);
    }
    .list-content {
      margin-left: size(40);
      > li {
        color: #999;
        padding: size(40) size(32) size(40) 0;
        display: flex;
        text-decoration: none;
        .item-img {
          width: size(226);
          height: size(148);
          flex: 0 0 auto;
          margin-right: size(30);
        }
        .item-text {
          flex: 1;
          .title {
            color: #333;
            font-size: 16px;
            font-weight: bold;
            margin: size(30) 0 size(24);
          }
          .label {
            display: flex;
            justify-content: space-between;
            span {
              i {
                display: inline-block;
                margin-right: size(10);
                padding: size(3) size(5);
                line-height: 1;
                font-size: 10px;
                border: 1px solid #09b6f2;
                color: #09b6f2;
                text-align: center;
              }
              em {
                line-height: size(18);
              }
            }
          }
        }
      }
    }
    .more {
      text-align: center;
      padding-top: size(30);
      i {
        vertical-align: middle;
        display: inline-block;
        width: size(14);
        height: size(14);
        margin-left: size(8);
        background-image: url("../images/after/jinr.png");
        background-repeat: no-repeat;
        background-size: contain;
      }
    }
  }
}
</style>
  