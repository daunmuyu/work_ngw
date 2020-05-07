<template lang="html">
	<div v-show="emojiShow" class="chatemoji clearfix">
		<template v-for="item in 68">
			<div class="imgemoji f-l" :style="'background-position:0 '+(item-1)*(-28)+'px;'" @click.stop="clickEmoji(item)"></div>
 		</template>
	</div>
</template>

<script>
  import { mapGetters, mapMutations, } from 'vuex';

  export default {
    data () {
      return {
        emojiCode: ['1f60a', '1f60c', '1f60f', '1f601', '1f604',
          '1f609', '1f612', '1f614', '1f616', '1f618', '1f621', '1f628',
          '1f630', '1f631', '1f633', '1f637', '1f603', '1f61e', '1f620',
          '1f61c', '1f60d', '1f613', '1f61d', '1f62d', '1f602', '1f622',
          '1f61a', '1f623', '1f632', '1f62a', '263a', '1f4aa', '1f44a',
          '1f44d', '1f44e', '1f44f', '1f64f', '1f446', '1f447', '261d',
          '270c', '1f44c', '270b', '270a', '1f440', '1f444', '1f35a',
          '1f382', '1f37b', '2615', '1f451', '1f494', '1f339', '1f4a3',
          '1f004', '1f437', '1f3b5', '2600', '1f319', '1f525', '1f47b',
          '1f489', '1f4a9', '1f47c', '1f52b', '1f3c6', '26bd', '1f680',
        ],
      }
    },
    methods: {
      ...mapMutations(['setEmojiShow', 'addEmoji']),
      clickEmoji (index) {
        const curremojicode = this.emojiCode[index - 1];
        this.setEmojiShow(false);
        this.addEmoji({ add: true, cont: `[${curremojicode}]`});
      },
    },
    computed: {
      ...mapGetters(['emojiShow']),
    }
  }
</script>

<style lang="scss" scoped>
  .chatemoji {
    position: absolute;
    left: 0px;
    top: -255px;
    width: 298px;
    z-index: 101;
    background: rgb(59, 64, 74);
    border: 1px solid rgb(59, 64, 74);
    border-radius: 4px;
    & .imgemoji {
      width: 28px;
      height: 28px;
      margin: 2px;
      border: 1px solid rgb(59, 64, 74);
      background-image: url(../images/emojiimg.png);
      background-repeat: no-repeat;
      background-size: 28px 1904px;
      cursor: pointer;
    }
  }
</style>
