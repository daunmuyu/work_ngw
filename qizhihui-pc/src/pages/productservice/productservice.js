import Vue from 'vue';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

require('./productservice.scss');
const template = require('./productservice.html');

export default Vue.extend({
  metaInfo() {
    return {
      title: '产品服务',
      meta: [{                 // set meta
        name: 'keywords',
        content: '产品服务',
      }],
    };
  },
  template,
  components: { Top: Header, Bottom: Footer },
  mounted() {
    this.$refs.ptabs.addEventListener('click', (e) => {
      e.stopPropagation();
      const t = e.target;
      const children = t.parentNode.children;
      [].forEach.call(children, (item) => {
        item.classList.remove('active');
      });
      t.classList.add('active');
      const tabId = t.getAttribute('tabid');
      this.checkTabContent(tabId);
    });
  },
  methods: {
    checkTabContent(tabid) {
      const contents = this.$refs.productcontent.querySelectorAll(
        '.tab-content',
      );
      [].forEach.call(contents, (item) => {
        item.style.display = 'none';
      });
      this.$refs.productcontent.querySelector(
        `.tab-content-${tabid}`,
      ).style.display =
        'block';
    },
    toDownload() {
      // console.log(this.$refs.qrcode.offsetTop);
      // console.log(document.body.scrollTop);
      // document.body.scrollTop = this.$refs.qrcode.offsetTop;
      // document.body.scrollTo(this.$refs.qrcode.offsetTop);
      document.getElementById('app').scrollTop = this.$refs.qrcode.offsetTop;
    },
  },
});
