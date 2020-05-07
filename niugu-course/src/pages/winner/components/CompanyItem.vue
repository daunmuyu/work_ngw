<template>
  <div class="stock-items">
    <section class="stock-name-wrapper">
      <p class="box-time">{{stock.BaseAddTime}}</p>
      <h5 class="stock-name-container">
        <p class="stock-name" @click="toQuote(stock)">
          {{stock.StockName}} ({{stock.StockCode}})
        </p>
        <div class="stock-label">
          <div class="label-box-wrapper">
            <div class="label-box border-ios">{{filterStyle(stock.OperateStyle)}}</div>
            <div class="label-box border-ios">{{filterType(stock.OperateType)}}</div>
          </div>
          <div class="handle-stock-label" v-if="stock.hasmore == 1" @click="handleLabelChange">
            <span v-if="stock.closestatus" class="arrow dk">打开</span>
            <span v-else class="arrow sq">收起</span>
          </div>
        </div>
      </h5>
    </section>
    <section class="stock-detail">
      <div class="left">
        <span>流通盘：</span>
        <b>{{stock.Mobilization}}亿股</b>
      </div>
      <div class="right">
        <span>流通市值：</span>
        <b>{{stock.MobilizationValue}}亿元</b>
      </div>
    </section>
    <section class="box clearfix" v-if="stock.listItem && stock.listItem.length" v-for="(litem,i) in stock.listItem" :key="i">
      <template v-if="litem.stocktype==='调出'">
        <b class="timeline"></b>
        <div class="box-tips box-tips-loss">
          <i>调出</i>{{litem.ComTime}}
        </div>
        <div class="box-content-win">
          {{litem.Reason}}
        </div>
        <p class="prices" v-if="litem.referencePrice">调出价格：{{litem.referencePrice}}</p>
      </template>
      <template v-if="litem.stocktype ==='调入'">
        <b class="timeline"></b>
        <div class="box-tips box-tips-win">
          <i>买入</i>{{litem.ComTime}}
        </div>
        <div class="box-content-win">
          {{litem.Reason}}
        </div>
      </template>
      <template v-if="litem.stocktype==='选股逻辑'">
        <b class="timeline"></b>
        <div class="box-tips box-tips-tips">
          <i>选股逻辑</i>{{litem.BaseAddTime}}
        </div>
        <div class="box-content-win" v-if="litem.Reason_Base">
          {{litem.Reason_Base}}
        </div>
        <div class="box-content-win" v-if="litem.Reason_Tech">
          {{litem.Reason_Tech}}
        </div>
        <p class="box-content-win">{{litem.recommcontent}}</p>
        <div class="box-list-win clearfix">
          <span class="item">
            <i>压力位</i>
            <em>{{litem.ProfitPrice}}</em>
          </span>
          <span class="item">
            <i>支撑位</i>
            <em>{{litem.LosePrice}}</em>
          </span>
          <span class="item item2">
            <i>最新价</i>
            <em :class="'price'+litem.PriceColor">{{litem.NowPx}}</em>
          </span>
          <span class="item">
            <i>参考介入价位</i>
            <em>{{litem.ReferencePrice}}</em>
          </span>
          <div class="item stock-speed-pane" v-if="litem.PositionValue">
            <em>仓位提示：</em>
            <strong>{{litem.PositionValue}}成</strong>
            <img v-if="litem.PositionValue" :src="filterImg(litem.PositionValue)" alt="仓位图">
          </div>
        </div>
      </template>
    </section>
  </div>
</template>
<script type="text/ecmascript-6">
import Vue from "vue";
import { mapState } from "vuex";
import bridge from "ng-bridge";
import { getCompany, getItemMore } from "../api/index.js";

const pageSize = 2;

export default {
  props: ["stock"],
  methods: {
    filterStyle(str) {
      const obj = {
        0: "短线类",
        1: "成长类",
        2: "价投类",
        3: "成长类"
      };
      return obj[str.toString()];
    },
    filterType(str) {
      const obj = {
        0: "稳健",
        1: "激进"
      };
      return obj[str.toString()];
    },
    toQuote(item) {
      if (item instanceof Object) {
        bridge.toQuote(
          item.InnerCode,
          item.StockCode,
          item.StockName,
          item.Market
        );
      }
    },
    // 切换折叠还是收起
    handleLabelChange(index) {
      this.$emit("onLabelChange", index);
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

.stock-items {
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
            border: 1px solid rgb(255, 76, 81); // border-radius: pxToRem(4px);
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
  .box {
    margin: 0 pxToRem(13px);
    padding-top: pxToRem(17.5px);
    position: relative;
    .timeline {
      display: block;
      width: pxToRem(14px);
      height: pxToRem(47.5px);
      float: left;
      background-image: url("../images/after/timeline.png");
      background-repeat: no-repeat;
      background-size: contain;
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
    .box-tips {
      height: pxToRem(16px);
      line-height: pxToRem(18px);
      color: rgb(153, 153, 153);
      font-size: pxToRem(12px);
      text-align: left;
      margin-left: pxToRem(26px);
      i {
        display: inline-block;
        padding: 0 pxToRem(5px);
        height: 100%;
        font-style: normal;
        border-radius: pxToRem(3px);
        line-height: pxToRem(18px);
        font-size: pxToRem(10px);
        color: #fff;
        text-align: center;
        margin-right: pxToRem(7.5px);
      }
    }
    .box-tips-win {
      i {
        background: rgb(239, 139, 69);
      }
    }
    .box-tips-loss {
      i {
        background: rgb(69, 140, 245);
      }
    }
    .box-tips-tips {
      i {
        background: #8fbaf9;
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
      margin: 0 0 pxToRem(17px) pxToRem(26px);
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
          margin-top: pxToRem(0px);
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
</style>

