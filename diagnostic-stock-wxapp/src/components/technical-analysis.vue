<template>
<!-- 技术研判 -->
  <div class="tab_view_pane">
    <div class="tab_view_main" v-if="technicalData.mainmsg">
      <p>{{technicalData.mainmsg}}</p>
    </div>
    <div class="tab_view_graph">
      <div class="thl_graph" v-if="technicalData.indicatorsmsg && technicalData.indicatorsmsg.length">
        <h6>近期指标信号</h6>
        <div class="thl_graph_list">
          <template v-for="(item, index) in technicalData.indicatorsmsg" wx:key="item">
          <p>{{item}}</p>
          </template>
        </div>
      </div>
      <div class="thl_graph" v-if="technicalData.shorlinemsg">
        <h6>短线研判</h6>
        <p>{{technicalData.shorlinemsg}}</p>
      </div>
      <div class="thl_graph" v-if="technicalData.longlinemsg">
        <h6>长线研判</h6>
        <p>{{technicalData.longlinemsg}}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['technicalData'],
  created () {
    console.log(this.technicalData)
  }
}
</script>

<style lang="scss" scoped>
.tab_view_graph {
  .thl_graph {
    padding: 15px 0;
    h6 {
      font-size: 14px;
      color: #2A4860;
    }
    p {
      padding-top: 5px;
      font-size: 14px;
      color: #8697A7;
      line-height: 1.5;
    }
    .thl_graph_list {
      p {
        padding-left: 20px;
        position: relative;
        padding-top: 12px;
        padding-bottom: 12px;
        &::after, &::before {
          content: "";
          position: absolute;
          top: 17px;
        }
        &::after {
          border-radius: 50%;
          width: 7px;
          height: 7px;
          overflow: hidden;
          background-color: #8697A7;
          left: 0;
        }
        &:before {
          height: 100%;
          border-left: 1px solid #8697A7;
          left: 3px;
        }
        &:last-child {
          padding-bottom: 0;
          &:before {
            display: none
          }
        }
      }
    }
  }

}
</style>
