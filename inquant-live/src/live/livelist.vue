<template lang="html">
	<div :class="setClass" ref='list'>
    <div class="kongbg" :class="skin==1?'wbg':'bbg'" v-if="!isListShow">
      <div class="kong-wrapper">
        <p>策略在手  投资不愁</p>
        <img :src="skin==1?'https://h5.inquant.cn/future/inquant-img/wfont.png':'https://h5.inquant.cn/future/inquant-img/bfont.png'">
      </div>
   </div>
    <div class="wrapper">
      <div class="header" v-show="isListShow">
        <!-- <img src="../images/tele.png" class="btn"/> -->
        <svg t="1529909377618" class="icon btn" style="" viewBox="0 0 1046 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2885" xmlns:xlink="http://www.w3.org/1999/xlink" width="20.4296875" height="20"><path d="M939.501314 218.141898h-230.101022l119.591241-130.46657a52.321168 52.321168 0 0 0-77.136351-70.708321l-184.394744 201.174891h-88.497518L294.568175 16.967007a52.321168 52.321168 0 0 0-77.13635 70.708321l119.591241 130.46657H106.922044A107.108905 107.108905 0 0 0 0 325.213431v591.715036A107.108905 107.108905 0 0 0 106.922044 1024h832.57927A107.108905 107.108905 0 0 0 1046.423358 916.928467V325.213431a107.108905 107.108905 0 0 0-106.922044-107.071533z" fill="#FF7700" p-id="2886"></path><path d="M663.694015 603.562044l-255.3273-143.621606a26.160584 26.160584 0 0 0-38.97927 22.79708v287.280584a26.160584 26.160584 0 0 0 38.97927 22.79708l255.3273-143.621605a26.160584 26.160584 0 0 0 0-45.631533z" fill="#FFFFFF" p-id="2887"></path></svg>
        <h3 class="title">全部直播</h3>
      </div>
      <div class="content clearfix" v-show="isListShow">
        <div class="item fl clearfix" v-for="(item,index) in list" @click="itemClick(item)">
          <div class="live-des">
            <!-- {{item.Title}} -->
            <div class="live-first-line">
              <div class="title">
              <span>{{item.Title}}</span>
              <svg t="1530261311132" v-if="(item.auth==0 && index==0 && item.isEncryptTime==1) || (index  > 0 && item.auth!=1)" class="icon" style="" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1509" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="20"><path d="M824 362.688h-52.032v-103.68A259.648 259.648 0 0 0 512 0a259.648 259.648 0 0 0-259.968 259.072v103.616h-52.032C142.528 362.688 96 408.96 96 466.304v454.08C96 977.6 142.528 1024 200 1024h624c57.472 0 104-46.4 104-103.68V466.368c0-57.28-46.528-103.68-104-103.68zM480 690.688V480a32 32 0 0 1 64 0v210.688a103.68 103.68 0 0 1 72 98.624c0 57.28-46.528 103.68-104 103.68a103.808 103.808 0 0 1-104-103.68c0-46.08 30.208-85.12 72-98.56z m193.216-328H350.72v-103.68c0-88.576 72.32-160.576 161.216-160.576a161.024 161.024 0 0 1 161.216 160.64v103.616z" p-id="1510" fill="#BDC1C5"></path></svg>
            </div>
            <div class="cus-num">
              <!-- <img class="people-icon" src="../images/people.png" alt=""> -->
              <svg t="1529909040087" class="icon" style="" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2631" xmlns:xlink="http://www.w3.org/1999/xlink" width="12" height="12"><path d="M227.166204 341.31363c0-147.867963 113.818948-265.410462 256.960864-265.410463s256.996668 117.435089 256.996668 265.410463c0 144.108608-113.783144 261.651107-253.273116 265.589479h-10.991638c-139.561579-7.590317-249.692778-125.168619-249.692778-265.589479z m587.497676 0c0-189.757918-146.793861-341.31363-330.429402-341.31363S153.94829 151.770531 153.94829 341.31363c0 128.892171 66.128844 238.91596 168.920351 295.879139-139.633185 56.963179-245.933423 182.095995-275.399606 341.313629-3.580338 18.939988 7.339693 41.675135 29.322969 45.470294h7.160676a35.803381 35.803381 0 0 0 36.662662-30.28966c33.010717-178.33664 183.599737-307.264614 359.752371-311.02397h7.339693c176.331651 0.10741 326.956474-155.45828 326.956474-341.349432z" :fill="+skin === 1 ? '#3F424E' : ' #BDC1C5'" p-id="2632"></path><path d="M781.044505 1023.976692c-123.414254-74.793263-196.23833-154.455785-196.23833-216.109207 0-68.026424 49.086435-103.829804 98.137067-103.829804a90.260323 90.260323 0 0 1 72.824076 35.337937l12.244757 15.932504a15.717684 15.717684 0 0 0 9.201469 5.549524c1.539545 0 2.32722 0.680264 3.830961 0.680264a7.590317 7.590317 0 0 0 3.830962-0.680264 15.502864 15.502864 0 0 0 9.201469-5.549524l12.28056-15.932504a91.262818 91.262818 0 0 1 72.824076-35.337937c48.298761 0 98.101263 36.018201 98.101264 103.829804 0.143214 61.653422-72.824077 141.996208-196.238331 216.109207z" fill="#FB344A" p-id="2633"></path></svg>
              <span>{{showOnline[item.roomId]}}</span>
            </div>
            </div>
            <div class="live-status-type">
              <div v-if="+item.isLive === 1" class="live-part-container">
                <div class="loading">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <p class="living">视频直播中</p>
              </div>
              <p class="living" v-else-if="+item.isVideo === 1">视频直播间</p>
              <p class="direct-seeding" v-else>图文直播中...</p>
            </div>
            <div ref="content" class="des-content">{{ item.Description.length > 60 ? `${item.Description.substring(0, 60)}...` : item.Description}}</div>
          </div>
          <div class="des">
            <img :src="item.cover" class="person"/>
          </div>
        </div>
      </div>
    </div>
	</div>
</template>

<script>
import { getLiveList, checkPulic, onlineCount } from "./api";
import search from "../lib/urlSearch.js";

// console.log(search)
const skin = search("skin");
const isLogin = search("isLogin");
// console.log(urlParam)

export default {
  data() {
    return {
      list: [],
      roomList: [],
      roomListOnline: [],
      showOnline: {},
      onlineTimer: undefined,
      skin,
      iconShow: false,
      isListShow: true,
      setClass: ""
    };
  },
  mounted() {
    this.init().then(res => {
      // this.limitContent();
    });
    //['livelist', {day: +skin === 1}]  
  },
  destroyed() {
    clearTimeout(this.onlineTimer);
  },
  methods: {
    itemClick({ roomId, Title, Description, auth, isEncryptTime, isVideo }) {
      if (isVideo == 1) {
        if (+auth == 1 || isEncryptTime == 0) {
          this.$router.push("/live");
          return;
        } else {
          if (isLogin == 0) {
            this.$Modal.error({
              title: "提示",
              content: "请登录期货账户",
              okText: "知道了"
            });
            return;
          } else {
            this.$Modal.error({
              title: "提示",
              content: "当前直播暂无权限, 请联系客服",
              okText: "知道了"
            });
            return;
          }
        }
      } else {
        if (isLogin == 0) {
          this.$Modal.error({
            title: "提示",
            content: "请登录期货账户",
            okText: "知道了"
          });
          return;
        }

        if (+auth !== 1) {
          this.$Modal.error({
            title: "提示",
            content: "当前直播暂无权限, 请联系客服",
            okText: "知道了"
          });
          return;
        }
      }
      this.$router.push(`live-home/${roomId}`);
    },
    init() {
      return Promise.all([
        getLiveList({
          livetoken: this.$root.livetoken
        }).then(res => {
          if (res.code === 0) {
            this.iconShow = res.data[0].auth == 1 ? false : true;
            if (
              sessionStorage.getItem("teacherList") !== JSON.stringify(res.data)
            ) {
              sessionStorage.setItem("teacherList", JSON.stringify(res.data));
            }
            res.data.map(val => {
              this.roomList.push(String(val.roomId));
            });
            this.getOnlineCount();
            this.list = res.data;
            this.isListShow = res.isShow;
            if (this.isListShow == true && +this.skin === 1) {
              this.setClass = "livelist day";
            } else if (this.isListShow == false && +this.skin === 1) {
              this.setClass = "livelist day kong-bg-bai";
            } else if (this.isListShow == false && +this.skin !== 1) {
              this.setClass = "livelist  kong-bg-hei";
            } else {
              this.setClass = "livelist";
            }
          } else {
            console.error("LiveList->", res);
          }
          return res;
        }),
        checkPulic({
          livetoken: this.$root.livetoken
        }).then(res => {
          if (res.result === 1) {
            this.$emit("isPublic", true);
          }
          return res;
        })
      ]).then(results => {
        if (
          results[1].result === 1 &&
          results[0].code === 0 &&
          results[0].data.length > 0
        ) {
          this.$emit("roomSelected", {
            roomid: results[0].data[0].roomId,
            title: results[0].data[0].Title,
            description: results[0].data[0].Description
          });
        }
      });
    },

    getOnlineCount() {
      const temp = {}; // 临时存储在线人数
      return Promise.all(
        [...this.roomList].map(val => {
          return onlineCount({
            roomIds: val
          }).then(res => {
            temp[res.data[0].roomId] = res.data[0].onlineUserCount;
          });
        })
      ).then(res => {
        this.showOnline = Object.assign({}, this.showOnline, temp); // 更新online人数， 更新视图
        this.onlineTimer = setTimeout(() => {
          this.getOnlineCount(); // 在线人数每一分钟刷新一次
        }, 10000);
      });
    },
    showOnlineCount(roomid) {
      for (let i = 0; i < this.roomListOnline.length; i += 1) {
        console.log(roomid);
        if (+this.roomListOnline[i].roomId === +roomid) {
          return this.roomListOnline[i].onlineUserCount;
        }
        // return '123'
      }
    },
    limitContent() {
      this.$refs.content.map((ele, index) => {
        window.$clamp(ele, {
          clamp: 4
        });
      });
    }
  }
};
</script>

<style lang="scss">
// body {
// 	overflow: hidden;
// }
.live-part-container {
  display: flex;
  margin-bottom: 6.4px;
}
.hide {
  display: none;
}
.kongbg {
  position: fixed;
  width: 100%;
  height: 100%;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  .kong-wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
.wbg {
  background-image: url(https://h5.inquant.cn/future/inquant-img/wbg.png);
  p {
    font-size: 32px;
    color: #282a30;
    text-align: center;
    width: 100%;
    font-weight: 500;
  }
}

.wrapper {
  padding: 30px;
}

.bbg {
  background-image: url(https://h5.inquant.cn/future/inquant-img/bbg.png);
  p {
    font-size: 32px;
    color: #e5e6ec;
    text-align: center;
    width: 100%;
    font-weight: 500;
  }
}
.livelist.day {
  background-color: #fff !important;
  color: #3f424e;

  .header {
    .title {
      color: #3f424e;
    }
  }

  .content {
    .item {
      background-color: #f7f7f7;
      .live-des {
        .title {
          color: #3f424e;
        }

        .des-content {
          color: #6e717e;
        }
      }
    }

    .cus-num {
      color: #474c63 !important;
    }
  }
}

.livelist {
  min-width: 1300px;
  width: 100%;
  height: auto;
  min-height: 100%;
  // height: 100%;
  // position: fixed;
  // left: 0;
  // right: 0;
  // bottom: 0;
  // top: 0;
  // padding: 30px;
  // background: rgba(25, 25, 25, .9);
  background-color: #141414;
  z-index: 100;
  .modal {
    z-index: 1000;
  }
  // overflow: hidden;
  .header {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    // position: relative;
    svg.btn {
      margin-left: 21px;
      // position: absolute;
      // left: 12px;
      // top: 6px;
    }
    .line {
      position: absolute;
      bottom: 0px;
      left: 0;
      width: 48px;
      height: 2px;
      background: #e96f03;
    }
    .title {
      padding-left: 5px;
      font-size: 20px;
      color: #fff;
      // border-bottom: 1px solid #5e5e5e;
    }
  }
  .content {
    display: flex;
    flex-wrap: wrap;

    .item {
      background-color: #1e1e22;
      display: flex;
      justify-content: flex-start;
      border-radius: 5px;
      width: 573px;
      height: 180px;
      margin-left: 20px;
      // margin-right: 97px;
      margin-top: 20px;
      padding-right: 30px;
      cursor: pointer;

      .des {
        // position: relative;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-left: 29px;
        height: 100%;
        cursor: pointer;
        .person {
          // width: 100%;
          width: 201px;
        }
        .live-status {
          position: absolute;
          height: 28px;
          width: 106px;
          background-color: rgba($color: #000000, $alpha: 0.5);
          border-radius: 28px;
          color: white;
          line-height: 28px;
          text-align: center;
          top: 13px;
          left: 12px;
        }
        .green-light {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 16px;
          background-color: rgb(119, 200, 70);
        }
      }
      .live-des {
        // float: right;
        height: 100%;
        // overflow: hidden;
        margin-left: 30px;
        // width: 223px;
        // color: white;
        color: #6e717e;
        font-size: 14px;
        display: flex;
        justify-content: center;
        flex-direction: column;

        .live-first-line {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        img.lock {
          width: 28px;
          vertical-align: middle;
          margin-left: 8px;
        }
        .cus-num {
          font-size: 14px;
          color: #d1d1d1;
          // color:
          img {
            width: 18px;
            height: auto;
            display: inline-block;
            margin-right: 8px;
          }
        }
        .des-content {
          color: rgba(255, 255, 255, 0.6);
          // height: 50px;
          font-size: 14px;
        }
      }
      .title {
        // height: 50px;
        // line-height: 50px;
        // margin-bottom: 8.6px;
        font-size: 20px;
        // padding-left: 15px;
        text-align: left;
        color: #fff;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        // background: rgb(71, 71, 71);

        .living {
          font-size: 12px;
          color: #ff8837;
        }
      }
    }
  }

  @-webkit-keyframes load {
    0%,
    100% {
      height: 2.5px;
      // background: lightgreen;
    }
    50% {
      height: 10px;
      margin: -5px 0;
      // margin-left: 3px;
      // background: lightblue;
    }
  }
  .living {
    font-size: 12px;
    color: #ff8837;
  }
  .direct-seeding {
    color: #3c7dda;
    font-size: 12px;
  }
  .loading {
    width: 14px;
    height: 10px;
    // margin: 0 auto;
    display: flex;
    // margin-left: 12px;
    justify-content: space-between;
    margin-top: 10px;

    // margin-top:100px;
  }
  .live-status-type {
    margin: 3px 0 6px 0;
  }
  .loading span {
    font-size: 0;
    display: inline-block;
    // margin-left: 3px;
    width: 2px;
    height: 100%;
    border-radius: 2px;
    background: #ff872c;
    -webkit-animation: load 1s ease infinite;
  }
  .loading span:nth-child(2) {
    background-color: #ffa50d;
    animation-delay: 0.2s;
  }
  .loading span:nth-child(3) {
    background-color: #ffc21c;
    animation-delay: 0.4s;
  }
  .loading span:nth-child(4) {
    -webkit-animation-delay: 0.6s;
  }
  .loading span:nth-child(5) {
    -webkit-animation-delay: 0.8s;
  }
}
</style>
