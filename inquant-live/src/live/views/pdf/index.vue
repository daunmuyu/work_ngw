<template>
  <div class="pdf">
    <div class="back" @click="back">< 全部日志</div>
    <iframe :src="pdfUrl" frameborder="0" width="100%" ></iframe>
  </div>
</template>
<script>
export default {
  data() {
    return {
      pdfUrl: ""
    };
  },
  created() {
    this.pdfUrl = this.$route.query.url;
  },
  methods: {
    back() {
      history.go(-1);
    }
  }
};
</script>
<style lang="scss" scoped>
.back{
  margin: 10px;
  cursor: pointer;
}
iframe{
  position: absolute;
  height: calc(100% - 80px);
  top: 40px;
  width: 100%;
}
.night{
  .back{
    color:#F3F3F3 !important;
  }
}
</style>

