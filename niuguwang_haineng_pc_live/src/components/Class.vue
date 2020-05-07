<template lang="html">
  <div class="mask" @click.self="showClass(false)" v-show="classModal">
    <div class="class-modal">
      <div class="close-btn" @click="showClass(false)"></div>
      <Carousel :height="360" :width="688" autoplay :autoplay-speed="3300" class="content">
        <Carousel-item v-for="(item, index) in classList" :key="index" class="class">
          <template v-if="item.HrefUrl">
            <a :href="item.HrefUrl" target="_blank"><img :src="item.ImageUrl" class="carous"></a>
          </template>
          <template v-else>
            <img :src="item.ImageUrl" class="carous">
          </template>
        </Carousel-item>
      </Carousel>
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
        classList: [],
        lid: '',
      }
    },
    computed: {
      ...mapGetters(['classModal', 'roomInfo'])
    },
    mounted () {
      this.lid = Cookie.get('lid') || this.roomInfo.liveId;
      this.getClass({ liveid: this.lid, type: 1 }).then((res) => {
        if (res.code === 0) {
          this.classList = res.scheduleList;
        } else {
          this.$Message.error(res.message || '网络错误');
        }
      });
    },
    methods: {
      ...mapActions(['getClass']),
      ...mapMutations(['showClass'])
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
  
  .class-modal {
    position: absolute;
    width: 688px;
    height: 360px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 4px;
    border: 1px solid #fff;
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
    .content {
      width: 688px;
      height: 360px;
      overflow: hidden;
    }
    .class {
      width: 688px;
      height: 360px;
      margin: 0 auto;
      img.carous{
        width: calc(100% - 2px);
        height: auto;
        border: 0;
      }
    }
  }
</style>
