<template>
  <div class="personal" v-if="userData">
    <div class="persnImg"><img :src="userData.LogoUrl" alt=""></div>
    <div class="persnname">{{userData.UserName}}</div>
    <div class="persnId">ID: {{userData.UserID}}</div>
    <div class="persnId" style="padding-top: 0">
      <el-input v-model="userData.Remark" @blur="addUserRemark(userData.UserID, userData.Remark)" placeholder="添加备注"></el-input>
      <img src="../assets/icon/icon-beizhu.png" />
    </div>
    <div class="persnInfo">
      <p v-if="userData.RegisterTime">注册时间：{{userData.RegisterTime}}</p>
      <p v-if="userData.CourseName">课程名称：{{userData.CourseName}}</p>
      <p v-if="userData.EndTime">课程到期：{{userData.EndTime}}</p>
      <p v-if=" userData.GroupList">当前组别：
        <el-select v-model="belgroup" placeholder="请选择" @change="groupManage">
        <el-option
          v-for="item in userData.GroupList"
          :key="item.value"
          :label="item.GroupName"
          :value="item.GroupID">
        </el-option>
      </el-select>
      </p>
    </div>
    <div class="persnTel" v-if="sipTel && userData.Mobile">
      <button @click="callPhone"><img src="../assets/icon/icon-phone.png">拨打电话</button>
    </div>
    <div class="callRecord" v-if="callRecord && callRecord.length">
      最近通话：{{callRecord[0].starttime}} <span @click="dialogTableVisible = true">记录</span>
    </div>
    <el-dialog class="call-record-dialog" :modal="false" title="通话记录" :visible.sync="dialogTableVisible">
      <el-table :data="callRecord">
        <el-table-column property="starttime" width="180"></el-table-column>
        <el-table-column property="type" width="70"></el-table-column>
        <el-table-column property="state"></el-table-column>
      </el-table>
    </el-dialog> 
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex';
import { getCSToken } from '@/store/authToken.js';
import { IMUserInfo, IMGroupChange, IMGroupRemark, IMCallRecord } from '@/service/api.js';

export default {
  name: 'Personal',
  data() {
    return {
      userData: null,
      belgroup: '',
      sipObj: null,
      dialogTableVisible: false,
      callRecord: null,
    };
  },
  computed: {
    ...mapGetters(['userInfo', 'sipTel']),
  },
  watch: {
    userInfo(val) {
      this.init(val.relationID);
    },
  },
  methods: {
    ...mapMutations(['USER_INFO']),
    init(userID) {
      IMUserInfo({
        usertoken: getCSToken(),
        userID,
      }).then((res) => {
        if (+res.result) {
          this.userData = res.data;
          this.userData.GroupList.forEach((v) => {
            if (+v.BelongGroupID) this.belgroup = v.GroupID;
          });
        } else {
          this.$message({
            message: res.message || '信息错误',
            type: 'warning',
          });
        }
      });
      this.getCallRecord();
    },
    // 获取通话记录
    getCallRecord() {
      IMCallRecord({
        usertoken: getCSToken(),
        userID: this.userInfo.relationID,
      }).then((res) => {
        if (+res.result === 1) {
          this.callRecord = res.data;
        }
      });
    },
    // 添加备注
    addUserRemark(userID, remark) {
      IMGroupRemark({
        usertoken: getCSToken(),
        userID,
        remark,
      }).then((res) => {
        if (res.code === '0') {
          const info = this.userInfo;
          info.relationName = remark;
          this.USER_INFO(info);
          this.$message.success(res.message);
        } else {
          this.$message.error(res.message || '修改失败');
        }
      });
    },
    groupManage() {
      IMGroupChange({
        userIDs: this.userData.UserID,
        groupID: this.belgroup,
        usertoken: getCSToken(),
      }).then((res) => {
        if (+res.result) {
          this.$message({
            message: res.message,
            type: 'success',
          });
        } else {
          this.$message({
            message: res.message || '信息错误',
            type: 'warning',
          });
        }
      });
    },
    callPhone() {
      const telNum = window.atob(this.userData.Mobile);
      console.log(this.userData.Mobile, this.sipTel, telNum);
      this.sipTel.call(telNum);
    },
  },
  mounted() {
    if (this.userInfo) this.init(this.userInfo.relationID);
  },
};
</script>
<style lang="scss" scoped>
@import '../styles/base.scss';
.personal {
  width: 260px;
  height: 100%;
  overflow-y: auto;
  background-color: $bg-FFFFFF;
  text-align: center;
  font-size: 18px;
  color: $bg-8997A5;
  position: relative;
  &::before {
    content: "";
    width: 15px;
    height: 30px;
    background-image: url('../assets/icon/icon_zhiyin.png');
    @include position(absolute, 0, 25px);
  }
  .callRecord {
    margin-top: 15px;
    font-size: 14px;
    line-height: 1.6;
    span {
      color: $bg-3D70F6;
      cursor: pointer;
      background-image: url('../assets/icon/jilu_more.png');
      background-size: 5px 8px;
      background-repeat: no-repeat;
      background-position: right center;
      padding-right: 10px;
    }
  }
  .persnImg {
    padding: 45px;
    img {
      margin: 0 auto;
      @include photoImg(150px);
    }
  }
  .persnname {
    font-size: 24px;
    color: $bg-2A4159;
  }
  .persnId {
    padding: 20px;
  }
  .persnInfo {
    text-align: left;
    width: 200px;
    margin: 0 auto;
    border-top: 1px solid $bg-E3E7E7;
    p {
      line-height: 1.6;
      padding: 10px 0;
    }
  }
  .persnTel {
    padding-top: 10px;
    button {
      background-color: $bg-2A4159;
      height: 40px;
      width: 200px;
      margin: 0 auto;
      border-radius: 20px;
      color: $bg-FFFFFF;
      font-size: 14px;
      outline: none;
      cursor: pointer;
      img {
        position: relative;
        top: 2px;
        right: 10px;
      }
    }
  }
}
</style>
