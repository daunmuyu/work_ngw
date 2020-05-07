import Vue from 'vue';
import template from './index.html';
import './style.scss';

export default Vue.extend({
  template,
  props: ['slogan', 'qrcode'],
  data() {
    return {
      showPanel: false,
    };
  },
  methods: {
    changeShowPanel() {
      this.showPanel = !this.showPanel;
    }
  }
});
