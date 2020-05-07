<template lang="html">
  <div class="mask" @click.self="close" v-show="teacherModal">
    <div class="teacher-modal">
      <div class="close-btn" @click="close"></div>
      <Carousel dots="none" :height="360" :width="688" :autoplay="auto" :autoplay-speed="3300" class="content" v-model="carous">
        <Carousel-item v-for="(teacherinfo, index) in teacherList" :key="index" class="teacher">
          <div class="teacher-img f-r">
            <img :src="teacherinfo.ImageUrl">
          </div>
          <div class="teacher-info f-l">
            <div class="teacher-name">
              {{teacherinfo.userName}}
              <span class="tag" v-for="tag in teacherinfo.Tag">{{tag}}</span>
            </div>
            <div class="teacher-intro">
              {{teacherinfo.Intro}}
            </div>
            <div class="teacher-time" v-show="teacherinfo.LiveTime">
              直播时间：{{teacherinfo.LiveTime}}
            </div>
          </div>
        </Carousel-item>
      </Carousel>
      <div class="dots">
        <li v-for="(m, i) in teacherList" :key="i" class="teacher-dots" @click="carous = i;auto=false">
          <button :class="i === carous? 'dots-active': ''">{{i + 1}}</button>
        </li>
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
        carous: 0,
        auto: true,
        lid: '',
      }
    },
    computed: {
      ...mapGetters(['teacherModal', 'teacherList', 'roomInfo'])
    },
    mounted () {
      this.lid = Cookie.get('lid') || this.roomInfo.liveId;
      this.getTeachers({
        liveid: this.lid,
      });
    },
    methods: {
      ...mapActions(['getTeachers']),
      ...mapMutations(['showTeacher']),
      close () {
        this.showTeacher(false);
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
  
  .teacher-modal {
    position: absolute;
    width: 688px;
    height: 360px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: url('../images/tbg.png');
    border: 1px solid #fff;
    border-radius: 4px;
    .close-btn {
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
    .dots {
      position: absolute;
      bottom: 30px;
      left: 40px;
      li {
        float: left;
        list-style: none;
        margin: 0 4px;
        button {
          width: 16px;
          height: 16px;
          line-height: 16px;
          color: #fff;
          font-size: 12px;
          vertical-align: text-top;
          background-color: rgb(186, 186, 186);
          border: 0;
          cursor: pointer;
          &.dots-active {
            background-color: rgb(124, 165, 255);
          }
        }
      }
    }
    .content {
      width: 688px;
      height: 360px;
    }
    .teacher {
      width: 688px;
      height: 360px;
      margin: 0 auto;
      .teacher-img {
        height: 100%;
        text-align: center;
        width: 40%;
        position: relative;
        img {
          bottom: 2px;
          position: absolute;
          left: 0;
        }
      }
      .teacher-info {
        height: 100%;
        width: 60%;
        padding: 40px;
        position: relative;
        .teacher-name {
          font-size: 24px;
          margin-bottom: 10px;
          margin-right: 5px;
          .tag {
            font-size: 12px; // background-color: rgba(0, 0, 0, 0.5);
            padding: 2px 5px;
          }
        }
        .teacher-intro {
          font-size: 14px;
        }
      }
      .teacher-time {
        padding-top: 20px;
        font-size: 14px;
      }
    }
  }
</style>
