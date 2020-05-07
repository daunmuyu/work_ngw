<template>
  <div class="after-wrapper" ref="after">
    <img src="https://img.niuguwang.com/2017/08/4/M_218A943F1D1825ADDBA5FC40511FB40A.png" alt="Tel" class="float-tel" @click="telPhone('4006255268')">
    <div class="after-content" ref="after">
      <!-- <img src="../images/after-banner.png" alt="banner" class="banner"> -->
      <h1 class="banner">{{bannerTitle + 'VIP服务'}}</h1>
      <!-- 今日策略 -->
      <introduction />
      <!-- vip直播室 -->
      <live v-if="!isLive" />
      <!-- <live /> -->
      <!-- 股票池 -->
      <pool />
      <!-- 机构池 -->
      <company />
      <!-- 独家内参 -->
      <information />
      <!-- 客服电话-->
      <div class="tels">
        <div class="tel-content">
          <span class="tels-tips">
            <b>客服电话</b>
            <i>交易日 09:00-18:00</i>
          </span>
          <div class="tels-no">
            <a @click="telPhone('021-2509-9066')" href="javascript: void(0);">021-2509-9066</a>
          </div>
          <div class="tels-img">
            <a @click="telPhone('021-2509-9066')" href="javascript: void(0);">拨打</a>
          </div>
        </div>
        <div class="tel-content">
          <span class="tels-tips">
            <b>服务监督电话</b>
          </span>
          <div class="tels-no">
            <a @click="telPhone('4006255268')" href="javascript: void(0);">400-625-5268</a>
          </div>
          <div class="tels-img">
            <a href="javascript: void(0);" @click="telPhone('4006255268')">拨打</a>
          </div>
        </div>
      </div>
      <!-- 按钮 -->
      <template v-if="!isBuyBtn">
        <div class="after-btn-pane">
          <div class="btn-pane" @click="toPay">
            <b>立即续订</b>
            <span>{{validtime}}</span>
          </div>
        </div>
      </template>
      <!-- 声明 -->
      <p class="statement">
        <template v-if="!isBuyBtn">
          点击立即续订按钮代表<span v-html="agreementMsgs.agreement"></span>{{agreementMsgs.content}}
        </template>
        <template v-else>
          以上数据仅供参考，不作为投资依据。股市有风险，投资需谨慎!
        </template>
      </p>
      <mt-popup v-model="popupVisible">
        <section class="before-remind-popup">
          <p class="remind-content">
            {{agreementMsgs.content}}
          </p>
          <p class="remind-checkbox">
            <label @click.prevent="tabAgreement">
              <input type="checkbox" v-model="agreementCheckboxValue">
              <span v-html="agreementMsgs.agreement"></span>
            </label>
          </p>
          <button class="before-remind-confirm-button" @click="popupCheckPay">知道了</button>
        </section>
      </mt-popup>
      <!-- 风险测试，目前是直播间的有此功能 -->
      <section v-if="!hadTest">
        <div class="mark-pane"></div>
        <div class="bomb-pne">
          <p>趋势稳盈战法邀请您在投资本产品之前先填写此风险测评问卷，旨在了解您可承受的风险程度，同时也可协助您选择更合适的理财产品。</p>
          <h5>TIP:本次测评共20题，预计需要2分钟。</h5>
          <div class="btn" @click="gotoRiskTest">
            开始评测
          </div>
        </div>
      </section>
      <!-- 合规弹出层2 -->
      <!-- <template v-if="popupRemindVisible">
        <div class="mark-pane" @click="popupRemindVisible=false"></div>
        <div class="bomb-pne bomb-pne-1">
          <h1>温馨提示</h1>
          <p>
            【海能投顾】尊敬的客户，目前各种非法金融活动引发的涉众型投资受损类风险高发频发，严重损害投资者利益和金融市场秩序，影响社会稳定。
          </p>
          <p>
            温馨提醒请您提高警惕，增强辨别能力谨防上当受骗，并请重点关注以下内容：
          </p>
          <p class="small-txt">1、核实相关机构合法性；</p>
          <p class="small-txt">2、坚决拒绝参与非法交易；</p>
          <p class="small-txt">3、对内幕信息保持高度警惕；</p>
          <div class="btn" @click="popupRemindVisible=false">
            知道了
          </div>
        </div>
      </template> -->
    </div>
    <frame-data :courseid="cid" :utken="usertoken"></frame-data>
  </div>

</template>
<script type="text/ecmascript-6">
import Vue from "vue";
import { mapState } from "vuex";
import bridge from "ng-bridge";
import { MessageBox, Toast, Popup } from "mint-ui";
import Introduction from "../components/introduction.vue";
import Live from "../components/live.vue";
import Pool from "../components/pool.vue";
import Company from "../components/company.vue";
import Information from "../components/information.vue";
import Investment from "../components/investment.vue";
import { getIsBuy, getRiskTest, COURSE_ID, TITLES } from "../api/index.js";
import { addClass, removeClass } from "../lib/util.js";
import FrameData from './../components/frameData.vue';

export default {
  data() {
    return {
      hadTest: true,
      popupVisible: false,
      agreementCheckboxValue: false,
      popupRemindVisible: null,
      isBuyBtn: false,
      bannerTitle: "",
      cid: COURSE_ID,
    };
  },
  props: ["isFirstTime", "agreementMsgs", "remindVisible"],
  components: {
    Introduction,
    Live,
    Pool,
    Company,
    Information,
    [MessageBox.name]: MessageBox,
    [Popup.name]: Popup,
    Investment,
    FrameData,
  },
  computed: {
    ...mapState(["isH5", "usertoken", "validtime", "isLive", "courseType"])
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.riskTest();
      this.goTo();
      this.checkFirstTime();
      this.popupRemindVisible = this.remindVisible;
      this.bannerTitle = TITLES[COURSE_ID];
      if (!this.isH5) {
        bridge.getVersion(vs => {
          const u = navigator.userAgent;
          const app = navigator.appVersion;
          const isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端
          if (isIOS) {
            this.isBuyBtn = (vs.replace(/\./g, "") >= 437 && !(bridge.search("s") === "EE")) || bridge.search('cn');
          }
        });
      }
    },
    checkFirstTime() {
      if (this.isFirstTime && !bridge.search("applive")) {
        // this.popupVisible = true;
      }
    },
    popupCheckPay() {
      if (!this.agreementCheckboxValue) {
        Toast({
          message: "请先勾选协议！",
          position: "bottom",
          duration: 2000
        });
        return;
      }
      // 勾选了同意协议，信息传给后端
      getIsBuy({
        usertoken: this.usertoken,
        action: "setriskconfirm"
      }).then(res => {
        if (+res.code === 0) {
          this.popupVisible = false;
        } else {
          Toast("数据存储失败，请联系管理员");
        }
      });
    },
    toPay() {
      if (this.isH5) {
        window.location.href = `/public/pay/index.html?courseid=${COURSE_ID}`;
      } else {
        bridge.toCoursePayment(COURSE_ID, "");
      }
    },
    tabAgreement() {
      this.agreementCheckboxValue = !this.agreementCheckboxValue;
      const confirmButton = document.getElementsByClassName(
        "before-remind-confirm-button"
      )[0];
      if (this.agreementCheckboxValue) {
        addClass(confirmButton, "red");
      } else {
        removeClass(confirmButton, "red");
      }
    },
    telPhone(tel) {
      bridge.telPhone(tel);
    },
    goTo() {
      if (bridge.search("to")) {
        this.$nextTick(() => {
          this.$refs.after.scrollTop = document.getElementById(
            bridge.search("to")
          ).offsetTop;
        });
      }
    },
    riskTest() {
      if (this.usertoken) {
        getRiskTest({
          usertoken: this.usertoken,
          action: "getrisktype",
          courseid: COURSE_ID,
        }).then(res => {
          if (+res.code === 0) {
            // this.hadTest = Number(res.isclose) > 0;
          }
        });
      }
    },
    gotoRiskTest() {
      const payms = `usertoken=${this.usertoken}&courseid=${COURSE_ID}`;
      location.href = `https://h5.niuguwang.com/huodong/2017Y3Q/risk-assess/index.html?${payms}`;
    }
  }
};
</script>
<style rel="stylesheet/sass" lang="scss" type="text/sass">
@import "../lib/common.scss";

.after-wrapper {
  height: 100%;
  overflow: hidden;
  position: relative;
  .float-tel {
    position: absolute;
    right: 0;
    top: pxToRem(100px);
    width: pxToRem(85px);
    height: pxToRem(28px);
    z-index: 99;
  }
}
.after-content {
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  .banner {
    height: pxToRem(80px);
    line-height: pxToRem(80px);
    background: url("../images/after-banner.jpg");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    color: #fff;
    font-size: pxToRem(29px);
    text-align: center;
    letter-spacing: pxToRem(1px);
    font-weight: 700;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }
  .tels {
    background: #fff;
    padding: pxToRem(10px) pxToRem(13px);
    margin-bottom: pxToRem(16px);
    .tel-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    span {
      display: block;
    }
    .tels-tips {
      line-height: pxToRem(30px);
      font-size: 17px;
      b {
        &:last-child {
          padding-top: pxToRem(10px);
        }
        display: block;
      }
    }
    .tels-no {
      line-height: pxToRem(30px);
      font-size: 17px;
      text-decoration: none;
      a {
        color: #f68811;
        display: block;
        &:last-child {
          padding-top: pxToRem(10px);
        }
      }
    }
    .tel-content:first-child {
      height: pxToRem(55px);
      .tels-tips {
        display: flex;
        flex-direction: column;
        b {
          margin-top: pxToRem(20px);
        }
        i {
          font-size: 12px;
          color: #999;
          font-style: normal;
          display: block;
          margin: pxToRem(-8px) 0 pxToRem(10px);
        }
      }
    }
    .tel-content:last-child {
      .tels-no {
        a {
          color: #8997a5;
        }
      }
      .tels-img {
        a {
          background-color: #8997a5;
        }
      }
    }
    .tels-img {
      width: pxToRem(63px);
      a {
        display: block;
        width: pxToRem(63px);
        height: pxToRem(30px);
        margin-right: pxToRem(27.5px);
        color: #fff;
        background-color: #f68811;
        border-radius: pxToRem(15px);
        text-align: center;
        line-height: pxToRem(30px);
        font-size: 14px;
        &:last-child {
          margin-top: pxToRem(10px);
        }
      }
    }
  }
  .after-btn-pane {
    padding: pxToRem(10px) 0 0;
    width: 100%;
    .btn-pane {
      color: #fff;
      background-color: rgb(86, 138, 224);
      text-align: center;
      margin: 0 pxToRem(13px);
      height: pxToRem(45px);
      display: flex;
      flex-direction: column;
      b {
        font-size: 17px;
        font-weight: 600;
        height: auto;
        display: block;
      }
      span {
        display: block;
        font-size: 10px;
        line-height: pxToRem(18px);
        height: pxToRem(18px);
      }
    }
  }
  .statement {
    margin: pxToRem(15px) pxToRem(13px);
    color: #999;
    font-size: 12px;
    line-height: 1.5;
    > a {
      color: #458cf5;
    }
  }

  .mark-pane {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 99;
  }
  .bomb-pne {
    position: fixed;
    z-index: 100;
    width: pxToRem(270px);
    height: pxToRem(245px);
    background: #fff;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 0.3rem;

    p {
      font-size: pxToRem(14px);
      line-height: pxToRem(20px);
      padding: pxToRem(30px) pxToRem(15px) pxToRem(20px);
      color: #333;
    }

    h5 {
      color: RGB(153, 153, 153);
      text-align: center;
      font-size: pxToRem(14px);
      line-height: pxToRem(20px);
      padding: 0 0 pxToRem(30px);
    }

    .btn {
      width: pxToRem(240px);
      height: pxToRem(40px);
      background-color: #458cf5;
      color: #fff;
      font-size: pxToRem(14px);
      text-align: center;
      line-height: pxToRem(40px);
      margin: 0 auto;

      a {
        color: #fff;
      }
    }
  }
  .bomb-pne-1 {
    height: auto;
    padding: px2Rem(30px) 0 px2Rem(20px);

    > h1 {
      font-size: px2Rem(16px);
      line-height: px2Rem(20px);
      padding: 0 0 px2Rem(20px);
      color: #333;
      font-weight: 600;
      text-align: center;
    }

    > p {
      padding: 0 px2Rem(15px) px2Rem(10px);
    }

    .small-txt {
      padding: 0 px2Rem(15px);
    }

    .btn {
      margin: px2Rem(20px) auto 0;
    }
  }
}
// 弹出层
.mint-popup {
  width: pxToRem(270px);
  box-sizing: border-box;
  padding: pxToRem(25px) pxToRem(16px);
}
.before-remind-popup {
  .remind-content,
  .remind-checkbox {
    font-size: pxToRem(14px);
    color: #8997a5;
    text-align: left;
    line-height: 1.4;
    padding-bottom: pxToRem(14px);
  }
  .remind-checkbox {
    padding-bottom: pxToRem(10px);
    a {
      color: #458cf5;
    }
  }
}
.mint-toast {
  z-index: 2201;
}
.before-remind-confirm-button {
  background: #999;
  color: #fff;
  font-size: pxToRem(15px);
  height: pxToRem(40px);
  line-height: pxToRem(40px);
  border-radius: pxToRem(2px);
  margin: pxToRem(20px) 0 0;
  width: 100%;
  border: none;
}
.red {
  background: #ff4c51;
}
</style>