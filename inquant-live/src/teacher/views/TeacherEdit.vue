<template>
  <div class="edit-container">
    <Icon class="person-add" type="md-person-add" size="40" @click.native="addPerson"></Icon>
    <Table :columns="columns1" :data="data1"></Table>
    <div class="edit-bomb" v-show="showEdit">
      <div class="bomb-container">
        <Icon @click.native="hideBomb" class="close-icon" type="ios-close-circle" size="25"></Icon>
        <h3>角色编辑<img :src="getRoleIcon(roleData.roleId)" alt=""></h3>
          <Form ref="formValidate" class="edit" :model="roleData" :rules="ruleValidate">
          <FormItem label="头像" :label-width="60">
              <div v-show="roleData.headImg" class="img-wrapper">
                <img :src="roleData.headImg" class="cover-img">
                <div class="video-cover">
                  <Icon type="ios-build-outline" @click.native="changeCover" size="40"></Icon>
                </div>
              </div>
              <div v-show="!roleData.headImg" class="no-img-wrapper">
                <input type="file" name="cover" ref="cover" id="cover" class="inputfile" @change="uploadImg" />
                <label for="cover">
                  <Icon type="ios-camera" size="30"></Icon>
                </label>
              </div>
            </FormItem>
            <FormItem label="角色" :label-width="60">
                 <RadioGroup v-model="roleData.roleId">
                    <Radio :disabled="roleData.roleDis" :label="2">
                        <span>助理</span>
                    </Radio>
                    <Radio :disabled="roleData.roleDis" :label="3">
                        <span>老师</span>
                    </Radio>
                </RadioGroup>
            </FormItem>
            <FormItem prop="name" label="姓名" :label-width="60">
              <Input v-model="roleData.name"  placeholder="请输入姓名"/>
            </FormItem>
            <FormItem label="介绍" prop="details" :label-width="60">
              <Input v-model="roleData.details" type="textarea" :autosize="{minRows: 2,maxRows: 10}" placeholder="请输入介绍"/>
            </FormItem>
            <FormItem label="" :label-width="60">
              <Button :loading="setRoleInfoLoading" type="primary" @click="setRoleInfo">确认并提交</Button>
            </FormItem>
        </Form>
      </div>
    </div>
  </div>
</template>
<script>
  import {
    setPersonnel,
    getRoomPersonnels,
    activate
  } from '../api/index';
  import t_helper from '../../images/t_helper.png';
  import teacher from '../../images/teacher.png';
  console.log(t_helper)

  export default {
    data() {
      return {
        textarea: undefined,
        roleType: 0,
        showEdit: false,
        setActiveLoading: false,
        setRoleInfoLoading: false,
        roleData: {
          roleId: undefined,
          details: '',
          name: '',
          headImg: ''
        },
        ruleValidate: {
          name: [
            { required: true, message: '请输入姓名~~', trigger: 'blur' }
          ],
          details: [
            { required: true, message: '介绍也要有~~', trigger: 'blur' }
          ],
        },
        columns1: [{
            title: '头像',
            key: 'headIcon',
            render: (h, {
              row
            }) => {
              return h('img', {
                style: {
                  width: '80px',
                  margin: '10px 0 10px 0'
                },
                domProps: {
                  src: row.headImg
                }
              })
            }
          },
          {
            title: '姓名',
            key: 'name'
          },
          {
            title: '角色类型',
            render: (h, { row }) => {
              return h('div', this.getRoleName(row.roleId))
            }
          },
          {
            title: '介绍',
            // key: 'details',
            render: (h, { row }) => {
              return h('div', this.limitContent(row.details, 30))
            }
          },
          
          {
            title: '操作',
            render: (h, {
              row
            }) => {
              console.log(this)
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary'
                  },
                  on: {
                    click: () => {
                      this.handleShowEdit(row.uid)
                    }
                  }
                }, '编辑'),
                h('Button', {
                  style: {
                    'margin-left': '10px'
                  },
                  on: {
                    click: () => {
                      this.setActivate(row.uid)
                    }
                  },
                  props: {
                    type: 'primary',
                    disabled: row.status === 1,
                    loading: this.setActiveLoading
                  }
                }, row.status === 1 ? '已默认' : '设置默认')
              ])
            }
          }
        ],
        data1: []
      }
    },
    mounted () {
      this.loadRoleInfo()
    },
    methods: {
      setRoleInfo() {
        this.$refs.formValidate.validate((valid) => {
            if (valid && this.roleData.headImg) {
                this.setRoleInfoLoading = true;
                setPersonnel({
                  ...this.roleData,
                  roomId: this.$route.params.roomid,
                }).then((res) => {
                  if (res.code === 0 && res.result === 1) {
                    this.$Message.success('设置成功')
                    this.loadRoleInfo();
                    this.showEdit = false;
                  } else {
                    this.$Message.error(res.msg)
                  }
                  this.setRoleInfoLoading = false;
                })
            } else {
                this.$Message.error('请输入内容和图片不为空~~');
                return;
            }
        })
      },
      loadRoleInfo() {
        getRoomPersonnels({
          roomid: this.$route.params.roomid
        }).then((res) => {
          // console.log(res)
          this.data1 = res.data
        })
      },
      setActivate(uid) {
        this.setActiveLoading = true;
        activate({
          roomid: this.$route.params.roomid,
          uid
        }).then((res) => {
          console.log(res)
          if (res.code === 0 && res.result === 1) {
            this.$Message.success('设置成功')
            this.loadRoleInfo();
          } else {
            this.$Message.error(res.msg)
          }
          this.setActiveLoading = false;
        })
      },
      uploadImg({target: {files} }) {
        const reader = new FileReader();
        reader.onload = () => {
          const data = reader.result;
          if (data.length > 0) {
            this.roleData = {
              ...this.roleData,
              headImg: data
            }
          }
        };
        reader.readAsDataURL(files[0]);
        return false;
      },
      addPerson() {
        this.roleData = {
          roleDis: false,
          roleId: 3
        };
        this.showEdit = true;
      },
      changeCover() {
        this.$refs.cover.click();
      },
      hideBomb() {
        this.showEdit = false;
      },
      handleShowEdit(type) {
        this.roleType = type;
        this.data1.map((v) => {
          if (v.uid === type) {
            this.roleData = {
              ...v,
              roleDis: true
            }
          } 
        })
        this.showEdit = true;
      },
      getRoleName(roleId) {
        switch (+roleId) {
          case 1:
            return '观众';
          case 2:
            return '助理';
          case 3:
            return '老师';
          case 4:
            return '高手'
          default:
            return '观众'
        }
      },
      limitContent(content, limitNum = 20) {
        return content.length > +limitNum ? `${content.substring(0, +limitNum)}......` : content;
      },
      getRoleIcon(roleId) {
        switch (+roleId) {
          case 1:
            return '';
          case 2:
            return t_helper;
          case 3:
            return teacher;
          case 4:
            return ''
          default:
            return ''
        }
      },
    }
  }
</script>
<style lang="scss" scoped>
.edit-container {
  position: relative;
  .person-add {
    position: absolute;
    right: 20px;
    top: 0;
    z-index: 1000;
  }
}

  .edit-bomb {
    width: 100%;
    height: 100%;
    background-color: rgba($color: #000000, $alpha: 0.5);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;

    .bomb-container {

      h3 {
        margin: 10px auto 23px 18px;

        img {
          // width: 30px;
          height: 20px;
          width: auto;
          vertical-align: sub;
          margin-left: 10px;
        }
      }
      position: relative;
      width: 500px;
      // height: 500px;
      background-color: #fff;
      border-radius: 5px;
      padding-right: 15px;

      .close-icon {
        cursor: pointer;
        position: absolute;
        right: 10px;
        top: 10px;
      }

      .img-wrapper {
        position: relative;
        display: inline-block;
        width: 100px;
        .cover-img {
          min-width: 50px;
          // min-height: 200px;
          width: 100%;
          cursor: pointer; // height: 60px;
          // border-radius: 50%;
          &+.video-cover {
            display: none;
            cursor: pointer;
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(0, 0, 0, .6);
            width: 100%;
            height: 100%;
            padding-top: 15%;
            letter-spacing: 10px; // width: 60px;
            text-align: center; // line-height: 60px;
            color: #fff;
            &:hover {
              display: block;
            }
          }
          &:hover+.video-cover {
            display: block;
          }
        }
      }
      .no-img-wrapper {
        width: 100px;
        height: 100px;

        .inputfile {
          width: 0.1px;
          height: 0.1px;
          opacity: 0;
          overflow: hidden;
          position: absolute;
          z-index: -1;
          &+label {
            background-color: #fff;
            display: inline-block;
            width: 100%;
            height: 100%;
            line-height: 100px;
            text-align: center;
            border: 1px dashed #d7dde4;
            // border-radius: 50%;
            cursor: pointer;
          }
          &+label:hover,
          &:focus+label {
            border: 1px dashed #5cadff;
          }
        }
      }
    }
  }
</style>

