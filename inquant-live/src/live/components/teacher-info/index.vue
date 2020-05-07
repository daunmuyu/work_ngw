<template lang="html">
	<div>
    <div class="vipteacher">
		<p class="teacher-title">直播老师</p>
    <div id="certify">
		<div class="swiper-container">
			<div class="swiper-wrapper">
				<div class="swiper-slide" v-for="teacherinfo in teacherList.filter(x=>x.roomId !== 10517689)">
					<p class="teacher-name">{{teacherinfo.TeacherName}}</p>
          <p class="room-name">{{teacherinfo.Title}}图文直播间导师</p>
          <img class="teacher-img" width="50px" :src="teacherinfo.TeacherImg" alt="">
				</div>
			</div>
		</div>
		<div class="swiper-pagination"></div>
		<!-- <div class="swiper-button-prev"></div>
		<div class="swiper-button-next"></div> -->
    </div>
	</div>
  <div class="teacher-intro">
    <p class="teacher-title">老师介绍</p>
    <p class="intro-detail">{{teacherList.length > 0 && teacherList.find(x => +x.roomId===10517689).Description}}</p>
  </div>
  </div>
</template>

<script>
import defaultImg from "../../../images/default.png";
import Swiper from "swiper";
import "swiper/dist/css/swiper.min.css";
// console.log(swiper)

export default {
  props: ["teacherList"],
  data() {
    return {
      defaultImg,
      certifySwiper: undefined
    };
  },
  watch: {
    teacherList(n, v) {
      console.log(n);
      if (n.length > 0) {
        this.$nextTick(() => {
          this.initSwiper();
        });
      }
    }
  },
  mounted() {
    console.log(this.teacherList);
  },
  components: {},
  methods: {
    errorHandler(teacherinfo) {
      if (teacherinfo.img !== defaultImg) {
        teacherinfo.img = defaultImg;
      }
    },
    // getTeacherImg()
    initSwiper() {
      var swiper = new Swiper(".swiper-container", {
        effect: "coverflow",
        initialSlide: 1,
        centeredSlides: true,
        grabCursor: true,
        // centeredSlides: false,
        // loop: true,
        slidesPerView: "auto",
        // prevButton: ".swiper-button-prev",
        // nextButton: ".swiper-button-next",
        coverflowEffect: {
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true
        },
        pagination: ".swiper-pagination"
      });

      //   this.certifySwiper = new Swiper("#certify .swiper-container", {
      //   watchSlidesProgress: true,
      //   slidesPerView: "auto",
      //   centeredSlides: true,
      //   loop: true,
      //   loopedSlides: 5,
      //   autoplay: 3000,
      //   prevButton: ".swiper-button-prev",
      //   nextButton: ".swiper-button-next",
      //   pagination: ".swiper-pagination",
      //   //paginationClickable :true,
      //   onProgress: function(swiper, progress) {
      //     for (let i = 0; i < swiper.slides.length; i++) {
      //       var slide = swiper.slides.eq(i);
      //       var slideProgress = swiper.slides[i].progress;
      //       let modify = 1;
      //       if (Math.abs(slideProgress) > 1) {
      //         modify = (Math.abs(slideProgress) - 1) * 0.3 + 1;
      //       }
      //       let translate = slideProgress * modify * 260 + "px";
      //       let scale = 1 - Math.abs(slideProgress) / 5;
      //       let zIndex = 999 - Math.abs(Math.round(10 * slideProgress));
      //       slide.transform("translateX(" + translate + ") scale(" + scale + ")");
      //       slide.css("zIndex", zIndex);
      //       slide.css("opacity", 1);
      //       if (Math.abs(slideProgress) > 3) {
      //         slide.css("opacity", 0);
      //       }
      //     }
      //   },
      //   onSetTransition: function(swiper, transition) {
      //     for (var i = 0; i < swiper.slides.length; i++) {
      //       var slide = swiper.slides.eq(i);
      //       slide.transition(transition);
      //     }
      //   },
      //   //处理分页器bug
      //   onSlideChangeStart: function(swiper) {
      //     if (swiper.activeIndex == 4) {
      //       swiper.bullets.eq(9).addClass("swiper-pagination-bullet-active");
      //       console.log(swiper.bullets.length);
      //     }
      //   }
      // });
    }
  }
};
</script>

<style lang="scss" scoped>
.intro-detail {
  font-size: 14px;
  color: #6e717e;
  padding-left: 16px;
}
.teacher-title {
  font-size: 16px;
  color: #d95226;
  margin-top: 15.2px;
  padding-left: 16px;
  margin-bottom: 15px;
}
.teacher-name {
  font-size: 16px;
  color: #3f424e;
  margin-top: 10px;
}
.room-name {
  font-size: 12px;
  color: #6e717e;
}
.vipteacher {
  // width: 95%;
  position: relative;
  // border-bottom: 1px solid rgb(239, 245, 247);
  // border-bottom: 1px solid #666;
  background: #fff;
  color: #a0acbb;

  #certify {
    position: relative;
    width: 100%;
    margin: 0 auto img {
      width: 30%;
    }
  }

  #certify .swiper-container {
    padding-bottom: 60px;
    border-bottom: 1px solid #f3f3f3;
  }

  #certify .swiper-slide {
    height: 275px;
    width: 187px;
    background-image: linear-gradient(-180deg, #f6f6f6 49%, #dddddd 99%);
    border-radius: 8px;
    // background: #fff;
    // box-shadow: 0 8px 30px #ddd;
    position: relative;

    .teacher-img {
      position: absolute;
      bottom: 0;
      width: 80%;
      left: 8%;
    }
  }
  #certify .swiper-slide img {
    display: block;
  }
  #certify .swiper-slide p {
    text-align: center;
  }

  #certify .swiper-pagination {
    width: 100%;
    bottom: 20px;
  }

  #certify .swiper-pagination-bullets .swiper-pagination-bullet {
    margin: 0 5px;
    border: 3px solid #fff;
    background-color: #d5d5d5;
    width: 10px;
    height: 10px;
    opacity: 1;
  }

  #certify .swiper-pagination-bullets .swiper-pagination-bullet-active {
    border: 3px solid #00aadc;
    background-color: #fff;
  }

  #certify .swiper-button-prev {
    // left: -30px;
    width: 45px;
    height: 45px;
    background: url(./images/wm_button_icon.png) no-repeat;
    background-position: 0 0;
    background-size: 100%;
  }

  #certify .swiper-button-prev:hover {
    background-position: 0 -46px;
    background-size: 100%;
  }

  #certify .swiper-button-next {
    // right: -30px;
    width: 45px;
    height: 45px;
    background: url(./images/wm_button_icon.png) no-repeat;
    background-position: 0 -93px;
    background-size: 100%;
  }

  #certify .swiper-button-next:hover {
    background-position: 0 -139px;
    background-size: 100%;
  }
}

.night {
  .vipteacher {
    background: #1a1a1d;

    #certify {
      .swiper-slide {
        background-image: linear-gradient(-180deg, #575962 0%, #2c2d33 100%);
      }
      .swiper-container {
        border-bottom: 1px solid #141414;

        .teacher-name {
          color: #e5e6ec;
        }
        .room-name {
          color: #aeafb3;
        }
      }
    }
  }
  .intro-detail {
    color: #aeafb3;
  }
}
</style>
