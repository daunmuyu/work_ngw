import React from 'react';
import {
  Layout,
} from 'antd';
import {
  connect
} from 'dva';
import Cookie from 'js-cookie';
import {
  USERINFO,
} from 'service/cookie-names.js';

import Header from 'components/header/header.jsx';
import PageFooter from 'components/footer/footer.jsx';

import './layout.scss';

const {
  Footer,
  Content,
} = Layout;

const regRouter = /#\/([a-z-]*)/;

class LayoutView extends React.Component {
  componentWillMount() {
    this.initCookie();
  }
  componentDidMount() {
    setTimeout(() => {
      this.init();
    }, 300);
  }
  render() {
    return (
      <div className="page-layout">
        <Layout>
          <div className="page-header">
            <Header />
          </div>
          <div className="page-container container">
            <Layout>
              <Content>
                {this.props.children}
              </Content>
            </Layout>
          </div>
          <Footer>
            <PageFooter/>
          </Footer>
        </Layout>
      </div>
    );
  }
  initCookie = () => {
    const userInfo = Cookie.getJSON(USERINFO);
    if (userInfo && userInfo.userId) {
      this.props.dispatch({
        type: 'user/saveUesrInfo',
        payload: userInfo,
      });
    }
  }
  init = () => {
    const {
      userInfo,
      dispatch,
    } = this.props;
    if (userInfo && userInfo.userId) {
      const name = this.matchRouter();
      if (name.indexOf('home') > -1 || name.length === 0) {
        window.location.href = '#home';
        setTimeout(() => {
          dispatch({
            type: 'chatRoom/initMyRooms',
            payload: {
              userToken: userInfo.userToken,
            }
          });
        }, 200);
      }
    } else {
      window.location.href = '#login';
    }
  }

  matchRouter = () => {
    const result = window.location.href.match(regRouter);
    if (result && result[1]) {
      return result[1];
    }
    return '';
  }
}

function mapStateToProps(state) {
  return {
    userInfo: state.user.userInfo,
  };
}

export default connect(mapStateToProps)(LayoutView);
