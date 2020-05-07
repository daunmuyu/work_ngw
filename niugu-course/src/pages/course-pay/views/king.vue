<template>
  <div class="container">
    <template v-for="item in 11">
      <img :src="getImg(item)" alt="" :key="item"> 
    </template>
    <div class="tel-phone">
      <div class="phone">
        <span>客服联系电话</span>
        <span>021-2509-9066</span>
        <span @click="telphone('021-2509-9066')">拨打</span>
      </div>
      <div class="phone">
        <span>服务监督电话</span>
        <span>400-625-5268</span>
        <span @click="telphone('400-625-5268')">拨打</span>
      </div>
    </div>
    <div class="rule" v-html="riskText"></div>
  </div>
</template>
<script>

import mixin from '../util/mixin.js';
import { getRiskText } from '../util/api.js';

export default {
  mixins: [mixin],
  data() {
    return {
      courseid: '',
      riskText: ''
    }
  },
  mounted() {
    this.courseid = this.$bridge.search('courseid');
    getRiskText({ courseid: this.courseid}).then((res) => {
      this.riskText = res.frontrisk.replace(
        /《.+?》/g,
        (match, p1, p2) => {
          if (p1) {
            return `<a style="color: #CA9C64;" href="${res.hdurl}">${match}</a>`;
          }
          if (p2) {
            return `<a style="color: #CA9C64;" href="${res.riskurl}">${match}</a>`;
          }
        }
      )
    })
  },
  methods: {
    getImg(index) {
      return require(`../images/king${index}.png`);
    },
  }
}
</script>
<style lang="scss" scoped>
@import '../scss/common.scss';

.container {
  height: 100%;
  overflow-y: scroll;
  background: #000;
  padding-bottom: size(77);
  & > img {
    width: 100%;
    display: block;
    line-height: 0;
  }
  .tel-phone {
    height: size(102);
    margin: size(16) 0;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: space-around;
    border-top: 1px solid #3C3229;
    border-bottom: 1px solid #3C3229;
    .phone {
      width: size(343);
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      line-height: size(30);
      span {
        &:nth-child(1) {
          color: #CDAE7B;
          font-size: size(16);
        }
        &:nth-child(2) {
          width: size(130);
          display: block;
          color: #EECE9F;
          font-size: size(17);
        }
        &:nth-child(3) {
          display: inline-block;
          height: size(30);
          width: size(63);
          text-align: center;
          line-height: size(30);
          border-radius: size(15);
          border: 1px solid #EECE9F;
          color: #EECE9F;
          font-size: size(14);
        }
      }
    }
  }
  .rule {
    width: size(343);
    margin: 0 auto;
    color: #766344;
  }
}
</style>
