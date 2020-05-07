import Vue from 'vue';
import {
  mapGetters,
  mapActions
} from 'vuex';
import template from './index.html';
import './style.scss';

export default Vue.extend({
  template,
  data() {
    return {
      title: '编辑视频',
      sourceList: [],
      video: {
        roomId: '',
        liveTitle: '',
        description: '',
        cover: '',
        videoUrl: '',
        bright: true,
      },
      videoValidate: {
        liveTitle: [{
          required: true,
          message: '视频名称不能为空',
          trigger: 'blur',
        }],
        description: [{
          required: true,
          message: '视频描述不能为空',
          trigger: 'blur',
        }],
        cover: [{
          required: true,
          message: '视频配图不能为空',
          trigger: 'blur',
        }],
        videoUrl: [{
          required: true,
          message: '视频地址不能为空',
          trigger: 'blur',
        }],
      }
    };
  },
  computed: {
    ...mapGetters([
      'liveList',
    ]),
  },
  async mounted() {
    if (this.$route.name === 'newVideo') {
      this.title = '添加视频';
    } else {
      this.title = '编辑视频';
    }
    this.loadLiveList();
    if (this.$route.params && this.$route.params.id) {
      this.id = this.$route.params.id;
      const video = await this.getVideoById({
        id: this.id,
      });
      this.video = {
        ...this.video,
        liveTitle: video.data.liveTitle,
        description: video.data.description,
        roomid: video.data.roomId,
        cover: video.data.cover,
        videoUrl: video.data.videoUrl,
        bright: video.data.bright === 1,
      };
    }
    try {
      const res = await this.sourceVideoList();
      if (res.code === 0) {
        this.sourceList = res.data;
      }
    } catch (err) {
      console.log(err);
    }
  },
  methods: {
    ...mapActions([
      'loadLiveList',
      'getVideoById',
      'addVideo',
      'modifyVideo',
      'sourceVideoList',
    ]),
    uploadImg({
      target: {
        files,
      },
    }) {
      const reader = new FileReader();
      reader.onload = () => {
        const data = reader.result;
        if (data.length > 0) {
          this.video.cover = data;
        }
      };
      reader.readAsDataURL(files[0]);
      return false;
    },
    removeCover() {
      this.video.cover = '';
    },
    changeCover() {
      this.$refs.cover.click();
    },
    saveVideoHandler() {
      if (this.$route.name === 'newVideo') {
        this.addVideoHandler();
      } else {
        this.modifyVideoHandler();
      }
    },
    addVideoHandler() {
      this.$refs.video.validate(async (valid) => {
        if (valid) {
          const res = await this.addVideo({
            roomid: this.video.roomid,
            liveTitle: this.video.liveTitle,
            description: this.video.description,
            cover: this.video.cover,
            videoUrl: this.video.videoUrl,
            bright: this.video.bright ? 1 : 0,
          });
          console.log(888, res);
          if (res.code === 1) {
            this.$Message.success('保存成功');
            setTimeout(() => {
              this.$router.push('/video');
            }, 1000);
          } else {
            this.$Message.warning(res.msg);
          }
        }
      });
    },
    modifyVideoHandler() {
      this.$refs.video.validate(async (valid) => {
        if (valid) {
          const cover = this.video.cover.indexOf('data:image') > -1 ? this.video.cover : '';
          const res = await this.modifyVideo({
            Id: this.id,
            roomid: this.video.roomid,
            liveTitle: this.video.liveTitle,
            description: this.video.description,
            cover,
            videoUrl: this.video.videoUrl,
            bright: this.video.bright ? 1 : 0,
          });
          console.log(777, res);
          if (res.code === 1) {
            this.$Message.success('保存成功');
            setTimeout(() => {
              this.$router.push('/video');
            }, 1000);
          } else {
            this.$Message.warning(res.msg);
          }
        }
      });
    }
  },
});
