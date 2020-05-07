<script>
export default {
  created () {
    // 调用API从本地缓存中获取数据
    // const logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    // console.log('app created and cache logs by setStorageSync')
    // wx.showSahreMenu({})
  }
}
</script>

<style lang="scss">
page {
  height: 100%;
}
.container {
  width: 100%;
  height: 100%;
  /* display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 200rpx 0; */
  box-sizing: border-box;
}
/* this rule will be remove */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}
.font-red {
  color: #FF4C51 !important;
}
.font-green {
  color: #22BB7E !important;
}
.font-gary {
  color: #8997A5 !important;
}
.font-black {
  color: #2A4159 !important;
}
.font-blue {
  color: #458CF5 !important;
}
// tab 下面 view 的样式
.tab_view_pane {
  padding: 20px 15px;
  .tab_view_main {
    padding: 12px;
    box-sizing: border-box;
    background-color: #F9FBFD;
    border: 1px solid #E2E9F1;
    color: #2A4159;
    font-size: 14px;
    line-height: 1.5;
  }
  .tab_view_graph {
    h4 {
      font-size: 14px;
      padding: 12px 0;
      color: #2A4159;
    }
  }
}
.zan-tab__bd--scroll {
  // background-color: #458CF5 !important;
  height: 45px!important;
  box-sizing: border-box!important;
  overflow: hidden!important;
  .zan-tab__item {
    padding: 0 15px;
  }
  .zan-tab__item--selected .zan-tab__title {
    border-color: #458CF5;
    color: #458CF5;
  }
}
</style>
