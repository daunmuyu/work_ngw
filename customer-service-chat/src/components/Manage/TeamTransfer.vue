<template>
  <div class="im-popover-container">
    <div class="im-popover-bg" @click="toggleTeamTransfer(false)"></div>
    <div class="im-popover-content">
      <div class="left">
        <label class="active-group-name">群名称&nbsp;&nbsp;
          <input type="text" v-model="activeTeamName" :disabled="type==='edit'">
        </label>
        <h5 class="title">添加成员</h5>
        <ul class="group-list">
          <li v-for="group in groupList" :key="group.GroupID">
            <span class="group-name noselect">
              <div class="left-arrow" @click="toggleGroupList(group)">
              <b class="arrow" :class="{'arrowBottom': group.open,'arrowRight': !group.open}"></b>
              <p>{{group.GroupName}}</p>
              </div>
              <div class="right-arrow" v-if="group.open && group.userList.length">
                勾选全组
                <div class="team-checkbox" @click="toggleCheckGroup(group)">
                  <img v-show="group.checked" src="/static/image/manage/checked.png" alt="">
                  <img v-show="!group.checked" src="/static/image/manage/nocheck.png" alt="">
                </div>
              </div>
            </span>
            <template  v-if="group.open">
              <ul class="user-list" v-for="(user, index) in group.userList" :key="user.UserID">
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
      </div>
      <div class="right">
        <h5 class="title">已邀请{{checkedList.length}}/{{gCount}}</h5>
        <ul class="user-list">
          <li v-for="(user,index) in checkedList" :key="user.UserID">
            <img class="phImg" :src="user.LogoUrl" alt="">
            <p>{{user.UserName}}</p>
            <img @click="removeCheckUser(index)" class="cancel-check" src="/static/image/manage/cancel.png">
          </li>
        </ul>
        <div class="btn-group">
          <button @click="toggleTeamTransfer(false)">取消</button>
          <button @click="saveTeam()">确认</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapMutations } from 'vuex';
import { IMGroupUser, IMGroupList, IMTmCt, IMTMUserList, IMTmUd } from '@/service/group.js';
import { getIMGcount } from '@/store/authToken';

export default {
  props: ['type', 'editTeam'],
  mounted() {
    this.fetchGroupList();
    if (this.type === 'edit') {
      this.activeTeamName = this.editTeam.TeamName;
      IMTMUserList({ teamID: this.editTeam.TeamID }).then((res) => {
        if (res.code === '0') {
          this.checkedList = res.data.UserList;
        }
      });
    } else {
      this.activeTeamName = '';
    }
  },
  data() {
    return {
      checkedList: [],
      groupList: {},
      activeTeamName: '',
      gCount: getIMGcount(),
    };
  },
  methods: {
    ...mapActions('manage', [
      'fetchTeamList',
    ]),
    ...mapMutations(['SHOW_TEAM_TRANSFER']),
    // 勾选分组
    toggleCheckGroup(group) {
      group.checked = !group.checked;
      console.log(group);
      if (!group.open) this.toggleGroupList(group);
      const timer = setInterval(() => {
        group.userList = group.userList.map((item) => {
          item.checked = !group.checked;
          this.toggleCheckUser(item, group);
          return item;
        });
        if (group.request) clearInterval(timer);
        this.$forceUpdate();
      }, 100);
      this.$forceUpdate();
    },
    // 获取用户分组
    fetchGroupList() {
      IMGroupList().then((res) => {
        if (res.code === '0') {
          res.data.forEach((item) => {
            this.groupList[item.GroupID] = {
              ...item,
              checked: false,
              request: false,
              userList: [],
              open: false,
            };
          });
          this.$forceUpdate();
        }
      });
    },
    // 打开关闭弹窗
    toggleTeamTransfer(val) {
      this.SHOW_TEAM_TRANSFER(val);
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
    // 个人 - 选中/取消选中用户
    toggleCheckUser(user, group) {
      user.checked = !user.checked;
      if (!user.checked) group.checked = false;
      if (user.checked) {
        this.checkedList.push(user);
        this.checkedList = this.uniq(this.checkedList);
      } else {
        const idx = this.checkedList.map(c => (c.UserID)).indexOf(user.UserID);
        this.checkedList.splice(idx, 1);
      }
    },
    // 个人 - 打开/关闭分组
    toggleGroupList(group) {
      group.open = !group.open;
      this.$forceUpdate();
      if (!group.request) {
        IMGroupUser({ groupID: group.GroupID }).then((res) => {
          if (res.code === '0') {
            const arr = res.data;
            group.request = true;
            group.userList = arr.map((item, index) => {
              item.GroupID = group.GroupID;
              item.index = index;
              this.checkedList.forEach((cuser) => {
                if (cuser.UserID === item.UserID) {
                  cuser.GroupID = group.GroupID;
                  cuser.index = index;
                }
              });
              if (this.checkedList.map(c => c.UserID).includes(item.UserID)) {
                item.checked = true;
              } else {
                item.checked = false;
              }
              return item;
            });
            this.$forceUpdate();
          }
        });
      }
    },
    // 删除选中用户
    removeCheckUser(index) {
      const u = this.checkedList[index];
      if (this.groupList && this.groupList[u.GroupID]) this.groupList[u.GroupID].userList[u.index].checked = false;
      this.checkedList.splice(index, 1);
      this.$forceUpdate();
    },
    // 保存群组 添加/更新
    saveTeam() {
      if (this.activeTeamName.length > 0) {
        const params = { userIDs: this.checkedList.map(item => item.UserID).join(',') };
        if (this.type === 'edit') {
          IMTmUd({ ...params, teamID: this.editTeam.TeamID }).then((res) => {
            if (res.code === '0') {
              this.toggleTeamTransfer(false);
              this.fetchTeamList();
              this.$message({
                type: 'success',
                message: res.message,
              });
            } else {
              this.$message.error(res.message);
            }
          });
        } else {
          IMTmCt({ ...params, teamName: this.activeTeamName }).then((res) => {
            if (res.code === '0') {
              this.toggleTeamTransfer(false);
              this.fetchTeamList();
              this.$message({
                type: 'success',
                message: res.message,
              });
            } else {
              this.$message.error(res.message);
            }
          });
        }
      } else {
        this.$message({
          type: 'info',
          message: '请输入群名称',
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import '../../styles/base.scss';
.im-popover-container {
  height: 100%;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9;
  .im-popover-bg {
    position: fixed;
    height: 100%;
    width: 100%;
    background: rgba($color: #000, $alpha: 0.5);
  }
  .im-popover-content {
    height: 420px;
    width: 480px;
    position: fixed;
    left: 50%;
    top: 50%;
    z-index: 10;
    display: flex;
    border-radius: 4px;
    transform: translate(-40%,-50%);
    background: #fff;
    text-align: left;
    color: #2A4159;
    .left {
      height: 100%;
      width: 269px;
      padding: 20px;
      border-right: 1px solid #E3E7E7;
      .active-group-name {
        width: 100%;
        height: 24px;
        display: block;
        margin-bottom: 15px;
        > input {
          height: 100%;
          width: 160px;
          border: none;
          border-radius: 12px;
          background: #F2F7F7;
          outline: none;
          text-indent: 10px;
        }
      }
      .group-list {
        height: 300px;
        margin-top: 20px;
        overflow-y: auto;
        > li {
          margin-bottom: 15px;
          .group-name {
            @include flexBox;
            margin-left: 2px;
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
    }
    .right {
      padding: 20px;    
      width: 210px;
      .user-list {
        height: 310px; 
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
      .btn-group {
        display: flex;
        justify-content: space-around;
        > button {
          width: 80px;
          height: 28px;
          background: transparent;
          border-radius: 14px;
          border: none;
          outline: none;
          cursor: pointer;
          &:first-child {
            border: 1px solid #E3E7E7;
            margin-right: 10px;
          }
          &:last-child {
            background: $bg-3D70F6;
            color: #fff;
          }
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
