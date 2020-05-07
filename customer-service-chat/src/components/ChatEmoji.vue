<template>
  <div class="chatEmoji">
    <div class="imgemoji" v-for="item in 68" :key="item" @click.stop="clickEmoji(item)">
      <img :src='"../assets/emoji/"+item+".png"' alt="">
    </div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex';
import { emojiCode } from '../service/utils.js';

export default {
  name: 'Emoji',
  data() {
    return {
    };
  },
  methods: {
    ...mapMutations(['CURR_EMOJI', 'EMOJI_SHOW']),
    clickEmoji(idx) {
      const curremojicode = emojiCode[idx];
      this.CURR_EMOJI(curremojicode);
      this.EMOJI_SHOW(false);
    },
  },
};
</script>
<style lang="scss" scoped>
.chatEmoji {
  width: 400px;
  overflow: hidden;
  .imgemoji {
    width: 40px;
    height: 40px;
    display: inline-block;
    text-align: center;
    margin: 2px;
    border: 1px solid #FFF;
    cursor: pointer;
    img {
      width: 32px;
      height: 32px;
      &:hover{
        transform: scale(1.2);
      }
    }
  }
}
</style>
