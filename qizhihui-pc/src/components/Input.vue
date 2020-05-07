<template>
  <div class="input-com">
    <img :src="imgPath" alt="" class="input-icon">
    <input :type="type" @input="updateValue($event.target.value)" class="input-control" :placeholder="placeholder">
  </div>
</template>

<script>
export default {
  props: {
    type: {
      default: 'text',
      type: String,
    },
    imgPath: {
      default: '/static/img/zhanghao.png',
      type: String,
    },
    placeholder: {
      default: '',
      type: String,
    },
  },
  methods: {
    updateValue(value) {
      this.$emit('input', value);
    },
  },
};
</script>

<style lang="scss" scoped>
.input-com {
  position: relative;
  height: 48px;
  width: 370px;
  .input-control {
    width: 320px;
    height: 46px;
    font-size: 16px;
    padding-left: 48px;
    border: 1px solid #e8e8e8;
  }
  .input-icon {
    position: absolute;
    left: 14px;
    top: 14px;
  }
}
</style>

