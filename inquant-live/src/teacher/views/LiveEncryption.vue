<template>
  <div>
    <!-- <div class="title">直播间加密</div> -->
    <div class="">设置团队以及密码</div>
    <div class="member-list">
      <Table disabled-hover border ref="selection" :columns="columns1" :data="data1"></Table>
      <Button icon="plus" class="add-row" type="success" @click="addRow">添加团队</Button>
    </div>
    <div class="set-time">
      <Col span="3">
        <p>设置时间开关</p>
      </Col>
       <Col span="12">
          <DatePicker format="yyyy年MM月dd日" @on-change="changeTime" v-model="selectDate" type="date" placeholder="选择加密日期" style="width: 200px"></DatePicker>
          <TimePicker @on-change="changeTime" v-model="selectTime" confirm type="timerange" placement="bottom-start" placeholder="选择需要加密的时间段" style="width: 168px"></TimePicker>
       </Col>
    </div>
    <Button @click="submitInfo" class="submit-info" type="info" size="large">确认全部提交</Button>
  </div>
</template>
<script>
import { format } from "lib/date.js";
import { setliveEncryptInfo, getliveEncryptInfo } from "../api";

export default {
  data() {
    return {
      msg: "直播间加密",
      selectDate: undefined,
      selectTime: undefined,
      // startDate: '2018-09-09',
      columns1: [
        {
          title: "添加团队",
          render: (h, { row, index }) => {
            // console.log(this);
            const _this = this;
            return h("Input", {
              props: {
                value: row.name,
                placeholder: "请输入团队名称"
              },
              on: {
                ["on-blur"](val) {
                  console.log(val);
                  _this.data1[index].name = val.target.value;
                }
              }
            });
          }
        },
        {
          title: "设置密码",
          // key: "password"
          render: (h, { row, index }) => {
            // console.log(this);
            const _this = this;
            return h("Input", {
              props: {
                value: row.passWord,
                placeholder: "请输入观看密码"
              },
              on: {
                ["on-blur"](val) {
                  console.log(val);
                  _this.data1[index].passWord = val.target.value;
                }
              }
            });
          }
        },
        {
          title: "用户人数",
          render(h, { row }) {
            return h("h4", row.useNum);
          }
        },
        {
          title: "操作",
          render: (h, { row, index }) => {
            const _this = this;
            return h(
              "Button",
              {
                props: {
                  type: "error"
                },
                nativeOn: {
                  click() {
                    console.log("删除");
                    _this.data1.splice(index, index + 1);
                  }
                }
              },
              "删除"
            );
          }
        }
      ],
      data1: []
    };
  },
  mounted() {
    this.handleGetliveEncryptInfo();
  },
  methods: {
    addRow() {
      for (let i = 0; i < this.data1.length; i += 1) {
        if (!this.data1[i].name || !this.data1[i].passWord) {
          this.$Message.error("请确保已添加信息不为空！");
          return;
        }
      }
      this.data1.push({
        useNum: 0
      });
    },
    handleGetliveEncryptInfo() {
      getliveEncryptInfo().then(res => {
        // console.log(res)
        if (+res.result === 1 && +res.code === 0) {
          this.data1 = res.data.users;
          const selectDate = res.data.info.startTime.split(" ");
          this.selectDate = selectDate[0];
          this.selectTime = [
            res.data.info.startTime.split(" ")[1],
            res.data.info.endTime.split(" ")[1]
          ];
        } else {
          this.$Message.error(res.msg || "数据错误，请刷新重试~");
        }
      });
    },
    submitInfo() {
      const dataLength = this.data1.length - 1;
      console.log(this.data1[dataLength]);
      if (!this.selectDate || !this.selectTime) {
        this.$Message.error("请选择加密时间~");
        return;
      }
      if (!this.data1[dataLength].name || !this.data1[dataLength].passWord) {
        // this.data1.pop();
        this.$Message.error("确认添加的信息不为空");
        return;
      }
      this.handleSetliveEncryptInfo();
    },
    changeTime() {
      console.log(this.selectDate, this.selectTime);
    },
    async handleSetliveEncryptInfo() {
      const res = await setliveEncryptInfo({
        info: {
            roomId: "10517689",
            startTime: `${format(new Date(this.selectDate), "yyyy-MM-dd")} ${
              this.selectTime[0]
            }`,
            endTime: `${format(new Date(this.selectDate), "yyyy-MM-dd")} ${
              this.selectTime[1]
            }`
          },
          users: this.data1
      });
      if (+res.result === 1 && +res.code === 0) {
        this.$Message.success("提交成功");
        this.handleGetliveEncryptInfo();
      } else {
        this.$Message.error(res.msg || "提交错误，请刷新重试~");
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.title {
  height: 50px;
  line-height: 50px;
  width: 100%;
  border-bottom: 1px solid gray;
}
.add-row {
  cursor: pointer;
  margin-left: 50%;
  margin-top: 20px;
  margin-bottom: 20px;
  transform: translateX(-50%);
}
.set-time {
  margin-bottom: 50px;
}
.submit-info {
  // margin-left: 50px;
}
</style>


