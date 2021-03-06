// import $ from 'jqueryLib';

import {
  BaseView,
} from 'ExtendBackbone';
import HeaderView from '../common/header/header.view.js';
import FooterView from '../common/footer/footer.view.js';

const tpl = require('./template/index5.html');


export default BaseView.extend({
  el: '#serviceContainer',
  rawLoader() {
    return require('./template/index5.html');
  },
  // 插入dom之前
  beforeMount() {
    //  初始化一些自定义属性
  },
  // 插入dom之后
  afterMount() {
    //  获取findDOMNode DOM Node
  },
  ready() {
    this.renderPage();
    this.header = new HeaderView();
    this.footer = new FooterView();

    // $('#doc-topbar-collapse ul>li').eq(2).find('a').addClass('active');
    this.$el.find('#header').find('ul>li')
    .eq(2).find('a')
    .addClass('active');
  },
  renderPage() {
    const html = this.compileHTML(tpl);
    this.$el.html(html);
  },
  bindEvent() { },
});
