<template>
  <div>
    <div class="header">
      <div class="date-search">
        选择查询日期<DatePicker :options="options" v-model="selectDate" @on-change="dateChange" type="date" placeholder="Select date" style="width: 200px; margin-left: 10px"></DatePicker>
      </div>
      <div class="name-search">
        <span>名称查询</span>
        <Input :clearable="true" @on-focus="selectSelf" :maxlength=5 v-model="searchName" style="width: 200px; margin-left: 10px"/>
        <Button type="success" @click="getBrowseRecords({queryDate: selectDate, name: searchName})">查询</Button>
        <Button @click="downloadData({queryDate: selectDate, name: searchName})" style="margin-left: 10px" type="success">确认导出</Button>
        <Icon @click.native="showAddPerson" class="person-add" type="md-person-add" size="40"></Icon>
      </div>
    </div>
    <div class="content">
      <div class="person-list">
        <h2>已添加人员列表</h2>
        <Table highlight-row class="person-list" border :columns="columns1" :data="data1">
           <template slot-scope="{ row, index }" slot="action">
            <Button type="primary" size="small" style="margin-right: 5px" @click="set(row)">设置</Button>
            <Button type="error" size="small" @click="deleteLink(row.slId)">删除</Button>
            </template>
        </Table>
      </div>
    </div>
    <div class="add-person-bomb" v-show="addPerson" @click="hide">
      <div class="child">
        <Icon size=28 type="ios-close-circle" class="close-bomb" @click="addPerson=false"></Icon>
        <h2>添加销售人员</h2>
        <Input :maxlength=5 :minlength=1 @keyup.enter.native="setSalesLink" v-model="salesName" placeholder="输入添加人员名称" :disabled='updateBtnShow'/>
        <Select v-model="sectionId" placeholder="请选择部门">
            <Option v-for="item in groups" :value="item.id" :key="item.id">{{ item.teamName }}</Option>
        </Select>
        <Select v-model="ptid" placeholder="请选择组别">
            <Option v-for="item in groupItems" :value="item.id" :key="item.id">{{ item.teamName }}</Option>
        </Select>
        <Button @click="setSalesLink"  type="success" long v-show="!updateBtnShow">确认添加</Button>
         <Button @click="_setSalesTeamMap"  type="success" long v-show="updateBtnShow">确定修改</Button>
      </div>
    </div>
  </div>
</template>
<script>

import {
  browseRecords,
  GetSalesLinkRecord,
  SetSalesLinkRecord,
  deleteLink,
  getallsalesteam,
  setSalesTeamMap
} from '../api/index.js'

import {
  format
} from 'lib/date'

const nowDate = new Date();
export default {
  data() {
    return {
      addPerson: false,
      salesName: '', // 销售人员名称
      searchName: undefined,
      selectDate: nowDate,
      exportDate: undefined,
      updateBtnShow:false,
      sectionId:'',
      rowObj:{},
      slId:'',//用户id
      ptid:'',//组Id
      groups:[],//部门
      allData:[],
      groupItems:[],//组
      options: {
        disabledDate(date) {
          return date && date.valueOf() > Date.now();
        }
      },
      columns1: [
        {
          title: '人员名称',
          key: 'name'
        },
        {
          title: '链接地址',
          key: 'shortUrl'
        },
        {
          title: '直播间/人数',
          render: (h, {row}) => {
            return (
              <div>
                {
                  row.recordCounts.map((v) => {
                    return (
                      <div class="people-card">
                        {format(new Date(v.starTime), 'MM月dd日 hh:mm')}-{format(new Date(v.endTime), 'hh:mm')} / <span class="people-num" style="{color: 'red'}">{v.num}人</span>
                      </div>
                    )
                  })
                }
              </div> 
            )
          }
        },
        {
          title:'部门名',
          key:'departmentName'
        },
        {
          title:'组名',
          key:'groupName'
        },
        {
          title: '创建日期',
          key: 'createTime'
        },
        {
          title: "操作",
          slot: "action",
          width: 150,
          align: "center"
        }
        // {
        //   title: '操作',
        //   render: (h, {row}) => {
        //     return h('Poptip', {
        //       props: {
        //         confirm: true,
        //         title: `确认删除${row.name}?`,
        //         // 'on-ok': this.deleteLink.call(this, row.slId),
        //       },
        //       on: {
        //         ['on-ok']: () => {
        //           this.deleteLink(row.slId)
        //         }
        //       },
        //     },
        //     [
        //       h('Button', {
        //         props: {
        //           type: 'error'
        //         }
        //       }, '删除')
        //     ])
        //   }
        // }
      ],
      data1: []
    }
  },
  mounted () {
    this.getBrowseRecords({type: 'init'});
    this._getallsalesteam();
  },
  watch:{
    sectionId() {
      this.ptid = '';
      this.groupItems = this.allData.filter(item=>{
        return this.sectionId === item.ptid;
      })
    }
  },
  methods: {
   // 获得销售部门以及组
   set(row){
     this.rowObj = row;
     this.slId = row.slId;
     this.salesName = row.name;
     this.addPerson = true;
     this.updateBtnShow = true;
   },
   _setSalesTeamMap(){
     setSalesTeamMap({
       tid:this.ptid,
       sid:this.slId
     }).then(res=>{
       if(+res.code === 0){
          this.getBrowseRecords({type: 'init'});
          this.$Message.success('修改成功');
          this.addPerson = false;
          this.salesName = '';
          this.ptid = '';
          this.sectionId='';
       }
       console.log('设置成功')
     })
   },
    _getallsalesteam(tid){
      getallsalesteam().then(res=>{
          this.allData = res.data;
          this.groups = res.data.filter(item=>{
            return item.ptid == 0;
          })
          console.log(this.groups);
      })
    },
     /**
     * 获取销售报表
     */
    getBrowseRecords({queryDate='', name='', type=''}) {
      if (queryDate) queryDate = format(new Date(queryDate), 'yyyyMMdd');
      console.log(queryDate, name)
      GetSalesLinkRecord({
        queryDate,
        name
      }).then((res) => {
        if (res) {
          this.data1 = res;
          if (type !== 'init') {
            this.$Message.success('查询成功');
          }
        } else {
          this.$Message.error('查询失败');
        }
      })
    },
    /**
     * 展示添加销售弹框
     */
    showAddPerson() {
      console.log('add')
      this.addPerson = true;
      this.updateBtnShow = false;
    },
    // 设置销售链接
    setSalesLink() {
      if (!this.salesName) {
        this.$Message.error('请输入姓名');
        return;
      }
      if (!this.ptid) {
        this.$Message.error('请选择组别');
        return;
      }
      SetSalesLinkRecord({
        name: this.salesName,
        tid:this.ptid
      }).then((res) => {
        this.addPerson = false;
        if (+res.code === 0 && +res.result === 1) {
          this.$Message.success('添加成功');
          this.salesName = '';
          this.ptid = '';
          this.sectionId='';
          this.getBrowseRecords({type: 'init'});
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 隐藏添加销售弹出框
    hide(event) {
      if ((event.srcElement && event.srcElement.className === 'add-person-bomb')
      || (event.originalTarget && event.originalTarget.className === 'add-person-bomb')) {
        this.addPerson = false;
        this.salesName = '';
      }
    },
    // 删除销售链接
    deleteLink(slrId) {
      deleteLink({
        slrId
      }).then((res) => {
        if (+res.code === 0 && +res.result === 1) {
          this.$Message.success('删除成功');
          this.getBrowseRecords({type: 'init'});
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    dateChange(date) {
      console.log(this.selectDate)
    },
    selectSelf(e) {
      e.currentTarget.select();
    },
    changeExportDate(date) {
      console.log(date)
      this.exportDate = date;
    },
    downloadData({ queryDate = '', name = '' }) {
      if (queryDate) {
        queryDate = format(new Date(queryDate), 'yyyyMMdd')
      } else {
        queryDate = '';
      }
      if (!name) name = ''
      window.location.href = `https://live.inquant.cn/chatroom/livedata/ExportSalesLinkRecord?queryDate=${queryDate}&name=${name}`
    },
  }
}
</script>
<style lang="scss" scoped>
  .header {
    display: flex;
    align-items: center;
    .name-search {
      margin-left: 20px;
    }
    .person-add {
      vertical-align: middle;
      margin-left: 50px;
      cursor: pointer;
    }
  }
  .content {
    margin-top: 15px;

    .person-list {
      margin-top: 15px;
    }
  }

  .people-card {
    border: 1px solid red;
  }
  .add-person-bomb {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    width: 100%;
    height: 100%;
    background-color: rgba($color: #000000, $alpha: 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    .child {
      border-radius: 5px;
      padding: 0 30px 0 30px;
      padding-bottom: 20px;
      width: 400px;
      height: 200px;
      background-color: #fff;

      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      position: relative;

      .close-bomb {
        position: absolute;
        top: 10px;
        right: 10px;
        cursor: pointer;
      }
    }
  }
</style>


