<template>
  <div class="im-popover-container" v-show="groupShow">
    <div class="im-popover-bg" @click="toggleTeamTransfer(false)"></div>
    <div class="im-popover-content">
      <div class="popover-title">群发消息
        <div class="close-btn" @click="toggleTeamTransfer(false)"><img src="../../assets/icon/close-big@2x.png" alt=""></div>
      </div>
      <div class="content">
        <div class="left">
          <ul class="group-list">
            <li v-for="group in groupList" :key="group.GroupID">
              <span class="group-name noselect">
                <div class="left-arrow" @click="toggleGroupList(group)">
                <b class="arrow" :class="{'arrowBottom': group.open,'arrowRight': !group.open}"></b>
                <p>{{group.GroupName}}</p>
                </div>
                <div class="right-arrow" v-if="group.open">
                勾选全组
                <div class="team-checkbox" @click="toggleCheckGroup(group)">
                  <img v-show="group.checked" src="/static/image/manage/checked.png" alt="">
                  <img v-show="!group.checked" src="/static/image/manage/nocheck.png" alt="">
                </div>
              </div>
              </span>
              <template  v-if="group.open">
                <ul class="user-list" v-for="(user, index) in group.UserList" :key="user.UserID">
                  <li>
                    <img class="phImg" :src="user.LogoUrl" alt="">
                    <p>{{user.UserName}}</p>
                    <div class="team-checkbox" @click="toggleCheckUser(user, group)">
                      <img v-show="user.checked" src="/static/image/manage/checked.png" alt="">
                      <img v-show="!user.checked" src="/static/image/manage/nocheck.png" alt="">
                    </div>
                  </li>
                </ul>
              </template>
            </li>
          </ul>
          <button @click="selectAll(true)" class="select-all">全选</button>
        </div>
        <div class="right">
          <h5 class="title">接收人</h5>
          <ul class="user-list">
            <li v-for="(user,index) in checkedList" :key="user.UserID">
              <img class="phImg" :src="user.LogoUrl" alt="">
              <p>{{user.UserName}}</p>
              <img @click="removeCheckUser(index)" class="cancel-check" src="/static/image/manage/cancel.png">
            </li>
          </ul>
          <button @click="selectAll(false)" class="clear-all">清空</button>
        </div>
      </div>
    <chat-msgs :userids="useridArr(checkedList)"></chat-msgs>
    </div>
  </div>
</template>
<script>
import { mapMutations, mapGetters } from 'vuex';
import { IMALLGroupUser } from '@/service/group.js';
import chatMsgs from '@/components/chatMsgs';

export default {
  mounted() {
    this.fetchGroupList();
  },
  components: {
    chatMsgs,
  },
  computed: {
    ...mapGetters(['groupShow']),
  },
  data() {
    return {
      checkedList: [],
      groupList: {},
    };
  },
  methods: {
    ...mapMutations(['GROUP_SHOW']),
    // 勾选全组
    toggleCheckGroup(group) {
      group.checked = !group.checked;
      group.UserList = group.UserList.map((item) => {
        item.checked = !group.checked;
        this.toggleCheckUser(item, group);
        return item;
      });
      this.$forceUpdate();
    },
    useridArr(arr) {
      const uidArr = [];
      arr.forEach((v) => {
        uidArr.push(v.UserID);
      });
      return uidArr.join();
    },
    // 过滤重复数组
    uniq(array) {
      const temp = [];
      const len = array.length;
      for (let i = 0; i < len; i += 1) {
        for (let j = i + 1; j < len; j += 1) {
          if (array[i].UserID === array[j].UserID) {
            i += 1;
            j = i;
          }
        }
        console.log(array[i]);
        temp.push(array[i]);
      }
      return temp;
    },
    // 获取用户分组
    fetchGroupList() {
      IMALLGroupUser().then((res) => {
        if (res.code === '0') {
          res.data.GroupList.forEach((group) => {
            group.UserList.forEach((user, index) => {
              user.GroupID = group.GroupID;
              user.index = index;
            });
            this.groupList[group.GroupID] = {
              ...group,
              open: false,
              checked: false,
            };
          });
          this.$forceUpdate();
        }
      });
    },
    // 打开关闭弹窗
    toggleTeamTransfer(val) {
      this.GROUP_SHOW(val);
    },
    // 个人 - 选中/取消选中用户
    toggleCheckUser(user, group) {
      user.checked = !user.checked;
      if (!user.checked) group.checked = false;
      this.checkedList = [];
      Object.values(this.groupList).forEach((team) => {
        team.UserList.forEach((item) => {
          if (item.checked) {
            this.checkedList.push(item);
          }
        });
      });
    },
    // 个人 - 打开/关闭分组
    toggleGroupList(group) {
      group.open = !group.open;
      this.$forceUpdate();
    },
    // 删除选中用户
    removeCheckUser(index) {
      const u = this.checkedList[index];
      this.groupList[u.GroupID].UserList[u.index].checked = false;
      this.checkedList.splice(index, 1);
    },
    selectAll(isClear) {
      this.checkedList = [];
      Object.values(this.groupList).forEach((group) => {
        group.UserList.forEach((item) => {
          if (isClear) {
            item.checked = true;
            this.checkedList.push(item);
          } else {
            item.checked = false;
          }
        });
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import '../../styles/base.scss';
.im-popover-container {
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9;
  .im-popover-bg {
    position: absolute;
    height: 100%;
    width: 100%;
    background: rgba($color: #000, $alpha: 0.5);
  }
  .im-popover-content {
    width: 480px;
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 10;
    border-radius: 4px;
    transform: translate(-40%,-50%);
    background: #fff;
    text-align: left;
    color: #2A4159;
    .popover-title {
      width: 100%;
      height: 40px;
      position: relative;
      display: block;
      line-height: 40px;
      padding-left: 20px;
      background: #F4F5F6;
      .close-btn {
        height: 32px;
        width: 32px;
        position: absolute;
        right: -10px;
        top: -10px;
        > img {
          height: 100%;
          width: 100%;
        }
      }
    }
    .content {
      display: flex;
      border-bottom: 1px solid #E3E7E7;
      .clear-all, .select-all {
        width: 80px;
        height: 28px;
        background: transparent;
        border-radius: 14px;
        border: none;
        outline: none;
        cursor: pointer;
        float: right;
      }
      .left {
        height: 100%;
        width: 269px;
        padding: 20px;
        border-right: 1px solid #E3E7E7;
        position: relative;
        .group-list {
          height: 300px;
          overflow-y: auto;
          > li {
            margin-bottom: 15px;
            .group-name {
              margin-left: 2px;
              @include flexBox;
              > div {
                @include flexAic;
                img {
                  width: 16px;
                  display: inline-block;
                }
              }
              p {
                margin-left: 5px;
              }
              .arrow {
                display: block;
                border: 1px solid $bg-2A4159;
                width: 5px;
                height: 5px;
                transform: rotate(45deg);
                transition: .3s;
                border-left: none;
                border-bottom: none;
                &.arrowBottom {
                  transform: rotate(135deg);
                }
                &.arrowRight {
                  transform: rotate(45deg);
                }
              }
            }
            .user-list > li {
              > p {
                width: 150px;
              }
              .team-checkbox {
                > img {
                  height: 16px;
                  width: 16px;
                }
              }
            }
          }
        }
        .select-all {
          border: 1px solid #E3E7E7;
        }
      }
      .right {
        padding: 20px;    
        width: 210px;
        .user-list {
          height: 260px;
          padding-right: 10px;
          margin-bottom: 10px;
          overflow-y: auto; 
          > li {
            > p {
              width: 100px;
            }
            .cancel-check {
              height: 16px;
              width: 16px;
            }
          }
        }
        .clear-all {
          background: $bg-3D70F6;
          color: #fff;
        }
      }
    }
    .title {
      color: #8997A5;
    }
    .left, .right {
      .user-list {
        margin-top: 12px;
        > li {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
          .phImg {
            @include photoImg(30px);
            margin: 0 10px;
          }
          p {
            @include lineOne;
          }
        }
      }
    }
  }
}
</style>
