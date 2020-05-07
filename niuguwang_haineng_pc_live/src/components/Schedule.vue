<template lang="html">
  <div class="mask" @click.self="showSchedule(false)" v-show="scheduleModal">
    <div class="schedule-modal">
      <div class="schedule-btn" @click="showSchedule(false)"></div>
      <div class="schedule-list">
        <div class="schedule-item" v-for="(schedule, index) in scheduleList" :key="index">
          <div class="user-logo">
            <img :src="schedule.imageurl || './static/img/user.png'">
          </div>
          <div class="user-text">
            <div class="title">
              <span>{{schedule.courseName}}</span>
              <span class="tags" v-for="(tag, index) in schedule.tag" :key="index" :style="{backgroundColor: getColor(index)}">{{tag}}</span>
            </div>
            <div class="intro">{{schedule.intro}}</div>
            <div class="time" v-if="schedule.liveTime">直播时间：{{schedule.liveTime}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Cookie from 'js-cookie';
  import * as types from '../store/mutation-types';
  import { mapGetters, mapActions, mapMutations } from 'vuex';
  export default {
    data () {
      return {
        scheduleList: [],
        lid: '',
      }
    },
    computed: {
      ...mapGetters(['scheduleModal', 'roomInfo'])
    },
    mounted () {

      this.lid = Cookie.get('lid') || this.roomInfo.liveId;
      this.getSchedule({ liveid: this.lid }).then((res) => {
        if (res.code === 0) {
          this.scheduleList = res.scheduleList;
        } else {
          this.$Message.error(res.message || '网络错误');
        }
      });
    },
    methods: {
      ...mapActions(['getSchedule']),
      ...mapMutations(['showSchedule']),
      getColor(index) {
        return ['rgb(114, 150, 254)', 'rgb(247, 141, 95)', 'rgb(255, 83, 87)','rgb(114, 150, 254)', 'rgb(247, 141, 95)', 'rgb(255, 83, 87)'][index];
      }
    }
  }
</script>

<style lang="scss" scoped>
  .mask {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 222;
    color: #fff;
  }
  
  .schedule-modal {
    position: absolute;
    width: 688px;
    height: 360px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: linear-gradient(to bottom, rgb(60, 58, 60), rgb(40, 41, 43));
    border: 1px solid #fff;
    border-radius: 4px;
    .schedule-btn {
      position: absolute;
      width: 34px;
      height: 34px;
      top: -70px;
      right: 0;
      background: url('../images/close.png');
      &::after {
        content: '';
        position: absolute;
        width: 1px;
        height: 36px;
        background: #fff;
        left: 50%;
        top: 34px;
      }
    }
    .schedule-list {
      height: 100%;
      width: 100%;
      overflow-x: hidden;
      overflow-y: auto;
      &::-webkit-scrollbar {
        width: 0px;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 0px;
        box-shadow: inset 0 0 0 rgba(0, 0, 0, 0.2);
        background: rgba(0, 0, 0, 0.2);
      }
      .schedule-item {
        width: 100%;
        height: 25%;
        display: flex;
        flex-direction: row;
        align-items: center;
        .user-logo {
          width: 100px;
          line-height: 100%;
          text-align: center;
          img {
            width: 50px;
            height: 50px;
            border-radius: 50%;
          }
        }
        .user-text {
          text-align: left;
          width: 100%;
          height: 100%;
          padding: 5px 0;
          border-bottom: 1px solid rgb(102,102,102);
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          .title {
            font-size: 18px;
            color: #fff;
           .tags{
             font-size: 12px;
             padding: 2px 4px;
             border-radius: 3px;
             background-color: #ffc600;
             margin: 0 5px;
             vertical-align: text-top;
           } 
          }
          .intro, .time {
            font-size: 12px;
            color: rgb(255, 255, 255);
            line-height: 17px;
          }
        }
      }
    }
  }
</style>
