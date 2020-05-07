import Vue from 'vue';
import template from './index.html';
import './style.scss';

export default Vue.extend({
  template,
  props: {
    title: {
      required: true,
      type: String,
    },
    content: {
      required: true,
      type: String,
    },
  },
  data() {
    return {};
  }
});
