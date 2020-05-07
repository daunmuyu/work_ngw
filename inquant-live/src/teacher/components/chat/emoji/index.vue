<template>
	<div class="chatemoji clearfix">
			<div class="imgemoji f-l" v-for="item in 68" :key="item" :style="'background-position:0 '+(item-1)*(-28)+'px;'" @click.stop="clickemoji(item)">
			</div>
	</div>
</template>

<script>
export default {
	data(){
		return{
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
	methods:{
	},
	components: {
	},
	methods: {
		clickemoji(index){
      const curremojicode = this.emojiCode[index-1];
      this.$emit('emojiSelected', `[${curremojicode}]`);
			
			// this.$store.commit('setEmojiShow',false);
			// this.$store.commit('addEmoji',{ifadd: true,cont: `[${curremojicode}]`,});
		},
	},
}
</script>

<style scoped lang="scss">
.chatemoji{
	position: absolute;
	left: 0px;
	top: 60px;
	width: 290px;
	z-index: 101;
	background: #fff;
	border: 1px solid #eff5f7;
	& .imgemoji{
		width: 28px;
		height: 28px;
		border: 1px solid rgb(253, 253, 253);
		background-image: url(../../../../images/emojiimg.png);
		background-repeat: no-repeat;
		background-size:28px 1904px;
    cursor: pointer;
    float: left;
	}
}
</style>