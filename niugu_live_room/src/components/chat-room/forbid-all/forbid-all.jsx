// 全局禁言

import React from 'react';
import {
  connect,
} from 'dva';
import {
  Switch,
  Modal,
} from 'antd';
// import {
//   openNotification,
// } from 'utils/tool.js';
import './forbid-all.scss';

// 需要禁言的房间
const FORBID_ROOMS = [30, 503, 504, 505];
// const FORBID_ROOMS = [30];

class ForbidAll extends React.Component {
  state = {
    visible: false,
  }
  render() {
    const {
      liveid,
    } = this.props.currentRoom;
    if (FORBID_ROOMS.indexOf((+liveid)) < 0) {
      return (<span/>);
    }
    // if (this.props.chatRoomInfo.mute) {
    //   setTimeout(() => {
    //     openNotification({
    //       description: '当前直播间处于全局禁言中',
    //     });
    //   }, 1200);
    // }
    return (
      <div className="forbid-all-wrap f-right">
        全局禁言
        <Switch checked={this.props.chatRoomInfo.mute} checkedChildren={'开'} unCheckedChildren={'关'} onChange={this.handleSwitchChanged} size="small"/>
      </div>
    );
  }

  handleSwitchChanged = (value) => {
    let content = '确定要全局禁言吗？';
    if (!value) {
      content = '确定关闭全局禁言吗？';
    }
    Modal.confirm({
      visible: this.state.visible,
      title: '全局禁言功能',
      content,
      okText: '确认',
      cancelText: '取消',
      onOk: this.handleModalOk,
      onCancel: this.handleModalCancel,
    });
  }

  handleModalOk = () => {
    const {
      chatRoomInfo,
      dispatch,
    } = this.props;
    chatRoomInfo.mute = !chatRoomInfo.mute;
    dispatch({
      type: 'chatRoom/markChatroomMute',
      payload: {
        mute: chatRoomInfo.mute ? 1 : 0,
      },
    });
  }

  handleModalCancel = () => {}
}

function mapStateToProps(state) {
  return {
    currentRoom: state.chatRoom.currentRoom,
    chatRoomInfo: state.im.chatRoomInfo,
  };
}

export default connect(mapStateToProps)(ForbidAll);
