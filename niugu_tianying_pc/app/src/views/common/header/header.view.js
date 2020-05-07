import {
  BaseView,
} from 'ExtendBackbone';
import './header1.scss';


export default BaseView.extend({
  el: '#header',
  data: {
    name: '',
  },
  rawLoader() {
    return require('./header1.html');
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
  },
  beforeDestroy() {
    //  进入销毁之前,将引用关系设置为null
  },
  destroyed() {
    //  销毁之后
  },

  renderPage() {
    // 渲染页面
  },
});
