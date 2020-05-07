import React, {} from 'react';
import {
  connect
} from 'dva';
import {
  Button,
  Modal,
} from 'antd';

import RoomList from '../room-list/room-list.jsx';

const confirm = Modal.confirm;


class NavMenu extends React.Component {
  render() {
    if (!this.props.userInfo || !this.props.userInfo.userId) {
      return (<div/>);
    }
    const {
      userInfo,
    } = this.props;
    return (
      <div>
        <div className="user-info f-right">
          <img className="avatar" alt="avatar" src={this.userAvatar(userInfo.userLogoUrl)}/>
          <span className="name">{userInfo.userName}</span>
          <Button
            type="primary"
            icon="logout"
            onClick={this.showLogoutConfirm}
          >退出
          </Button>
        </div>
        <RoomList/>
      </div>
    );
  } //  end render

  userAvatar = (url) => {
    if (url) {
      return url;
    }
    return 'https://img.niuguwang.com/avatar/default_avatar.png';
  }

  handleOk = () => {
    this.props.dispatch({
      type: 'user/userLogout',
      payload: {
        userId: null,
      },
    });
  }

  showLogoutConfirm = () => {
    confirm({
      title: '退出登录?',
      content: '您确定要退出登录吗',
      onOk: this.handleOk,
      onCancel() {},
    });
  }

}

function mapStateToProps(state) {
  return {
    currentRoom: state.chatRoom.currentRoom,
    userInfo: state.user.userInfo,
    currentRoute: state.user.currentRoute,
  };
}

export default connect(mapStateToProps)(NavMenu);
