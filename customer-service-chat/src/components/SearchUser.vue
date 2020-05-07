<template>
  <div class="searchWrapper">
    <el-input v-model="searchKey" placeholder="搜索" @input="searchChange">
      <el-select class="selectV" v-model="select" slot="prepend">
        <el-option label="用户" value="1"></el-option>
        <el-option label="聊天" value="2"></el-option>
      </el-select>
    </el-input>
    <template v-if="select > 1">
      <div class="searchPopover" v-show="searchUserHist.length > 0">
        <div class="searchPopoverInner">
          <h6 class="popoverTitle">聊天记录</h6>
          <ul class="popoverList">
            <template v-for="item in searchUserHist">
              <li @click="userHist(item)" :key="item.Id">
                <img :src="item.HeadImg" alt="">
                <div class="info">
                  <p v-html="item.Name"></p>
                  <p><b v-html="getName(item.Content)"></b></p>
                </div>
              </li>
            </template>
          </ul>
        </div>
      </div>
    </template>
    <template v-else>
    <div class="searchPopover" v-show="searchUserList.length > 0">
      <div class="searchPopoverInner">
        <h6 class="popoverTitle">好友</h6>
        <ul class="popoverList">
          <template v-for="item in searchUserList">
            <li @click="pickUser(item)" :key="item.UserID" v-if="item.MessageType === '1'">
              <img :src="item.LogoUrl" alt="">
              <p v-html="getName(item.UserName)"></p>
            </li>
          </template>
        </ul>
        <div class="splitLine"></div>
        <h6 class="popoverTitle">群聊</h6>
        <ul class="popoverList">
          <template v-for="item in searchUserList">
            <li @click="pickUser(item)" :key="item.UserID" v-if="item.MessageType === '2'">
              <img :src="item.LogoUrl" alt="">
              <p v-html="getName(item.UserName)"></p>
            </li>
          </template>
        </ul>
      </div>
    </div>
    </template>
  </div>
</template>
<script>
import { mapMutations } from 'vuex';
import { delay } from '@/service/utils.js';
import { IMSerch, IMHostChat } from '@/service/api.js';
import { getCSToken } from '@/store/authToken.js';

export default {
  data() {
    return {
      searchKey: '',
      searchUserList: [],
      searchUserHist: [],
      select: '1',
    };
  },
  methods: {
    ...mapMutations(['USER_INFO', 'KEHU_SHOW', 'HIST_SHOW']),
    searchChange() {
      if (this.searchKey) {
        delay(() => {
          if (this.select > 1) {
            this.searchChatHist(this.searchKey);
          } else {
            this.searchUser(this.searchKey);
          }
        }, 500);
      } else {
        this.searchUserList = [];
        this.searchUserHist = [];
      }
    },
    searchChatHist(content) {
      IMHostChat({
        content,
        contentType: 0,
        usertoken: getCSToken(),
      }).then((res) => {
        this.searchUserHist = res.data;
      });
    },
    searchUser(content) {
      IMSerch({ content, usertoken: getCSToken() }).then((res) => {
        if (res.code === '0') {
          this.searchUserList = res.data;
        }
      });
    },
    userHist(item) {
      const users = {
        messageType: `${item.MessageType}`,
        relationID: item.Id,
        relationLogoUrl: item.HeadImg,
        relationName: item.Name,
      };
      this.USER_INFO(users);
      this.HIST_SHOW({
        isShow: true,
        isCurr: this.searchKey,
      });
      this.KEHU_SHOW(false);
      this.searchKey = '';
      this.searchUserHist = [];
    },
    pickUser(item) {
      const users = {
        messageType: item.MessageType,
        relationID: item.UserID,
        relationLogoUrl: item.LogoUrl,
        relationName: item.UserName,
      };
      this.USER_INFO(users);
      this.KEHU_SHOW(false);
      this.searchKey = '';
      this.searchUserList = [];
    },
    getName(name) {
      const reg = new RegExp(this.searchKey, 'g');
      return name.replace(reg, `<span style="color: #3D70F6;">${this.searchKey}</span>`);
    },
  },
};
</script>
<style lang="scss" scoped>
@import '../styles/base.scss';
.searchWrapper {
  position: relative;
  .searchPopover {
    width: 200px;
    position: absolute;
    top: 43px;
    z-index: 9;
    text-align: left;
    &::before {
      height: 0;
      width: 0;
      position: absolute;
      left: 93px;
      top: -6px;
      content: " ";
      border-width: 0 6px 6px;
      border-style: solid;
      border-color:transparent transparent #fff;
    }
    .searchPopoverInner {
      overflow-x: hidden;
      overflow-y: auto;
      min-height: 100px;
      max-height: 300px;
      background: #fff;
      padding: 12px;
      border-radius: 4px;
      .popoverTitle {
        color: #8997A5;
        font-size: 14px;
        margin-bottom: 14px;
      }
      .popoverList > li {
        @include flexBox;
        margin-bottom: 14px;
        cursor: pointer;
        > img {
          height: 34px;
          width: 34px;
          border-radius: 34px;
        }
        p {
          width: 125px;
          font-size: 18px;
          margin-left: 10px;
          // line-height: 34px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          b {
            font-size: 10px;
          }
        }
      }
      .splitLine {
        height: 1px;
        background: #E3E7E7;
        margin-bottom: 14px;
      }
    }
  }
}
</style>
