<template lang="html">
	<div class="top clearfix">
    <Modal title="禁言名单管理" v-model="blackShow" :mask-closable="false">
      <div class="blacklist-content">
        <div class="table">
          <Table height="200" :columns="laheiColumns" :data="jinyanList"></Table>
        </div>
      </div>
		</Modal>
    <label class="room-label">您的直播间列表:</label>
     <Select v-model="curRoomId" style="width:200px" @on-change="roomSelect">
        <Option v-for="(item, index) in roomList" :value="+item.roomId" :key="index">{{ item.roomName }}</Option>
    </Select>
    <div class="black-manage" @click="blackManageClick">禁言列表</div>
    <div class="black-manage" @click="toStrategy">策略</div>
    <div class="black-manage" @click="toSpeak">管理</div>
    <div class="logout">
      <span class="userinfo">{{userName}}</span>
      <Button type="primary" class="btn-logout" @click="doLogout">退出</Button>
    </div>
	</div>
</template>

<script>

export default {
  props: {
    roomList: {
      required: true,
      type: Array,
    },
    jinyanList: {
      default: [],
      type: Array,
    },
    userName: {
      required: true,
      type: String,
    },
    curRoom: {
      required: true,
    }
  },
  data() {
    return {
      blackShow: false,
      curRoomId: undefined,
      laheiColumns: [
        {
          title: '用户名称',
          key: 'UserName'
        },
        {
          title: '用户id',
          key: 'id'
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          render: (h, { row }) => {
            return h('Button', {
              props: {
                type: 'primary',
                size: 'small',
              },
              on: {
                click: () => {
                  this.cancelJY(row.id);
                }
              }
            }, '解除')
          }
        }
      ],
      // strategyUrl: '//h5.inquant.cn/future/background/tradeBack/index.html',
    }
  },
  watch: {
    curRoom(nv) {
      this.curRoomId = +nv.roomId // 为了默认选中路由上面的直播间
    }
  },
  methods: {
    toStrategy() {
      this.$emit('toStrategy');
      // window.location.href = `${this.strategyUrl}?roomid=${this.$root.roomid}&usertoken=${this.userToken}&strname=${this.strname}&strnumber=${this.strnumber}`;
    },
    toSpeak() {
      this.$emit('toSpeak');
    },
    handlerClick(index) {
      this.handleIndex = index;
    },
    cancelJY(target) {
      this.$emit('cancelJY', target);
    },
    blackManageClick() {
      this.blackShow = true;
    },
    roomSelect(index) {
      console.log(this.curRoomId);
      this.$emit('roomSelected', this.roomList.find((v) => +v.roomId === +this.curRoomId));
    },
    doLogout() {
      this.$emit('logout');
    },
  }
}
</script>

<style lang="scss">
.blacklist-content {
  .handler {
    margin-bottom: 10px;
    .btn {
      display: inline-block;
      width: 76px;
      height: 22px;
      line-height: 22px;
      text-align: center;
      border-radius: 2px;
      color: #fff;
      background: rgb(88, 88, 92);
    }
    .active {
      color: rgb(154, 97, 15);
      background: rgb(255, 198, 0);
    }
  }
}

.top {
  position: relative;
  width: 100%;
  padding-bottom: 10px;
  border-bottom: 1px solid rgb( 239, 245, 247);
  .black-manage {
    display: inline-block;
    width: 120px;
    height: 33px;
    line-height: 33px;
    background-color: #ff7700;
    color: #fff;
    margin: 0 7px;
    text-align: center;
    font-size: 14px;
    border-radius: 4px;
    box-shadow: 0 2px 7px rgba(0, 0, 0, .18);
    cursor: pointer;
  }


  .logout {
    float: right;
    .userinfo {
      color: #fff;
      margin-right: 10px;
    }
  }
  .room-label {
    font-size: 14px;
    color: #fff;
    margin: 0 10px;
  }
}
</style>
