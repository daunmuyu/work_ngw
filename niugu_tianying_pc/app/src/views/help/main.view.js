import $ from 'jqueryLib';
import {
  BaseView,
} from 'ExtendBackbone';
import HeaderView from '../common/header/header.view.js';
import FooterView from '../common/footer/footer.view.js';

const tpl = require('./template/index1.html');


export default BaseView.extend({
  el: '#helpContainer',
  rawLoader() {
    return require('./template/index1.html');
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
    //  初始化
    // const lis = document.getElementById('navUls').getElementsByTagName('li');
    // lis.className = 'active';
    this.renderPage();
    this.header = new HeaderView();
    this.footer = new FooterView();
    $('#doc-topbar-collapse ul>li').eq(3).find('a').addClass('active');
  },
  beforeDestroy() {
    //  进入销毁之前,将引用关系设置为null
  },
  destroyed() {
    //  销毁之后
  },
  renderPage() {
    // 渲染页面
    const html = this.compileHTML(tpl);
    this.$el.html(html);
  },
  bindEvent() {},
});
