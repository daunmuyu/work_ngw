<template>
  <div class="container">
    <div class="chat_view_pane">
      <div class="chat_room_pane">
        <div class="oneself dialogue">
          <div class="user_img">
            <img src="/static/img/favicon128X128.png" alt="">
          </div>
          <div class="chat_msg_pane">
            <div class="chat_msg_box">
              <p>超级利好！应广大用户要求，平台将对单次开播（或续费）季度、半年度、年度会员服务的朋友分别予以88折、75折、7折的价格优惠！（请在开通会员页面确认相应折扣后购买）快快行动起来吧！</p>
            </div>
          </div>
        </div>
        <div class="dialogue">
          <div class="time_pane">
            <p>22222222</p>
          </div>
        </div>
        <div class="dialogue">
          <div class="user_img">
            <img src="/static/img/favicon128X128.png" alt="">
          </div>
          <div class="chat_msg_pane">
            <div class="chat_msg_box">
              <p>超级利好起来吧！</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="chat_push_pane">
      <div class="icon emj_icon on"></div>
      <div class="icon img_icon on"></div>
      <div class="text_box">
        <div class="enter_msg" id="txtMsg" contenteditable="true" placeholder="请输入您要咨询的问题">
          <div class="WxEmojiPreView"> {{ msgTxt }} <span></span></div>
          <textarea name="enter_msg" v-model="msgTxt" id="enter_msg" placeholder="请输入您要咨询的问题"></textarea>
          </div>
        <div class="icon icon_enter on"></div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      msgTxt: ''
    }
  },

  components: {
  },

  methods: {

  },

  created () {
  }
}
</script>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  background-color: #F4F5F6;
  .chat_view_pane {
    flex: 1;
    .chat_room_pane {
      width: calc(100% - 30px);
      margin: 0 auto;
      .time_pane {
        width: 100%;
        text-align: center;
        font-size: 12px;
        color: #8997A5;
        padding-top: 5px;
      }
    }
    .dialogue {
      display: flex;
      .user_img {
        width: 40px;
        height: 40px;
        padding-top: 15px;
        img {
          overflow: hidden;
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      .chat_msg_pane {
        padding: 15px 10px 15px;
        box-sizing: border-box;
        max-width: calc(100% - 50px);
        position: relative;
        font-size: 16px;
        line-height: 1.5;
        color: #2A4159;
        &::before {
          position: absolute;
          content: "";
          width: 10px;
          height: 10px;
          background: #fff;
          border: #E2E9F1 1px solid;
          top: 30px;
          left: 5px;
          transform: rotate(45deg);
          border-top: none;
          border-right: none;
        }
        .chat_msg_box {
          background-color: #fff;
          overflow: hidden;
          border-radius: 5px;
          border: #E2E9F1 1px solid;
          p {
            padding: 10px;
          }
        }
      }
      &.oneself {
        flex-direction: row-reverse;
        .chat_msg_pane {
          &::before {
            background: #D6F1FF;
            border: #C4E5F9 1px solid;
            left: unset;
            right: 5px;
            transform: rotate(45deg);
            border-bottom: none;
            border-left: none;
          }
          .chat_msg_box {
            background-color: #D6F1FF;
            overflow: hidden;
            border-radius: 5px;
            border: #C4E5F9 1px solid;
          }
        }
      }
    }
  }
  .chat_push_pane {
    height: 45px;
    box-sizing: border-box;
    display: flex;
    align-items: flex-end;
    border-top: 1px solid #e8e8e8;
    padding: 6px 15px;
    .text_box {
      width: calc(100% - 80px);
      position: relative;
      box-sizing: border-box;
      // min-height: 32px;
      // height: auto;
      overflow: hidden;
      border-radius: 16px;
      font-size: 16px;
      background-color: #fff;
      .enter_msg {
        .WxEmojiPreView {
          min-height: 100%;
          width: calc(100% - 30px);
          min-height: 32px;
          box-sizing: border-box;
          line-height: 22px;
          padding: 0 4px 0 15px;
          span {
            display: inline-block;
            border-right: #e8e8e8;
            height: 22px;
          }
        }
      }
      textarea {
        position: absolute;
        box-sizing: border-box;
        top: 0;
        bottom: 0;
        left: 0;
        display: block;
        width: calc(100% - 35px);
        height: 100%;
        line-height: 22px;
        padding: 5px 4px 5px 15px;
        z-index: 99;
        background-color: transparent;
        color: #fff;
      }
      .icon_enter {
        position: absolute;
        bottom: 1.5px;
        right: 5px;
        margin-right: 0;
      }
    }
    .icon {
      width: 25px;
      height: 25px;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 15px;
      background-repeat: no-repeat;
      background-size: cover;
      margin-bottom: 3px;
      background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAEsCAYAAACBlODuAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MzAyNzg3N0Y3Q0Q4MTFFODgyRTlCODE2MkIxRDEyOTAiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MzAyNzg3ODA3Q0Q4MTFFODgyRTlCODE2MkIxRDEyOTAiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDozMDI3ODc3RDdDRDgxMUU4ODJFOUI4MTYyQjFEMTI5MCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDozMDI3ODc3RTdDRDgxMUU4ODJFOUI4MTYyQjFEMTI5MCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pma2LGUAABpMSURBVHja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');
      &.emj_icon {
        background-position: left top;
        &.on {
          background-position: left -25px;
        }
      }
      &.img_icon {
        background-position: left -50px;
        &.on {
          background-position: left -75px;
        }
      }
      &.icon_enter {
        background-position: left -100px;
        &.on {
          background-position: left -125px;
        }
      }
    }
  }
}
</style>
