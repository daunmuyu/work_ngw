<template>
  <div class="before-wrapper">
    <div class="container">
      <template v-if="courseType === '1'">
        <First :ios="isIOS" :frontRisk="frontRisk"></First>
      </template>
      <!-- 王牌掘金 courseid=4390 -->
      <template v-if="courseType === '2'">
        <Second :ios="isIOS" :frontRisk="frontRisk"></Second>
      </template>
      <!-- 成长为王乾坤版 courseid=4391 -->
      <template v-if="courseType === '3'">
        <Third :ios="isIOS" :frontRisk="frontRisk"></Third>
      </template>
      <!-- 五维擒龙 courseid=4389 -->
      <template v-if="courseType === '4'">
        <Forth :ios="isIOS" :frontRisk="frontRisk"></Forth>
      </template>
      <!-- 成长为王 courseid=4376 -->
      <template v-if="courseType === '5'">
        <Fifth :ios="isIOS" :frontRisk="frontRisk"></Fifth>
      </template>
      <!-- 实战为王 courseid=4392 -->
      <template v-if="courseType === '6'">
        <Sixth :ios="isIOS" :frontRisk="frontRisk"></Sixth>
      </template>
    </div>
    <div v-if="!isIOS || (isIOS && isH5)" :class="filterBottomBtnClass">
      <section class="nolive-btn" :style="{background: activeBuyBtnBg}">
        <span v-if="isH5" @click="buyLive" :class="courseType !== '5' ? 'gradient' : 'grey'" :style="{color: activeBuyBtnColor}">立即购买</span>
        <!-- <span v-if="isH5" @click="buyLive" :class="courseType !== '2' ? 'grey' : 'gradient'" >立即购买</span> -->
        <span v-if="!isH5 && !isIOS" @click="copyWXH" id="wxbtn" :data-clipboard-text="wxh">在线咨询</span>
      </section>
    </div>
    <div class="mark-pane" v-show="!isHide" @click="isHide=true"></div>
    <div class="bomb-pane" v-show="!isHide">
      <img src="../images/confirm.png" alt="" />
      <p class="copy-success">复制成功</p>
      <p>微信号
        <span class="wechat-num wxh">{{wxh}}</span>复制成功
        <br />点击跳转微信添加助理</p>
      <div class="bomb-add clse" @click="closeBomb">立即添加</div>
    </div>
    <!-- 合规审核 -->
    <div class="dialog-wrapper" v-if="auditPopupVisible" @touchmove.prevent>
      <div class="dialog-container" @click="auditPopupVisible=false"></div>
      <div class="dialog-content">
        <template v-if="notAudit">
          <p class="tit">您尚未接受合规审核</p>
          <p class="literals">抱歉，您因尚未接受合规审核，暂时无法享受VIP服务。请留意电话，或主动拨打客服电话</p>
        </template>
        <template v-if="notThrough">
          <p class="tit">您未通过合规审核</p>
          <p class="literals">抱歉，您未通过合规审核，无法享受该服务，退款将在7个工作日内返还原支付账户，详情可咨询客服</p>
        </template>
        <p class="phone">
          <span>客服电话：</span>
          <a href="javascript: void(0)" @click="telPhone('021-25099065')">021-25099065</a>
        </p>
        <div class="dialog-close clse" @click="auditPopupVisible=false">知道了</div>
      </div>
    </div>
    <div class="has-buy" v-if="!hadLogin && (!isIOS || (isIOS && isH5))" @click="handleBuy">
      <img src="../images/has-buy-btn.png" alt="icon">
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import Vue from "vue";
import { mapState } from "vuex";
import Cookie from "js-cookie";
import bridge from "ng-bridge";
import Clipboard from "clipboard";
import { Swipe, SwipeItem, Toast, MessageBox } from "mint-ui";
import { qsearch } from "../lib/util.js";
import { COURSE_TYPES, COURSE_ID } from "../api/index.js";
import First from "../components/first.vue";
import Second from "../components/second.vue";
import Third from "../components/third.vue";
import Forth from "../components/forth.vue";
import Fifth from "../components/fifth.vue";
import Sixth from "../components/sixth.vue";

export default {
  data() {
    return {
      wxh: bridge.search("wxh") || "stockhn102",
      isHide: true,
      clipboard: null,
      auditPopupVisible: false,
      isBuyBtn: false,
      // 是否登录
      hadLogin: true,
      // 是否是H5页面
      isH5: false,
      // 是否是iOS
      isIOS: false,
      frontRisk: '',
    };
  },
  props: ["frontRisk"],
  components: {
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    Toast,
    First,
    Second,
    Third,
    Forth,
    Fifth,
    Sixth,
  },
  computed: {
    ...mapState([
      "notAudit",
      "notThrough",
      "isLive",
      "usertoken",
      "courseType",
    ]),
    filterBottomBtnClass() {
      const classname = ['bottom-btn-wrapper'];
      switch (this.courseType) {
        case '2':
          classname.push('special');
          break;
        case '4':
          classname.push('forth-bottom-btn');
          break;
        case '5':
          classname.push('fifth-bottom-btn');
          break;
        default:
          console.log(classname);
      }
      //  !== '2' ? 'common' : 'special';
      return classname;
    },
    activeBuyBtnBg() {
      const list = ['#fff', '#000', '#480e07', '#fff', '#01062c', '#000'];
      return list[this.courseType - 1]
    },
    activeBuyBtnColor() {
      const list = ['#fff', '#916617', '#4c130c', '#916617', '#fff', '#916617'];
      return list[this.courseType - 1]
    }
  },
  watch: {
    frontRisk(val) {
      this.frontRisk = val;
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.isH5 = qsearch("isH5") === "1";
      this.filterHadLogin();
      this.filterIOS();
      this.clipboard = new Clipboard("#wxbtn");
    },
    filterHadLogin() {
      if (this.isH5) {
        this.hadLogin = Boolean(Cookie.get("usertoken"));
      } else {
        bridge.utoken((usertoken = bridge.search("usertoken")) => {
          this.hadLogin = Boolean(usertoken);
        });
      }
    },
    filterIOS() {
      // ios终端
      const u = navigator.userAgent;
      this.isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    },
    copyWXH() {
      this.clipboard.on("success", e => {
        e.clearSelection();
        this.isHide = false;
      });
      this.clipboard.on("error", e => {
        Toast("发生错误");
        this.isHide = true;
      });
    },
    closeBomb() {
      this.isHide = true;
      location.href = "weixin://";
    },
    telPhone(tel) {
      bridge.telPhone(tel);
    },
    handleBuy() {
      // 判断是否是h5页面
      // app外
      if (this.isH5) {
        const usertoken = Cookie.get("usertoken") || qsearch("usertoken");
        if (usertoken) {
          this.$store.commit("SET_USERTOKEN", usertoken);
          location.href = `/public/pay/index.html?courseid=${COURSE_ID}`;
          // window.location.href = `http://h5.niuguwang.com/public/pay/index.html?courseid=${COURSE_ID}`;
        } else {
          location.href = "/public/login/index.html";
          // window.location.href = "http://h5.niuguwang.com/public/login/index.html";
        }
      } else {
        // app内
        bridge.utoken((usertoken = bridge.search("usertoken")) => {
          if (usertoken) {
            this.$store.commit("SET_USERTOKEN", usertoken);
            bridge.toCoursePayment(COURSE_ID, "");
          } else {
            bridge.login();
          }
        });
      }
    },
    // 含直播的页面的支付事件
    buyLive() {
      if (this.notAudit || this.notThrough) {
        this.auditPopupVisible = true;
      } else {
        this.handleBuy();
      }
    },
  }
};
</script>
<style rel="stylesheet/sass" lang="scss" type="text/sass">
@import "../lib/common.scss";
@import "../lib/extend.scss";

.icon {
  display: block;
  background-repeat: no-repeat;
  background-size: 100%;
}
.before-wrapper {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .container {
    flex: 1;
    overflow-x: hidden;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    .before {
      background: #f1f1f1;
      .content {
        border-radius: pxToRem(6px);
        margin: 0 pxToRem(8px) pxToRem(-46px);
        background: #fff;
        transform: translate(0, pxToRem(-46px));
        box-shadow: 0 pxToRem(2px) pxToRem(4px) pxToRem(4px)
          rgba(30, 30, 30, 0.1);
        > section {
          .section-header {
            display: flex;
            justify-content: center;
            padding-top: pxToRem(24px);
            .reg {
              display: inline-block;
              border: pxToRem(1px) solid #bb8854;
              width: pxToRem(8px);
              height: pxToRem(8px);
              transform: rotate(45deg) translate(pxToRem(10px), pxToRem(10px));
            }
            .header-text {
              margin: 0 pxToRem(12px);
              color: #bb8854;
              text-align: center;
              h1 {
                font-size: pxToRem(27px);
              }
              p {
                margin-top: pxToRem(6px);
                font-size: pxToRem(12px);
              }
            }
          }
        }
        .section1 {
          .section-content {
            margin-top: pxToRem(26px);
          }
          .first-section-content-1 {
            .txt-list {
              > li {
                margin: pxToRem(16px) pxToRem(8px) 0;
                padding-bottom: pxToRem(15px);
                position: relative;
                &:after {
                  position: absolute;
                  left: 50%;
                  bottom: 0;
                  transform: translate(-50%, 0);
                  display: inline-block;
                  content: " ";
                  width: pxToRem(400px);
                  height: pxToRem(1px);
                  background-image: url("../images/line-1@2x.png");
                  background-repeat: no-repeat;
                  background-size: pxToRem(400px) pxToRem(1px);
                }
                &:last-of-type {
                  padding-bottom: 0;
                  &:after {
                    content: "";
                    display: none;
                  }
                }

                .icon {
                  float: left;
                }
                .icon-1 {
                  background-image: url("./../images/icon-video-1@2x.png");
                  width: pxToRem(19px);
                  height: pxToRem(18px);
                }
                .icon-2 {
                  background-image: url("./../images/icon-video-2@2x.png");
                  width: pxToRem(19px);
                  height: pxToRem(12px);
                }
                .icon-3 {
                  background-image: url("./../images/icon-video-3@2x.png");
                  width: pxToRem(18px);
                  height: pxToRem(16px);
                }
                .icon-4 {
                  background-image: url("./../images/icon-video-4@2x.png");
                  width: pxToRem(19px);
                  height: pxToRem(19px);
                }
                .icon-5 {
                  background-image: url("./../images/icon-video-5@2x.png");
                  width: pxToRem(19px);
                  height: pxToRem(18px);
                }
                .icon-6 {
                  background-image: url("./../images/icon-video-6@2x.png");
                  width: pxToRem(19px);
                  height: pxToRem(19px);
                }
                .text {
                  font-size: pxToRem(11px);
                  margin-left: pxToRem(24px);
                  .text-title {
                    line-height: 1;
                    strong {
                      font-size: pxToRem(16px);
                      color: #282828;
                    }
                    small {
                      color: #282828;
                    }
                  }
                  .text-content {
                    margin-top: pxToRem(6px);
                    color: #353437;
                  }
                  .vodeo-list {
                    margin-top: pxToRem(10px);
                    > li {
                      text-indent: pxToRem(8px);
                      line-height: 1.6em;
                    }
                  }
                }
              }
            }
          }
          .first-section-content-2 {
            .txt-list {
              overflow: hidden;
              > li {
                float: left;
                width: 50%;
                box-sizing: border-box;
                padding: 0 pxToRem(10px);
                display: flex;
                flex-direction: column;
                text-align: center;
                line-height: 1.4;
                .icon {
                  display: block;
                  width: pxToRem(110px);
                  height: pxToRem(110px);
                  margin: 0 auto;
                }
                .work-header {
                  color: #282828;
                  font-size: pxToRem(15px);
                }
                .time {
                  color: #999;
                  height: 2em;
                  font-size: pxToRem(11px);
                }
                .text {
                  color: #353437;
                  text-align: left;
                  margin: pxToRem(6px) 0;
                  font-size: pxToRem(11px);
                }
              }
            }
          }
          .first-section-content-3 {
            .txt-list {
              margin: 0 pxToRem(4px) 0 pxToRem(24px);
              > li {
                border-left: pxToRem(1px) solid #d6b898;
                line-height: 1;
                position: relative;
                padding-left: pxToRem(10px);
                &:last-child {
                  border-left: 0;
                }
                &:before {
                  position: absolute;
                  left: pxToRem(-2.5px);
                  content: " ";
                  display: block;
                  width: pxToRem(5px);
                  height: pxToRem(5px);
                  border-radius: 50%;
                  background: #d6b898;
                }
                p:first-child {
                  > strong {
                    font-size: pxToRem(16px);
                    color: #18171d;
                  }
                  > span {
                    font-size: pxToRem(11px);
                    color: #999;
                  }
                }
                p:last-child {
                  font-size: pxToRem(11px);
                  margin: pxToRem(8px) 0 0 0;
                  padding-bottom: pxToRem(15px);
                  color: #353437;
                }
              }
            }
          }
        }
        .section2 {
          .section-content {
            margin-top: pxToRem(16px);
            .teacher {
              display: block;
              height: auto;
            }
          }
          .section-content-2 {
            margin-top: pxToRem(36px);
          }
          .ins-title {
            margin: pxToRem(10px) pxToRem(24px);
            color: #282828;
            font-size: pxToRem(15px);
          }
          .ins {
            margin: pxToRem(10px) pxToRem(24px);
            color: #353437;
            text-indent: 2em;
            font-size: pxToRem(10px);
          }
        }
        .section3 {
          .section-content {
            padding: 0 pxToRem(10px) pxToRem(20px);
            .result-img {
              display: block;
            }
          }
        }
      }

      .call-wrapper {
        margin: pxToRem(16px) pxToRem(8px) pxToRem(16px);
        padding: pxToRem(16px);
        background: #fff;
        display: flex;
        height: pxToRem(70px);
        align-items: center;
        box-shadow: 0 pxToRem(2px) pxToRem(4px) pxToRem(4px)
          rgba(30, 30, 30, 0.1);
        border-radius: pxToRem(6px);
        .call-left {
          width: pxToRem(250px);
          flex: 1;
          .num {
            b {
              font-size: 15px;
            }
            a {
              color: rgb(219, 179, 124);
              padding-left: pxToRem(10px);
            }
          }
          p.time {
            margin-top: pxToRem(8px);
            font-size: 12px;
            color: #999;
          }
        }
        .call-right {
          text-align: center;
          width: pxToRem(67px);
          height: pxToRem(30px);
          background: #bb8854;
          color: #fff;
          font-size: pxToRem(16px);
          border-radius: pxToRem(14px);
          outline: none;
          border: 0;
        }
      }
      .no-box-shadow {
        box-shadow: none;
        border-radius: 0;
        margin: pxToRem(16px) 0 0;
        .call-right {
          background: #dbb47d;
        }
      }
      .before-tel-wrapper {
        padding: 0 size(26);
        .tel-content {
          display: flex;
          justify-content: space-between;
          height: size(100);
          > span {
            display: inline-block;
          }
          .tel-tips {
            min-width: size(120);
          }
          .tel-num {
            height: size(110);
            line-height: size(110);
            font-size: size(32);
          }
          .tel-btn {
            width: size(126);
            height: size(60);
            line-height: size(60);
            border-radius: size(30);
            margin: size(25) 0;
            text-align: center;
            color: #fdfbf9;
            font-size: size(28);
          }
        }
        .service {
          line-height: 1;
          .tel-tips {
            display: flex;
            flex-direction: column;
            b {
              display: block;
              line-height: size(110);
              font-size: size(32);
            }
            i {
              display: block;
              font-size: 12px;
              color: #999;
              font-style: normal;
              margin-top: size(10);
            }
          }
          .tel-num {
            color: #bb8854;
            line-height: size(110);
          }
          .tel-btn {
            background: #bb8854;
          }
        }
        .watch {
          font-size: size(32);
          height: size(80);
          b {
            line-height: size(110);
            font-size: size(32);
          }
          .tel-num {
            color: #bb8854;
          }
          .tel-btn {
            background: #bb8854;
          }
        }
        .time {
          font-size: size(20);
          color: #282828;
          padding-bottom: size(40);
        }
      }
      .tips {
        width: 100%;
        height: pxToRem(68px);
        padding: pxToRem(13px);
        text-align: justify;
        font-size: 9px;
        background: rgb(236, 238, 241);
      }
      img {
        display: block;
        width: 100%;
        height: auto;
      }
      .announcement {
        color: #999;
        line-height: 1.5;
        font-size: pxToRem(12px);
        padding: pxToRem(13px) pxToRem(13px) pxToRem(10px);
        a {
          color: #458cf5;
        }
      }
    }
  }
  .buy-button {
    flex: 0 0 auto;
    width: 100%;
    height: pxToRem(50px);
    line-height: pxToRem(50px);
    background: #bb8854;
    color: #fff;
    font-size: pxToRem(18px);
    font-weight: bold;
    text-align: center;
  }
  .bottom-btn-wrapper {
    flex: 0 0 auto;
    height: pxToRem(70px);
    .nolive-btn {
      padding: 0 pxToRem(6px);
      text-align: center;
      display: -webkit-box;
      display: -webkit-flex;
      display: box;
      display: flex;
      justify-content: space-between;
      -webkit-justify-content: space-between;
      img {
        width: pxToRem(174px);
        height: pxToRem(53px);
        display: block;
        margin: 0 auto;
      }
      > span {
        flex: 1;
        -webkit-flex: 1;
        margin: 0.4rem 0.2rem;
        display: block;
        font-weight: bold;
        height: pxToRem(45px);
        line-height: pxToRem(45px);
        float: left;
        color: #fff;
        font-size: 15px;
        text-align: center;
        letter-spacing: size(2);
        &.grey {
          background: #d6a56e;
        }
        &.gradient {
          background: linear-gradient(to right, #EECE9F, #e3af71);
        }
      }
      #wxbtn {
        background: #458cf5;
      }
    }
  }
  .common {
    background: #f1f1f1;
  }
  .special {
    background: #000;
  }
  .forth-bottom-btn {
    background: #100F15;
    height: size(140);
    margin-top: -1px;
    .nolive-btn {
      > span {
        background: linear-gradient(to right, #EECE9F, #E2AF70) !important;
        color: #916617;
        font-weight: 500;
      }
    }
  }
  .fifth-bottom-btn {
    background-image: url("../images/18.jpg");
    background-size: 100% size(140);
    background-repeat: no-repeat;
    margin-top: -1px;
    .nolive-btn {
      > span {
        background: linear-gradient(to right, #E2AF78, #C79761) !important;
      }
    }
  }
}

#cpLink {
  position: absolute;
  left: -9999px;
  top: -999999px;
}
.mark-pane {
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
}
.bomb-pane {
  position: fixed;
  z-index: 999;
  top: 50%;
  left: 50%;
  width: pxToRem(270px);
  height: pxToRem(290px);
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  background: #fff;
  border-radius: 0.26667rem;
  font-size: 16px;
  line-height: 1.5;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2), 0 2px 2px rgba(0, 0, 0, 0.14),
    0 3px 1px -2px rgba(0, 0, 0, 0.12);
  img {
    display: block;
    width: pxToRem(49px);
    height: auto;
    margin: pxToRem(30px) auto;
  }
  p {
    margin: pxToRem(10px) auto;
    text-align: center;
    span {
      color: rgb(226, 73, 45);
    }
  }
  .bomb-add {
    width: pxToRem(240px);
    height: pxToRem(40px);
    margin: pxToRem(25px) auto;
    background-color: #f26e54;
    line-height: pxToRem(40px);
    font-size: p18px;
    text-align: center;
    color: #fff;
    border-radius: 4px;
  }
  .copy-success {
    font-size: pxToRem(18px);
    font-weight: 700;
    margin-top: pxToRem(16px);
  }
}
.bottom-btn {
  height: pxToRem(70px);
  background: url("../images/before/bg.png");
  background-size: 100% 100%;
}

.live-special {
  .live-btn {
    img {
      width: 100%;
      height: pxToRem(70px);
      display: block;
    }
  }
}
.dialog-wrapper {
  .dialog-container {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 1000;
  }
  .dialog-content {
    position: fixed;
    z-index: 1001;
    top: 50%;
    left: 50%;
    width: 80%;
    box-sizing: border-box;
    padding: 0 pxToRem(26px);
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    background: #fff;
    border-radius: pxToRem(6px);
    font-size: 16px;
    line-height: 1.5;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2), 0 2px 2px rgba(0, 0, 0, 0.14),
      0 3px 1px -2px rgba(0, 0, 0, 0.12);
    .tit {
      font-size: 18px;
      color: #2a4159;
      text-align: center;
      margin: pxToRem(15px) 0;
    }
    .literals {
      font-size: 14px;
      color: #98a4b1;
    }
    .phone {
      font-size: 14px;
      text-align: center;
      padding: pxToRem(20px) 0 pxToRem(16px);
      span {
        color: #2a4159;
      }
      > a {
        color: #458cf5;
      }
    }
    .dialog-close {
      background: #ff4c51;
      height: pxToRem(40px);
      line-height: pxToRem(40px);
      text-align: center;
      margin: pxToRem(15px) 0;
      color: #fff;
      font-size: 16px;
    }
  }
}

.has-buy {
  position: absolute;
  top: pxToRem(200px);
  right: 0;
  img {
    height: pxToRem(30px);
  }
}
</style>