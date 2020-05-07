import Vue from 'vue';
import {
  // DatePicker,
  // Button,
  // Select,
  // Option,
  // Pagination,
  // Message,
  // MessageBox,
} from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { search } from '../../service/tools.js';


require('./style.scss');
const template = require('./index.html');

export default Vue.extend({
  components: { Top: Header, Bottom: Footer },
  template,
  data() {
    return {
      className: 'el-icon-error',
      resultMsg: '入金失败！',
    };
  },
  computed: {

  },
  created() {
    if (search('result') === 'success') {
      this.className = 'el-icon-success';
      this.resultMsg = '入金成功！';
    }
  },
  methods: {
  },
});
