<template>
  <div class="home-wrapper">
    <!-- <before-view v-if="type==='before'" /> -->
    <after-view 
      v-if="type==='after'"
      :isFirstTime="isFirstTime"
      :agreementMsgs="agreementMsgs"
      :remindVisible="remindVisible"
    />
    <before-view :frontRisk="frontRisk" v-else />
  </div>
</template>
<script type="text/ecmascript-6">
import Vue from "vue";
import bridge from "ng-bridge";
import Cookie from "js-cookie";
import { getIsBuy, COURSE_ID, COURSE_TYPES, TITLES } from "../api/index.js";
import BeforeView from "./combineBefore.vue";
import AfterView from "./after.vue";
import { qsearch } from "../lib/util.js";

export default {
  data() {
    return {
      type: "",
      // 是否是第一次进入此课程页面
      isFirstTime: false,
      // 从后端拿的弹框中的信息
      agreementMsgs: {},
      // 温馨提示弹框是否显示
      remindVisible: null,
      frontRisk: '',
    };
  },
  components: {
    BeforeView,
    AfterView
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      bridge.init();
      const isH5 = Boolean(qsearch("isH5"));
      const courseType = COURSE_TYPES[qsearch("courseid")] || '1';
      let title = TITLES[COURSE_ID]
      if (!Object.keys(TITLES).includes(COURSE_ID)) {
        title = TITLES[4392];
      }
      document.title = title;
      if (isH5) {
        const usertoken = Cookie.get("usertoken") || qsearch("usertoken");
        this.filterView(usertoken);
      } else {
        bridge.setTitle(title);
        bridge.initRefresh(1);
        bridge.utoken((usertoken = qsearch("usertoken")) => {
          this.filterView(usertoken);
        });
      }
      this.$store.commit('SET_isH5', isH5);
      this.$store.commit('SET_COURSE_TYPE', courseType);
      this.filterLive();
    },
    filterLive() {
      let isLive = false;
      if (Number(qsearch("applive")) === 1) {
        isLive = true;
      }
      this.$store.commit("SET_LIVE", isLive);
    },
    // 根据usertoken和url里的query，判断显示哪个页面
    filterView(usertoken) {
      let notAudit = false;
      let notThrough = false;
      if (usertoken) {
        getIsBuy({
          usertoken,
          action: "isbuy",
          courseid: COURSE_ID,
          date: new Date()
        }).then(res => {
          // 未审核
          console.log(res);
          if (+res.orderStatus === 10) {
            notAudit = true;
          }
          // 未通过
          if (+res.orderStatus === 11) {
            notThrough = true;
          }
          if (Number(res.code) === 0 && Number(res.result) === 1) {
            // bridge.onQuShiWenYingLogin();
            this.type = "after";
            this.remindVisible = res.alertflag === 1;
            if (res.message) {
              this.$store.commit("SET_VALID_TIME", res.message);
            }
            if (+res.isShowRisk === 1) {
              this.isFirstTime = true;
              // 转换后端给的弹框信息：利用正则，匹配拼接
            }
            this.agreementMsgs = {
              content: res.agreementtext,
              agreement: res.newagreementtext.replace(
                /《.+?》/g,
                (match, p1, p2) => {
                  if (p1) {
                    return `<a href="${res.hdurl}">${match}</a>`;
                  }
                  if (p2) {
                    return `<a href="${res.riskurl}">${match}</a>`;
                  }
                }
              )
            };
          } else {
            this.type = "before";
            this.frontRisk = res.frontrisk && res.frontrisk.replace(
                /《.+?》/g,
                (match, p1, p2) => {
                  if (p1) {
                    return `<a href="${res.hdurl}">${match}</a>`;
                  }
                  if (p2) {
                    return `<a href="${res.riskurl}">${match}</a>`;
                  }
                }
              )
            console.log(this.frontRisk, 'riskkk');
          }
          this.$store.commit("SET_NOT_AUDIT", notAudit);
          this.$store.commit("SET_NOT_THROUGH", notThrough);
        });
        this.$store.commit("SET_USERTOKEN", usertoken);
      } else {
        this.$store.commit("SET_USERTOKEN", "");
        this.type = "before";
      }
    }
  }
};
</script>
<style rel="stylesheet/sass" lang="scss" type="text/sass">
.home-wrapper {
  height: 100%;
  overflow: hidden;
  position: relative;
}
</style>