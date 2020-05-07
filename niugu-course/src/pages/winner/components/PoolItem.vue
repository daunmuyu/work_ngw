<template>
  <div class="pool-item">
    <section class="stock-name-wrapper">
      <p class="box-time">{{stock.recommdate}}</p>
      <h5 class="stock-name-container">
        <p class="stock-name" @click="toQuote(stock)">
          {{stock.stockname}} ({{stock.stockcode}})
        </p>
        <div class="stock-label">
          <div class="label-box-wrapper">
            <div class="label-box border-ios">{{stock.operateType}}</div>
            <div class="label-box border-ios">{{stock.choosetype}}</div>
          </div>
          <div class="handle-stock-label" v-if="stock.hasmore == 1" @click="handleClick">
            <span v-if="stock.closestatus" class="arrow dk">打开</span>
            <span v-else class="arrow sq">收起</span>
          </div>
        </div>
      </h5>
    </section>
    <section class="stock-detail">
      <div class="left" v-if="stock.mobilization">
        <span>流通盘：</span>
        <b>{{stock.mobilization}}股</b>
      </div>
      <div class="right" v-if="stock.mobilizationValue">
        <span>流通市值：</span>
        <b>{{stock.mobilizationValue}}元</b>
      </div>
    </section>
    <section class="box-loss-win" v-if="stock.listItem && stock.listItem.length" v-for="(litem,i) in stock.listItem" :key="i">
      <template v-if="litem.stocktype==='调出'">
        <div class="box-tips-loss">
          <i>调出</i>{{litem.recommdate}}
        </div>
        <p class="box-content-loss">{{litem.recommcontent}}</p>
        <p class="prices" v-if="litem.referencePrice">调出价格：{{litem.referencePrice}}</p>
      </template>
      <template v-if="litem.stocktype==='调入'">
        <div class="box-tips-win">
          <i>买入</i>{{litem.recommdate}}
        </div>
        <p class="box-content-win">{{litem.recommcontent}}</p>
        <div class="box-list-win clearfix">
          <span class="item item1">
            <i>压力位</i>
            <em>{{litem.profitPrice}}</em>
          </span>
          <span class="item item3">
            <i>支撑位</i>
            <em>{{litem.losePrice}}</em>
          </span>
          <span class="item item2">
            <i>最新价</i>
            <em :class="'price'+litem.pricecolor">{{litem.nowprice}}</em>
          </span>
          <span class="item item4">
            <i>参考介入价位</i>
            <em>{{litem.referencePrice}}</em>
          </span>
          <div class="item stock-speed-pane" v-if="litem.postionvos">
            <em>仓位提示：</em>
            <strong>{{litem.postionvos}}成</strong>
            <img v-if="litem.postionvos" :src="filterImg(litem.postionvos)" alt="仓位图">
          </div>
        </div>
      </template>
      <template v-if="!litem.stocktype">
        <div class="box-tips-win">
          {{litem.recommdate}}
        </div>
        <div class="box-content-win">
          {{litem.recommcontent}}
        </div>
      </template>
    </section>
  </div>
</template>
<script type="text/ecmascript-6">
import Vue from "vue";
import { mapState } from "vuex";
import bridge from "ng-bridge";

export default {
  data() {
    return {
      pool: null,
      filterPool: null
    };
  },
  props: ['stock'],
  computed: {
    ...mapState(["usertoken"])
  },
  created() {
  },
  methods: {
    toQuote(item) {
      bridge.toQuote(
        item.innercode,
        item.stockcode,
        item.stockname,
        item.market
      );
    },
    // 切换折叠还是收起
    handleClick() {
      this.$emit('onLabelChange');
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
.pool-item {
  padding: pxToRem(20px) pxToRem(15px) 0;
  margin: 0 auto;
  .stock-name-wrapper {
    padding-bottom: pxToRem(5px);
    .box-time {
      font-size: 12px;
      line-height: pxToRem(18px);
      color: #999;
    }
    .stock-name-container {
      color: rgb(86, 138, 224);
      font-size: pxToRem(15px);
      line-height: pxToRem(22px);
      font-weight: 500;
      display: flex;
      .stock-name {
        width: 40%;
        flex: 0 0 auto;
        line-height: pxToRem(22px);
        height: pxToRem(22px);
      }
      .stock-label {
        flex: 1;
        display: flex;
        padding: 0 0;
        .label-box-wrapper {
          flex: 0 0 auto;
          .label-box {
            display: inline-block;
            color: rgb(255, 76, 81);
            height: pxToRem(18px);
            line-height: pxToRem(18px);
            padding: 0 pxToRem(6px);
            border: 1px solid rgb(255, 76, 81);
            // border-radius: pxToRem(4px);
            margin-right: pxToRem(8px);
            font-size: pxToRem(10px);
          }
        }
        .handle-stock-label {
          flex: 1;
          text-align: right;
          .arrow {
            font-size: 12px;
            color: #333;
          }
          .dk:after {
            content: "";
            display: inline-block;
            position: relative;
            left: pxToRem(6px);
            top: pxToRem(2px);
            width: pxToRem(10px);
            height: pxToRem(8px);
            background-image: url("../images/after/jinr.png");
            background-repeat: no-repeat;
            background-size: contain;
            transform: rotate(90deg);
            -ms-transform: rotate(90deg);
            -moz-transform: rotate(90deg);
            -webkit-transform: rotate(90deg);
            -o-transform: rotate(90deg);
          }
          .sq:after {
            content: "";
            display: inline-block;
            position: relative;
            left: pxToRem(6px);
            top: pxToRem(-2px);
            width: pxToRem(10px);
            height: pxToRem(8px);
            background-image: url("../images/after/jinr.png");
            background-repeat: no-repeat;
            background-size: contain;
            transform: rotate(-90deg);
            -ms-transform: rotate(-90deg);
            -moz-transform: rotate(-90deg);
            -webkit-transform: rotate(-90deg);
            -o-transform: rotate(-90deg);
          }
        }
      }
    }
  }
  .stock-detail {
    text-align: left;
    overflow: hidden;
    zoom: 1;
    clear: both;
    font-size: 12px;
    color: #333;
    > div {
      display: inline-block;
      line-height: pxToRem(24px);
      margin-right: pxToRem(10px);
    }
  }
  .box-loss-win {
    // margin: 0 pxToRem(13px);
    padding-top: pxToRem(17.5px);
    position: relative;
    .box-time {
      font-size: pxToRem(12px);
      color: #999;
      text-align: left;
    }
    .box-name {
      padding-top: pxToRem(2px);
      font-size: pxToRem(17px);
      color: rgb(178, 148, 101);
      text-align: left;
      margin-bottom: pxToRem(14.8px);
    }
    .box-tips-loss {
      height: pxToRem(16px);
      line-height: pxToRem(18px);
      color: rgb(153, 153, 153);
      font-size: 12px;
      text-align: left;
      margin-left: pxToRem(26px);
      i {
        display: inline-block;
        padding: 0 pxToRem(5px);
        height: 100%;
        background: rgb(69, 140, 245);
        font-style: normal;
        border-radius: pxToRem(3px);
        line-height: pxToRem(18px);
        font-size: 10px;
        color: #fff;
        text-align: center;
        margin-right: pxToRem(7.5px);
      }
      &:after {
        content: "";
        display: block;
        width: pxToRem(14px);
        height: pxToRem(47.5px);
        position: relative;
        left: pxToRem(-25px);
        top: pxToRem(-18px);
        background-image: url("../images/after/timeline.png");
        background-repeat: no-repeat;
        background-size: contain;
      }
    }
    .box-content-loss {
      width: pxToRem(286px);
      font-size: 14px;
      line-height: pxToRem(20px);
      padding-top: pxToRem(6px);
      text-align: left;
      margin-left: pxToRem(42.5px);
      margin-bottom: pxToRem(6px);
    }
    .prices {
      width: pxToRem(286px);
      font-size: pxToRem(14px);
      line-height: pxToRem(20px);
      padding-top: pxToRem(6px);
      text-align: left;
      margin-left: pxToRem(42.5px);
      margin-bottom: pxToRem(5px);
    }
    .box-tips-win {
      height: pxToRem(16px);
      line-height: pxToRem(18px);
      color: rgb(153, 153, 153);
      font-size: pxToRem(12px);
      text-align: left;
      margin-left: pxToRem(26px);
      i {
        float: left;
        display: block;
        width: pxToRem(30px);
        height: 100%;
        background: rgb(239, 139, 69);
        font-style: normal;
        border-radius: pxToRem(3px);
        line-height: pxToRem(18px);
        font-size: pxToRem(10px);
        color: #fff;
        text-align: center;
        margin-right: pxToRem(7.5px);
      }
      :after {
        content: "";
        display: block;
        width: pxToRem(14px);
        height: pxToRem(47.5px);
        position: relative;
        left: pxToRem(-25px);
        top: pxToRem(-18px);
        background-image: url("../images/after/timeline.png");
        background-repeat: no-repeat;
        background-size: contain;
      }
    }
    .box-content-win {
      width: pxToRem(286px);
      font-size: 14px;
      line-height: pxToRem(20px);
      padding-top: pxToRem(6px);
      text-align: left;
      margin-left: pxToRem(26px);
      margin-bottom: pxToRem(10px);
    }
    .box-list-win {
      position: relative;
      margin: 0 pxToRem(26px) pxToRem(17px) pxToRem(26px);
      .item {
        float: left;
        display: block;
        width: 50%;
        height: pxToRem(39px);
        padding-top: pxToRem(6px);
        line-height: 1.5;
        > i {
          display: block;
          font-style: normal;
          font-size: 12px;
          color: rgb(153, 153, 153);
        }
        > em {
          padding-top: pxToRem(1px);
          display: block;
          font-style: normal;
          font-size: 14px;
        }
      }
      // .item1:after,
      // .item2:after {
      //   content: " ";
      //   position: absolute;
      //   right: 0;
      //   top: 50%;
      //   height: pxToRem(22px);
      //   width: 1px;
      //   background: #e8e8e8;
      //   transform: translate(0, -50%);
      // }
      .item2 {
        .price1 {
          color: #ff4c51;
        }
        .price2 {
          color: #999;
        }
        .price3 {
          color: #22be7e;
        }
      }
    }
  }
  .stock-txt {
    line-height: pxToRem(22px);
    font-size: pxToRem(14px);
    color: rgb(51, 51, 51);
    padding: pxToRem(10px) 0;
  }
  .short-term {
    background-image: url("../images/after/buy2.png");
    background-size: pxToRem(756px) pxToRem(170px);
    background-position: center;
    width: 100%;
    height: pxToRem(85px);
    display: flex;
    align-items: center;
    & > div {
      font-size: pxToRem(12px);
      line-height: pxToRem(16px);
      &.lef {
        padding: 0 pxToRem(15px);
        color: #fff;
      }
      &.cont {
        width: pxToRem(135px);
        padding-bottom: pxToRem(5px);
        &:nth-child(2) {
          position: relative;
          &:after,
          &:before {
            content: "";
            position: absolute;
            top: pxToRem(5px);
            border-left: 1px solid rgb(232, 232, 232);
            height: pxToRem(22px);
          }
          &:before {
            left: 0;
          }
          &:after {
            right: 0;
          }
        }
        p {
          padding-left: pxToRem(15px);
          color: RGB(153, 153, 153);
        }
        h5 {
          padding-left: pxToRem(15px);
        }
      }
    }
  }
}
.stock-speed-pane {
  width: 100% !important;
  height: auto !important;
  padding-top: pxToRem(8px) !important;
  font-size: 12px;
  height: 1.5em;
  em {
    color: #999;
    font-size: 12px !important;
    display: inline !important;
  }
  strong {
    color: rgb(255, 88, 71);
    display: inline;
  }
  img {
    float: right;
    width: pxToRem(195px);
    height: pxToRem(13px);
    // margin-top: pxToRem(4px);
  }
}
</style>

