<template lang="html">
	<div class="container">
		<Top/>
    <div class="main">
      <Left/>
      <VideoMain/>
      <Chat/>
    </div>
    <Foot/>
    <Teacher/>
    <Login/>
    <Class/>
    <Schedule/>
    <div v-show="userStatus" class="box" @click.self="">
      <div class="content">
        <p>您的账号最后于 {{times}} 在其他设备上登录，您的趋势稳盈课程服务、实盘策略、名师直播、金股池和稳盈内参已转移到最后登录设备上查看,请您知悉！</p>
        <div class="btn" @click="userStatu">知道了</div>
      </div>
    </div>
	</div>
</template>

<script>
  import Top from './Top'
  import Left from './Left'
  import Foot from './Foot'
  import VideoMain from './Video'
  import Chat from './chat'
  import Teacher from './Teacher'
  import Login from './Login'
  import Class from './Class'
  import Schedule from './Schedule'
  export default {
    props: ['times', 'userStatus'],
    methods: {
      userStatu() {
        this.$emit('close');
      },
    },
    components: {
      Top, Left, Foot, VideoMain, Chat, Teacher, Login, Class, Schedule
    }
  }
</script>

<style lang="scss">
  .container {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #212224;
    .main {
      width: 100%;
      height: calc(100% - 90px);
      display: flex;
    }
  }
  
  .box {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 100;
    text-align: center;
    .content {
      position: absolute;
      left: 50%;
      top: 50%;
      width: 420px;
      padding: 0 50px;
      z-index: 101;
      text-align: center;
      background-color: #fff;
      border-radius: 4px;
      transform: translate(-50%, -50%);
      p {
        margin: 40px 0;
        font-size: 16px;
      }
      .btn {
        width: 92%;
        height: 40px;
        margin: 0 auto;
        border: 1px solid rgb(255, 76, 81);
        text-align: center;
        line-height: 40px;
        color: rgb(255, 76, 81);
        font-size: 16px;
        margin-bottom: 30px;
        cursor: pointer;
      }
    }
  }
</style>
