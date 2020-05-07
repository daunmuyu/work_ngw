// 单条消息的回复、踢人、禁言操作
import React from 'react';
import {
  connect
} from 'dva';
import {
  Radio,
  Button,
  Popover,
} from 'antd';
import {
  openNotification,
} from 'utils/tool.js';

const userIcons = [9, 10, 11, 12];

class ChatBar extends React.Component {
  constructor() {
    super();
    this.state = {
      visibleKick: false,
      visibleForbid: false,
      groupVal: '',
    };
  }
  render() {
    if (userIcons.indexOf(this.props.info.userFlag) > -1) {
      return (<div/>);
    }
    return (
      <div>
        <Radio.Group value={this.state.groupVal} onChange={this.handleChange}>
          <Radio.Button value="1">回复</Radio.Button>
          <Popover
            trigger="click"
            content={this.handleKickContent(this.props.info)}
            visible={this.state.visibleKick}
            onVisibleChange={this.handleVisibleKickChange}
          >
            <Radio.Button value="kick">踢人</Radio.Button>
          </Popover>
          <Popover
            content={this.handleForbidContent(this.props.info)}
            trigger="click"
            visible={this.state.visibleForbid}
            onVisibleChange={this.handleVisibleForbidChange}
          >
            <Radio.Button value="forbid">禁言</Radio.Button>
          </Popover>
        </Radio.Group>
      </div>
    );
  }
  handleVisibleKickChange = (visibleKick) => {
    this.setState({
      visibleKick,
    });
  }
  handleKickContent(info) {
    return (
      <div>
        <h3>将该用户踢出房间?</h3>
        <br/>
        <Button data-account={info.userId} data-name={info.userName} onClick={this.handleKick} type="primary">确定</Button>&nbsp;
        <Button onClick={this.handleVisibleKickHide}>取消</Button>
      </div>
    );
  }
  handleVisibleKickHide = () => {
    this.setState({
      visibleKick: false,
    });
  }
  handleKick = (e) => {
    const target = e.currentTarget;
    const account = target.getAttribute('data-account');
    const name = target.getAttribute('data-name');
    this.handleChatroomKickout({
      account,
      name,
    });
    this.handleVisibleKickHide();
  }
  handleVisibleForbidChange = (visibleForbid) => {
    this.setState({
      visibleForbid,
    });
  }
  handleForbidContent(info) {
    return (
      <div>
        <h3>将该用户禁言?</h3>
        <br/>
        <Button data-account={info.userId} data-name={info.userName} onClick={this.handleForbid} type="primary">确定</Button>&nbsp;
        <Button onClick={this.handleVisibleForbidHide}>取消</Button>
      </div>
    );
  }
  handleVisibleForbidHide = () => {
    this.setState({
      visibleForbid: false,
    });
  }
  handleForbid = (e) => {
    const target = e.currentTarget;
    const account = target.getAttribute('data-account');
    const name = target.getAttribute('data-name');
    this.handleChatroomForbid({
      account,
      name,
      isAdd: true,
    });
    this.handleVisibleForbidHide();
  }
  handleChange = (e) => {
    const value = +e.target.value;
    // 为数字时表示点击的是回复
    if (value) {
      this.props.dispatch({
        type: 'im/ByReply',
        payload: this.props.info,
      });
    }
  }
  isAnchor() {
    const {
      userId,
    } = this.props.userInfo;
    const {
      userid: anchorId
    } = this.props.currentRoom;
    return +userId === +anchorId;
  }
  // 处理禁言逻辑
  handleChatroomForbid({
    account,
    name,
  }) {
    this.props.dispatch({
      type: 'im/forbidUserSendMsg',
      payload: {
        account,
        name,
        state: 1,
      }
    });
    // this.props.chatRoomInstance.markChatroomGaglist({
    //   account,
    //   isAdd,
    //   done: (err, obj) => {
    //     console.log(err, obj);
    //     if (!err || +err.code === 417) {
    //       openNotification({
    //         description: `已将用户 ${name} 禁言`,
    //       });
    //       this.refreshMemberList();
    //     } else {
    //       openNotification({
    //         description: '禁言操作失败，稍后重试',
    //       });
    //     }
    //   },
    // });
  }

  // 处理踢人逻辑
  handleChatroomKickout = ({
    account,
    name,
  }) => {
    this.props.chatRoomInstance.markChatroomBlacklist({
      account,
      isAdd: true,
      done: (err) => {
        if (!err || +err.code === 417) {
          openNotification({
            description: `已将用户 ${name} 踢出房间`,
          });
          this.refreshMemberList();
        } else {
          openNotification({
            description: '踢人操作失败，请稍后重试',
          });
        }
      },
    });
  }

  refreshMemberList() {
    this.props.dispatch({
      type: 'im/getChatroomMembers',
      payload: null,
    });
  }

} // end class

function mapStateToProps(state) {
  return {
    currentRoom: state.chatRoom.currentRoom,
    userInfo: state.user.userInfo,
    chatRoomInstance: state.im.chatRoomInstance,
  };
}

export default connect(mapStateToProps)(ChatBar);
