<template>
  <div class="stock-core" id="stock-core" v-if="denver">
    <div class="section-title border-ios">今日策略</div>
    <div class="stock-txt-pane border-ios">
      <div class="core-tips" v-html="full?denver.reportcontent:denver.abstract"></div>
      <div class="core-time">{{denver.reporttime}}</div>
    </div>
    <div class="box-more up border-ios" @click="full=!full">
      <span :class="full?'shouqi':'chakan'">{{full?'收起':'查看全文'}}</span>
    </div>
    <div class="core-tips-degree">
      建议仓位：
      <i>{{denver.postionvos}}成</i>
    </div>
    <img v-if="denver.postionvos" :src="filterImg(denver.postionvos)" class="core-degree-img" alt="仓位图"/>
    <div class="core-degree"></div>
  </div>
</template>
<script type="text/ecmascript-6">
import Vue from "vue";
import { Toast } from "mint-ui";
import { mapState } from 'vuex';
import { getDenver } from "../api/index";

export default {
  data() {
    return {
      denver: null,
      full: false
    };
  },
  computed: {
    ...mapState([
      'usertoken',
    ])
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      getDenver({
        usertoken: this.usertoken
      }).then(res => {
        if (+res.code === 0) {
          this.denver = res;
        } else {
          Toast(res.err || "请求错误");
        }
      });
    },
    /**
     * @augments {string} 图片名
     * @return 图片模块
     * 遇到的问题： vue 动态加载图片src的时候，webpack无法解析地址，保存的还是相对路径
     * 解决办法： 见 http://blog.csdn.net/Mr_YanYan/article/details/78783091
     */
    filterImg(num) {
      return require(`../images/after/i/speed-${num}.png`);
    }
  }
};
</script>
<style rel="stylesheet/sass" lang="scss" type="text/sass">
@import "../lib/common.scss";

.stock-core {
  background: #fff;
  margin-bottom: pxToRem(12px);
  .stock-txt-pane {
    padding-bottom: pxToRem(15px);
    .core-tips {
      padding-top: pxToRem(20px);
      margin: 0 auto;
      width: pxToRem(346px);
      font-size: 14px;
      line-height: pxToRem(21px);
      text-align: left;
    }
    .core-time {
      padding-top: pxToRem(10px);
      font-size: 12px;
      text-align: left;
      width: pxToRem(346px);
      color: rgb(153, 153, 153);
      margin: 0 auto;
    }
  }
  .core-tips-section {
    width: pxToRem(346px);
    padding-top: pxToRem(23.5px);
    text-align: left;
    font-size: 17px;
    margin: 0 auto;
    font-weight: bold;
  }
  .core-sections {
    width: pxToRem(366px);
    margin: 0 auto;
    padding-top: pxToRem(19px);
    span {
      display: block;
      float: left;
      width: pxToRem(74px);
      height: pxToRem(54px);
      text-align: center;
      line-height: pxToRem(54px);
      font-size: 12.5px;
      margin-bottom: pxToRem(10px);
      margin-left: pxToRem(8.2px);
      box-shadow: 0 0 10px rgba(194, 165, 121, 0.4);
    }
    .items-box {
      float: left;
      margin: pxToRem(7px);
      width: pxToRem(168px);
      height: pxToRem(55px);
      box-shadow: 5px 8px 10px rgba(194, 165, 121, 0.2);
      display: flex;
      .item {
        width: 50%;
        height: 100%;
        h5 {
          padding: pxToRem(8px) pxToRem(10px) 0;
          font-size: 14px;
        }
        p {
          padding: pxToRem(4px) pxToRem(10px) 0;
          font-size: 12px;
          &.red {
            color: rgb(230, 0, 18);
          }
          &.green {
            color: rgb(0, 153, 68);
          }
        }
        span {
          padding-left: pxToRem(10px);
          line-height: pxToRem(55px);
          font-size: 16px;
          color: #fff;
        }
        &.red {
          background-color: rgb(230, 0, 18);
        }
        &.green {
          background-color: rgb(0, 153, 68);
        }
      }
    }
  }
  .core-tips-degree {
    width: pxToRem(346px);
    padding-top: pxToRem(23px);
    text-align: left;
    font-size: 17px;
    margin: 0 auto pxToRem(19px);
    font-weight: bold;
    i {
      font-style: normal;
      color: red;
      font-weight: normal;
    }
  }
  .core-degree-img {
    margin: 0 auto;
    display: block;
    width: pxToRem(346px);
    height: pxToRem(20px);
  }
  .core-degree {
    margin: 0 auto;
    width: pxToRem(313px);
    padding-top: pxToRem(23px);
    font-size: 14px;
    text-align: left;
    line-height: pxToRem(21px);
    margin-bottom: pxToRem(12px);
  }
}
</style>
