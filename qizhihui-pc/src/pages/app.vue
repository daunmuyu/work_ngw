<template>
  <div id="app" class="app">
    <Login
    @setUsertoken="val => $emit('setUsertoken', val)"
    @setUserinfo="val => $emit('setUserinfo', val)"
    ></Login>
    <!-- <app-header
    @setUsertoken="val => $emit('setUsertoken', val)"
    @setUserinfo="val => $emit('setUserinfo', val)"
    @logout="() => $emit('logout')"
    ></app-header> -->
    <router-view></router-view>
    <!-- <app-footer></app-footer> -->
  </div>
</template>
<script>
import Login from '@/components/Login';
// import AppHeader from '@/components/Header';
// import AppFooter from '@/components/Footer';

export default {
  components: {
    // AppHeader,
    // AppFooter,
    Login,
  },
};
</script>
<style lang="scss" scoped>
.app {
  margin: 0;
}
</style>

