<template>
  <div class="group-info">
    <div class="title">群消息</div>
    <div class="info">
      <p><span>群名</span><br/>{{userInfo.relationName}}</p>
      <p><span>ID</span><br/>{{userInfo.relationID}}</p>
      <!-- <p><span>群成员</span><br/>{{}}</p> -->
    </div>
    <div class="group-list">
      <div class="item-person" @click="onShowTeamTransfer(true)">
        <div class="item-icon"></div>
        <div class="item-img">
          <img src="../assets/icon/icon_tianjia.png" alt="">
        </div>
        <p><span>添加成员</span></p>
      </div>
      <div class="item-person between" v-for="(item, index) in groupList" :key="index">
        <div class="item-icon">
          <img class="icon" v-if="+item.RoleType == 2" src="../assets/icon/icon_qunzhu.png" alt="">
          <img class="icon" v-if="+item.RoleType == 1" src="../assets/icon/icon_guanliyuan.png" alt="">
        </div>
        <div class="item-img">
          <img class="personImg" :src="item.LogoUrl" :alt="item.UserName">
        </div>
        <el-tooltip class="persnName" effect="dark" :content="item.UserName" placement="top-start">
          <div class="persnName">{{item.UserName}}</div>
        </el-tooltip>
        <!-- <div class="persnName">{{item.UserName}}</div> -->
        <div class="caozuo">
        <!-- <div class="operation" @click="promotion(item.UserID)" v-if="+item.RoleType == 0 && CurrentRoleType > 1">提拔</div>
        <div class="operation" @click="kictOut(item.UserID)" v-if="+item.RoleType != 2">踢出</div> -->
        <el-dropdown v-if="CurrentRoleType > 0 && item.RoleType < 2" @command="operateConfirm">
          <span class="el-dropdown-link">
            操作
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="commandWords(item, item.TalkState == 1 ? 2 : 3)">{{item.TalkState == 1 ? '解禁' : '禁言'}}</el-dropdown-item>
            <el-dropdown-item :command="commandWords(item, item.RoleType == 1 ? 1 : 0)">{{item.RoleType == 1 ? '降级' : '提拔'}}</el-dropdown-item>
            <el-dropdown-item :command="commandWords(item, 4)">踢出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        </div>
      </div>
    </div>
    <team-transfer :type="teamTransferType" :edit-team="editTeam" v-if="showTeamTransfer"></team-transfer>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex';
import { getCSToken } from '@/store/authToken.js';
import { IMTMUserList, IMTMKict, IMAddMage, IMTalkState } from '@/service/api.js';
import TeamTransfer from './Manage/TeamTransfer';

export default {
  name: 'GroupInfo',
  components: {
    TeamTransfer,
  },
  computed: {
    ...mapGetters(['userInfo', 'showTeamTransfer', 'forbiddenWords']),
  },
  watch: {
    userInfo(val) {
      this.init(val.relationID);
    },
    showTeamTransfer(val) {
      if (!val) this.init(this.userInfo.relationID);
    },
    forbiddenWords(val) {
      console.log(val);
      const key = +val.TalkState === 1 ? 2 : 3;
      this.operateConfirm({ key, ...val });
    },
  },
  data() {
    return {
      groupList: null,
      editTeam: {},
      teamTransferType: '',
      CurrentRoleType: 0,
    };
  },
  mounted() {
    if (this.userInfo) this.init(this.userInfo.relationID);
  },
  methods: {
    ...mapMutations(['SHOW_TEAM_TRANSFER', 'GROUP_LIST']),
    init(teamID) {
      IMTMUserList({
        usertoken: getCSToken(),
        teamID,
        date: new Date().getTime(),
      }).then((res) => {
        if (+res.result) {
          this.CurrentRoleType = res.data.CurrentRoleType;
          this.groupList = res.data.UserList;
          this.GROUP_LIST(res.data);
        } else {
          this.$message({
            message: res.message || '信息错误',
            type: 'warning',
          });
        }
      });
    },
    commandWords(item, key) {
      return { key, ...item };
    },
    forbiddenWordsFun(userID, mute) {
      IMTalkState({
        usertoken: getCSToken(),
        teamID: this.userInfo.relationID,
        userID,
        mute,
      }).then((res) => {
        if (+res.result === 1) {
          this.$message({
            message: res.message || '操作成功',
            type: 'success',
          });
          this.init(this.userInfo.relationID);
        } else {
          this.$message({
            message: res.message || '信息错误',
            type: 'warning',
          });
        }
      });
    },
    operateConfirm(item) {
      const strArr = ['提拔', '降级', '解禁', '禁言', '踢出'];
      const numArr = [0, 1, 0, 1, 0];
      const funArr = ['promotion', 'promotion', 'forbiddenWordsFun', 'forbiddenWordsFun', 'kictOut'];
      const key = item.key;
      this.$confirm(`确认${strArr[key]}${item.UserName}吗？`, '操作提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
        closeOnClickModal: false,
        showClose: false,
      }).then(() => {
        this[funArr[key]](item.UserID, numArr[key]);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: `已取消${strArr[key]}${item.UserName}`,
        });
      });
    },
    // 显示弹窗
    onShowTeamTransfer(val) {
      console.log(val);
      this.editTeam = this.teamObj();
      this.SHOW_TEAM_TRANSFER(val);
      this.teamTransferType = 'edit';
      this.init(this.userInfo.relationID);
    },
    teamObj() {
      return {
        TeamName: this.userInfo.relationName,
        TeamID: this.userInfo.relationID,
      };
    },
    promotion(userID, mute) {
      IMAddMage({
        usertoken: getCSToken(),
        teamID: this.userInfo.relationID,
        userID,
        mute,
      }).then((res) => {
        if (+res.result) {
          this.$message({
            message: res.message || '操作成功',
            type: 'success',
          });
          this.init(this.userInfo.relationID);
        } else {
          this.$message({
            message: res.message || '信息错误',
            type: 'warning',
          });
        }
      });
    },
    kictOut(userID) {
      IMTMKict({
        usertoken: getCSToken(),
        teamID: this.userInfo.relationID,
        userID,
      }).then((res) => {
        if (+res.result) {
          this.$message({
            message: res.message || '操作成功',
            type: 'success',
          });
          this.init(this.userInfo.relationID);
        } else {
          this.$message({
            message: res.message || '信息错误',
            type: 'warning',
          });
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import '../styles/base.scss';
.group-info {
  width: 260px;
  height: 100%;
  overflow-y: auto;
  background-color: $bg-FFFFFF;
  text-align: center;
  font-size: 14px;
  color: $bg-2A4159;
  position: relative;
  text-align: left;
  &::before {
    content: "";
    width: 15px;
    height: 30px;
    background-image: url('../assets/icon/icon_zhiyin.png');
    @include position(absolute, 0, 25px);
  }
  .title {
    height: 80px;
    line-height: 80px;
    font-size: 24px;
    padding-left: 30px;
  }
  .info {
    padding-left: 30px;
    font-size: 14px;
    border-bottom: 1px solid $bg-E3E7E7;
    p {
      line-height: 1.6;
      padding-bottom: 20px;
      span {
        color: $bg-8997A5;
      }
    }
  }
  .group-list {
    height: calc(100% - 300px);
    overflow-y: auto;
    padding-top: 10px;
    .item-person {
      font-size: 14px;
      padding: 10px 15px;
      @include flexAic;
      &.between {
        justify-content: space-between;
      }
      .item-icon {
        width: 12px;
      }
      .item-img {
        padding: 0 10px;
        img {
          @include photoImg(30px);
        }
      }
      .persnName {
        // width: 80px; // 注销
        width: 115px;
        @include lineOne;
      }
      .caozuo {
        flex: 1;
        text-align: right;
        .el-dropdown {
          width: 100%;
          text-align: center;
          .el-dropdown-link {
            color: $bg-3D70F6;
          }
        }
        @include flexAic;
        & > div {
          cursor: pointer;
        }
      }
      .operation {
        flex: 1;
        color: $bg-3D70F6;
        text-align: right;
      }
    }
  }
}
</style>
