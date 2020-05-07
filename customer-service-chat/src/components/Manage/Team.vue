<template>
<div class="teamTable">
  <div class="tthd ttitem noselect">
    <div class="ttd5 fontGy">群名称</div>
    <div class="ttd4 fontGy">最近聊天</div>
    <div class="ttd3 fontGy">群成员</div>
    <div class="ttd3 fontGy">身份</div>
    <div class="ttd5 fontGy">操作</div>
  </div>
  <div class="cont ttitem" v-for="team in teamList" :key="team.TeamID">
    <div class="ttd5">
      <img class="phImg" :src="team.TeamLogoUrl" alt="">
      <p>{{team.TeamName}}</p>
    </div>
    <div class="ttd4">{{team.LastMsgTime}}</div>
    <div class="ttd3">{{team.Count}}/{{gCount}}</div>
    <div class="ttd3">{{roles[team.RoleID]}}</div>
    <div class="ttd5">
      <el-button @click="chatMsg(team)" type="primary" round>聊天</el-button>
      <el-button v-if="team.RoleID > 0" @click="onShowTeamTransfer(true, 'edit', team)" type="primary" round>成员管理</el-button>
      <el-button v-if="team.RoleID == 2" @click="removeTeam(team.TeamID)" type="danger" round>解散</el-button>
    </div>
  </div>
  <team-transfer :type="teamTransferType" :edit-team="editTeam" v-if="showTeamTransfer"></team-transfer>
</div>
</template>
<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import { IMTMRemove, IMTmCt } from '@/service/group.js';
import { getIMGcount } from '@/store/authToken';
import TeamTransfer from '@/components/Manage/TeamTransfer';

export default {
  props: ['type'],
  watch: {
    type(v) {
      if (v) this.teamTransferType = 'add';
    },
  },
  mounted() {
    this.fetchTeamList();
  },
  components: {
    TeamTransfer,
  },
  computed: {
    ...mapGetters(['showTeamTransfer']),
    ...mapGetters('manage', [
      'teamList',
    ]),
  },
  data() {
    return {
      editTeam: {},
      teamTransferType: '',
      roles: ['群成员', '管理员', '群主'],
      gCount: getIMGcount(),
    };
  },
  methods: {
    ...mapActions('manage', ['fetchTeamList', 'fetchGroupList']),
    ...mapMutations(['USER_INFO', 'KEHU_SHOW', 'SHOW_TEAM_TRANSFER']),
    chatMsg(item) {
      const users = {
        messageType: '2',
        relationID: item.TID,
        relationLogoUrl: item.TeamLogoUrl,
        relationName: item.TeamName,
      };
      this.USER_INFO(users);
      this.KEHU_SHOW(false);
    },
    // 删除分组
    removeTeam(TeamID) {
      this.$confirm('此操作将永久删除该分组, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        IMTMRemove({ TeamID }).then((res) => {
          if (res.code === '0') {
            this.$message({
              type: 'success',
              message: '解散成功',
            });
            this.fetchTeamList();
          } else {
            this.$message.error('解散失败');
          }
        });
      });
    },
    // 添加分组
    addTeam(value) {
      IMTmCt({ teamName: value, userIDs: 1 }).then((res) => {
        this.message(res, '添加', 'fetchTeamList');
      });
    },
    // 显示弹窗
    onShowTeamTransfer(val, type, team) {
      this.editTeam = team;
      this.SHOW_TEAM_TRANSFER(val);
      this.teamTransferType = type || 'add';
    },
  },
};
</script>
<style lang="scss" scoped>
@import '../../styles/base.scss';
// 群组table
.teamTable {
  .ttitem {
    @include flexAic;
    padding: 0 15px;
    >div {
      text-align: left;
    }
    .ttd5 {
      width: 220px;
    }
    .ttd4 {
      width: 160px;
    }
    .ttd3 {
      width: 100px;
    }
  }
  .cont {
    height: 52px;
    .ttd3 {
      @include flexAic;
      p {
        width: calc(100% -20px);
        @include lineOne;
      }
    }
    .ttd5 {
      @include flexAic;
      .phImg {
        @include photoImg(30px);
        margin: 0 10px;
      }
      p {
        width: 150px;
        @include lineOne;
      }
    }
  }
}
</style>
