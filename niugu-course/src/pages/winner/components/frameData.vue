<template>
  <div class="frameDataPane" v-if="frameShow">
    <div class="frameData" :style="{'height': auditfailedreason && '340px'}">
      <div class="frameDataTitle">{{windowtitle}}</div>
      <div class="frameDataText">{{windowdes}}</div>
      <ul>
        <template v-for="item in list">
          <li class="border-ios" :key="item.title"><b>{{item.title}}</b>
            <button :disabled="item.status === 0" :class="bgcolor[item.status]" @click="goToUrl(item.url)">{{item.statusdes}}</button>
          </li>
        </template>
      </ul>
      <p class="reasons-for-failure" v-if="auditfailedreason">{{auditfailedreason}}</p>
    </div>
  </div>
</template>
<script>
import { ckConfirm } from './../api/index.js';

export default {
  data() {
    return {
      frameShow: false,
      windowtitle: '',
      windowdes: '',
      list: [],
      bgcolor: ['grayBg', 'redBg', 'black'],
      auditfailedreason: ''
    }
  },
  props: ['utken', 'courseid'],
  watch: {
    utken(v) {
      return v;
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      ckConfirm({
        usertoken: this.utken,
        courseid: this.courseid,
      }).then((res) => {
        if (+res.code === 1) {
          this.frameShow = true;
          this.windowtitle = res.data.windowtitle;
          this.windowdes = res.data.windowdes;
          this.list = res.data.list;
          this.auditfailedreason = res.data.auditfailedreason;
          const dvh = document.querySelectorAll('div');
          for (let i = 0; i < dvh.length; i += 1) {
            dvh[i].style.overflow = 'hidden';
          }
        }
      })
    },
    goToUrl(url) {
      if (!url) return;
      window.location.href = url;
    },
  }
}
</script>

<style lang="scss" scoped>
.frameDataPane {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  background-color: rgba(#000, .8);
  z-index: 999;
  .frameData {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    width: 270px;
    height: 300px;
    border-radius: 5px;
    color: #2F4157;
    .frameDataTitle {
      text-align: center;
      padding: 20px;
      font-size: 18px;
      font-weight: 600;
    }
    .frameDataText {
      font-size: 14px;
      color: #8C97A4;
      width: 225px;
      margin: 0 auto;
      line-height: 1.5;
      padding-bottom: 6px;
    }
    ul {
      li {
        display: flex;
        border-bottom: 1px solid #E8E8E8;
        width: 225px;
        margin: 0 auto;
        justify-content: space-between;
        align-items: center;
        height: 54px;
        b, button {
          display: block;
        }
        b {
          font-size: 16px;
        }
        button {
          background-color: #EC5A58;
          width: 64px;
          height: 25px;
          border-radius: 13px;
          color: #fff;
          font-size: 13px;
          overflow: hidden;
          border: 1px solid #EC5A58;
          &.blackBg {
            border: 1px solid #8C97A4;
            background: #fff;
            color: #8C97A4;
          }
          &.grayBg {
            border: 1px solid rgb(85, 91, 97);
            background: #fff;
            color: rgb(85, 91, 97);
          }
        }
      }
    }
    .reasons-for-failure {
      margin-top: 13px;
      text-align: center;
      color: #EC5A58;
      font-family: PingFangSC-Regular;
    }
  }
}
</style>
