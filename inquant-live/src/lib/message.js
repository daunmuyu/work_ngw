import Message from 'iview/src/components/message';

const messagePlugin = {
  install: (Vue, options) => {
    // 4. 添加实例方法
    Vue.prototype.$Message = Message;
  }
}

export default messagePlugin;
