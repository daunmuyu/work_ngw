<template>
  <div class="ChatMailListPaneBg" v-if="mailList.isShow">
    <div class="ChatMailListPane">
      <div class="MailListSearch">
        <el-input
          class="inline-input"
          size="mini"
          prefix-icon="el-icon-search"
          placeholder="搜索好友/群聊"
          v-model="searchVal"
          @input="changeVal"
        ></el-input>
      </div>
      <div class="MailListView">
        <div class="MailListWarp" ref="indexWrap" @scroll="onListWrapScroll">
          <div class="MailListGroup" ref="indexGroup" v-for="(item, index) in groupItem" :key="index">
            <h5 class="MailListGroupTitle">{{item.firstStr}}</h5>
            <div v-if="item.uData.length" class="MailListTitle">好友</div>
            <div v-for="(itm, idx) in item.uData" :key="idx">
            <ul class="MailListGroupPane">
              <li class="MailListGroupItem">
                <div class="userInfo">
                  <img
                    class="avatar"
                    :src="itm.relationLogoUrl"
                    alt=""
                  >
                  <span class="name">{{itm.relationName}}</span>
                </div>
                <!-- <el-checkbox ref="checkBox" @change="adduser($event, itm.relationID)"></el-checkbox> -->
                <el-radio v-model="radio" @change="adduser(itm)" :label="itm.relationID"></el-radio>
              </li>
            </ul>
            </div>
            <div v-if="item.tData.length" class="MailListTitle">群聊</div>
            <div v-for="(itm, idx) in item.tData" :key="idx">
            <ul class="MailListGroupPane">
              <li class="MailListGroupItem">
                <div class="userInfo">
                  <img
                    class="avatar"
                    :src="itm.relationLogoUrl"
                    alt=""
                  >
                  <span class="name">{{itm.relationName}}</span>
                </div>
                <el-radio v-model="radio" @change="adduser(itm)" :label="itm.relationID"></el-radio>
                <!-- <el-checkbox ref="checkBox" @change="adduser($event, itm.relationID)"></el-checkbox> -->
              </li>
            </ul>
            </div>
          </div>
        </div>
        <div class="MailListNav">
          <ul>
            <li class="MailListNavItem" v-for="(itm, idx) in chars" :key="idx" :class="{'active': currentIndex == idx}" @click="onTouchStartIndex(idx)">{{itm}}</li>
          </ul>
        </div>
        <transition name="fade">
          <div class="index-indicator" v-show="moving">{{currentIndicator}}</div>
        </transition>
      </div>
      <div class="MailLsitFooter">
        <el-button round @click="cancelBtn">取消</el-button>
        <el-button type="primary" round @click="sureBtn">确定</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex';
import { getCSToken } from '../store/authToken';
import { IMMailList, IMTransmit } from '../service/api';
import { filterArr, delay } from '../service/utils';

const INDICATOR_INDURATION = 1000;
const TITLE_HEIGHT = 30;

export default {
  name: 'ChatMail',
  data() {
    return {
      chars: null,
      groupItem: null,
      currentIndex: 0,
      moving: false,
      currentIndicator: '',
      tidArr: [],
      searchVal: '',
      radio: '',
      userType: 1,
    };
  },
  computed: {
    ...mapGetters(['mailList']),
  },
  watch: {
    currentIndex(newVal) {
      console.info(newVal);
      clearTimeout(this.timer);
      // this.currentIndicator = this.chars[this.currentIndex];
      const idx = filterArr(this.groupItem, 'firstStr').indexOf(this.chars[newVal]);
      if (idx !== -1) {
        this.currentIndicator = this.chars[newVal];
      }
      this.moving = true;
      this.timer = setTimeout(() => {
        this.moving = false;
      }, INDICATOR_INDURATION);
    },
  },
  created() {
    this.listHeight = [];
    this.timer = null;
    this.scrollTimer = null;
    this.initMail();
  },
  mounted() {
  },
  methods: {
    ...mapMutations(['MAIL_LIST']),
    adduser(item) {
      console.log(item);
      this.userType = item.userType;
      // if (e) this.tidArr.push(id);
      // if (!e) this.tidArr.splice(this.tidArr.indexOf(id), 1);
      // console.log(this.tidArr);
      // console.log(this.$refs.checkBox[0].checked);
    },
    changeVal() {
      console.log(this.searchVal);
      delay(() => {
        this.initMail();
      }, 300);
    },
    cancelBtn() {
      this.searchVal = '';
      this.MAIL_LIST({
        isShow: false,
        msgId: '',
      });
      this.initMail();
    },
    sureBtn() {
      if (!this.radio) {
        this.$message({
          message: '请选择要转发的人',
          type: 'warning',
        });
        return;
      }
      this.forward();
    },
    initMail() {
      IMMailList({
        usertoken: getCSToken(),
        content: this.searchVal,
      }).then((res) => {
        if (+res.code === 0) {
          this.chars = res.chars;
          this.groupItem = res.data;
          this.currentIndex = this.chars.indexOf(this.groupItem[0].firstStr);
          this.$nextTick(() => {
            this.calculateHeight();
          });
        }
      }).catch((err) => {
        console.log(err);
      });
    },
    forward() {
      IMTransmit({
        usertoken: getCSToken(),
        cID: this.mailList.msgId,
        toID: this.radio,
        userType: this.userType,
      }).then((res) => {
        this.$message({
          message: res.message || '转发发成功',
          type: +res.result === 1 ? 'success' : 'warning',
        });
        if (!+res.code) this.cancelBtn();
      }).catch((err) => {
        this.$message({
          message: err.message || '网络故障',
          type: 'error',
        });
      });
    },
    calculateHeight() {
      this.listHeight = [];
      const list = this.$refs.indexGroup;
      if (!list) return;
      let height = 0;
      this.listHeight.push(height);
      for (let i = 0; i < list.length; i += 1) {
        const item = list[i];
        height += item.clientHeight;
        this.listHeight.push(height);
      }
    },
    onTouchStartIndex(index) {
      this.currentIndex = index;
      const idx = filterArr(this.groupItem, 'firstStr').indexOf(this.chars[index]);
      if (idx !== -1) {
        this.$refs.indexWrap.scrollTop = this.listHeight[idx];
      }
    },
    onListWrapScroll(e) {
      console.warn(e);
      clearTimeout(this.scrollTimer);
      this.scrollTimer = setTimeout(() => {
        const scrollTop = this.$refs.indexWrap.scrollTop;
        const listHeight = this.listHeight;
        for (let i = 0; i < listHeight.length - 1; i += 1) {
          if (
            scrollTop <= listHeight[i + 1] - TITLE_HEIGHT &&
            scrollTop >= listHeight[i]
          ) {
            this.currentIndex = this.chars.indexOf(this.groupItem[i].firstStr);
            return;
          }
        }
      }, 20);
    },
  },
  destroyed() {
    clearTimeout(this.timer);
    clearTimeout(this.scrollTimer);
  },
};
</script>
<style lang="scss" scoped>
@import "../styles/base.scss";

.ChatMailListPaneBg {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;
  background-color: rgba($color: #000000, $alpha: 0.7);
  .ChatMailListPane {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    width: 450px;
    height: 70%;
    background-color: #fff;
    border-radius: 5px;
    .MailListSearch {
      border-bottom: 1px solid $bg-E3E7E7;
      padding: 10px 15px;
    }
    .MailLsitFooter {
      padding: 10px 15px;
      text-align: center;
      button {
        height: 28px;
        width: 80px;
        border-radius: 14px;
        font-size: 14px;
        color: $bg-2A4159;
        padding: 0;
        &.el-button--primary {
          color: #fff;
          background-color: $bg-3D70F6;
        }
      }
    }
    .MailListView {
      height: calc(100% - 100px);
      flex: 1;
      position: relative;
      text-align: left;
      color: $bg-2A4159;
      font-size: 14px;
      .MailListWarp {
        height: 100%;
        overflow-x: hidden;
        overflow-y: scroll;
      }
      .MailListNav {
        position: absolute;
        right: 15px;
        top: 50%;
        z-index: 100;
        width: 20px;
        // padding: 20px 15px;
        text-align: center;
        // border-radius: 10;
        // background: rgba(0, 0, 0, 0.3);
        transform: translateY(-50%);
        text-align: center;
        .MailListNavItem {
          padding: 3px;
          font-size: 12px;
          color: $bg-8997A5;
          list-style: none;
          cursor: pointer;
          &.active {
            color: #fff;
            border-radius: 50%;
            background-color: $bg-52668C;
          }
        }
      }
      .MailListTitle {
        padding: 10px 15px;
        font-size: 16px;
      }
      .MailListWarp {
        // width: 100%;
        // height: calc(100% - 48px);
        .MailListGroupTitle {
          line-height: 36px;
        }
        .MailListGroup {
          width: 380px;
          border-bottom: 1px solid  $bg-E3E7E7;
          margin-left: 15px;
          .MailListGroupPane {
            .MailListGroupItem {
              padding-bottom: 15px;
              @include flexBox;
              .userInfo {
                @include flexAic;
                .avatar {
                  @include photoImg(36px);
                }
                .name {
                  display: block;
                  padding-left: 20px;
                  // line-height: 36px;
                }
              }
            }
          }
        }
      }
    }
  }

  .index-indicator {
    position: absolute;
    width: 50px;
    height: 50px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    line-height: 50px;
    background: rgba(0, 0, 0, 0.7);
    color: #fff;
    font-size: 22px;
    border-radius: 5px;
    pointer-events: none;
  }
  .fade-leave-active {
    transition: opacity 0.5s;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
  
}

</style>
