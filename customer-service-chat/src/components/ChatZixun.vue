<template>
  <div class="zxunBgView" v-if="zxunShow">
    <div class="zixunPane">
      <div class="close-pane" @click="closeZxun">
        <img src="../assets/icon/close-big@2x.png" alt="">
      </div>
      <div class="tab-nav-pane">
        <!-- <span :class="{'active': tabNav == 0}">秘籍攻略</span>
        <span :class="{'active': tabNav == 1}">独家资讯</span> -->
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
          <el-menu-item index="2">秘籍攻略</el-menu-item><el-menu-item index="1">独家资讯</el-menu-item>
        </el-menu>
      </div>
      <div class="content">
        <div class="item-cont" v-for="(item, index) in articleList" :key="index" @click="shareSend(item.id)">
          <div class="item-left">
            <h6>{{item.title}}</h6>
            <p>{{item.publishtime}}</p>
          </div>
          <div class="item-right">
            <img :src="item.image" alt="">
          </div>
        </div>
      </div>
      <div class="footer">
        <el-pagination
          layout="prev, next"
          prev-text="< 上一页"
          next-text="下一页 >"
          :total="count"
          @current-change="handleCurrentChange"
          :page-size="pageSize">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex';
import { getCSToken } from '../store/authToken.js';
import { IMArticle, IMAddMsg } from '../service/api.js';
import { delay } from '../service/utils.js';

export default {
  name: 'ChatZixun',
  data() {
    return {
      activeIndex: '2',
      pageindex: 1,
      count: 0,
      pageSize: 5,
      articleList: null,
      pagecount: 0,
      // zxunShow: false,
    };
  },
  computed: {
    ...mapGetters(['userInfo', 'zxunShow']),
  },
  created() {
    this.articleInit();
  },
  methods: {
    ...mapMutations(['ZXUN_SHOW']),
    closeZxun() {
      this.pageindex = 1;
      // this.activeIndex = '2';
      this.ZXUN_SHOW(false);
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
      this.activeIndex = key;
      this.pageindex = 1;
      this.articleInit();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pageindex = val;
      this.articleInit();
    },
    articleInit() {
      IMArticle({
        articleType: this.activeIndex,
        pageindex: this.pageindex,
        pagesize: this.pageSize,
      }).then((res) => {
        this.count = res.count;
        this.pagecount = res.pagecount;
        this.articleList = res.list;
      });
    },
    shareSend(content) {
      delay(() => {
        IMAddMsg({
          usertoken: getCSToken(),
          toID: this.userInfo.relationID,
          messageType: this.userInfo.messageType,
          contentType: 100,
          content,
        }).then((res) => {
          if (+res.result) {
            this.$message({
              message: res.message || '发送成功',
              type: 'sccuess',
            });
          } else {
            this.$message({
              message: res.message || '信息错误',
              type: 'warning',
            });
          }
        });
      }, 300);
    },
  },
};
</script>
<style lang="scss" scoped>
@import '../styles/base.scss';
.zxunBgView {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;
  background-color: rgba($color: #000000, $alpha: 0.7);
  width: 100%;
  height: 100%;
  .el-menu--horizontal {
    background-color: transparent;
    .el-menu-item {
      height: 53px;
      &.is-active {
        color: #3D70F6;
        border-bottom-color: #3D70F6;
      }
    }
  }
}
.zixunPane {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  width: 420px;
  height: 488px;
  border-radius: 5px;
  .close-pane {
    float: right;
    width: 28px;
    height: 28px;
    margin-top: -18px;
    margin-right: -18px;
    img {
      width: 28px;
    }
  }
  .tab-nav-pane {
    width: 400px;
    margin-left: 20px;
    // border-bottom: 1px solid #E3E7E7;
    span {
      display: inline-block;
      margin-right: 35px;
      line-height: 48px;
      border-bottom: 3px solid transparent;
      font-size: 16px;
      color: #8997A5;
      &.active {
        color: #3D70F6;
        border-bottom: 3px solid #3D70F6;
      }
    }
  }
  .content {
    width: 380px;
    margin: 0 auto;
    // border-bottom: 1px solid #E3E7E7;
    .item-cont {
      @include flexBox;
      padding: 10px 0;
      border-bottom: 1px solid #E3E7E7;
      cursor: pointer;
      &:hover {
        background-color: #F4F5F6;
      }
      .item-left {
        flex: 1;
        h6 {
          color: #2A4159;
          font-size: 14px;
          line-height: 1.6;
        }
        p {
          font-size: 12px;
          color: #8997A5;
        }
      }
      .item-right {
        padding-left: 25px;
        img {
          width: 56px;
          height: 56px;
          border-radius: 5px;
        }
      }
    }
  }
  .footer {
    margin: 0 auto;
    width: 400px;
    .el-pagination {
      text-align: right;
    }
  }
}
</style>
