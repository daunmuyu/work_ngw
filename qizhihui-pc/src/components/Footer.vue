<template>
  <div id="footer">
    <div class='am-g'>
      <div class="header clearfix">
        <img src="/static/img/logo.png" alt="" class="logo fl">
        <div class="tell fr">400-020-0055</div>
      </div>
      <div class="des">
        <div class="line"></div>
        <ul class="tabs clearfix">
          <li class="tab">
            <!-- <a href="./productservice.html">产品服务</a> -->
            <router-link to="/productservice">产品服务</router-link>
          </li>
          <li class="tab">
            <!-- <a href="./tradeguide.html">交易指南</a> -->
            <router-link to="/tradeguide">交易指南</router-link>
          </li>
          <li class="tab">
            <!-- <a href="./about.html">关于我们</a> -->
            <router-link to="/about">关于我们</router-link>
          </li>
        </ul>
        <div class="info">
          <p class="p1">
            免责声明:差价合约及其他高杠杆金融工具之交易隐含高度风险，并不适合所有投资者，有可能使您损失所有投资。在决定交易之前， 您应该评估交易相关的所有风险，谨慎考虑您的投资目标、经验水平和风险偏好。
          </p>
          <p class="p2">
            此外，还存在与交易的执行和交易系统相关的风险，包括但不限于软硬件故障和网络断线。 人人期指将尽力避免服务故障或将故障时间限制在最短时间内。如因不可抗力或其他无法控制的原因， 使人人期指崩溃或无法正常使用，导致您丢失有关的信息、记录等，人人期指交易平台不承担责任。 但是人人期指会尽合理的可能协助处理善后事宜，并努力使您免受经济损失。
          </p>
          <p class="p3">
            经人人期指所载的任何新闻、观点、研究、分析或其他信息，只作为一般的市场评论，并不构成投资建议。 人人期指不承担您以此作为决策依据而造成任何损失或损害责任。 您经人人期指发出的所有交易指令，都被视为您已授权执行，并对上述声明清楚理解且无异议。
          </p>
        </div>
        <div class="line"></div>
      </div>

      <div class="copyright">
        Copyight©️ 2017 人人期指版权所有
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'hello',
  data() {
    return {
      msg: 'this is header',
    };
  },
};
</script>

<style scoped lang="scss">
#footer {
  background: #0d212c;
  color: #fff;
  .header {
    height: 115px;
    line-height: 115px;
    .tell {
      font-size: 28px;
    }
    .logo {
      margin-top: 38px;
    }
  }
  .des {
    .line {
      height: 1px;
      transform: scaleY(.5);
      background: #e8e8e8;
      opacity: .5;
    }
    .tabs {
      height: 80px;
      .tab {
        float: left;
        height: 100%;
        line-height: 80px;
        margin-right: 80px;
        a {
          display: block;
          width: 100%;
          height: 100%;
          color: #fff;
        }
      }
    }
    .info {
      font-size: 14px;
      line-height: 1.8;
      padding-bottom: 30px;
    }
  }
  .copyright {
    height: 74px;
    line-height: 74px;
    text-align: center;
    font-size: 14px;
  }
}
</style>
