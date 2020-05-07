<template>
  <!-- 五维擒龙 -->
  <div class="before forth-before">
    <img src="../images/before-banner-3@2x.jpg" alt="before-banner" width="100%">
    <img src="../images/4389-1.png" alt="img" width="100%">
    <img src="../images/4389-2.png" alt="img" width="100%">
    <img src="../images/4389-3.png" alt="img" width="100%">
    <img src="../images/4389-4.png" alt="img" width="100%">
    <img src="../images/4389-5.png" alt="img" width="100%">
    <img src="../images/4389-6.png" alt="img" width="100%">
    <img src="../images/4389-7.png" alt="img" width="100%">
    <img src="../images/4389-8.png" alt="img" width="100%">
    <img src="../images/4389-9.png" alt="img" width="100%">
    <img src="../images/4389-10.png" alt="img" width="100%">
    <section class="before-tel-wrapper">
      <p class="tel-content service">
        <span class="tel-tips">
          <b>官方客服电话</b>
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
      <p class="time">周一到周五：09:00-18:00</p>
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
    Investment
  },
  methods: {
    telPhone(tel) {
      bridge.telPhone(tel);
    }
  }
};
</script>
<style rel="stylesheet/sass" lang="scss" type="text/sass" scoped>
@import "../lib/common.scss";
@import "../lib/extend.scss";
.before-wrapper .container .forth-before {
  background: #100f15;
  .before-tel-wrapper {
    .service,
    .tel-content {
      color: #EECE9F;
      .tel-tips {
        color: #cdae7b;
      }
      .tel-num {
        color: #EECE9F;
        font-weight: bold;
      }
      .tel-btn {
        border: 1px solid #EECE9F;
        color: #EECE9F;
        background: transparent;
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
