<template>
  <div class="sole-box" id="sole-box" v-if="report">
    <div class="section-title border-ios">
      独家内参
    </div>
    <p class="sole-item border-ios" v-for="item in report" :key="item.url" @click="open(item)">
      <span class="sole-name">{{item.title}}</span>
      <span class="sole-time">{{item.addtime}}</span>
    </p>
    <a class="box-more right border-ios" v-if="usertoken" :href="'http://h5.stockhn.com/huodong/base/list/sole-list.html?usertoken='+usertoken">
      <span>点击查看更多</span>
    </a>
  </div>
</template>
<script type="text/ecmascript-6">
import Vue from "vue";
import bridge from "ng-bridge";
import { mapState } from "vuex";
import { getReport } from "../api/index.js";

export default {
  data() {
    return {
      report: null
    };
  },
  created() {
    this.fetchData();
  },
  computed: {
    ...mapState(["usertoken", "isH5"])
  },
  methods: {
    fetchData() {
      getReport({
        usertoken: this.usertoken,
        curpage: 1,
        pagesize: 4
      }).then(res => {
        if (+res.code === 0) {
          this.report = res.reportdata;
        }
      });
    },
    open(pdf) {
      if (pdf.url) {
        if (this.isH5) {
          location.href = pdf.url;
        } else {
          bridge.openPDF(pdf.url, pdf.title);
        }
      }
    }
  }
};
</script>
<style rel="stylesheet/sass" lang="scss" type="text/sass">
@import "../lib/common.scss";

.sole-box {
  margin: pxToRem(12.5px) auto;
  width: 100%;
  background: #fff;
  text-align: center;
  margin-bottom: pxToRem(12.5px);
  .sole-item {
    display: block;
    width: pxToRem(348px);
    height: pxToRem(45px);
    line-height: pxToRem(45px);
    border-bottom: 1px solid rgb(232, 232, 232);
    margin: 0 auto;
    &:last-child {
      border: none;
    }
    .sole-name {
      float: left;
      display: block;
      color: #000;
      font-size: 16px;
      width: pxToRem(203.5px);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: left;
    }
    .sole-time {
      display: block;
      float: right;
      font-size: 12px;
      color: rgb(153, 153, 153);
    }
  }
}
</style>
