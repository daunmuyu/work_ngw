import $ from 'jqueryLib';
import {
  BaseView,
} from 'ExtendBackbone';
import HeaderView from '../common/header/header.view.js';
import FooterView from '../common/footer/footer.view.js';


const tpl = require('./template/index2.html');


export default BaseView.extend({
  el: '#indexContainer',
  rawLoader() {
    return require('./template/index2.html');
  },
  // 插入dom之前
  beforeMount() {
    //  初始化一些自定义属性
  },
  // 插入dom之后
  afterMount() {
  },
  ready() {
    this.renderPage();
    this.header = new HeaderView();
    this.footer = new FooterView();

    // $('#doc-topbar-collapse ul>li').eq(0).find('a').addClass('active');
    this.$el.find('#header').find('ul>li')
    .eq(0).find('a')
    .addClass('active');
    let clientwidth = document.body.clientWidth;
    const con = document.querySelector('.Anti_con');
    if (con) {
      setInterval(() => {
        if (clientwidth >= 1200) {
          clientwidth = 1200;
        }
        if (con.scrollLeft - (1356 + clientwidth) >= 0) {
          con.scrollLeft -= (1356 + clientwidth);
        } else {
          con.scrollLeft = con.scrollLeft + 1;
        }
      }, 30);
    }
    $('.Anti_con').css({ 'width': 1200 - 50 });
    $('.Anti_text').css({ 'padding-left': '562px', 'display': 'block' });
  },
  renderPage() {
    const html = this.compileHTML(tpl);
    this.$el.html(html);
  },
  bindEvent() { },
});
