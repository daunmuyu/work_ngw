// 底部
import React from 'react';
import {
  connect,
} from 'dva';
import './footer.scss';

class Footer extends React.Component {
  render() {
    return (
      <div className="page-footer">
        <p>Copyright © 2016 niuguwang.com All Rights Reserved.</p>
        <p>北京淘金者科技有限公司 京ICP备14020843号</p>
      </div>
    );
  }
}

export default connect()(Footer);
