<template>
  <!-- 实战为王 -->
  <div class="container" id="sixth-before">
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
    <!-- <div class="rule" v-html="riskText"></div> -->
     <p class="announcement" v-html="frontRisk">
      风险提示：股市有风险，入市需谨慎。本产品所有提示及业绩展现均不构成买卖建议。
      <span v-if="!ios">点立即领取按钮代表同意
        <Investment></Investment>
        并已阅知
        <a href="https://h5.niuguwang.com/appinline/2018y/agreement/sea-risk.html">《风险揭示书》</a>，</span>VIP课程由上海海能证券投资顾问有限公司提供。
    </p>
  </div>
</template>
<script>

import bridge from 'ng-bridge';
import { getRiskText } from '../api/index.js';
import { qsearch } from "../lib/util.js";
import Cookie from "js-cookie";
import Investment from "./investment.vue";

export default {
  props: ['ios', 'frontRisk'],
  components: {
    Investment,
  },
  data() {
    return {
      courseid: '',
      riskText: ''
    }
  },
  mounted() {
    this.courseid = bridge.search('courseid');
    getRiskText({ 
      courseid: this.courseid,
    }).then((res) => {
      this.riskText = res.frontrisk && res.frontrisk.replace(
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
<style lang="scss">
@import "../lib/common.scss";
@function size($size) {
  $width: 375;
  $scale: 10;
  @return ($size / $width * $scale) * 1rem;
}

#sixth-before {
  background: #000;
  padding-bottom: size(10);
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
  .announcement {
    color: #766344;
    padding: pxToRem(13px) pxToRem(13px) pxToRem(10px) !important;
    a {
      color: #CA9C64 !important;
    }
  }
}
</style>
