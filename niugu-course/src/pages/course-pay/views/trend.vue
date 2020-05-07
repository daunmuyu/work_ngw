<template>
  <div class="container">
    <img src="../images/dk4.png" alt="img" width="100%" class="float-left">
    <div class="list-text float-right" style="margin-top: -1px">
      <p>
        系统涵盖趋势、变盘、买卖、减仓多重信号联动共振，提供一键选股功能、股票池个性区分、自选股智能预警等应用于一体，是股票个人投资者的必备工具。
      </p>
    </div>
    <img src="../images/dk1.png" alt="img" width="100%">
    <div class="list-text float-left">
      <p>
        大数据智能区分策略属性，建立五大精选股票池。多种强势策略选股，总有一款适合你。
      </p>
    </div>
    <img src="../images/dk2.png" alt="img" width="100%">
    <div class="example">
      <p class="title">图例</p>
      <img src="../images/dk6.jpg" alt="example" class="example-img">
    </div>
    <div class="example-text">
      <p class="text">
        如图中的红色持股阶段，股价出现剧烈震荡和回落，但是区块保持红色，意味着波段趋势不变，可以维持持股而把握主升浪，但因此处市场行情出现下跌风险，DK趋势将会发出减仓信号，提示您可落袋为安并且规避风险。而图中绿色持币阶段，期间股价如有出现阳线回升，但是区块维持绿色，意味着股价趋势未走好，继续持币观望和避险，规避持续下跌的波段。
      </p>
    </div>
    <div class="how-to-use">
      <div class="title">
        <span>使用说明</span>
      </div>
      <p class="text">
        1.时空图区块呈红色，发出D点信号，联动共振，表明股票处于多方趋势，可以精选个股介入。随后按照DK信号可把握整个上涨波段
        <br />2.时空图区块呈绿色，发出D点信号，过滤信号，表明股票处于空方趋势，建议警惕后续风险，保持观望
        <br />3.时间区块呈现红色，发出D点信号，同时底部变盘信号出现，预示着机会将至
        <br /> 4.时间区块呈现绿色，发出K点信号，同时顶部变盘信号出现，预示着风险降至
        <br /> 5.当市场行情出现下跌风险时，DK趋势会适时发出减仓信号，提示您可落袋为安并且规避风险
      </p>
      <img src="../images/dk3.png" alt="title" class="bg" width="100%">
    </div>
    <p class="instruction">
      风险提示：历史回测数据不代表未来趋势；本产品利用市场公开数据经大数据智能分析运算，相关结论仅供参考，不构成投资建议，据此操作，盈亏自负；技术指标存在客观局限性，不同历史时期市场环境下表现有差异，不具备普适性；股市有风险，投资需谨慎。
      <br/>上海海能证券投资顾问有限公司 业务许可编号：zx0098
    </p>
  </div>
</template>
<script>
import mixin from '../util/mixin.js';

export default {
  mixins: [mixin],
}
</script>
<style lang="scss" scoped>
@function size($px) {
    @return $px / 75 * 1rem;
}
.float-right {
  float: right;
}

.float-left {
  float: left;
}
.container {
  height: 100%;
  overflow-y: scroll;
  padding-bottom: size(180);
  background: #180F5E;
  >img {
    display: block;
    border: 0;
    // margin: -1px 0 0;
  }
  .list-text {
    width: size(690);
    margin-top: -1px;
    background: #fff;
    >p {
      margin: 0 0 size(76) size(40);
      background: #EEF1F6;
      padding: size(54) size(36) size(56);
      color: #2A4159;
      font-size: size(28);
      line-height: 1.6;
    }
  }
  .example {
    // height: size(778);
    width: 100%;
    background-image: url("../images/dk5.png");
    background-size: cover;
    background-repeat: no-repeat;
    position: relative;
    padding: size(164) 0 size(30);
    -webkit-box-sizing: border-box;
            box-sizing: border-box;
    
    > .title {
      background: -webkit-gradient(linear,right top, left top,from(rgba(28,30,110, 1)),to(rgba(28,30,110, 0.3)));
      background: linear-gradient(to left,rgba(28,30,110, 1),rgba(28,30,110, 0.3));
      width: size(500);
      height: size(60);
      line-height: size(60);
      font-size: size(32);
      color: #FDFDFD;
      text-indent: 1em;
      position: absolute;
      left: size(47);
      top: size(51);
      border-radius: 0 size(30) size(30) 0;
      font-weight: bold;
    }
    .example-img {
      margin: 0 auto;
      display: block;
      width: size(574);
      height: auto;
      border: size(13) solid transparent;
      -o-border-image: linear-gradient(to right, #177FFF,#2E39C2,#EE4548);
          border-image: -webkit-gradient(linear, left top, right top, from(#177FFF),color-stop(#2E39C2),to(#EE4548));
          border-image: linear-gradient(to right, #177FFF,#2E39C2,#EE4548);
      border-image-slice: 13;
    }
  }
  .example-text {
    .text {
      margin: 0 size(40);
      padding: size(18) size(40) size(84);
      background:-webkit-gradient(linear,left bottom, left top,from(rgba(27,28,106,1)),to(rgba(30,41,132,1)));
      background:linear-gradient(0deg,rgba(27,28,106,1) 0%,rgba(30,41,132,1) 100%);
      color: #DED6FE;
      font-size: size(26);
      line-height: size(48);
    }
  }
  .how-to-use {
    background: #180F5E;
    .title {
      background-image: url("../images/dk-title-bg.png");
      background-size: 100% size(60);
      background-repeat: no-repeat;
      width: size(250);
      height: size(60);
      -webkit-transform: translateY(size(30));
              transform: translateY(size(30));
      > span {
        display: inline-block;
        line-height: size(60);
        height: size(60);
        font-size: size(32);
        font-weight: 500;
        margin-left: size(70);
      }
    }
    > .text {
      background: #1B1C6A;
      margin: 0 size(40);
      padding: size(90) size(35) 0;
      color: #DED6FE;
      font-size: size(26);
      line-height: 1.5;
    }
  }
  .instruction {
    color: #4F509C;
    font-size: size(22);
    line-height: size(36);
    margin: 0 size(36);
    clear: both;
    padding: size(78) 0 size(26);
  }
}
</style>
