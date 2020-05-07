<template>
  <div class="pool-wrapper" v-if="pool">
    <div class="section-title border-ios">
      <h5>{{bannerTitle + '股票池'}}</h5>
    </div>
    <pool-item v-for="(stock,index) in filterPool" :stock="stock" @onLabelChange="handleLabel(index, stock.id)" :key="stock.id" />
    <router-link class="box-more right border-ios" to="/pool-list">
      <span>点击查看更多</span>
    </router-link>
    <!-- <a class="box-more right border-ios":href="'http://h5.stockhn.com/huodong/base/list/stock-list.html?usertoken=' + usertoken">
      <span>点击查看更多</span>
    </a> -->
    <!-- <div class="txtBox">
      风险提示：本产品利用客观数据进行大数据智能分析和运算，得出相关结论，仅供参考，不构成投资建议，据此操作，盈亏自负。
    </div> -->
  </div>
</template>
<script type="text/ecmascript-6">
import Vue from "vue";
import { mapState } from "vuex";
import bridge from "ng-bridge";
import PoolItem from "./PoolItem.vue";
import { getPoolNew, getItemMore, TITLES, COURSE_ID } from "../api/index.js";

export default {
  data() {
    return {
      pool: null,
      filterPool: null,
      bannerTitle: '',
    };
  },
  computed: {
    ...mapState(["usertoken", "courseType"])
  },
  created() {
    this.fetchData();
  },
  mounted() {
    this.bannerTitle = TITLES[COURSE_ID];
  },
  components: {
    PoolItem
  },
  methods: {
    fetchData() {
      getPoolNew({
        usertoken: this.usertoken,
        curpage: 1,
        pagesize: 2
      }).then(res => {
        if (+res.code === 0 && res.stockpooldata.length) {
          this.pool = res.stockpooldata;
          this.filterPool = [...res.stockpooldata].map((item, index) => {
            return Object.assign({}, item, {
              listItem: item.listItem.slice(0, 1),
              closestatus: true
            });
          });
          if (this.filterPool[0].hasmore === "1") {
            this.handleLabel(0, this.filterPool[0].id);
          }
        }
      });
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

.pool-wrapper {
  background-color: #fff;
  margin-bottom: pxToRem(12px);
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

