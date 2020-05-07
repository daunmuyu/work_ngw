<template>
  <div>
      <Table @on-select-all="selectAll" @on-selection-change="selectList" disabled-hover border ref="selection" :columns="columns4" :data="data1"></Table>
      <Row class="select-button">
        <Col span="6">
          <Checkbox v-model="isAll" @on-change="handleSelectAll">是否统一发言</Checkbox>
        </Col>
        
        <Col span="6">
          <Input v-model="allSpeak" placeholder="请输入发言内容" sylte="width: 50%"/>
        </Col>
        <Col span="6" offset="1">
          <Select v-model="intervalTime" style="width:200px">
            <Option v-for="item in timeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Col>
        <Col span="3">
          <Button :loading="loading" type="success" @click="submitToSpeak" long>确认发言</Button>
        </Col>
    </Row>
  </div>
</template>

<script>

import { speak, unifidespeak } from '../api/index';

  export default {
    data() {
      return {
        loading: false,
        columns4: [
          {
            type: 'selection',
            width: 60,
            align: 'center',
          },
          {
            title: '马甲列表',
            key: 'name',
            render: (h, { row } ) => {
              return h('Input',{
                props: {
                  value: row.name,
                  placeholder: '请输入昵称....'
                },
                on: {
                  'on-blur': (event) => {
                    this.allData[row.id].name  = event.target.value
                    // this.id = event
                  }
                }
              })
            }
          },
          {
            title: '发言内容编辑',
            key: 'age',
            render: (h, { row } ) => {
              return h('Input', {
                props: {
                  value: row.content,
                  placeholder: '请输入发言内容....'
                },
                on: {
                  'on-blur': (event) => {
                    this.allData[row.id].content  = event.target.value
                  }
                }
              })
            }
          },
          {
            title: '操作',
            key: 'address',
            render:  (h, { row }) => {
              return h('div', [
                h('Checkbox', {
                  props: {
                    value: row.isSign
                  },
                  on: {
                    'on-change': (event) => {
                      if (event) {
                        this.allData[row.id].isSign = true;
                      } else {
                        this.allData[row.id].isSign = false;
                      }
                    }
                  }
                }, '特殊标记'),
                h('Checkbox', {
                  props: {
                    value: row.roleType
                  },
                  on: {
                    'on-change': (event) => {
                      if(event) {
                        this.allData[row.id].roleType = true;
                      } else {
                        this.allData[row.id].roleType = false;
                      }
                    }
                  }
                },'助理角色')
              ])
            }
          }
        ],
        data1: [],
        allData: [],
        submitData: [],
        intervalTime: 0,
        isAll: false,
        allSpeak: undefined,
        timeList: [
          {
            value: 0,
            label: '请选择间隔时间'
          },
          {
            value: 1,
            label: '1分钟'
          },
          {
            value: 2,
            label: '2分钟'
          },
          {
            value: 3,
            label: '3分钟'
          },
          {
            value: 4,
            label: '4分钟'
          },
          {
            value: 5,
            label: '5分钟'
          },
          {
            value: 6,
            label: '6分钟'
          }
        ]
      }
    },
    mounted () {
      this.initList();
    },
    methods: {
      initList() {
        for (let m = 0, length = 10; m < length; m ++) {
          this.data1.push({
            id: m,
            name: '',
            content: '',
            roleType: false,
            isSign: false,
            isSelect: false,
            // _checked: false
          })
          this.allData.push({
            id: m,
            name: '',
            content: '',
            roleType: false,
            isSign: false,
            isSelect: false,
          })
        }
      },
      selectList(data, i) {
        this.allData.forEach((v, i) => {
          v.isSelect = false;
        })
        data.forEach((v, i) => {
          this.allData[v.id].isSelect = true;
        })
      },
      handleSelectAll (status) {
        if (status) {
          this.$refs.selection.selectAll(status);
        }
      },
      selectAll(data) {
        // this.allData = data;
      },
      SubmitUnifidespeak (req) {
        this.loading = true;
        unifidespeak({
            users: JSON.stringify(req),
            livetoken: this.$root.livetoken,
            intervalTime: this.intervalTime,
            roomId: this.$root.roomid | this.$route.params.roomid,
            content: this.allSpeak
          }).then((res) => {
            this.loading = false;
            if (+res.code === 0) {
            this.$Message.success('发送成功~');
            this.data1 = this.allData.reduce((arr, item) => {
                arr.push({
                  ...item,
                  content: ''
                })
                return arr;
              }, [])
            this.allSpeak = '';
            this.isAll = false;
            } else {
              this.$Message.error(res.msg);
            }
          })
      },
      submitSpeak() {
        this.loading = true;
        speak({
          livetoken: this.$root.livetoken,
          SpeakContents: JSON.stringify(this.submitData),
          intervalTime: this.intervalTime,
          roomId: this.$root.roomid | this.$route.params.roomid
        }).then((res) => {
          this.loading = false;
          if (+res.code === 0) {
            this.$Message.success('发送成功~');
            this.data1 = this.allData.reduce((arr, item) => {
              arr.push({
                ...item,
                content: ''
              })
              return arr;
            }, [])
          } else {
            this.$Message.error(res.msg);
          }
        })
      },
      submitToSpeak() {
        // console.log(this.$root.livetoken)
        this.submitData = this.allData
                          .filter(v => v.isSelect === true)
                          .reduce((arr, item) => {
                            arr.push({
                              name: this.allData[item.id].name || `游客-${Math.floor(Math.random() * 10000)}`,
                              roleId: this.allData[item.id].roleType ? 2 : 1,
                              flag: this.allData[item.id].isSign ? 1 : 0, // 是否特殊标注
                              content: this.allData[item.id].content,
                            });
                            return arr;
                          }, [])
        if (!this.$root.roomid && !this.$route.params.roomid) {
          this.$Message.info('请到直播界面选择直播间后继续操作~');
          return;
        }
        if (this.submitData.length === 0) {
          this.$Message.info('请确认至少选择一个马甲~');
          return;
        }
        for (let m = 0, length = this.submitData.length; m < length; m++) {
          if ((!this.submitData[m].content || !this.submitData[m].name) && !this.isAll) {
            this.$Message.info('请确认选中项的发言内容不为空');
            return;
          }
        }
        if (this.isAll) { // 是否全部发言逻辑
          if (!this.allSpeak) {
            this.$Message.info('请输入发言内容~');
            return;
          }
          const content = this.submitData.reduce((arr, item) => {
            const temItem = Object.keys(item)
                            .filter(key => key !== 'content')
                            .map((key, value) => ({ [key]: item[key] }))
                            .reduce((result, current) => ({ ...result, ...current}), {})
            arr.push({
              ...temItem,
            })
            return arr;
          }, []);

          this.SubmitUnifidespeak(content);
          return;
        }
        this.submitSpeak();
      }
    }
  }
</script>

<style scope>
  .select-button {
    margin-top: 20px;
  }
</style>
  