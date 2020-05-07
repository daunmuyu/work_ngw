<template>
  <!-- 王牌掘金 -->
  <div class="before" id="second-before">
    <template v-for="item in 8">
      <img :src="getImg(item)" alt="王牌掘金高级课" :key="item" width="100%"> 
    </template>
    <section class="before-tel-wrapper">
      <p class="tel-content service">
        <span class="tel-tips">
          <b>客服联系电话</b>
        </span>
        <span class="tel-num">021-2509-9066</span>
        <span class="tel-btn" @click="telPhone('021-2509-9066')">拨打</span>
      </p>
      <p class="tel-content watch">
        <span class="tel-tips">
           <b>服务监督电话</b>
        </span>
        <span class="tel-num">400-625-5268</span>
        <span class="tel-btn" @click="telPhone('4006255268')">拨打</span>
      </p>
      <!-- <p class="time">周一到周五：09:00-18:00</p> -->
    </section>
    <p class="announcement" v-html="frontRisk">
      风险提示：股市有风险，入市需谨慎。本产品所有提示及业绩展现均不构成买卖建议。
      <span v-if="!ios">点立即领取按钮代表同意
        <Investment></Investment>
        并已阅知
        <a href="https://h5.niuguwang.com/appinline/2018y/agreement/sea-risk.html">《风险揭示书》</a>，</span>VIP课程由上海海能证券投资顾问有限公司提供。
    </p>
  </div>
</template>
<script type="text/ecmascript-6">
import Vue from "vue";
import bridge from "ng-bridge";
import Investment from "./investment.vue";

export default {
  props: ['ios', 'frontRisk'],
  components: {
    Investment,
  },
  methods: {
    telPhone(tel) {
      bridge.telPhone(tel);
    },
    getImg(index) {
      return require(`../images/wp_0${index}.png`);
    },
  },
};
</script>
<style rel="stylesheet/sass" lang="scss" type="text/sass">
@import "../lib/common.scss";

#second-before {
  background: #000;
  .before-tel-wrapper {
    margin-bottom: size(30);
    color: #EECE9F;
    .tel-content {
      .tel-tips {
         color: #CDAE7B;
      }
      .tel-num{
        color: #dfc194;
      }
      .tel-btn{
        border: size(2) solid #EECE9F;
        background: transparent;
        color: #EECE9F;
      }
    }
  }
  .announcement {
    color: #766344;
    a {
      color: #CA9C64;
    }
  }
}
</style>
