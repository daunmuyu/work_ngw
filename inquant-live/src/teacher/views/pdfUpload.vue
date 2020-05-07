<template>
  <div class="pdf-upload">
    <Row>
      <Col span="12">
        <Button @click="modal1=true">添加</Button>
      </Col>
      <!-- <Col span="12">col-12</Col> -->
    </Row>
    <Modal v-model="modal1" title="添加PDF" @on-ok="ok" @on-cancel="cancel">
      <Form ref="formCustom" :model="formCustom" :label-width="80">
        <FormItem label="PDF名称" prop="Title">
          <Input type="url" v-model="formCustom.Title"></Input>
        </FormItem>
        <FormItem label="成功路径" prop="PdfUrl">
          <Input type="url" v-model="formCustom.PdfUrl" disabled></Input>
        </FormItem>
        <input id="File1" type="file" @change="tirggerFile($event)">
      </Form>
    </Modal>

    <Table border :columns="columns" :data="learnList">
      <template slot-scope="{ row }" slot="title">
        <strong>{{ row.title }}</strong>
      </template>
      <template slot-scope="{ row, index }" slot="action">
        <Button type="error" size="small" @click="remove(row)">删除</Button>
      </template>
    </Table>
  </div>
</template>
<script>
import axios from "axios";
import { addLog, logList, deletelog } from "../api/index.js";
export default {
  data() {
    return {
      learnList: [],
      modal1: false,
      page: 1,
      pageSize: 20,
      formCustom: {
        Title: "",
        PdfUrl: "",
        RoomId: 0
      },
      columns: [
        {
          title: "名字",
          slot: "title"
        },
        {
          title: "PDF路径",
          key: "pdfUrl"
        },
        {
          title: "操作",
          slot: "action",
          width: 150,
          align: "center"
        }
      ]
    };
  },
  mounted() {
    this.fetch();
  },
  methods: {
    fetch() {
      logList({
        roomId: this.$route.params.roomid,
        pageIndex: this.page,
        pageSize: this.pageSize
      }).then(res => {
        this.learnList = res.data.logs;
      });
    },
    cancel() {},
    remove(item) {
      deletelog({
        id: item.id
      }).then(res => {
        this.$Message.success("删除成功");
        this.fetch();
      });
    },
    ok() {
      this.formCustom.RoomId = this.$route.params.roomid;
      addLog(this.formCustom).then(res => {
          this.fetch();
      });
    },
    tirggerFile(even) {
      var file = document.getElementById("File1").files[0];
      var formdata1 = new FormData(); // 创建form对象
      formdata1.append("img", file, file.name);
      let config = {
        headers: { "Content-Type": "multipart/form-data" }
      }; //添加请求头
      axios
        .post(
          "https://live.inquant.cn/chatroom/LearningLog/UpLoadFile",
          formdata1,
          config
        )
        .then(response => {
          this.$Message.success("上传pdf成功,请提交表单");
          this.formCustom.PdfUrl = response.data.data.url;
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.ivu-btn {
  margin-bottom: 10px;
}
</style>
