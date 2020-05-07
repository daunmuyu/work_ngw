import Vue from 'vue';
import {
  mapActions,
  mapGetters,
} from 'vuex';
import template from './index.html';
import './style.scss';

export default Vue.extend({
  template,
  data() {
    return {
      user: {
        name: '',
        password: '',
      },
      rule: {
        name: [{
          required: true,
          message: '请填写用户名',
          trigger: 'blur',
        }],
        password: [
          {
            required: true,
            message: '请填写密码',
            trigger: 'blur',
          },
        ],
      },
      loading: false,
    };
  },
  computed: {
    ...mapGetters([
      'userInfo',
    ]),
  },
  methods: {
    ...mapActions([
      'login',
      'createRoom',
    ]),
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.loading = true;
          this.login({
            mobile: this.user.name,
            password: this.user.password,
          }).then((res) => {
            if (res.error_no === 0 && this.userInfo && this.userInfo.userToken) {
              this.loading = false;
              this.createRoom();
              this.$router.push('index');
            } else {
              this.loading = false;
              this.$Modal.warning({
                content: res.error_info,
              });
            }
          });
          // this.$Message.success('提交成功!');
        } else {
          this.$Message.error('表单验证失败!');
        }
      });
    },
  },
});
