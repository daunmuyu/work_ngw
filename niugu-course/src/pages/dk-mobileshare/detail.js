import bridge from 'ng-bridge';

import './detail.scss';

window.onload = () => {
  bridge.init();
  bridge.setTitle('牛熊分界');

  const telDom = document.getElementById('telDom');

  telDom.onclick = () => {
    bridge.telPhone('021-25099066');
  };
};
