<template>
  <div class="before first-before">
    <img src="../images/before-banner@2x.jpg" width="100%" alt="banner-3926" class="banner">
    <div class="part-wrapper">
      <img src="../images/sec1-top@2x.png" alt="" class="top-banner">
      <ul class="ads-wrapper">
        <li>
          <img src="../images/icon1@2x.png" alt="" class="icon">
          <div class="text-wrapper">
            <h3 class="title">实盘策略</h3>
            <p class="text">
              交易日操作策略讲解互动，实时分析市场变化，热点资讯快速解读，紧贴盘面，狙击投资机会，规避市场风险！
            </p>
          </div>
        </li>
        <li>
          <img src="../images/icon2@2x.png" alt="" class="icon">
          <div class="text-wrapper">
            <h3 class="title">名师直播</h3>
            <p class="text">
              盘中操作方向指示，重大热点风口点评，实时个股诊断，潜力金股挖掘，精品课程教学。
            </p>
          </div>
        </li>
        <li>
          <img src="../images/icon3@2x.png" alt="" class="icon">
          <div class="text-wrapper">
            <h3 class="title">策略金股池</h3>
            <p class="text">
              策略金股池实时调仓通知。每天量化交易时段提示交易机会；精选质地优良、形态走强、安全边际高的金股，紧密跟踪，把握最佳利润控制位。
            </p>
          </div>
        </li>
        <li>
          <img src="../images/icon4@2x.png" alt="" class="icon">
          <div class="text-wrapper">
            <h3 class="title">金典战法</h3>
            <p class="text">
              数十套资深导师战法，实战案例教学，让你深度解析市场走势，从此掌握主力投资思路。
            </p>
          </div>
        </li>
      </ul>
    </div>
    <div class="part-wrapper">
      <img src="../images/sec2-top@2x.png" alt="" class="top-banner">
      <p class="top-label">业内高手实盘授课 独家量化选股技术</p>
      <p class="instruction">
        海能投研导师团队十余年投资经验，遵循趋势理性投资理念，精研《量化成王智能模型》综合基本面、技术面、资金面，全方位挖掘爆发性龙头！
      </p>
      <div class="swiper">
        <mt-swipe :auto="4000">
          <mt-swipe-item>
            <img src="../images/t1.jpg" class="teacher" alt="">
          </mt-swipe-item>
          <mt-swipe-item>
            <img src="../images/t2.jpg" class="teacher" alt="">
          </mt-swipe-item>
          <mt-swipe-item>
            <img src="../images/t3.jpg" class="teacher" alt="">
          </mt-swipe-item>
          <mt-swipe-item>
            <img src="../images/t4.jpg" class="teacher" alt="">
          </mt-swipe-item>
          <mt-swipe-item>
            <img src="../images/t5.jpg" class="teacher" alt="">
          </mt-swipe-item>
          <mt-swipe-item>
            <img src="../images/t6.jpg" class="teacher" alt="">
          </mt-swipe-item>
          <mt-swipe-item>
            <img src="../images/t7.jpg" class="teacher" alt="">
          </mt-swipe-item>
        </mt-swipe>
      </div>
    </div>
    <div class="part-wrapper">
      <img src="../images/sec3-top@2x.png" alt="" class="top-banner">
      <p class="top-label">实践是检验真理的唯一标准</p>
      <ul class="examples-wrapper">
        <li>
          <h2 class="title">宏川智慧——002930</h2>
          <p class="label">2018年5月10日锁定妖股达成
            <span>141.06%累计收益！</span>
          </p>
          <img src="../images/example-1@2x.png" alt="example" class="example-img">
        </li>
        <li>
          <h2 class="title">国科微——300672</h2>
          <p class="label">2017年8月14号2个月达成
            <span>120%的主升浪波段收益。</span>
          </p>
          <img src="../images/example-2@2x.png" alt="example" class="example-img">
        </li>
        <li>
          <h2 class="title">中国中车——601766</h2>
          <p class="label">2014年10月下旬锁定大牛股半年累计
            <span>最高盈利空间571%！</span>
          </p>
          <img src="../images/example-3@2x.png" alt="example" class="example-img">
        </li>
      </ul>
    </div>
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
import { Swipe, SwipeItem } from "mint-ui";
import bridge from "ng-bridge";
import Investment from "./investment.vue";

export default {
  props: [
    'ios', 'frontRisk',
  ],
  components: {
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    Investment,
  },
  mounted() {
    console.log(this.frontRisk);
  },
  methods: {
    telPhone(tel) {
      bridge.telPhone(tel);
    },
  },
};
</script>
<style rel="stylesheet/sass" lang="scss" type="text/sass" scoped>
@import "../lib/common.scss";
@import "../lib/extend.scss";

.first-before {
  background: #f6f6f6;
  .banner {
    margin-bottom: pxToRem(17px);
  }
  .part-wrapper {
    .top-banner {
      display: block;
      margin: 0 auto pxToRem(12px);
      width: pxToRem(328px);
      height: pxToRem(24px);
    }
    .top-label {
      color: #b58d5a;
      font-size: pxToRem(16px);
      line-height: 1;
      margin: pxToRem(9px) auto 0;
      text-align: center;
    }
    .instruction {
      font-size: pxToRem(13px);
      line-height: 1.4;
      color: #000;
      margin: pxToRem(24px) pxToRem(17px) pxToRem(15px);
    }
    .ads-wrapper {
      display: block !important;
      margin: 0 pxToRem(18px) pxToRem(43px);
      > li {
        padding: pxToRem(20px) 0;
        border-bottom: pxToRem(1px) solid #e0e2e4;
        display: flex;
        .icon {
          flex: 0 0 auto;
          display: block;
          width: pxToRem(69px);
          height: pxToRem(47px);
        }
        .text-wrapper {
          flex: 1;
          margin-left: pxToRem(16px);
          > .title {
            color: #000;
            font-size: pxToRem(16px);
            line-height: 1;
            margin-bottom: pxToRem(10px);
          }
          > .text {
            color: #999;
            font-size: pxToRem(13px);
            line-height: 1.4;
          }
        }
      }
    }
    .examples-wrapper {
      margin: pxToRem(27px) pxToRem(17px) pxToRem(15px);
      > li {
        background-color: #fff;
        background-repeat: no-repeat;
        background-position: 0 0;
        border-radius: pxToRem(5px);
        padding: pxToRem(20px) pxToRem(18px);
        box-sizing: border-box;
        position: relative;
        overflow: hidden;
        margin: 0 0 pxToRem(42px);
        &:before {
          content: "";
          display: block;
          width: pxToRem(40px);
          height: pxToRem(40px);
          position: absolute;
          left: 0;
          top: 0;
          background-size: 100% 100%;
          background-repeat: no-repeat;
        }
        > .title {
          font-size: pxToRem(16px);
          color: #282828;
        }
        .label {
          margin-top: pxToRem(6px);
          font-size: pxToRem(13px);
          color: #b4b4b4;
          line-height: 1.4;
          > span {
            color: #ff4c51;
          }
        }
        .example-img {
          display: block;
          box-shadow: 0 0 pxToRem(8px) rgba(210, 201, 188, 0.8);
          margin: pxToRem(20px) 0 pxToRem(4px);
        }
      }
      li:nth-of-type(1) {
        &:before {
          background-image: url("../images/icon-example-1@2x.png");
        }
      }
      li:nth-of-type(2) {
        &:before {
          background-image: url("../images/icon-example-2@2x.png");
        }
      }
      li:nth-of-type(3) {
        margin: 0 0 pxToRem(32px);
        &:before {
          background-image: url("../images/icon-example-3@2x.png");
        }
      }
    }
  }
}
</style>
