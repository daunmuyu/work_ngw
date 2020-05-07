<template lang="html">
	<div class="vipteacher">
		<div class="teacher-wrapper" v-for="teacherinfo in teacherList">
			<div class="teacher-main">
				<img class="vipteacher_img" :src="teacherinfo.img || defaultImg" @error="errorHandler(teacherinfo)">
				<div class="vipteacher_name">
					{{teacherinfo.nickName}}
				</div>
			</div>
			<!-- <div class="vipteacher_record">
				胜率：{{teacherinfo.WinRate}} 月均收益：{{teacherinfo.Income}}%
			</div> -->
			<!-- <div class="vipteacher_info">
				{{teacherinfo.teacherinfo}}
			</div>
			<div class="vipteacher_flag" v-if="teacherinfo.TeacherTag">
				<span v-for="item in teacherinfo.TeacherTag.split(',')" >
					{{item}}
				</span>
			</div> -->
			<div class="teacher-description">
				<div class="vipteacher_tip">
					老师简介：
				</div>
				<div class="vipteacher_tips">
					{{teacherinfo.summary}}
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import defaultImg from '../../../images/default.png';

export default {
  props: ["teacherList"],
  data() {
    return {
			defaultImg,
		};
  },
	components: {},
	methods: {
		errorHandler(teacherinfo) {
			if (teacherinfo.img !== defaultImg) {
				teacherinfo.img = defaultImg;
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.vipteacher {
  // width: 95%;
  position: relative;
  // border-bottom: 1px solid rgb(239, 245, 247);
  // border-bottom: 1px solid #666;
  // background: #666;
  color: #a0acbb;
  // height: 100%;
  padding: 27.5px 20px 0;
  // padding-left: 20px;
	overflow: auto;
  .teacher-wrapper {
    position: relative;
		.teacher-main{
			display: flex;
		}
		.teacher-description{
			margin-top: 20px;
		}
  }
  & .vipteacher_img {
    // position: absolute;
    left: 20px;
    // top: 30px;
    width: 64px;
    height: 64px;
    border-radius: 50%;
  }
  & .vipteacher_name {
    height: 23px;
    font-size: 24px;
    line-height: 24px;
    // margin-left: 96px;
		margin-left: 15px;
    margin-bottom: 9px;
  }
  & .vipteacher_record {
    margin-left: 96px;
    font-size: 14px;
    line-height: 14px;
    height: 14px;
  }
  & .vipteacher_info {
    margin-left: 96px;
    font-size: 14px;
    line-height: 14px;
    margin-bottom: 7px;
    padding-right: 20px;
    min-height: 16px;
  }
  & .vipteacher_flag {
    width: 587px;
    margin: 10px 20px;
    & span {
      height: 23px;
      font-size: 12px;
      line-height: 20px;
      color: rgb(100, 179, 240);
      text-align: center;
      border: 1px solid rgb(100, 179, 240);
      padding: 0 8.5px;
      margin-right: 5px;
    }
  }
  & .vipteacher_tip {
    width: 100%;
    // margin-left: 20px;
    font-size: 14px;
    color: rgb(255, 76, 81);
    line-height: 14px;
    height: 14px;
    margin-bottom: 12.5px;
  }
  & .vipteacher_tips {
    width: 100%;
    font-size: 14px;
    line-height: 20px;
    // padding: 0 20px;
    margin-bottom: 30px;
  }
}
</style>
