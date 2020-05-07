import Vue from 'vue';
import { mapGetters, mapActions, mapMutations } from 'vuex';
import Cookie from 'js-cookie';
import template from './index.html';
import './style.scss';

export default Vue.extend({
  template,
  data() {
    return {
      activeName: 'index',
    };
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  mounted() {
    this.activeName = this.$route.name;
    console.log(this.activeName);
  },
  methods: {
    ...mapActions(['clearUserInfo']),
    selectMenu(menu) {
      this.$router.push(`/${menu}`);
    },
    logout() {
      this.clearUserInfo();
      this.$router.push('login');
    }
  }
});
