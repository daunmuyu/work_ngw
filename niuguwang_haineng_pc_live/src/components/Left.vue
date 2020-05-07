<template>
  <div class="left">
    <div class="list-group">
      <div class="list" @click="showClass(true)">
        <div class="img">
          <img src="../images/class.png" />
        </div>
        <div class="text">课程介绍</div>
      </div>
      <div class="list" @click="showTeacher(true)">
        <div class="img">
          <img src="../images/teacher.png" />
        </div>
        <div class="text">老师介绍</div>
      </div>
      <div class="list" @click="showSchedule(true)">
        <div class="img">
          <img src="../images/table.png" />
        </div>
        <div class="text">课程表</div>
      </div>
      <div class="list" v-show="false">
        <div class="img">
          <lightbox src="./static/img/hn.png">
            <img src="../images/hn.png" class="qr" />
          </lightbox>
        </div>
        <div class="text">
          <span class="yellow">微信扫一扫
            <br>手机看直播</span>
          <br>点击放大</div>
      </div>
    </div>
  </div>
</template>
<script>
  import { mapMutations } from 'vuex';
  import Lightbox from 'vue-lightbox';
  export default {
    name: 'nav',
    methods: {
      ...mapMutations(['showTeacher', 'showClass', 'showSchedule'])
    },
    components: {
      Lightbox
    }
  }
</script>

<style lang="scss" scoped>
  .left {
    width: 4%;
    min-width: 80px;
    height: 100%;
    color: #fff;
    font-size: 12px;
    .list-group {
      width: 90%;
      height: 100%;
      margin: 0 auto;
      background-color: rgb(44, 47, 53);
      padding-top: 40px;
    }
    .list {
      width: 100%;
      margin: 0 auto;
      margin-bottom: 40px;
      border-radius: 4px;
      text-align: center;
      cursor: pointer;
      .text {
        margin: 5px auto;
      }
      .img {
        width: 100%;
      }
      .qr {
        width: 72px;
        height: auto;
        border: 1px solid #ffc600;
      }
      .yellow {
        color: #ffc600;
      }
    }
  }
</style>
