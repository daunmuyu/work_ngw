<template>
  <div class="HomeManage">
    <div class="header">
      <div class="title">客户管理</div>
      <div class="headTab">
        <div class="grundTab">
          <div @click="toggleTopNav(0)" :class="{active: topNav === 0}">个人</div>
          <div class="right" @click="toggleTopNav(1)" :class="{active: topNav === 1}">群组</div>
        </div>
        <div class="selectAdd">
          <div class="select" v-show="topNav === 0">
            <span>移动到</span>
            <el-dropdown trigger="click" @command="changeUserGroup">
              <span class="el-dropdown-link">请选择<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item 
                  v-for="item in groupList"
                  :key="item.GroupID"
                  v-if="item.GroupID != -1"
                  :command="item.GroupID">{{item.GroupName}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div class="add" @click="addGroup">
            <img src="/static/image/manage/icon_tianjia.png" alt="">
            <span>{{topNav == 0 ? '添加分组' : '添加群'}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="mangeMain">
      <manage-person v-show="topNav === 0"></manage-person>
      <manage-team v-show="topNav === 1" :type="type"></manage-team>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import { IMGroupAdd } from '@/service/group.js';
import ManagePerson from '@/components/Manage/Person';
import ManageTeam from '@/components/Manage/Team';

export default {
  name: 'HomeManage',
  components: {
    ManagePerson,
    ManageTeam,
  },
  computed: {
    ...mapGetters(['showTeamTransfer']),
    ...mapGetters('manage', [
      'groupList',
    ]),
  },
  watch: {
    showTeamTransfer(v) {
      if (!v) this.type = '';
    },
  },
  data() {
    return {
      // 个人/群组
      topNav: 0,
      type: '',
    };
  },
  methods: {
    ...mapActions('manage', [
      'fetchGroupList',
      'fetchTeamList',
    ]),
    ...mapMutations(['SHOW_TEAM_TRANSFER']),
    // 个人/群组切换
    toggleTopNav(num) {
      this.topNav = num;
      if (num) {
        this.fetchTeamList();
      }
    },
    // 个人/群组 添加分组
    addGroup() {
      if (this.topNav === 0) {
        this.$prompt('请输入组名称', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          IMGroupAdd({ name: value }).then((res) => {
            this.message(res, '添加', '', 'add');
          });
        });
      } else {
        this.SHOW_TEAM_TRANSFER(true);
        this.type = 'add';
      }
    },
    // 移动分组
    changeUserGroup(groupID) {
      this.$bus.$emit('changeUserGroup', groupID);
    },
    message(res, action, method, operate) {
      if (res.code === '0') {
        this.$message({
          type: 'success',
          message: `${action}成功`,
        });
        this[method || 'fetchGroupList'](operate);
      } else {
        this.$message.error(`${action}失败`);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import '../../styles/base.scss';
.HomeManage {
  color: $bg-2A4159;
  display: flex;
  flex-direction: column;
  background-color: $bg-F2F7F7;
  width: 860px;
  font-size: 14px;
  .header {
    height: 160px;
    .title {
      height: 80px;
      border-bottom: 1px solid $bg-E3E7E7;
      text-align: left;
      font-size: 24px;
      padding-left: 15px;
      line-height: 80px;
      font-weight: 400;
    }
    .headTab {
      @include flexBox;
      height: 80px;
      padding: 0 15px;
      .grundTab {
        display: flex;
        & > div {
          width: 80px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          border: 1px solid $bg-3D70F6;
          transition: .3s;
          cursor: pointer;
          &.active {
            color: $bg-FFFFFF;
            background-color: $bg-3D70F6;
          }
        }
      }
      .selectAdd {
        @include flexAic;
        .select {
          padding-right: 10px;
          height: 50px;
          line-height: 50px;
          position: relative;
          &::after{
            content: "";
            position: absolute;
            right: 0;
            width: 1px;
            height: 100%;
            background-color: $bg-E3E7E7;
          }
          & > .el-dropdown {
            cursor: pointer;
          }
        }
        .add {
          @include flexAic;
          padding-left: 15px;
          cursor: pointer;
          span {
            padding-left: 10px;
          }
        }
      }
    }
  }
  .mangeMain {
    width: 100%;
    height: calc(100% -160px);
    overflow-y: auto;
  }
}
</style>
