import Vue from 'vue';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

require('./about.scss');
const template = require('./about.html');

export default Vue.extend({
  metaInfo() {
    return {
      title: '关于我们',
      meta: [{                 // set meta
        name: 'keywords',
        content: '关于我们',
      }],
    };
  },
  template,
  components: { Top: Header, Bottom: Footer },
});
