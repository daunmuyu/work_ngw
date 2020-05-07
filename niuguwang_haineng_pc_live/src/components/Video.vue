<template>
  <div class="video-main">
    <div class="videotipsf">
      <div class="video-infos f-l">
        <img src="../images/video.png">
        <span>{{type}}：</span>
        <span class="title">{{major.title}}</span>
      </div>
      <div class="videotips f-r" v-show="notice">
        <!-- <div class="marqueelist">
          <marquee scrollamount='4'>
            <i class="marqueeitemimg"></i>
            <span class="marqueeitem">{{notice}}</span>
          </marquee>
        </div> -->
      </div>
    </div>
    <div class="video-content">
      <video class="video-js vjs-default-skin" id="live-video" loop webkit-playsinline playsinline autoplay controls="controls"></video>
    </div>
    <div class="video-bottom">
      <Carousel :dots="bannerList.length > 1 ? 'inside':'none'" :arrow="bannerList.length > 1 ? 'hover':'never'" autoplay :autoplay-speed="3300" class="carousel">
        <Carousel-item v-for="(banner, index) in bannerList" :key="index">
          <template v-if="banner.HrefUrl">
            <a :href="banner.HrefUrl" target="_blank">
              <img :src="banner.ImageUrl" class="carous">
            </a>
          </template>
          <template v-else>
            <img :src="banner.ImageUrl" class="carous">
          </template>
        </Carousel-item>
      </Carousel>
    </div>
  </div>
</template>
<script>
  import { mapGetters, mapMutations, mapActions } from 'vuex';
  import Cookie from 'js-cookie';
  import { getUrlParam } from '../util/interaction';
  export default {
    data () {
      return {
        player: '',
        bannerList: [],
        notice: '',
        lid: '',
        vid: '',
      }
    },
    computed: {
      ...mapGetters(['playlive', 'liveType', 'major', 'roomInfo']),
      type () {
        return this.liveType === 'live' ? '正在直播' : '精彩视频';
      }
    },
    mounted () {
      this.lid = Cookie.get('lid') || this.roomInfo.liveId;
      this.vid = Cookie.get('vid') || this.roomInfo.chatroomId;
      this.checkLogin();
      this.getMajor({ roomId: this.vid });
      this.getBanner({ liveid: this.lid, type: 0 }).then((res) => {
        if (res.code === 0) {
          this.bannerList = res.scheduleList;
        } else {
          this.$Message.error(res.message || '网络错误');
        }
      });
      this.getNotice({
        roomId: this.vid,
        liveID: this.lid
      }).then((res) => {
        if (res.code === 0) {
          this.notice = res.noticeInfo;
        }
      })
    },
    updated () {
      this.player = videojs('live-video', { techOrder: ['flash', 'html5'] });
    },
    methods: {
      ...mapActions(['getPlayLive', 'guestReg', 'getUserInfo', 'getVideo', 'getMajor', 'getBanner', 'getNotice']),
      ...mapMutations(['setLogin', 'setLiveType']),
      checkLogin() {
        const usertoken = getUrlParam('t') || Cookie.get('hn-token');
        if (usertoken) {
          this.setLogin(true);
          this.getUserInfo({ usertoken });
        } else {
          const tmp = Cookie.get('hn-tmptoken');
          if (tmp) {
            this.getUserInfo({ usertoken: tmp });
          } else {
            this.guestReg().then((res) => {
              if (res.code === 0) {
                const ut = res.userInfo.userToken;
                Cookie.set('hn-tmptoken', ut);
                this.getUserInfo({ usertoken: ut });
              }
            });
          }
        }
        this.videoInit();
      },
      videoInit() {
        const token = getUrlParam('t') || Cookie.get('hn-token');
        this.getPlayLive({ liveid: this.lid, usertoken: token }).then((res) => {
          if (res.code === 0) {
            if (res.data.m3u8 !== '') {
              this.setLiveType('live');
            } else {
              this.setLiveType('record');
            }
          } else {
            this.$Message.error(res.message || '网络错误，请重试！');
          }
        });
      },
      initLive (url) {
        console.log(url)
        this.player.src({
          src: url.replace(/http:\/\//, 'https://'),
          type: 'application/x-mpegURL',
        });
        this.player.load();
        this.player.play();
      },
      initVideo (urls) {
        console.log(urls)
        const list = urls.map(i => ({
          sources: [{
            src: i.replayUrl.replace(/http:\/\//, 'https://'),
            type: `video/${i.replayUrl.split('.').pop()}`
          }]
        }));
        this.player.playlist(list);
      }
    },
    watch: {
      liveType (type) {
        this.getMajor({
          roomID: this.vid
        });
        const token = getUrlParam('t') || Cookie.get('hn-token');
        if (type === 'live') {
          this.getPlayLive({ liveid: this.lid, usertoken: token }).then((res) => {
            this.initLive(res.data.m3u8);
          });
        } else {
          this.getVideo({ userid: '9507147' }).then((res) => {
            this.initVideo(res.dataResult.videoInfo.videoList);
          });
        }
      }
    }
  }
</script>

<style lang="scss">
  .video-main {
    width: 54%;
    height: 100%;
    background-color: #1f2227;
    position: relative;
    .video-content {
      width: 100%;
      height: 70%;
      position: relative;
      background-color: #fff;
      border: 1px solid #363f50;
      .video-js {
        width: 100%;
        height: 100%;
        .vjs-tech {
          object-fit: fill;
          display: block;
          border-radius: 4px;
        }
        .vjs-poster {
          background-size: cover;
        }
        .vjs-big-play-button {
          display: none;
        }
        .vjs-loading-spinner {
          background-image: url('../images/line.png');
          background-repeat: no-repeat;
          background-size: contain;
          width: 170px;
          height: 70px;
          border: 0;
          border-radius: 0;
          transform: translate(-50%, -50%);
          &:after,
          &:before {
            content: '';
            width: 170px;
            height: 20px;
            margin: 0;
            background: url('../images/loading.gif') no-repeat center;
            background-size: contain;
            position: absolute;
            bottom: -32px;
          }
        }
        @keyframes vjs-spinner-spin {
          100% {
            transform: none;
          }
        }
        .vjs-volume-control {
          visibility: visible !important;
          opacity: 1;
          position: relative !important;
          width: 5em !important;
        }
        .vjs-volume-panel {
          width: 10em !important;
        }
        .vjs-control-bar {
          background: rgb(51, 51, 51);
        }
      }
      .video-load {
        position: absolute;
        left: 50%;
        top: 40%;
        z-index: 100;
        width: 200px;
        margin-left: -100px;
      }
    }
    .videotipsf {
      width: 100%;
      height: 30px;
      background: #1a1a1a;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 99;
      .video-infos {
        height: 30px;
        width: 50%;
        line-height: 30px;
        color: #fff;
        padding-left: 10px;
        overflow: hidden;
        span {
          vertical-align: middle;
          font-size: 14px;
          padding-left: 5px;
          &.title {
            color: rgb(255, 198, 0);
            padding-left: 0;
          }
          img {
            padding-right: 5px;
          }
        }
      }
      & .videotips {
        width: 48%;
        height: 30px;
        position: absolute;
        line-height: 30px;
        color: #fff;
        right: 0;
        z-index: 22;
        & .marqueelist {
          width: 100%;
          height: 30px;
          & .marqueeitem {
            padding-left: 6.5px;
            padding-right: 34px;
            position: relative;
            cursor: pointer;
          }
          & .marqueeitemimg {
            position: relative;
            top: 4px;
            display: inline-block;
            width: 18px;
            height: 16px;
            background-image: url(../images/notice.png);
            background-repeat: no-repeat;
            background-size: contain;
          }
        }
      }
    }
    .video-bottom {
      width: 100%;
      height: calc(30% - 10px);
      text-align: center;
      margin-top: 10px;
      background-color: rgb(52, 56, 64);
      border: 1px solid #363f50;
      .carousel {
        height: 100%;
        overflow: hidden;
      }
      img {
        object-fit: contain;
        width: 100%;
      }
    }
  }
</style>
