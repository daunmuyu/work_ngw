<template>
  <Form ref="formValidate" :model="roomInfo" :rules="ruleValidate" class="edit">
    <FormItem label="banner图片配置" :label-width="120">
        <div v-show="roomInfo.banner" class="img-wrapper">
          <img :src="roomInfo.banner" class="cover-img">
          <div class="video-cover">
            <Icon type="compose" @click.native="changeCover" size="60"></Icon>
          </div>
        </div>
        <div v-show="!roomInfo.banner" class="no-img-wrapper">
          <input type="file" name="cover" ref="cover" id="cover" class="inputfile" @change="uploadImg" />
          <label for="cover">
            <Icon type="camera" size="60"></Icon>
          </label>
        </div>
      </FormItem>
      <FormItem label="系统通知" :label-width="120" prop='systemNotice'>
        <Input :maxlength="30" v-model="roomInfo.systemNotice"  placeholder="请输入30字以内" style="width: 400px"/>
      </FormItem>
      <FormItem label="风险提示" :label-width="120" prop='viewpoint'>
        <Input :maxlength="30" v-model="roomInfo.viewpoint"  placeholder="请输入30字以内" style="width: 400px"/>
      </FormItem>
      <FormItem label="今日思想" :label-width="120" prop='thinking'>
        <Input type="textarea" v-model="roomInfo.thinking"  placeholder="请输入今日思想" style="width: 400px"/>
      </FormItem>
      <FormItem label="" :label-width="120">
        <Button :loading="loading" @click="handleSetRoomInfo" type="primary">确认并提交</Button>
      </FormItem>
  </Form>
</template>
<script>
  import {
    setRoomInfo,
    getRoomInfo
  } from '../api/index'

  export default {
    data() {
      return {
        msg: '信息',
        loading: false,
        roomInfo: {
          banner: '', // banner图片
          systemNotice: '', // 系统通知
          thinking: '', // 今日思想
          viewpoint: '', // 观点（需求改为风险提示）
        },
        ruleValidate: {
          systemNotice: [
            { required: true, message: '请输入系统通知', trigger: 'blur' },
            { max: 30, message: '不能超过30个字', trigger: 'blur' }
          ],
          viewpoint: [
            { required: true, message: '请输入风险提示', trigger: 'blur' },
            { max: 30, message: '不能超过30个字', trigger: 'blur' }
          ],
          thinking: [
            { required: true, message: '请输入今日思想', trigger: 'blur' }
          ],
        },
      }
    },
    mounted () {
      // this.loadRoomInfo()
      this.handleGetRoomInfo()
    },
    methods: {
      handleGetRoomInfo() {
        getRoomInfo({
          roomId: this.$route.params.roomid
        }).then((res) => {
          this.roomInfo = res.data
        })
      },
      handleSetRoomInfo() {
        this.$refs.formValidate.validate((valid) => {
            if (valid && this.roomInfo.banner) {
                this.loading = true;
                setRoomInfo({
                  roomId: this.$route.params.roomid,
                  ...this.roomInfo
                }).then((res) => {
                  this.loading = false;
                  if (res.code === 0 && res.result === 1) {
                    this.$Message.success('设置成功')
                  } else {
                    this.$Message.error(res.msg)
                  }
                })
            } else {
                this.$Message.error('请确认banner图和所填内容都符合要求');
            }
        })
      },
      uploadImg({target: {files} }) {
        const reader = new FileReader();
        reader.onload = () => {
          const data = reader.result;
          if (data.length > 0) {
            this.roomInfo.banner = data;
          }
        };
        reader.readAsDataURL(files[0]);
        return false;
      },
      changeCover() {
        this.$refs.cover.click();
      },
    }
  }
</script>
<style lang="scss" scoped>
.edit {
  .img-wrapper {
    position: relative;
    display: inline-block;
    width: 400px;
    .cover-img {
      min-width: 100px;
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
    width: 400px;
    height: 225px;
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
        line-height: 225px;
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
</style>

