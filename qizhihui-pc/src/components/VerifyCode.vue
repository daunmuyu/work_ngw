<template>
  <div id="verifycode">
    <a href="javascript:;" @click="goVerify" class="code-btn" ref="codeBtn">{{countTxt}}</a>
  </div>
</template>

<script>
import Vue from 'vue';
import {
  Message,
} from 'element-ui';
import utils from 'utils';

Vue.prototype.$message = Message;

export default {
  data() {
    return {
      flag: false,
      countTxt: '获取验证码',
      count: 60,
      timer: null,
    };
  },
  props: {
    tell: {
      type: String,
      default: '',
    },
  },
  methods: {
    goVerify() {
      const state = utils.verifyTell(this.tell);
      if (!this.flag && state) {
        this.flag = true;
        const verifycode = () => {
          if (this.count === 0) {
            this.resetVerify();
          } else {
            this.$refs.codeBtn.classList.add('code-disabled');
            this.count = this.count - 1;
            this.countTxt = `${this.count}后重新获取`;
            this.timer = setTimeout(verifycode, 1000);
          }
        };
        verifycode();
        this.$emit('goVerify');
      }
      if (!state) {
        this.$message({
          message: '请输入正确的手机号',
          type: 'warning',
        });
      }
    },
    resetVerify() {
      clearTimeout(this.timer);
      this.countTxt = '获取验证码';
      this.count = 60;
      this.flag = false;
      this.$refs.codeBtn.classList.remove('code-disabled');
    },
  },
};
</script>

<style lang="scss" scoped>
#verifycode {
  .code-btn {
    display: block;
    width: 130px;
    height: 46px;
    line-height: 46px;
    text-align: center;
    color: #238cfd;
    font-size: 16px;
    border: 1px solid #e8e8e8;
  }
  .code-disabled {
    color: #666;
  }
}
</style>

