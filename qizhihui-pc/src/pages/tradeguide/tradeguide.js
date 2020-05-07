import Vue from 'vue';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

require('./tradeguide.scss');
const template = require('./tradeguide.html');

export default Vue.extend({
  metaInfo() {
    return {
      title: '交易指南',
      meta: [{                 // set meta
        name: 'keywords',
        content: '交易指南',
      }],
    };
  },
  template,
  components: { Top: Header, Bottom: Footer },
  data() {
    return {
      title: 'CFD差价合约',
      itemdls: {
        1: false,
        2: false,
        3: false,
        4: false,
      },
    };
  },
  mounted() {
    this.bindMenuEvent();
  },
  methods: {
    bindMenuEvent() {
      this.$refs.menu.addEventListener('click', (e) => {
        e.stopPropagation();
        const t = e.target.hasAttribute('href')
          ? e.target.parentNode
          : e.target;
        const children = t.parentNode.children;
        [].forEach.call(children, (item) => {
          item.classList.remove('active');
        });
        t.classList.add('active');
        const id = t.getAttribute('data-id');
        this.checkMenu(id);
        this.checkBanner(id);
        this.checkTitle(id);
      });
    },
    checkMenu(value) {
      const content = this.$refs.guideContent;
      [].forEach.call(content.children, (item) => {
        item.style.display = 'none';
      });
      content.querySelector(`.section${value}`).style.display = 'block';
    },
    checkBanner(value) {
      this.$refs.banner.style.background = `url(../../../static/img/guidebanner${value}.png)`;
    },
    checkTitle(id) {
      switch (id) {
        case '1':
        default:
          this.title = 'CFD差价合约';
          break;
        case '2':
          this.title = '外盘CFD';
          break;
        case '3':
          this.title = '交易规则';
          break;
        case '4':
          this.title = '常见问题';
          break;
      }
    },
    openClose(key) {
      this.itemdls[key] = !this.itemdls[key];
    },
  },
});
