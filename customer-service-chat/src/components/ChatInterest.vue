<template>
  <div class="chatList">
    <div class="itemView" v-for="(item, index) in interLst" :key="index"
    :class="{'active': item.UserID == userInfo.relationID}" @click="obtainUser(item)">
      <div class="userIcon">
        <img :src="item.LogoUrl" alt="">
      </div>
      <div class="userInfo">
        <h5><b>{{item.UserName}}</b><time>{{+item.IsTalk ? '已接待' : '待接待'}}</time></h5>
        <p><span>{{+item.LoginState ? '在线' : '离线'}}</span><span>{{expireData[item.IsExpire]}}</span></p>
      </div>
    </div>
  </div>
</template>
<script>
import { mapMutations, mapGetters } from 'vuex';
import { isToday } from '@/service/utils.js';
import { IMITPole } from '@/service/api.js';
import { getCSToken } from '@/store/authToken.js';

export default {
  name: 'Interest',
  data() {
    return {
      interLst: null,
      expireData: ['在服务时间内', '快到期', '已过期'],
    };
  },
  computed: {
    ...mapGetters(['userInfo', 'msgEvents', 'interShow']),
  },
  watch: {
    msgEvents() {
      if (this.interShow) this.init();
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    ...mapMutations(['USER_INFO', 'KEHU_SHOW']),
    init() {
      IMITPole({
        usertoken: getCSToken(),
      }).then((res) => {
        if (+res.result) {
          this.interLst = res.data;
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
    obtainUser(item) {
      const users = {
        messageType: item.MessageType,
        relationID: item.UserID,
        relationLogoUrl: item.LogoUrl,
        relationName: item.UserName,
      };
      this.USER_INFO(users);
      this.KEHU_SHOW(false);
    },
  },
};
</script>
<style lang="scss" scoped>
@import '../styles/base.scss';
.chatList {
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
  position: relative;
  .itemView {
    @include flexAic;
    height: 80px;
    padding: 0 15px;
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
        @include flexBox;
        font-size: 14px;
        color: $bg-6A7681;
        width: 100%;
        @include lineOne;
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
</style>
