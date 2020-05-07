/**
 * 用户
 */

import React from 'react';
import { connect } from 'dva';
import { Button, Popover } from 'antd';
import { openNotification } from 'utils/tool.js';

import './user-item.scss';

// https://img.niuguwang.com/avatar/default_avatar.png
class UserItem extends React.Component {
  state = {
    visible: false
  };
  render() {
    const { info } = this.props;
    return (
      <div className="user-item">
        <img className="avatar" src={info.avatar} alt="用户" />
        <span className="name">{info.nick}</span>
        {this.renderForbidBtn()}
      </div>
    );
  }

  renderForbidBtn = () => {
    const { type } = this.props;
    if (!type) {
      return '';
    }
    return (
      <div className="forbid-btn-reset">
        <Popover
          content={this.forbidPopoverContent()}
          trigger="click"
          visible={this.state.visible}
          onVisibleChange={this.handlePopover}
        >
          <Button className="reset" size="small">
            恢复
          </Button>
        </Popover>
      </div>
    );
  };

  forbidPopoverContent = () => {
    const { type } = this.props;
    let tip = '恢复该用户发言?';
    if (type === 'forbid') {
      tip = '恢复该用户发言?';
    } else if (type === 'black') {
      tip = '从黑名单中移除?';
    }
    return (
      <div>
        <h3>{tip}</h3>
        <br />
        <Button onClick={this.handleSureClick} type="primary">
          确定
        </Button>&nbsp;
        <Button onClick={() => this.handlePopover(false)}>取消</Button>
      </div>
    );
  };

  handlePopover = (visible) => {
    this.setState({
      visible
    });
  };

  handleSureClick = () => {
    const { type } = this.props;
    if (type === 'forbid') {
      this.releaseForbidUser();
    } else if (type === 'black') {
      this.releaseBlackUser();
    }
  };

  releaseForbidUser = () => {
    const { info } = this.props;
    this.props.dispatch({
      type: 'im/forbidUserSendMsg',
      payload: {
        state: 0,
        account: info.account,
        name: info.nick
      }
    });
    this.handlePopover(false);
  };

  releaseBlackUser = () => {
    const { chatRoomInstance, info } = this.props;
    chatRoomInstance.markChatroomBlacklist({
      account: info.account,
      isAdd: false,
      done: (err) => {
        if (!err || +err.code === 417) {
          openNotification({
            description: `用户 ${info.nick} 已移出黑名单`
          });
          this.refreshMemberList();
        } else {
          openNotification({
            description: '操作失败，请稍后重试'
          });
        }
      }
    });
  };

  refreshMemberList() {
    this.props.dispatch({
      type: 'im/getChatroomMembers',
      payload: null
    });
  }
}

function mapStateToProps(state) {
  return {
    currentRoom: state.chatRoom.currentRoom,
    userInfo: state.user.userInfo,
    chatRoomInstance: state.im.chatRoomInstance
  };
}

export default connect(mapStateToProps)(UserItem);
