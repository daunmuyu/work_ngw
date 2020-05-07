<template>
  <!-- 股票池查看更多后跳转的列表 -->
  <div class="pool-list-wrapper">
    <pool-item v-for="(stock,index) in filterPool" :stock="stock" @onLabelChange="handleLabel(index, stock.id)" :key="stock.id" />
    <div class="box-more" @click="getMore" v-show="showloadmore">
      <span>点击查看更多</span>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import Vue from "vue";
import bridge from "ng-bridge";
import { mapState } from "vuex";
import PoolItem from "../components/PoolItem.vue";
import { getPoolNew, getItemMore } from "../api/index.js";

let page = 1;
const pageSize = 5;

export default {
  data() {
    return {
      pool: [],
      filterPool: [],
      showloadmore: true
    };
  },
  components: {
    PoolItem
  },
  computed: {
    ...mapState(["usertoken"])
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      bridge.initRefresh(1);
      this.fetchData(page);
    },
    // 获取列表数据
    fetchData(pageIndex) {
      getPoolNew({
        usertoken: this.usertoken,
        curpage: page,
        pagesize: pageSize
      }).then(res => {
        if (+res.code === 0) {
          if (pageSize * page >= Number(res.totalcount)) {
            this.showloadmore = false;
          }
          this.pool = [...this.pool].concat(res.stockpooldata);
          this.filterPool = [...this.filterPool].concat(
            res.stockpooldata.map(item => {
              return {
                ...item,
                listItem: item.listItem.slice(0, 1),
                closestatus: true
              };
            })
          );
          if (this.filterPool[0].listItem.length > 1) {
            this.handleLabel(0, this.filterPool[0].id);
          }
        }
      });
    },
    getMore() {
      page += 1;
      this.fetchData(page);
    },
    // 切换折叠还是收起
    async handleLabel(index, id) {
      const item = {
        ...this.filterPool[index]
      };
      const itemDataSource = {
        ...this.pool[index]
      };
      if (item.closestatus) {
        const itemRes = await getItemMore({
          curpage: 1,
          pagesize: 3,
          pid: id
        });
        if (itemRes.code === 0 && itemRes.stockpooldetaildata) {
          this.$set(this.filterPool, index, {
            ...item,
            listItem: itemRes.stockpooldetaildata,
            closestatus: false
          });
        }
      } else {
        this.$set(this.filterPool, index, {
          ...item,
          listItem: itemDataSource.listItem.slice(0, 1),
          closestatus: true
        });
      }
    }
  }
};
</script>
<style rel="stylesheet/sass" lang="scss" type="text/sass">
@import "../lib/common.scss";

a,
a:visited,
a:hover,
a:active {
  text-decoration: none;
}

.pool-list-wrapper {
  height: 100%;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  .mint-navbar {
    height: pxToRem(40px);
    border-bottom: 1px solid #e8e8e8;
    .mint-tab-item {
      .mint-tab-item-label {
        font-size: 14px;
        color: #2a4159;
      }
      &.is-selected {
        border-bottom: none;
        position: relative;
        .mint-tab-item-label {
          color: #ff4c51;
        }
      }
    }
    .mint-tab-item.is-selected:after {
      content: "  ";
      position: absolute;
      bottom: pxToRem(2px);
      left: 50%;
      transform: translateX(-50%);
      display: inline-block;
      width: pxToRem(32px);
      height: pxToRem(2px);
      background-color: #ff4c51;
    }
  }
  .mint-tab-container {
    background: #fff;
  }
}

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