<!-- 触底加载更多 -->
<template>
  <div class="infinite-scroll">
    <i v-show="loading" class="loading-icon"></i>
    <span class="loading-label" :class="{ 'loading-label-over': !loading }">{{loadingText}}</span>
  </div>
</template>

<script>
export default {
  name: 'InfiniteScroll',
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    loadingText: {
      type: String,
      default: '加载中...',
    },
    scroller: {
      // type: [HTMLDocument, Element, Window, String],
      default() {
        return window;
      },
    },
  },
  watch: {
    scroller(scroller, oldScroller) {
      if (scroller === oldScroller) return;
      this.$unbindScroll(oldScroller);
      this.$bindScroll(scroller);
    },
  },
  mounted() {
    this.$bindScroll();
  },
  beforeDestroy() {
    this.$unbindScroll();
  },
  methods: {
    onScroll() {
      if (this.loading) return;
      const scroller = this.scroller;
      const isWindow = scroller === window;
      const scrollTop = isWindow ? scroller.scrollY : scroller.scrollTop;
      const scrollHeight = isWindow ? document.documentElement.scrollHeight || document.body.scrollHeight : scroller.scrollHeight;
      const h = scrollHeight - scrollTop - 10;
      const sh = isWindow ? window.innerHeight : scroller.offsetHeight;
      if (h <= sh) {
        this.$emit('load'); // 加载更多回调
      }
    },
    $bindScroll() {
      if (!this.scroller) return;
      this.handleScroll = (e) => {
        if (this.onScroll) this.onScroll(e);
      };
      this.scroller.addEventListener('scroll', this.handleScroll);
    },
    $unbindScroll(scroller) {
      const scrollers = scroller || this.scroller;
      if (this.handleScroll) scrollers.removeEventListener('scroll', this.handleScroll);
    },
  },
};
</script>

<style lang="css">
  .infinite-scroll {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: .4rem;
    padding-bottom: .4rem;
  }
  .loading-label {
    color: #8c8fa7;
    font-size: .24rem;
    line-height: .4rem;
  }
  .loading-label-over {
    color: #8c8fa7;
  }
  .loading-icon {
    display: block;
    width: .28rem;
    height: .28rem;
    margin-right: .2rem;
    background: url('../assets/icon/loading.png') center center no-repeat;
    background-size: .28rem .28rem;
    animation: rotate 0.75s linear infinite;
  }

  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(180deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
