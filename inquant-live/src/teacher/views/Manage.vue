
<template>
  <div class="layout">
    <Header class="teacher-header">
      <Col span="8">
        老师后台管理系统
        <span class="room-name">{{getRoomName()}}</span>
      </Col>
      <Col
        span="3"
        offset="13"
        style="cursor: pointer"
        @click.native="$router.push({ path: `/home/${$route.params.roomid}` })"
      >
        <Icon type="ios-home"/>
      </Col>
    </Header>
    <Layout :style="{minHeight: '100vh'}">
      <Sider collapsible :collapsed-width="78" v-model="isCollapsed">
        <Menu :active-name="$route.name" theme="dark" width="auto" :class="menuitemClasses">
          <MenuItem
            class="menu-item"
            name="Speak"
            @click.native="$router.push({ path: `/manage/speak/${$route.params.roomid}` })"
          >
            <Icon type="ios-navigate"></Icon>
            <span :class="{'width-span': !isCollapsed}">马甲发言</span>
          </MenuItem>
          <MenuItem
            v-show="+$route.params.roomid === 10517689"
            class="menu-item"
            name="LiveData"
            @click.native="$router.push({ path: `/manage/live-data/${$route.params.roomid}` })"
          >
            <Icon type="ios-navigate"></Icon>
            <span :class="{'width-span': !isCollapsed}">直播浏览量统计</span>
          </MenuItem>
          <MenuItem
            class="menu-item"
            name="Edit"
            @click.native="$router.push({ path: `/manage/edit/${$route.params.roomid}` })"
          >
            <Icon type="ios-navigate"></Icon>
            <span :class="{'width-span': !isCollapsed}">编辑上传</span>
          </MenuItem>
          <MenuItem
            class="menu-item"
            name="TeacherEdit"
            @click.native="$router.push({ path: `/manage/teacher-edit/${$route.params.roomid}` })"
          >
            <Icon type="ios-navigate"></Icon>
            <span :class="{'width-span': !isCollapsed}">老师资料上传</span>
          </MenuItem>
          <MenuItem
            class="menu-item"
            name="UrlStatistical"
            @click.native="$router.push({ path: `/manage/url-statistical/${$route.params.roomid}` })"
          >
            <Icon type="ios-navigate"></Icon>
            <span :class="{'width-span': !isCollapsed}">销售链接访问统计</span>
          </MenuItem>
          <MenuItem
            class="menu-item"
            name="LiveEncryption"
            @click.native="$router.push({ path: `/manage/live-encryption/${$route.params.roomid}` })"
          >
            <Icon type="ios-navigate"></Icon>
            <span :class="{'width-span': !isCollapsed}">直播间加密设置</span>
          </MenuItem>
          <MenuItem
            class="menu-item"
            name="pdfUpload"
            @click.native="$router.push({ path: `/manage/pdf-upload/${$route.params.roomid}`})"
          >
            <Icon type="ios-navigate"></Icon>
            <span :class="{'width-span': !isCollapsed}">学习日志上传</span>
          </MenuItem>
          <MenuItem
            class="menu-item"
            name="UserLiveTime"
            @click.native="$router.push({ path: `/manage/user-live-time/${$route.params.roomid}`})"
          >
            <Icon type="ios-navigate"></Icon>
            <span :class="{'width-span': !isCollapsed}">用户直播时长</span>
          </MenuItem>
        </Menu>
      </Sider>
      <Layout>
        <Content :style="{padding: '0 16px 16px'}">
          <Breadcrumb :style="{margin: '16px 0'}">
            <BreadcrumbItem>管理后台</BreadcrumbItem>
            <BreadcrumbItem>{{ locationName }}</BreadcrumbItem>
          </Breadcrumb>
          <Card>
            <router-view></router-view>
          </Card>
        </Content>
      </Layout>
    </Layout>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isCollapsed: false,
      locationName: undefined
    };
  },
  mounted() {
    this.changLocationName(this.$route.name);
  },
  computed: {
    menuitemClasses: function() {
      return ["menu-item", this.isCollapsed ? "collapsed-menu" : ""];
    }
  },
  watch: {
    $route(to, from) {
      this.changLocationName(to.name);
    }
  },
  methods: {
    init() {
      console.log(this.$route.name);
    },
    changLocationName(name) {
      console.log(name);
      switch (name) {
        case "LiveData":
          this.locationName = "直播浏览量统计";
          break;
        case "Speak":
          this.locationName = "马甲发言";
          break;
        case "Edit":
          this.locationName = "编辑上传";
          break;
        case "TeacherEdit":
          this.locationName = "老师资料上传";
          break;
        case "UrlStatistical":
          this.locationName = "销售链接访问统计";
          break;
        case "LiveEncryption":
          this.locationName = "直播间加密设置";
          break;
        case "pdfUpload":
          this.locationName = "学习资料上传";
          break;
        case "UserLiveTime":
          this.locationName = "用户直播时长";
          break;
        default:
          break;
      }
    },
    getRoomName() {
      if (!localStorage.getItem("roomList")) {
        return "";
      }
      const roomList = JSON.parse(localStorage.getItem("roomList"));
      console.log(roomList);
      const a = roomList.filter(v => +v.roomId === +this.$route.params.roomid);
      if (a.length > 0) {
        return a[0].roomName;
      } else {
        return "";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.room-name {
  font-size: 15px;
  text-indent: 10px;
  color: #bbbec4;
}
.width-span {
  width: 110px;
}
.layout-con {
  height: 100%;
  width: 100%;
}
.menu-item span {
  display: inline-block;
  overflow: hidden;
  width: 69px;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
  transition: width 0.2s ease 0.2s;
  &.width-span {
    width: 110px;
  }
}
.teacher-header {
  padding-bottom: 66px;
  margin-top: -15px;
  height: 50px;
  color: white;
  font-weight: bold;
  font-size: 20px;
  text-indent: 20px;
  overflow: hidden;
}
.menu-item i {
  transform: translateX(0px);
  transition: font-size 0.2s ease, transform 0.2s ease;
  vertical-align: middle;
  font-size: 16px;
}
.collapsed-menu span {
  width: 0px;
  transition: width 0.2s ease;
}
.collapsed-menu i {
  transform: translateX(5px);
  transition: font-size 0.2s ease 0.2s, transform 0.2s ease 0.2s;
  vertical-align: middle;
  font-size: 22px;
}
</style>