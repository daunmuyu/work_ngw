<template>
  <div class="grundTable">
    <div v-for="(group,index) in groupList" :key="group.GroupID">
      <div class="gthd gtitem noselect">
        <div class="gtd5 gtd9">
        <b :class="{'arrowBottom': group.open,'arrowRight': !group.open}" @click="toggleGroupList(index)"></b>
        <span @click="toggleGroupList(index)">{{group.GroupName}}  {{group.checkedUsersLen}}/{{group.Count}}</span>
        <img v-if="index > 0 && group.GroupID != -1" @click="modify(group)" class="xiugai" src="../../assets/icon/icon-beizhu.png" />
        </div>
        <div class="gtd6 fontGy">备注</div>
        <div class="gtd2 fontGy">状态</div>
        <div class="gtd3 fontGy">最近聊天</div>
        <!-- <div class="gtd4 fontGy">课程名称</div> -->
        <!-- <div class="gtd3 fontGy">课程到期</div> -->
        <div class="gtd3 fontGy">操作</div>
        <div class="gtd2 fontRd"><span v-if="index > 0 && group.GroupID != -1" @click="removeGroup(group.GroupID, index)">删除分组</span></div>
      </div>
      <div v-if="Array.isArray(group.userList) && group.userList.length > 0">
        <template v-for="user in group.userList">
          <div class="cont gtitem" :key="user.UserID" v-show="group.open">
            <div class="gtd5 gtd9">
            <el-checkbox ref="userCheck"  :user="user" @change="toggleCheckUser(index, group.GroupID)"></el-checkbox>
            <img class="phImg" :src="user.LogoUrl" alt="">
            <p>{{user.UserName}}</p>
            </div>
            <div class="gtd6 userRemark">
            <img @click="user.remarkOpen = true" src="../../assets/icon/icon-beizhu.png" />
            <el-input :focus="user.remarkOpen" v-model="user.Remark" @blur="addUserRemark(user.UserID, user.Remark)" placeholder="添加备注"></el-input>
            </div>
            <div class="gtd2" :class="{online: user.LoginState}">{{user.LoginState ? '在线' : '离线'}}</div>
            <div class="gtd3">{{user.LastTime}}</div>
            <!-- <div class="gtd4">{{user.CourseName}}</div>
            <div class="gtd3">{{user.EndTime.substr(0, 10)}}</div> -->
            <div class="gtd4">
            <el-button type="primary" round @click="chat(user)">聊天</el-button>
            <el-button type="success" v-if="sipTel && user.Mobile" round @click="callPhone(user.Mobile)">拨打电话</el-button>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import { getCSToken } from '@/store/authToken.js';
import { IMGroupUser, IMGroupDel, IMGroupRemark, IMGroupChange, IMUpGroupName } from '@/service/api.js';

export default {
  mounted() {
    this.fetchGroupList();
    // 调整用户分组
    this.$bus.$off('changeUserGroup');
    this.$bus.$on('changeUserGroup', (groupID) => {
      this.changeUserGroup(groupID);
    });
  },
  computed: {
    ...mapGetters('manage', ['groupList']),
    ...mapGetters(['sipTel']),
  },
  data() {
    return {
      notify: null,
    };
  },
  methods: {
    ...mapActions('manage', [
      'fetchGroupList',
    ]),
    ...mapMutations(['USER_INFO', 'KEHU_SHOW']),
    chat(user) {
      const users = {
        messageType: user.MessageType,
        relationID: user.UserID,
        relationLogoUrl: user.LogoUrl,
        relationName: user.UserName,
      };
      this.USER_INFO(users);
      this.KEHU_SHOW(false);
    },
    callPhone(tel) {
      const telNum = window.atob(tel);
      this.sipTel.call(telNum);
    },
    modify(group) {
      this.$prompt('请输入您要修改的组名称', '修改', {
        confirmButtonText: '确定',
        inputPlaceholder: group.GroupName,
      }).then(({ value }) => {
        console.log(group.GroupID, value);
        this.groupName(group.GroupID, value);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消修改',
        });
      });
    },
    groupName(groupID, name) {
      IMUpGroupName({
        usertoken: getCSToken(),
        groupID,
        name,
      }).then((res) => {
        if (res.code === '0') {
          this.$message({
            type: 'success',
            message: res.message || '修改成功',
          });
          this.fetchGroupList();
        } else {
          this.$message.error(res.message || '修改失败，请重试');
        }
      });
    },
    message(res, action, method = 'fetchGroupList', operate) {
      if (res.code === '0') {
        this.$message({
          type: 'success',
          message: `${action}成功`,
        });
        this[method](operate);
      } else {
        this.$message.error(`${action}失败`);
      }
    },
    // 个人 删除分组
    removeGroup(groupID) {
      this.$confirm('此操作将永久删除该分组, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        IMGroupDel({ groupID }).then((res) => {
          this.message(res, '删除');
        });
      });
    },
    // 个人 - 选中/取消选中用户
    toggleCheckUser(index, groupID) {
      const group = this.groupList[index];
      group.checkedUsersLen = 0;
      this.$refs.userCheck.forEach((item) => {
        if (item.isChecked && groupID === item.$attrs.user.groupID) {
          group.checkedUsersLen += 1;
        }
      });
    },
    // 个人 - 打开/关闭分组
    toggleGroupList(index) {
      const group = this.groupList[index];
      group.open = !group.open;
      if (group.open) {
        // this.notify = this.$notify({
        //   title: '加载中...',
        //   message: '数据正在加载请稍等~ ',
        //   duration: 0,
        //   showClose: false,
        // });
        IMGroupUser({ usertoken: getCSToken(), groupID: group.GroupID }).then((res) => {
          if (res.code === '0') {
            const arr = res.data || [];
            group.userList = arr.map((item) => {
              item.remarkOpen = false;
              item.groupID = group.GroupID;
              return item;
            });
            if (!arr.length) {
              this.$message.info('暂无数据，等待移入~');
              group.open = !group.open;
            }
            // this.notify.close();
          }
        });
      }
    },
    // 添加备注
    addUserRemark(userID, remark) {
      IMGroupRemark({
        userID,
        remark,
        usertoken: getCSToken(),
      }).then((res) => {
        if (res.code !== '0') {
          this.$message.error('修改失败');
        }
      });
    },
    // 移动分组
    changeUserGroup(groupID) {
      const userIDs = [];
      if (this.$refs.userCheck) {
        this.$refs.userCheck.forEach((item) => {
          if (item.isChecked) userIDs.push(item.$attrs.user.UserID);
        });
        if (userIDs.length > 0) {
          IMGroupChange({
            groupID,
            userIDs: userIDs.join(','),
            usertoken: getCSToken(),
          }).then((res) => {
            this.message(res, '移动');
          });
        } else {
          this.$message({
            type: 'info',
            message: '请先选择用户',
          });
        }
      } else {
        this.$message({
          type: 'info',
          message: '请先选择用户',
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import '../../styles/base.scss';
.grundTable {
  text-align: left;
  .gthd {
    height: 40px;
    background-color: $bg-E4EBEB;
    cursor: pointer;
  }
  .gtitem {
    @include flexAic;
    padding: 0 15px;
    .gtd5 {
      position: relative;
      .xiugai {
        // position: absolute;
        // right: 15px;
        margin-left: 15px;
      }
    }
    .gtd4, .gtd5 {
      width: 140px;
      @include flexAic;
      b {
        display: block;
        border: 1px solid $bg-2A4159;
        width: 8px;
        height: 8px;
        transform: rotate(45deg);
        transition: .3s;
        border-left: none;
        border-bottom: none;
        position: relative;
        top: -2px;
        &.arrowBottom {
          transform: rotate(135deg);
        }
        &.arrowRight {
          transform: rotate(45deg);
        }
      }
      span {
        padding-left: 10px;
      }
    }
    .gtd5 {
      width: 170px;
    }
    .gtd6 {
      width: 200px;
    }
    .gtd9 {
      width: 300px !important;
      p {
        flex: 1;
        width: calc(100% - 80px) !important;
      }
    }
    .gtd3 {
      width: 100px;
    }
    .gtd2 {
      width: 60px;
    }
  }
  .cont {
    height: 52px;
    .gtd3 {
      @include flexAic;
      p {
        width: calc(100% -20px);
        @include lineOne;
      }
    }
    .gtd4, .gtd5 {
      .phImg {
        @include photoImg(30px);
        margin: 0 10px;
      }
      p {
        width: 90px;
        @include lineOne;
        overflow: scroll;
        text-overflow: inherit;
      }
    }
    .online {
      color: #55D48B;
    }
  }
}
</style>
