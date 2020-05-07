<template>
  <!-- 成长为王乾坤版 -->
  <div class="before" id="third-before">
    <template v-for="item in 9">
      <img :src="getImg(item)" alt="" :key="item"> 
    </template>
    <section class="bottom">
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
        <!-- <p class="time">周一到周五：09:00-18:00</p> -->
      </section>
      <p class="announcement" v-html="frontRisk">
        风险提示：股市有风险，入市需谨慎。本产品所有提示及业绩展现均不构成买卖建议。
        <span v-if="!ios">点立即领取按钮代表同意
          <Investment></Investment>
          并已阅知
          <a href="https://h5.niuguwang.com/appinline/2018y/agreement/sea-risk.html">《风险揭示书》</a>，</span>VIP课程由上海海能证券投资顾问有限公司提供。
      </p>
    </section>
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
      return require(`../images/4391_${index}.png`);
    },
  }
};
</script>
<style rel="stylesheet/sass" lang="scss" type="text/sass">
@import "../lib/common.scss";

#third-before {
  font-size: 0;
  .bottom {
    width: 100%;
    background-image: url("../images/4391_10.png");
    background-size: 100% size(452);
    background-repeat: no-repeat;
  }
  .before-tel-wrapper {
    margin-bottom: size(30);
    color: #eece9f;
    .tel-content {
      .tel-tips {
        color: #f9d092;
      }
      .tel-num {
        color: #f9d092;
      }
      .tel-btn {
        background: #fdd395;
        color: #581810;
      }
    }
  }
  .announcement {
    color: #a59795;
    >a {
      color: #946c49 !important;
    }
  }
}
</style>
