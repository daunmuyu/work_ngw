import React from 'react';
import {
  connect
} from 'dva';
import {
  Spin,
} from 'antd';

import LoginView from 'components/login/login.jsx';
import './login.scss';

class Login extends React.Component {
  render() {
    return (
      <div className="page-login clear">
        <div className="login-section f-left">
          <Spin spinning={this.props.loginLoading}>
            <LoginView/>
          </Spin>
        </div>
        <div className="banner-section f-right">
          <img src={require('../../img/login-banner.png')} alt="牛人直播间" />
        </div>
      </div>
    );
  }
  initData = () => {}
}

function mapStateToProps(state) {
  return {
    loginLoading: state.login.loginLoading
  };
}

export default connect(mapStateToProps)(Login);
