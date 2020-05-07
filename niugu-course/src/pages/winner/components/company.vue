<template>
  <div class="company-wrapper" v-if="filterPool.length">
    <div class="section-title border-ios">
      <h5>机构调研池</h5>
    </div>
    <company-item v-for="(stock,index) in filterPool" :key="stock.BaseID" :stock="stock" @onLabelChange="handleLabel(index)" />
    <div class="box-more right border-ios" @click="fetchMore">
      <span>点击查看更多</span>
    </div>
    <div class="txtBox">
      风险提示：本产品利用客观数据进行大数据智能分析和运算，得出相关结论，仅供参考，不构成投资建议，据此操作，盈亏自负。
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import Vue from "vue";
import { mapState } from "vuex";
import bridge from "ng-bridge";
import { getCompany, getItemMore } from "../api/index.js";
import CompanyItem from "./CompanyItem.vue";

const pageSize = 2;

export default {
  data() {
    return {
      pool: [],
      filterPool: []
    };
  },
  components: {
    CompanyItem
  },
  computed: {
    ...mapState(["usertoken"])
  },
  created() {
    this.fetchData(1);
  },
  methods: {
    fetchData(pageIndex) {
      getCompany({
        usertoken: this.usertoken,
        pageIndex,
        pageSize
      }).then(res => {
        if (+res.code === 0 && res.list.length) {
          this.pool = this.transferData(res.list);
          this.filterPool = this.transferData(res.list).map(item => {
            return Object.assign({}, item, {
              listItem: item.listItem.slice(0, 1),
              closestatus: true
            });
          });
          this.handleLabel(0);
        }
      });
    },
    transferData(list) {
      return list.map(item => {
        const array = [
          {
            stocktype: "调出",
            ...item.ComOut
          },
          {
            stocktype: "调入",
            ...item.ComIn
          },
          {
            stocktype: "选股逻辑",
            ...item.BaseInfo
          }
        ];
        const result = [];
        array.forEach(i => {
          if ((i && i.State == 0) || i.stocktype === "选股逻辑") {
            result.push(i);
          }
        });
        return Object.assign({}, item, {
          listItem: result,
          hasmore: result.length > 1 ? 1 : 0
        });
      });
    },
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
      bridge.toQuote(
        item.innercode,
        item.stockcode,
        item.stockname,
        item.market
      );
    },
    // 切换折叠还是收起
    async handleLabel(index) {
      const item = {
        ...this.filterPool[index]
      };
      const itemDataSource = {
        ...this.pool[index]
      };
      if (item.closestatus) {
        this.$set(this.filterPool, index, {
          ...item,
          listItem: itemDataSource.listItem,
          closestatus: false
        });
      } else {
        this.$set(this.filterPool, index, {
          ...item,
          listItem: itemDataSource.listItem.slice(0, 1),
          closestatus: true
        });
      }
    },
    /**
     * @augments {string} 图片名
     * @return 图片模块
     * 遇到的问题： vue 动态加载图片src的时候，webpack无法解析地址，保存的还是相对路径
     * 解决办法： 见 http://blog.csdn.net/Mr_YanYan/article/details/78783091
     */
    filterImg(num) {
      return require(`../images/after/i/speed-${num}.png`);
    },
    fetchMore() {
      this.$router.push("/company-list");
    }
  }
};
</script>
<style rel="stylesheet/sass" lang="scss" type="text/sass">
@import "../lib/common.scss";

.company-wrapper {
  background-color: #fff;
  margin-bottom: pxToRem(12px);

  .stock-speed-pane {
    width: 60% !important;
    float: right !important;
    padding-top: pxToRem(3px) !important;
    p {
      font-size: 12px;
      height: 1.5em;
      vertical-align: middle;
      em {
        color: #999;
        font-size: 12px;
        vertical-align: bottom;
        font-weight: normal;
      }
      strong {
        color: rgb(255, 88, 71);
        font-size: 14px;
      }
    }
    img {
      display: block;
      width: pxToRem(195px);
      height: pxToRem(13px);
      margin-top: pxToRem(6px);
    }
  }
  .txtBox {
    width: pxToRem(348px);
    margin: 0 auto;
    text-align: left;
    font-size: pxToRem(12px);
    color: rgb(153, 153, 153);
    line-height: pxToRem(18px);
    padding: pxToRem(15px) 0;
  }
}
</style>

