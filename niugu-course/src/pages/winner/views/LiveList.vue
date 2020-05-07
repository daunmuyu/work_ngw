<template>
  <div class="container">
    <router-link 
      class="aus-list" 
      v-if="videoList.length" 
      v-for="(item) in videoList"
      :key="item.partId"
      :to="{
        path: 'live-list-detail',
        query: {
          id: `${item.partId}`
        }
      }"
    >
      <div class="aus-rig">
        <img :src="item.partImg" alt="缩略图">
      </div>
      <div class="aus-lef">
        <p class="title">{{item.partName}}</p>
        <p class="desc">{{item.partTag}}</p>
        <p class="time">
          <span class="t">更新时间</span>
          <span>{{item.partUpdateTime}}</span>
        </p>
      </div>
    </router-link>
  </div>
</template>
<script type="text/ecmascript-6">
import Vue from "vue";
import { mapState } from "vuex";
import bridge from "ng-bridge";
import { COURSE_ID, fetchLiveList } from "../api/index.js";

export default {
  data() {
    return {
      videoList: []
    };
  },
  computed: {
    ...mapState([
      "usertoken",
    ])
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      fetchLiveList({
        usertoken: this.usertoken,
        courseid: COURSE_ID,
        action: 'getpartlist'
      }).then(res => {
        if (res && +res.code === 0) {
          this.videoList = res.data;
        }
      });
    }
  }
};
</script>
<style rel="stylesheet/sass" lang="scss" type="text/sass" scoped>
@import "../lib/common.scss";

.container{
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}
.aus-list {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: pxToRem(15px);
  box-sizing: border-box;
  background: #fff;
  margin-bottom: pxToRem(5px);
  &:last-of-type{
    margin-bottom: 0;
  }
  .aus-lef {
    flex: 1;
    padding-left: pxToRem(14px);
    p {
      color: rgb(25, 25, 30);
      text-align: left;
      & + p {
        margin-top: pxToRem(10px);
      }
      &.title {
        font-size: pxToRem(18px);
      }
      &.desc {
        font-size: pxToRem(12px);
      }
      &.time {
        color: rgb(150, 150, 150);
        font-size: pxToRem(12px);
      }
      span.t {
        border: 1px solid rgb(150, 150, 155);
        padding: 0 pxToRem(4px);
      }
    }
  }

  .aus-rig {
    width: pxToRem(100px);
    flex: 0 0 auto;
    img {
      width: 100%;
    }
  }
}
</style>