import Vue from 'vue';
import { MessageBox } from 'mint-ui';
import search from 'lib/urlSearch.js';
import { format } from 'lib/date.js';
import template from './index.html';
import './style.scss';

import defaultPoster from '../../../images/logo.png';
// import { setInterval } from 'timers';

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
    // topTips: {
    //   type: String,
    // },
    // bottomTips: {
    //   type: String,
    // },
  },
  data() {
    return {
      player: undefined,
      bannerList: [],
      notice: '',
      type: '正在直播',
      poster: defaultPoster,
      showSwitch: false,
      interval: undefined,
      nowTime: undefined,
      begTime: undefined,
      endTime: undefined,
      // timer: undefined,
      timeType: undefined, // 是否为限定时间， 1为限定时间
      showTime: '00:00'
    };
  },
  watch: {
    vedioInfo(nInfo, oInfo) {
      // type:1为直播，2为视频，其他无资源
      if (nInfo.type === 1) {
        if (nInfo.video.length > 0) {
          this.initLive(nInfo.video[0]);
        }
        if (this.endTime) { // 是否为限时模式
          this.calcTimer();
          this.timeType = 1;
        }
      }
      // else if (nInfo.type === 2) {
      //   if (oInfo.type === 1) {
      //     this.showSwitch = true;
      //     setTimeout(() => {
      //       this.showSwitch = false;
      //       this.initVideo(nInfo.video);
      //     }, 5000);
      //   // } else {
      //   //   this.initVideo(nInfo.video);
      //   } else {
      //     this.initVideo(nInfo.video);
      //   }
      // }
    },
    currentVideo(nVal, oVal) {
      if (+oVal === -1) { // 如果没有选中视频，说明一直在录播情况下没有看过视频，所以初始化录播视频
        this.initVideo(this._props.vedioInfo.video);
        // this.initVideo(['https://playback.stockhn.com/stockhnapp/致胜.mp4']);
      }
      if (nVal !== -1 && nVal !== oVal && this.player.playlist.currentItem) {
        this.player.playlist.currentItem(this.currentVideo);
      }
    },
  },
  mounted() {
    this.player = videojs(
      'videoPlayer', {
        language: 'zh',
        techOrder: ['html5'],
      });
      this.nowTime = new Date().getTime();
      this.endTime = Number(search('endTime'));
      this.begTime = Number(search('begTime'));
  },
  computed: {
  },
  methods: {
    initLive(url) {
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
      this.player.load();
      this.player.play();
    },
    initVideo(urls) {
      const list = urls.map(url => ({
        sources: [{
          src: url,
          type: `video/${url.split('.').pop()}`
        }],
        poster: defaultPoster,
      }));
      this.player.playlist(list);
      this.player.playlist.autoadvance(0);
      this.player.playlist.repeat(true);
      this.player.play();
      if (this.currentVideo >= 0) {
        this.player.playlist.currentItem(this.currentVideo);
      }
      // const self = this;
      // this.player.on('playlistitem', () => {
      //   const curIndex = this.player.playlist.currentItem();
      //   console.log(curIndex);
      //   // self.$emit('videoChanged', curIndex);
      // });
      this.player.on('playlistitem', () => {
        const curIndex = this.player.playlist.currentItem();
        console.log(curIndex);
        this.$emit('videoChanged', curIndex);
      });
      console.log('video')
    },
    calcTimer() {
      console.log(this.endTime - this.nowTime)
      console.log(this.player)
      if (this.endTime - this.nowTime < 0) {
        this.showTime = '00:00';
        this.player.exitFullscreen();
        setTimeout(() => {
          console.log(this)
          this.player.pause();
        }, 500);
        this.showSwitch = true;
        MessageBox('温馨提示', '链接已到有效时间，请联系老师助理获取新的视频链接');
        // clearInterval(this.interval);
        return;
      }
      this.showTime = `${format(new Date(this.endTime - this.nowTime), 'mm:ss')}`
      this.nowTime += 1000;
      setTimeout(() => {
        this.calcTimer()
      }, 1000);
    }
  },
});
