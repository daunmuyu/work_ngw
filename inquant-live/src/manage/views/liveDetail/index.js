import Vue from 'vue';
import {
  mapActions
} from 'vuex';
import template from './index.html';
import './style.scss';

export default Vue.extend({
  template,
  data() {
    return {
      live: {
        LiveBanner: '',
        LiveTitle: '',
        LiveDesc: '',
        roomid: '',
        strname: '',
        strnumber: '',
        teacherIds: [],
        assistantIds: [],
        desc: '',
        strategyImg: '',
        slogan: '',
        qrcode: '',
      },
      liveValidate: {
        LiveTitle: [
          {
            required: true,
            message: '直播间名称不能为空',
            trigger: 'blur',
          }
        ],
        LiveDesc: [
          {
            required: true,
            message: '直播间简介不能为空',
            trigger: 'blur',
          }
        ],
        strname: [
          {
            required: true,
            message: '策略名不能为空',
            trigger: 'blur',
          }
        ],
        strnumber: [
          {
            required: true,
            message: '期货分析师牌照号不能为空',
            trigger: 'blur',
          }
        ],
      }
    };
  },
  mounted() {
    if (this.$route.params && this.$route.params.id) {
      this.roomid = this.$route.params.id;
      this.getLiveDetail({
        roomid: this.roomid,
      }).then((res) => {
        this.live = {
          ...this.live,
          ...res,
        };
        this.live.teacherIds = res.teacherList.filter(item => item.auth === 1).map(item => item.Id);
        this.live.assistantIds = res.assistantList.filter(item => item.auth === 1).map(item => item.Id);
        console.log(this.live);
      });
    }
  },
  methods: {
    ...mapActions([
      'getLiveDetail',
      'saveLive',
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
          // this.changeTeacherPhone(data);
          this.live.LiveBanner = data;
        }
      };
      reader.readAsDataURL(files[0]);
      return false;
    },
    removePhone() {
      this.live.LiveBanner = '';
    },
    changePhone() {
      this.$refs.phone.click();
    },
    uploadStrategyImg({
      target: {
        files,
      },
    }) {
      const reader = new FileReader();
      reader.onload = () => {
        const data = reader.result;
        if (data.length > 0) {
          this.live.strategyImg = data;
        }
      };
      reader.readAsDataURL(files[0]);
      return false;
    },
    removeStrategyImg() {
      this.live.strategyImg = '';
    },
    changeStrategyImg() {
      this.$refs.strategyImg.click();
    },
    uploadQrcode({
      target: {
        files,
      },
    }) {
      const reader = new FileReader();
      reader.onload = () => {
        const data = reader.result;
        if (data.length > 0) {
          this.live.qrcode = data;
        }
      };
      reader.readAsDataURL(files[0]);
      return false;
    },
    removeQrcode() {
      this.live.qrcode = '';
    },
    changeQrcode() {
      this.$refs.qrcode.click();
    },
    saveLiveHandler() {
      this.$refs.live.validate((valid) => {
        if (valid) {
          const userIds = this.live.teacherIds.concat(this.live.assistantIds);
          this.saveLive({
            LiveBanner: this.live.LiveBanner,
            LiveTitle: this.live.LiveTitle,
            LiveDesc: this.live.LiveDesc,
            roomid: this.roomid,
            strname: this.live.strname,
            desc: this.live.desc,
            strategyImg: this.live.strategyImg,
            strnumber: this.live.strnumber,
            userIds: userIds.join(','),
            slogan: this.live.slogan,
            img: this.live.qrcode,
          }).then((res) => {
            if (res[0].result !== 1) {
              this.$Message.warning(res[0].message)
            } else if (res[1].code !== 1) {
              this.$Message.warning('保存失败');
            } else if (res[2].error_no !== 0) {
              this.$Message.warning(res[2].error_info);
            } else {
              this.$Message.success('保存成功');
              setTimeout(() => {
                this.$router.push('/live');
              }, 1000);
            }
          });
        }
      });
    }
  }
});
