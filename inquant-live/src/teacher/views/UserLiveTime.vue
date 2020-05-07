<template>
  <div class="pdf-upload">
    <Row>
      <Col span="5">
        <DatePicker type="date" placeholder="选择日期"  :value="date" style="width: 200px" @on-change="change"></DatePicker>
      </Col>
      <Col span="4">
           <Input v-model="searchObj.salesName" placeholder="输入销售人员名称 " style="width: 150px" />
      </Col>
      <Col span="5">
            <Select v-model="tid" style="width:200px" clearable placeholder="请选择组别">
              <OptionGroup :label="items.teamName" v-for="items in groups" :key="items.index">
                  <Option v-for="item in items.children" :value="item.ptid" :key="item.index">{{ item.teamName }}</Option>
              </OptionGroup>
          </Select>
      </Col>
      <Col span="2">
        <Button @click="fetch()" type="success">查询</Button>
      </Col>
        <Col span="2">
        <Button @click="output" type="success">确定导出</Button>
      </Col>
      <!-- <Col span="12">col-12</Col> -->
    </Row>
    <!-- <Modal v-model="modal1" title="添加PDF" @on-ok="ok" @on-cancel="cancel">
      <Form ref="formCustom" :model="formCustom" :label-width="80">
        <FormItem label="PDF名称" prop="Title">
          <Input type="url" v-model="formCustom.Title"></Input>
        </FormItem>
        <FormItem label="成功路径" prop="PdfUrl">
          <Input type="url" v-model="formCustom.PdfUrl" disabled></Input>
        </FormItem>
        <input id="File1" type="file" @change="tirggerFile($event)">
      </Form>
    </Modal>-->

    <Table border :columns="columns" :data="userliveList">
      <template slot-scope="{ row }" slot="userName">
        <strong>{{ row.userName }}</strong>
      </template>
      <!-- <template slot-scope="{ row, index }" slot="action">
        <Button type="error" size="small" @click="remove(row)">删除</Button>
      </template>-->
    </Table>
    <Page :total="total" show-elevator @on-change="pageChange" :page-size="pageSize" />
  </div>
</template> 
<script>
import axios from "axios";
import { getallsalesteam, QueryOnlineInfo, ExportQueryOnlineInfo } from "../api/index.js";
import { parseTime } from '../../lib/date'

const nowDate = parseTime(new Date().getTime(),'{y}-{m}-{d}')
export default {
  data() {
    return {
      userliveList: [],
      modal1: false,
      page: 1,  
      tid:'',
      pageSize: 20,
      total:20,
      groups:[],
      allData:[],
      pageIndex:1,
      date:new Date(),
      searchObj: {
        date: "",
        salesName: "",
        groups: "",
      },
      cityList: [],
      columns: [
        {
          title: "名字",
          slot: "userName"
        },
        {
          title: "来源",
          key: "source"
        },
        {
          title: "销售名",
          key: "salesName"
        },
        {
          title:"停留时间",
          key:'timeLength'
        },
        {
          title: "开始时间",
          key: "startTime"
        },
        {
          title: "结束时间",
          key: "endTime"
        }
        // {
        //   title: "操作",
        //   slot: "action",
        //   width: 150,
        //   align: "center"
        // }
      ]
    };
  },
  mounted() {
    this.searchObj.date = nowDate;
    this.fetch();
    this._getallsalesteam();
  },
  methods: {
    _getallsalesteam(){
       getallsalesteam().then(res=>{
          this.allData = res.data;
          this.groups = res.data.filter(item=>{
            if(item.ptid == 0){
              item.children = [];
            }
            return item.ptid == 0;
          }) 
          for(var i = 0;i<this.groups.length;i++){
                this.allData.forEach(item => {
                  if(item.ptid === this.groups[i].id){
                    this.groups[i].children.push(item);
                  }
              })
            }
          });
    },
    pageChange(index){
      console.log(index)
      this.pageIndex = index;
      this.fetch();
    },
    fetch() {
      QueryOnlineInfo({
        queryDate: this.searchObj.date,
        tid: this.tid,
        name:this.searchObj.salesName,
        pageindex:this.pageIndex,
        pagesize:this.pageSize
      }).then(res => {
        this.userliveList = res.data;
        this.total = res.total;
        this.userliveList.forEach(item=>{
          if(item.source==1){
            item.source = 'app'
          }else if(item.source==2){
            item.source = 'PC'
          }else if(item.source==3){
            item.source = '官网'
          }else if(item.source == 4){
            item.source = '微信'
          }
        })
      });
    },
    change(date) {
      this.searchObj.date = date;
      console.log(date);
    },
    cancel() {},
    output(){
       window.location.href = `https://live.inquant.cn/chatroom/LiveData/ExportQueryOnlineInfo?queryDate=${this.searchObj.date}&tid=${this.tid}&name=${this.searchObj.salesName}`
    },
    // export2Excel() {
    //   var that = this;
    //   require.ensure([], () => {
    //     const { export_json_to_excel } = require("../excel/expor2Excal.js"); //这里必须使用绝对路径
    //     const tHeader = ["用户名", "来源", "销售员", "开始时间", "结束时间"]; //  导出的表头名
    //     const filterVal = [
    //       "userName",
    //       "source",
    //       "salesName",
    //       "startTime",
    //       "endTime"
    //     ]; // 导出的表头字段名
    //     const list = that.userliveList;
    //     const data = that.formatJson(filterVal, list);
    //     export_json_to_excel(tHeader, data, `${new Date().getTime()}直播时长表`); // 导出的表格名称，根据需要自己命名
    //   });
    // },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    }
  }
};
</script>
<style lang="scss">
.ivu-page{
  margin-top: 20px !important;
}
</style>

<style lang="scss" scoped>
.ivu-btn {
  margin-bottom: 10px;
}
</style>
