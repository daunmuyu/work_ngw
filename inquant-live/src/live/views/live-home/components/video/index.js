import Vue from 'vue';
import template from './index.html';
import './style.scss';

import defaultPoster from '../../../../../images/logo.png';

videojs.options.flash.swf = './static/video-js.swf';

export default Vue.extend({
  template,
  props: {
    vedioInfo: {
      required: true,
      type: Object,
    },
    currentVideo: {
      type: Number,
      required: true,
    },
    teacherVideoList: {
      type: Array,
    },
    isEncry: {
      type: Boolean
    }
  },
  data() {
    return {
      player: undefined,
      bannerList: [],
      notice: '',
      type: '正在直播',
      poster: defaultPoster,
      showSwitch: false,
      hasFlash: true,
      showTeacherVideo: false,
    };
  },
  beforeDestroy() {
    this.player.dispose()
  },
  watch: {
    isEncry(n, o) {
      if (n === true) {
        this.$emit('changeBomb', true);
      }
      // console.log(n)
    },
    vedioInfo(nInfo, oInfo) {
      if (this.isEncry) {
        this.$emit('changeBomb', true);
        return;
      }
      // type:1为直播，2为视频，其他无资源
      if ((+this.$route.params.type === 0 || +this.$route.params.type === 1) && !this.$root.clickGoodVideo) {
        // console.log(this.teacherVideoList)
        this.showTeacherVideo = true;
        this.initVideo(this.teacherVideoList.slice(this.$route.params.type, this.$route.params.type + 1));
        return;
      }
      if (nInfo.type === 1) {
        if (this.isEncry) {
          this.$emit('changeBomb', true);
          return;
        }
        if (nInfo.video.length > 0) {
          this.initLive(nInfo.video[0]);
        }
      } else if (nInfo.type === 2) {
        this.initVideo(nInfo.video);
      }
    },
    currentVideo(nVal, oVal) {
      if ((+this.$route.params.type === 0 || +this.$route.params.type === 1) && !this.$root.clickGoodVideo) {
        return;
      }
      if (+oVal === -1) { // 如果没有选中视频，说明一直在录播情况下没有看过视频，所以初始化录播视频
        this.initVideo(this.vedioInfo.video);
        // this.initVideo(['https://playback.stockhn.com/stockhnapp/致胜.mp4']);
      }
      // console.log(this.player)
      if (nVal !== -1 && nVal !== oVal && this.player.playlist.currentItem) {
        this.player.playlist.currentItem(this.currentVideo);
      }
    },
  },
  mounted() {
    this.checkFlash();
    this.player = videojs(
      'videoPlayer', {
        language: 'zh',
        techOrder: ['html5', 'flash'],
        autoplay: true,
        notSupportedMessage: '若视频无法播放，请检查是否允许flash播放',
      });
      this.player.on('play', (e) => {
        this.hasFlash = true;
      });
  },
  methods: {
    checkFlash() {
      if (document.all) {
        const swf = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
        if (!swf) {
          this.hasFlash = false;
        }
      } else if (navigator.plugins && navigator.plugins.length > 0) {
        const swf = navigator.plugins['Shockwave Flash'];
        if (!swf) {
          this.hasFlash = false;
        }
      }
    },
    initLive(url) {
      console.log(url);
      if (url.indexOf('.m3u8') > -1) {
        this.player.src({
          src: url,
          type: 'application/x-mpegURL',
        });
      } else {
        this.player.src({
          src: url,
          type: 'rtmp/mp4',
        });
      }
      this.player.ready(() => {
        console.log('ready')
        this.player.load();
        this.player.play();
      })
    },
    initVideo(urls) {
      const list = urls.map(i => ({
        sources: [{
          src: i.replace(/http:\/\//, 'https://'),
          type: `video/${i.split('.').pop()}`
        }],
        // poster: defaultPoster,
      }));
      // this.player.playlist(list);
      this.player.playlist(list);
      this.player.playlist.autoadvance(0);
      this.player.playlist.repeat(true);
      this.player.play();
      if (this.currentVideo >= 0) {
        this.player.playlist.currentItem(this.currentVideo);
      }
      // const self = this;
      this.player.on('playlistitem', () => {
        const curIndex = this.player.playlist.currentItem();
        // console.log(curIndex);
        this.$emit('videoChanged', curIndex);
      });
      console.log(this.player);
    },
  },
});
