<template>
  <div class="contView">
    <div class="searchTop">
      <search-user></search-user>
      <p>在线{{inCount}} &nbsp;&nbsp; 总数{{count}}</p>
    </div>
    <div class="chatList" v-show="!interShow">
      <div v-if="userInfo" class="itemView" v-for="(item, index) in msgList" :key="index"
      :class="{'active': item.relationID == userInfo.relationID, 'itemViewBg': +item.isTop}"
      @click="obtainID(item)">
        <div class="userIcon">
          <img :src="item.relationLogoUrl" alt="">
          <span v-if="item.unRead > 0">{{item.unRead}}</span>
        </div>
        <div class="userInfo">
          <h5><b>{{item.relationName}}</b><time>{{timeData(item.updateTime)}}</time></h5>
          <p v-if="item.content">
            <span><b v-if="+item.isAt">[有人@我]</b>{{item.content}}</span>
            <img @click.stop="userTop(item, 'cancel')" v-if="+item.isTop" src="../assets/icon/zhiding_cancel.png" alt="" srcset="">
            <img @click.stop="userTop(item, 'add')" v-else src="../assets/icon/zhiding.png" alt="" srcset="">
          </p>
        </div>
      </div>
    </div>
    <chat-inter v-if="interShow"></chat-inter>
    <div class="manage" :class="active" @click="tabManage">
      <!-- <router-link to="/home/manage"> -->
        客户管理&nbsp;
        <img src="../assets/icon/arrow-left.png" alt="">
      <!-- </router-link> -->
    </div>
  </div>
</template>
<script>
import { mapMutations, mapGetters } from 'vuex';
import SearchUser from '@/components/SearchUser';
import { isToday, delay } from '@/service/utils.js';
import { getCSToken } from '@/store/authToken.js';
import { IMMsgList, IMSerch, IMMsRead, IMUserTop } from '@/service/api.js';
import MyScroll from './Scroll';
import ChatInter from './ChatInterest';

export default {
  name: 'ContView',
  components: {
    MyScroll,
    SearchUser,
    ChatInter,
  },
  data() {
    return {
      searchData: [],
      timeout: null,
      restaurants: [],
      msgList: null,
      count: 0,
      inCount: 0,
      active: '',
    };
  },
  computed: {
    ...mapGetters(['chatMsgs', 'kehuShow', 'interShow', 'updateSession', 'userInfo']),
  },
  watch: {
    kehuShow(val) {
      if (val) {
        this.active = 'active';
      } else {
        this.active = '';
      }
    },
    updateSession() {
      this.updateUnread(this.userInfo);
    },
  },
  created() {
    this.findLst();
  },
  methods: {
    ...mapMutations(['USER_INFO', 'KEHU_SHOW', 'MSG_COUNT']),
    querySearchAsync(queryString, cb) {
      this.searchAsync(queryString);
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(this.restaurants);
      }, 1000 * Math.random());
    },
    searchAsync(content) {
      IMSerch({
        content,
      }).then((res) => {
        if (+res.result) {
          this.restaurants = res.data.map((item) => {
            item.value = item.UserName;
            return item;
          });
        } else {
          this.$message({
            message: res.message || '信息错误',
            type: 'warning',
          });
        }
      });
    },
    userTop(item, action) {
      IMUserTop({
        action,
        usertoken: getCSToken(),
        relationID: item.relationID,
        msgType: item.messageType,
      }).then((res) => {
        if (+res.result === 1) {
          this.findLst();
          this.$message({
            message: res.message || '操作成功',
            type: 'info',
          });
        } else {
          this.$message({
            message: res.message || `${action}置顶接口错误`,
            type: 'warning',
          });
        }
      });
    },
    obtainID(item) {
      this.USER_INFO(item);
      this.tabManage(false);
      // this.$router.push({ name: 'home' });
      this.updateUnread(item);
    },
    updateUnread(item) {
      delay(() => {
        IMMsRead({
          usertoken: getCSToken(),
          msgtype: item.messageType,
          relationID: item.relationID,
        }).then((res) => {
          if (+res.result === 1) {
            this.findLst();
          } else {
            this.$message({
              message: res.message || '信息错误',
              type: 'warning',
            });
          }
        });
      }, 500);
    },
    findLst() {
      IMMsgList({
        usertoken: getCSToken(),
      }).then((res) => {
        if (+res.result) {
          this.inCount = res.inCount;
          this.count = res.count;
          this.msgList = res.data;
          this.MSG_COUNT(res.msgCount);
          if (!this.userInfo) {
            this.USER_INFO(res.data[0]);
            this.updateUnread(res.data[0]);
          }
        } else {
          this.$message({
            message: res.message || '信息错误',
            type: 'warning',
          });
        }
      });
    },
    timeData(tr) {
      if (isToday(tr)) return tr.substring(10);
      return tr.substring(2, 10);
    },
    tabManage(ble = true) {
      this.KEHU_SHOW(ble);
    },
  },
};
</script>
<style lang="scss" scoped>
@import '../styles/base.scss';
.contView {
  width: 300px;
  background-color: $bg-363E47;
  color: $bg-6A7681;
  flex-direction: column;
  @include flexBetween;
  .manage, .searchTop {
    height: 80px;
    padding: 0 15px;
    cursor: pointer;
    &.active {
      background-color: $bg-404953;
    }
  }
  .searchTop {
    @include flexBox;
    border-bottom: 1px solid $bg-303841;
    p {
      color: $bg-6A7681;
      font-size: 12px;
    }
  }
  .manage {
    @include flexAic;
    justify-content: center;
    border-top: 1px solid $bg-303841;
    font-size: 18px;
    > a {
      display: block;
      width: 100%;
      text-align: center;
      color: #99A8B4;
    }
  }
  .chatList {
    flex: 1;
    overflow-x: hidden;
    overflow-y: auto;
    position: relative;
    .itemView {
      @include flexAic;
      height: 80px;
      padding: 0 15px;
      &.itemViewBg {
        background-color: $bg-303841;
      }
      &.active {
        background-color: $bg-404953;
      }
      .userIcon {
        position: relative;
        padding-right: 15px;
        span {
          @include position(absolute, 50%, -6px);
          font-size: 12px;
          line-height: 16px;
          padding: 0 4.5px;
          border-radius: 8px;
          overflow: hidden;
          background-color: $bg-F36060;
          color: $bg-FFFFFF;
        }
        img {
          @include photoImg(44px);
        }
      }
      .userInfo {
        flex: 1;
        width: calc(100% - 60px);
        p {
          text-align: left;
          font-size: 14px;
          color: $bg-6A7681;
          width: 100%;
          @include flexBox;
          span {
            flex: 1;
            @include lineOne;
            display: block;
            b {
              color: $bg-F36060;
            }
          }
          img {
            display: block;
            cursor: pointer;
          }
          &.active {
            color: $bg-55D48B;
          }
        }
        h5 {
          width: 100%;
          @include flexBox;
          b {
            display: block;
            @include lineOne;
            text-align: left;
            width: calc(100% - 60px);
            flex: 1;
            font-size: 18px;
            color: $bg-FFFFFF;
          }
          time {
            display: block;
            width: 60px;
            text-align: right;
            font-size: 14px;
          }
        }
      }
    }
  }
}
</style>
