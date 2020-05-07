import React from 'react';
import { connect } from 'dva';
import { Modal, Button, Menu, Icon, Row, Col, Form, Input } from 'antd';
import MemberTab from 'components/member-tab/member-tab.jsx';
import './index.scss';

const FormItem = Form.Item;

class HomeView extends React.Component {
  state = {
    visible: false,
    pcPassword: '',
    AppPassword: ''
  };
  onChangePcPassword = (e) => {
    this.setState({ pcPassword: e.target.value });
  };
  onChangeAppPassword = (e) => {
    this.setState({ AppPassword: e.target.value });
  };
  render() {
    return (
      <div className="main-layout">
        {this.renderModal()}
        <Row>
          <Col span={18} push={6}>
            {this.props.children}
          </Col>
          <Col span={6} pull={18} className="left-panel">
            <div className="menu-wrap">
              <Menu onClick={this.handleMenuClick}>
                {this.renderNavItem()}
                <Menu.Item key="usermanage">
                  <Icon type="team" /> 用户管理
                </Menu.Item>
                {/* {this.renderPwd()} */}
                {this.renderAppPwd()}{this.renderPcPwd()}
                <Menu.Item key="welcome">
                  <Icon type="solution" /> 老师助理欢迎语设置
                </Menu.Item>
                {this.props.exercises.isCanExercise ? (
                  <Menu.Item key="exercises">
                    <Icon type="exception" /> 习题册管理
                  </Menu.Item>
                ) : (
                  ''
                )}
                {this.props.currentRoom.intradayBroadcast && (
                  <Menu.Item key="intraday">
                    <Icon type="sound" /> 盘中播报
                  </Menu.Item>
                )}
                {this.props.tactics.isCanCallOrder ? (
                  <Menu.Item key="tactics">
                    <Icon type="area-chart" /> 港美股策略
                  </Menu.Item>
                ) : (
                  ''
                )}
                {this.props.strategy.isCanCallOrder ? (
                  <Menu.Item key="strategy">
                    <Icon type="dot-chart" /> A股策略
                  </Menu.Item>
                ) : (
                  ''
                )}
                <Menu.Item key="question">
                  <Icon type="question-circle-o" /> 智能问股-问题管理
                </Menu.Item>
                <Menu.Item key="help">
                  <Icon type="exclamation-circle-o" /> 视频直播帮助
                </Menu.Item>
                <Menu.Item key="download">
                  <Icon type="download" /> 视频直播下载
                </Menu.Item>
                <Menu.Item key="paperclip">
                  <Icon type="paper-clip" /> 量化股票
                </Menu.Item>
              </Menu>
            </div>
            <MemberTab />
          </Col>
        </Row>
      </div>
    );
  }

  initUser = () => {
    this.props.dispatch({
      type: 'user/name',
      payload: this.userName.value
    });
    this.props.dispatch({
      type: 'user/age',
      payload: 23
    });
  };

  renderModal = () => {
    const psts = this.state.type === 1 ? this.props.currentRoom.passwordStatus : this.props.currentRoom.passwordStatusWeb;
    if (!this.props.currentRoom || !psts) {
      return <div />;
    }
    return (
      <Modal
        title="密码管理"
        visible={this.state.visible}
        onCancel={this.handleCancel}
        footer={null}
      >
        {this.state.type === 2 ?
        (<Form layout="inline" className="form">
          <FormItem label="P C直播间密码">
            <Input
              value={this.state.pcPassword}
              onChange={this.onChangePcPassword}
            />
          </FormItem>
        </Form>)
        :
        (<Form layout="inline" className="form">
          <FormItem label="APP直播间密码">
            <Input
              value={this.state.AppPassword}
              onChange={this.onChangeAppPassword}
            />
          </FormItem>
        </Form>
        )}
        <div className="modal-btn">
          {psts === '2' ? (
            <Button
              type="primary"
              onClick={() => {
                this.setStatus(0);
              }}
            >
              关闭
            </Button>
          ) : (
            <Button
              type="primary"
              onClick={() => {
                this.setStatus(1);
              }}
            >
              开启
            </Button>
          )}
          <Button onClick={this.updatePwd}>更新密码</Button>
        </div>
      </Modal>
    );
  };

  renderAppPwd = () => {
    if (
      !this.props.currentRoom ||
      this.props.currentRoom.livetype !== '1'
    ) {
      return <div />;
    }
    return (
      <Menu.Item key="pwdApp">
        <Icon type="lock" /> <span>APP-密码管理</span>
        <span className="pwd">
          {this.getPasswordStatus(this.props.currentRoom.passwordStatus)}
        </span>
      </Menu.Item>
    );
  };
  renderPcPwd = () => {
    if (
      !this.props.currentRoom ||
      this.props.currentRoom.livetype !== '1'
    ) {
      return <div />;
    }
    return (
      <Menu.Item key="pwdPc">
        <Icon type="lock" /> <span>P C-密码管理</span>
        <span className="pwd">
          {this.getPasswordStatus(this.props.currentRoom.passwordStatusWeb)}
        </span>
      </Menu.Item>
    );
  };

  getPasswordStatus = (i) => {
    let status = '';
    switch (i) {
      case '0':
        status = '未设置';
        break;
      case '1':
        status = '关闭中';
        break;
      case '2':
        status = '开启中';
        break;
      default:
        status = '';
    }
    return status;
  };

  renderNavItem = () => {
    if (!this.props.user.userInfo || !this.props.user.userInfo.userId) {
      return <div />;
    }
    const { userId } = this.props.user.userInfo;
    const { userid: anchorId } = this.props.currentRoom;
    if (+userId !== +anchorId) {
      return '';
    }
    const { currentRoute } = this.props;
    if (currentRoute === 'role') {
      return (
        <Menu.Item key="chat-room">
          <Icon type="video-camera" />聊天室
        </Menu.Item>
      );
    }
    return (
      <Menu.Item key="role">
        <Icon type="setting" /> 角色设置
      </Menu.Item>
    );
  };

  handleMenuClick = ({ key }) => {
    switch (key) {
      case 'role':
        window.location.href = '#/home/role';
        break;
      case 'chat-room':
        window.location.href = '#/home/chat-room';
        break;
      case 'usermanage':
        window.location.href = '#/home/user-manage';
        break;
      case 'welcome':
        window.location.href = '#/home/welcome';
        break;
      case 'intraday':
        window.location.href = '#/home/intraday';
        break;
      case 'exercises':
        window.location.href = '#/home/exercises';
        break;
      case 'tactics':
        window.location.href = '#/home/tactics';
        break;
      case 'strategy':
        window.location.href = '#/home/strategy';
        break;
      case 'question':
        window.location.href = 'http://mp.niuguwang.com';
        break;
      case 'download':
        window.location.href =
          'http://download.niuguwang.com/files/exe/setup-2.rar';
        break;
      case 'paperclip':
        window.location.href = '#/home/stock-pool';
        break;
      case 'pwdApp':
        this.showModal(1);
        break;
      case 'pwdPc':
        this.showModal(2);
        break;
      default:
    }
    this.props.dispatch({
      type: 'user/CurrentRoute',
      payload: key
    });
  };

  getRoom = () => {
    this.props.dispatch({
      type: 'chatRoom/initMyRooms',
      payload: {
        userToken: this.props.user.userInfo.userToken
      }
    });
  };

  showModal = (ty) => {
    this.setState({
      visible: true,
      type: ty,
      pcPassword: this.props.currentRoom.password,
      AppPassword: this.props.currentRoom.AppPassword
    });
  };
  handleOk = () => {
    this.setState({
      visible: false
    });
  };
  handleCancel = () => {
    this.setState({
      visible: false
    });
  };
  updatePwd = () => {
    const pwd = this.state.type === 1 ? this.state.AppPassword : this.state.pcPassword;
    if (!pwd) {
      return;
    }
    this.props.dispatch({
      type: 'chatRoom/setRoomPassword',
      payload: {
        liveID: this.props.currentRoom.liveid,
        password: pwd,
        type: this.state.type,
        usertoken: this.props.user.userInfo.userToken,
        roomId: this.props.currentRoom.VideoChatRoom
      }
    });
    this.handleCancel();
  };
  setStatus = (status) => {
    this.props.dispatch({
      type: 'chatRoom/setRoomPasswordStatus',
      payload: {
        liveID: this.props.currentRoom.liveid,
        roomId: this.props.currentRoom.VideoChatRoom,
        status,
        type: this.state.type,
        usertoken: this.props.user.userInfo.userToken
      }
    });
    this.handleCancel();
  };
}

function mapStateToProps(state) {
  return {
    user: state.user,
    currentRoom: state.chatRoom.currentRoom,
    currentRoute: state.user.currentRoute,
    tactics: state.tactics,
    strategy: state.strategy,
    exercises: state.exercises
  };
}

export default connect(mapStateToProps)(HomeView);
